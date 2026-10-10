"use client";

/*
  Cómo funciona: el recorrido de una venta en cuatro pasos, en un solo panel fijo.
  Mientras se baja, el panel queda quieto y cambia de paso; en el escenario 3D se enciende la
  cinta de la S que corresponde (atraer, atender, cerrar) y en "crecer" la S se vuelve a armar.
  Cada paso: el verbo, una frase y la vista viva del servicio que lo resuelve.

  - Sin GSAP pin: un contenedor alto con un panel sticky (convive con Lenis sin saltos)
  - El cambio de paso es un barrido en diagonal, con la inclinación de las cintas del isotipo
    (24,5°); con reduced motion, un fundido
  - Las vistas de los pasos que no se ven quedan en pausa (PreviewSuspendContext)
  - La barra de pasos es navegación real: cada verbo lleva a su paso
*/
import dynamic from "next/dynamic";
import { ArrowDown } from "@phosphor-icons/react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import { AgentPreview } from "@/components/previews/agent-preview";
import { CrmPreview } from "@/components/previews/crm-preview";
import { MarketingPreview } from "@/components/previews/marketing-preview";
import { PreviewSuspendContext } from "@/components/previews/preview-shell";
import { getLenis } from "@/components/smooth-scroll";
import { StageMark } from "@/components/three/stage";
import type { PoseKey } from "@/components/three/choreography";

const GrowthChart = dynamic(() => import("@/components/dashboard-chart").then((m) => m.GrowthChart), {
  ssr: false,
  loading: () => <div className="h-full rounded-[1.25rem] border border-line bg-navy-900/50" />,
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
    title: "Anuncios que traen consultas, no solo likes.",
    text: "Campañas en Meta y Google y una web pensada para que te escriban.",
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
    title: "Cada consulta llega al vendedor justo.",
    text: "Con toda la conversación y sin seguimientos olvidados, en un CRM hecho a tu medida.",
    Preview: CrmPreview,
  },
  {
    pose: "crecer",
    verb: "Crecer",
    service: "Tableros",
    title: "Sabés qué anuncio vende y quién cierra.",
    text: "Tus números de ventas en un tablero que se actualiza solo.",
    Preview: GrowthChart,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// Barrido en diagonal con la inclinación de las cintas: tan(24,5°) ≈ 0,46 del alto
const SHOWN = "polygon(-46% 0%, 100% 0%, 146% 100%, 0% 100%)";
const BEFORE = "polygon(-46% 0%, -46% 0%, 0% 100%, 0% 100%)";
const AFTER = "polygon(100% 0%, 100% 0%, 146% 100%, 146% 100%)";

function RailSegment({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const fill = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
  return (
    <span aria-hidden="true" className="relative mt-2 block h-[2px] w-full overflow-hidden rounded-full bg-fg/10">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left rounded-full bg-blue-400" />
    </span>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActive((current) => (current === next ? current : next));
  });

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

  const variants = reduce
    ? { shown: { opacity: 1 }, before: { opacity: 0 }, after: { opacity: 0 } }
    : {
        shown: { clipPath: SHOWN, opacity: 1, transform: "translateY(0px)" },
        before: { clipPath: BEFORE, opacity: 0.4, transform: "translateY(18px)" },
        after: { clipPath: AFTER, opacity: 0.4, transform: "translateY(-18px)" },
      };

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="relative">
      <StageMark pose="arrive" className="absolute left-0 top-0" />

      <div className="mx-auto max-w-[1200px] px-4 pb-6 pt-24 md:px-6 md:pt-36">
        <h2
          id="como-titulo"
          className="font-display max-w-[16ch] text-[clamp(2.3rem,8.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.6rem] lg:text-[4.4rem]"
        >
          Así convertimos consultas en ventas.
        </h2>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-muted md:text-lg">
          Un solo equipo se encarga de los cuatro pasos y cada uno le pasa el cliente al siguiente.
        </p>
      </div>

      {/* Un tramo de scroll por paso; el panel queda fijo mientras tanto */}
      <div ref={track} className="relative" style={{ height: `${(STEPS.length + 1) * 100}svh` }}>
        {STEPS.map((s, i) => (
          <StageMark key={s.pose} pose={s.pose} className="absolute left-0" style={{ top: `${i * 100 + 50}svh` }} />
        ))}
        <StageMark pose="out" className="absolute left-0" style={{ top: `${STEPS.length * 100 + 60}svh` }} />

        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-6 pt-[84px] md:px-6 lg:pb-12 lg:pt-28">
            {/* Pasos: navegación y progreso */}
            <nav aria-label="Pasos de la venta" className="lg:max-w-[540px]">
              <ol className="grid grid-cols-4 gap-2 sm:gap-4">
                {STEPS.map((s, i) => (
                  <li key={s.verb}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
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

            {/* En celulares, el espacio de arriba es del isotipo */}
            <div aria-hidden="true" className="h-[30svh] shrink-0 lg:hidden" />

            <div className="relative grid min-h-0 flex-1 lg:mt-10 lg:max-w-[540px]">
              {STEPS.map((s, i) => {
                const state = i === active ? "shown" : i < active ? "after" : "before";
                return (
                  <motion.article
                    key={s.verb}
                    aria-hidden={i !== active}
                    inert={i !== active}
                    initial={false}
                    animate={state}
                    variants={variants}
                    transition={{ duration: reduce ? 0.25 : 0.75, ease: EASE }}
                    className="col-start-1 row-start-1 flex min-h-0 flex-col"
                  >
                    <p className="text-sm text-blue-300">{s.service}</p>
                    <h3 className="font-display mt-2 text-[1.7rem] font-bold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[2.2rem] lg:text-[2.6rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink-muted md:text-base">{s.text}</p>
                    <div className="mt-5 min-h-0 flex-1 lg:mt-7 lg:max-h-[330px]">
                      <PreviewSuspendContext.Provider value={i !== active}>
                        <s.Preview />
                      </PreviewSuspendContext.Provider>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cierre: el hardware como módulo aparte y la nota de las vistas */}
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-10 md:px-6 md:pb-32">
        <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">Módulo aparte: hardware e IoT.</span> Sensores, placas y
            control de acceso conectados, para negocios que lo necesitan.
          </p>
          <a
            href="#proyectos"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-ink transition-colors duration-150 hover:text-blue-300"
          >
            Ver proyectos
            <ArrowDown size={15} weight="bold" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>
        <p className="mt-4 text-xs text-ink-faint">Las vistas de cada paso son de ejemplo.</p>
      </div>
    </section>
  );
}
