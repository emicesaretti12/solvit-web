"use client";

/*
  Cómo funciona: el recorrido de una venta en cuatro pasos, en un solo panel fijo.
  Mientras se baja, el panel queda quieto y cambia de paso; en el escenario 3D se enciende la
  cinta de la S que corresponde (atraer, atender, cerrar) y en "crecer" la S se vuelve a armar.
  En celulares la S vive dentro del panel (steps-isotype, en el hueco de arriba): viaja con el
  scroll nativo junto al texto, sin el retraso de un canvas fijo que se reposiciona por código.
  Cada paso: el verbo, una frase y la vista viva del servicio que lo resuelve.

  - Sin GSAP pin: un contenedor alto con un panel sticky (convive con Lenis sin saltos)
  - El cambio de paso es un barrido en diagonal, con la inclinación de las cintas del isotipo
    (24,5°); con reduced motion, un fundido. Las variantes tienen las mismas claves en los dos
    casos: el HTML del servidor y el del cliente coinciden y nada queda trabado al hidratar
  - En celulares no hay barrido (clip-path repinta todo el paso en cada cuadro): el paso que se
    va sale rápido hacia arriba y el que llega entra desde abajo apenas después, sin que los dos
    textos se pisen
  - Las vistas se escalan para entrar en el espacio que queda (nunca se cortan) y solo se
    montan al acercarse a su paso; las de los pasos que no se ven quedan en pausa
  - Los textos de los cuatro pasos quedan en el árbol de accesibilidad; al cambiar de paso se
    anuncia, y si el foco estaba en una vista que se oculta, pasa al botón del paso
*/
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { memo, useEffect, useRef, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { MaskWords } from "@/components/mask-words";
import { AgentPreview } from "@/components/previews/agent-preview";
import { CrmPreview } from "@/components/previews/crm-preview";
import { MarketingPreview } from "@/components/previews/marketing-preview";
import { PreviewSuspendContext } from "@/components/previews/preview-shell";
import { LogoMark } from "@/components/logo";
import { getLenis } from "@/components/smooth-scroll";
import { CanvasBoundary } from "@/components/three/canvas-boundary";
import { StageMark } from "@/components/three/stage";
import type { PoseKey } from "@/components/three/choreography";

const StepsIsotype = dynamic(() => import("@/components/three/steps-isotype"), { ssr: false });

const GrowthChart = dynamic(() => import("@/components/dashboard-chart").then((m) => m.GrowthChart), {
  ssr: false,
  loading: () => <div className="h-[300px] rounded-[1.25rem] border border-line bg-navy-900/50" />,
});

type Step = {
  pose: PoseKey;
  verb: string;
  service: string;
  title: string;
  text: string;
  Preview: ComponentType;
};

const STEPS: Step[] = [
  {
    pose: "atraer",
    verb: "Atraer",
    service: "Marketing digital",
    title: "Anuncios pensados para que te escriban.",
    text: "Campañas en Meta y Google y una web que convierte visitas en consultas.",
    Preview: MarketingPreview,
  },
  {
    pose: "atender",
    verb: "Atender",
    service: "Agentes de IA",
    title: "Respondemos en segundos, a cualquier hora.",
    text: "El agente atiende WhatsApp, Instagram y tu web, contesta dudas y detecta quién quiere comprar.",
    Preview: AgentPreview,
  },
  {
    pose: "cerrar",
    verb: "Cerrar",
    service: "CRM y software a medida",
    title: "Cada consulta llega al vendedor indicado.",
    text: "Con toda la conversación y sin seguimientos olvidados, en un CRM hecho a tu medida.",
    Preview: CrmPreview,
  },
  {
    pose: "crecer",
    verb: "Crecer",
    service: "Tableros",
    title: "Ves en números cómo crecen tus ventas.",
    text: "Consultas, tiempos de respuesta y seguimientos en un tablero que se actualiza solo.",
    Preview: GrowthChart,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// Las transiciones no van en el HTML: pueden depender del ancho sin romper la hidratación
const MOBILE_QUERY = "(max-width: 1023.98px)";
const subscribeMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useIsMobile = () =>
  useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE_QUERY).matches, () => false);

// Barrido en diagonal con la inclinación de las cintas: tan(24,5°) ≈ 0,46 del alto
const SHOWN = "polygon(-46% 0%, 100% 0%, 146% 100%, 0% 100%)";
const BEFORE = "polygon(-46% 0%, -46% 0%, 0% 100%, 0% 100%)";
const AFTER = "polygon(100% 0%, 100% 0%, 146% 100%, 146% 100%)";
const STILL = "translateY(0px)";

function RailSegment({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const fill = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
  return (
    <span aria-hidden="true" className="relative mt-2 block h-[2px] w-full overflow-hidden rounded-full bg-fg/10">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left rounded-full bg-blue-400" />
    </span>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/* La S de los pasos en celulares (solo se monta en el cliente): el isotipo plano mientras carga
   WebGL (o si no hay), después la S en 3D. El canvas se prepara cuando la S del hero ya se
   zambulló (en el primer rato libre) o cuando la sección se acerca, nunca al cargar la página ni
   con el hero animándose: crear el contexto y la iluminación en ese momento trabaría el scroll */
function MobileSteps({ step, reduce }: { step: number; reduce: boolean }) {
  const [gl] = useState(hasWebGL);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !gl) return;
    const arm = () => setArmed(true);
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && arm(), { rootMargin: "100% 0px" });
    io.observe(el);
    // Safari viejo no tiene requestIdleCallback: ahí espera un rato fijo
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    let idle: number | ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (idle === undefined) idle = ric ? ric(arm, { timeout: 1500 }) : setTimeout(arm, 400);
    };
    const hero = document.getElementById("hero");
    const pastHero = () => window.scrollY > (hero?.offsetHeight ?? window.innerHeight) * 0.75;
    const onScroll = () => {
      if (!pastHero()) return;
      schedule();
      window.removeEventListener("scroll", onScroll);
    };
    if (pastHero()) schedule();
    else window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (idle !== undefined) {
        if (ric) window.cancelIdleCallback(idle as number);
        else clearTimeout(idle);
      }
    };
  }, [gl]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-[var(--ease-out)] ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <LogoMark className="h-[62%] w-auto" />
      </div>
      {gl && armed && (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)] ${ready ? "opacity-100" : "opacity-0"}`}>
          <CanvasBoundary>
            <StepsIsotype step={step} reduce={reduce} onReady={() => setReady(true)} />
          </CanvasBoundary>
        </div>
      )}
    </div>
  );
}

/* Escala el contenido para que entre en el alto disponible (hasta 50 %), sin recortarlo */
function FitBox({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      i.style.transform = "";
      i.style.width = "";
      const avail = o.clientHeight;
      const natural = i.offsetHeight;
      const k = avail > 0 && natural > avail ? Math.max(0.5, avail / natural) : 1;
      if (k < 1) {
        i.style.width = `${100 / k}%`;
        i.style.transform = `scale(${k})`;
      }
    };
    // El panel cambia de alto (barra del navegador) y las vistas crecen (mensajes nuevos)
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    fit();
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} className="relative min-h-0 flex-1 overflow-hidden">
      <div ref={inner} className="origin-top-left">
        {children}
      </div>
    </div>
  );
}

const StepPreview = memo(function StepPreview({
  Preview,
  suspended,
  mounted,
}: {
  Preview: ComponentType;
  suspended: boolean;
  mounted: boolean;
}) {
  return (
    <div inert={suspended} className="mt-5 flex min-h-0 flex-1 flex-col lg:mt-7">
      <FitBox>
        <PreviewSuspendContext.Provider value={suspended}>{mounted ? <Preview /> : null}</PreviewSuspendContext.Provider>
      </FitBox>
    </div>
  );
});

export function HowItWorks() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const track = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(() => new Set([0, 1]));
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActive((current) => (current === next ? current : next));
    // Monta la vista del paso activo y la del siguiente (una vez montadas, quedan)
    setVisited((seen) => (seen.has(next) && seen.has(next + 1) ? seen : new Set([...seen, next, next + 1])));
  });

  useEffect(() => {
    // Si el foco quedó dentro de una vista que se ocultó, pasa al botón del paso activo
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.closest("[data-step]")?.getAttribute("data-step") !== String(active)) {
      if (focused.closest("[data-step]")) buttons.current[active]?.focus({ preventScroll: true });
    }
  }, [active]);

  // Lleva al centro del tramo de cada paso
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const target = top + (span * (i + 0.5)) / STEPS.length;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target });
  };

  // Las mismas variantes siempre (el servidor no conoce la preferencia y el HTML tiene que
  // coincidir): con reduced motion, el CSS del artículo anula el barrido y el desplazamiento
  // y queda solo el fundido
  // En celulares, salida corta y entrada apenas después (los textos no se superponen); en
  // escritorio, el barrido sale y entra a la vez
  const staged = mobile && !reduce;
  const enter = staged ? { duration: 0.55, delay: 0.14, ease: EASE } : { duration: reduce ? 0.25 : 0.75, ease: EASE };
  const leave = staged ? { duration: 0.22, ease: EASE } : enter;
  const variants = {
    shown: { clipPath: SHOWN, opacity: 1, transform: STILL, transition: enter },
    before: { clipPath: BEFORE, opacity: 0, transform: "translateY(18px)", transition: leave },
    after: { clipPath: AFTER, opacity: 0, transform: "translateY(-18px)", transition: leave },
  };

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="relative">
      <StageMark pose="arrive" className="absolute left-0 top-0" />

      <div className="mx-auto max-w-[1200px] px-4 pb-6 pt-24 md:px-6 md:pt-36">
        <h2
          id="como-titulo"
          className="font-display max-w-[16ch] text-[clamp(2.3rem,8.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.6rem] lg:text-[4.4rem]"
        >
          <MaskWords text="Así convertimos consultas en ventas." />
        </h2>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-muted md:text-lg">
          Un solo equipo se encarga de los cuatro pasos, sin que ninguna consulta se pierda entre uno y otro.
        </p>
      </div>

      {/* Un tramo de scroll por paso; el panel queda fijo mientras tanto */}
      <div ref={track} className="relative" style={{ height: `${(STEPS.length + 1) * 100}svh` }}>
        {STEPS.map((s, i) => (
          <StageMark
            key={s.pose}
            pose={s.pose}
            className="absolute left-0"
            style={{ top: `${i * 100 + 50}svh` }}
          />
        ))}
        {/* Crecer queda quieto hasta que el panel se suelta; recién ahí la S se retira */}
        <StageMark
          pose="crecer"
          className="absolute left-0"
          style={{ top: `${STEPS.length * 100 - 4}svh` }}
        />
        <StageMark pose="out" className="absolute left-0" style={{ top: `${STEPS.length * 100 + 32}svh` }} />

        <div data-stage-panel className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-4 pb-6 pt-[84px] md:px-6 lg:pb-12 lg:pt-28">
            {/* Pasos: navegación y progreso */}
            <nav aria-label="Pasos de la venta" className="lg:max-w-[540px]">
              <ol className="grid grid-cols-4 gap-2 sm:gap-4">
                {STEPS.map((s, i) => (
                  <li key={s.verb}>
                    <button
                      ref={(el) => {
                        buttons.current[i] = el;
                      }}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      aria-controls={`paso-${s.pose}`}
                      className={`group flex min-h-11 w-full flex-col justify-end text-left text-[13px] font-medium transition-colors duration-200 sm:text-sm ${
                        i === active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                      }`}
                    >
                      <span>
                        <span className="mr-1.5 font-mono text-[11px] tabular-nums text-ink-faint">0{i + 1}</span>
                        {s.verb}
                      </span>
                      <RailSegment progress={scrollYProgress} index={i} total={STEPS.length} />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <p aria-live="polite" className="sr-only">
              {`Paso ${active + 1} de ${STEPS.length}: ${STEPS[active].verb}. ${STEPS[active].title}`}
            </p>

            {/* En celulares, este hueco es de la S de los pasos (con su propio canvas) */}
            <div id="steps-slot" aria-hidden="true" className="relative h-[25svh] shrink-0 lg:hidden">
              {mobile && <MobileSteps step={active} reduce={Boolean(reduce)} />}
            </div>

            <div className="relative grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] lg:mt-10 lg:max-w-[540px]">
              {STEPS.map((s, i) => {
                const state = i === active ? "shown" : i < active ? "after" : "before";
                return (
                  <motion.article
                    key={s.verb}
                    id={`paso-${s.pose}`}
                    data-step={i}
                    initial={false}
                    animate={state}
                    variants={variants}
                    className={`col-start-1 row-start-1 flex min-h-0 flex-col max-lg:![clip-path:none] motion-reduce:![clip-path:none] motion-reduce:!transform-none ${
                      i === active ? "" : "pointer-events-none"
                    }`}
                  >
                    <p className="text-sm text-blue-300">{s.service}</p>
                    <h3 className="font-display mt-2 text-[1.7rem] font-bold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[2.2rem] lg:text-[2.6rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink-muted max-lg:[@media(max-height:720px)]:hidden md:text-base">{s.text}</p>
                    <StepPreview Preview={s.Preview} suspended={i !== active} mounted={visited.has(i)} />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cierre: el hardware como módulo aparte */}
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-10 md:px-6 md:pb-32">
        <p className="max-w-[60ch] border-t border-line pt-8 text-[15px] leading-relaxed text-ink-muted">
          <span className="font-medium text-ink">Módulo aparte: hardware e IoT.</span> Sensores, placas y control
          de acceso conectados, para negocios que lo necesitan.
        </p>
      </div>
    </section>
  );
}
