"use client";

/*
  Trabajos: lo que vendemos, en cinco líneas (desarrollo web, software a medida, agentes de IA,
  proyectos híbridos de software con hardware y marketing: contenido, redes y pauta). Cada
  tarjeta tiene su objeto 3D en CSS (services-3d), que se arma cuando la tarjeta llega y queda en
  reposo (con su loop) mientras está a la vista, y nombra los proyectos reales donde lo hicimos
  (llevan a su ficha en Proyectos).

  - Celulares (con al menos 640px de alto): un mazo. Cada tarjeta se queda pegada arriba y la
    siguiente sube y la tapa; la de abajo se inclina hacia atrás, se achica y se apaga. Donde el
    navegador tiene animaciones ligadas al scroll, eso, el giro de cada objeto y el brillo que
    cruza sus caras van al ritmo del dedo y en el compositor (scenes.css); si no, el mazo se
    apila igual, sin inclinarse, y el brillo cruza una vez al armarse
  - Tocar la tarjeta de arriba (con el dedo) vuelve a armar su objeto: la respuesta al toque,
    con un golpe háptico donde existe
  - Escritorio: grilla con tamaños distintos; cada objeto gira apenas al cruzar la pantalla. Con
    mouse, la tarjeta se inclina hacia el puntero con un resorte y el objeto, adentro, gira un
    poco más (paralaje en profundidad). Motion values y el transform completo como texto: no
    pasa por React en cada cuadro
  - Solo la tarjeta de arriba del mazo (o las visibles, en la grilla) corre sus loops
  - Con reduced motion: los objetos armados y quietos, sin mazo inclinado ni inclinación con el
    puntero (lo resuelve el CSS y los manejadores; el servidor no conoce la preferencia y el
    HTML tiene que coincidir al hidratar)
*/
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { MaskWords } from "@/components/mask-words";
import { ServiceScene } from "@/components/services-3d";
import { getLenis } from "@/components/smooth-scroll";
import { PROJECTS, type Project } from "@/content/projects";
import { SERVICES, type Service, type ServiceKey } from "@/content/services";
import { tap } from "@/lib/haptics";

// Misma consulta que el mazo de scenes.css
const DECK_QUERY = "(max-width: 1023.98px) and (min-height: 640px)";
// La inclinación con el puntero: solo con mouse (o trackpad) y en la grilla de escritorio
const TILT_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

// Las consultas se crean una vez y se leen en cada evento (el puntero se mueve seguido)
const queries = new Map<string, MediaQueryList>();
function matches(query: string) {
  let mql = queries.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    queries.set(query, mql);
  }
  return mql.matches;
}

// Resorte de la inclinación: sigue al puntero sin latigazo y vuelve solo al salir
const SPRING = { stiffness: 210, damping: 22, mass: 0.7 };

// Grilla de escritorio: web grande a la izquierda, el resto alrededor
const SPAN: Record<ServiceKey, string> = {
  web: "lg:col-span-7 lg:row-span-2",
  software: "lg:col-span-5",
  ia: "lg:col-span-5",
  hardware: "lg:col-span-6",
  marketing: "lg:col-span-6",
};

const N = SERVICES.length;
const SEG = 100 / N;

/* Tramos del mazo sobre la línea de tiempo de la lista (exit-crossing: de que su borde de arriba
   cruza el de la pantalla hasta que lo cruza el de abajo): la tarjeta i se inclina mientras la
   tapa la siguiente; su objeto gira (y su brillo cruza) desde que llega hasta que queda tapado */
const deckVars = (i: number) =>
  ({
    "--i": i,
    "--r0": `exit-crossing ${i * SEG}%`,
    "--r1": `exit-crossing ${(i + 1) * SEG}%`,
    "--t0": i === 0 ? "entry 35%" : `exit-crossing ${(i - 1) * SEG}%`,
    "--t1": `exit-crossing ${Math.min(100, (i + 1) * SEG)}%`,
  }) as CSSProperties;

const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/* Lleva a la ficha del proyecto; si el filtro de Proyectos la ocultaba, primero lo quita (el
   aviso lo escucha Proyectos, que vuelve a "Todos" antes de que se busque la ficha) */
function goToProject(slug: string, event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  // El toque en la tarjeta vuelve a armar su objeto: el enlace no tiene que dispararlo
  event.stopPropagation();
  window.dispatchEvent(new CustomEvent("sen:show-project", { detail: slug }));
  const target = document.getElementById(`proyecto-${slug}`);
  if (!target) return;
  target.focus({ preventScroll: true });
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target);
  } else target.scrollIntoView({ block: "start" });
}

const projectOf = (slug: string) => PROJECTS.find((p) => p.slug === slug);

function ServiceCard({ service: s, index: i, on, live }: { service: Service; index: number; on: boolean; live: boolean }) {
  const card = useRef<HTMLElement>(null);
  const pointer = useRef("mouse");
  const work = s.work.map(projectOf).filter((p): p is Project => p !== undefined);

  // Puntero sobre la tarjeta, de -0,5 a 0,5 en cada eje, con resorte. En reposo (0, 0) el
  // transform es "none": igual en el servidor y en el cliente, y sin capa de más en el mazo
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  // La tarjeta grande se inclina menos (en una superficie grande el mismo ángulo marea)
  const max = s.key === "web" ? 4.5 : 7;
  const tilt = useTransform([sx, sy], ([x, y]: number[]) =>
    x === 0 && y === 0
      ? "none"
      : `perspective(1200px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`,
  );
  const look = useTransform([sx, sy], ([x, y]: number[]) =>
    x === 0 && y === 0 ? "none" : `rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 18).toFixed(2)}deg)`,
  );

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !matches(TILT_QUERY) || matches(REDUCE_QUERY)) return;
    // La caja del <li>: la de la tarjeta cambia con su propia inclinación
    const box = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!box) return;
    px.set(Math.min(0.5, Math.max(-0.5, (e.clientX - box.left) / box.width - 0.5)));
    py.set(Math.min(0.5, Math.max(-0.5, (e.clientY - box.top) / box.height - 0.5)));
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  // Con el dedo, tocar la tarjeta de arriba vuelve a armar su objeto: data-replay lleva cada
  // pieza a su punto de partida sin transición; se fija ese estado (lectura de layout) y al
  // soltarlo las transiciones del armado corren de nuevo, con sus retardos
  const onClick = () => {
    const el = card.current;
    if (!el || pointer.current === "mouse" || !on || !live || matches(REDUCE_QUERY)) return;
    tap();
    el.setAttribute("data-replay", "");
    el.getBoundingClientRect();
    el.removeAttribute("data-replay");
  };

  return (
    <li className={`svc-item svc-item-${s.key} ${SPAN[s.key]}`} style={deckVars(i)}>
      <motion.article
        ref={card}
        aria-labelledby={`servicio-${s.key}`}
        data-on={on}
        data-live={live}
        data-last={i === N - 1 || undefined}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        style={{ transform: tilt }}
        className="svc-card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-navy-850"
      >
        <div className="svc-stage relative h-[216px] shrink-0">
          <ServiceScene kind={s.key} look={look} />
        </div>
        <div className="svc-body relative flex flex-1 flex-col px-5 pb-6 md:px-7 md:pb-8">
          <h3
            id={`servicio-${s.key}`}
            className="font-display text-[1.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink md:text-[2rem]"
          >
            {s.title}
          </h3>
          <p className="mt-2 text-base font-medium leading-snug text-ink">{s.lead}</p>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
          <ul aria-label={`Qué incluye ${s.title.toLowerCase()}`} className="mt-4 flex flex-wrap gap-1.5 lg:mt-auto lg:pt-5">
            {s.deliverables.map((d) => (
              <li key={d} className="rounded-full border border-line bg-navy-900/70 px-2.5 py-1 text-[12px] leading-none text-ink-muted">
                {d}
              </li>
            ))}
          </ul>
          {work.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[12px] text-ink-faint">Lo hicimos para</span>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {work.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`#proyecto-${p.slug}`}
                      onClick={(e) => goToProject(p.slug, e)}
                      className="group/link inline-flex min-h-8 items-center gap-1 text-[13px] font-medium text-blue-400 transition-colors duration-150 pointer-fine:hover:text-blue-300"
                    >
                      {p.client ?? p.name}
                      <ArrowUpRight
                        size={12}
                        weight="bold"
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-[var(--ease-out)] pointer-fine:group-hover/link:-translate-y-px pointer-fine:group-hover/link:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.article>
    </li>
  );
}

export function Services() {
  const deck = useRef<HTMLOListElement>(null);
  // Armadas (una vez armada, queda) y con loop corriendo
  const [on, setOn] = useState<boolean[]>(() => SERVICES.map(() => false));
  const [live, setLive] = useState<number[]>([]);
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    const list = deck.current;
    if (!list) return;
    const vh = window.innerHeight;
    const stacked = matches(DECK_QUERY);
    const arrived: number[] = [];
    const visible: number[] = [];
    let top = -1;
    Array.from(list.children).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.72 && r.bottom > vh * 0.08) arrived.push(i);
      if (r.bottom > 0 && r.top < vh) visible.push(i);
      // En el mazo, la de arriba es la última que ya llegó (las anteriores quedan tapadas)
      if (r.top < vh * 0.6 && r.bottom > 0) top = i;
    });
    setOn((prev) => (arrived.every((i) => prev[i]) ? prev : prev.map((v, i) => v || arrived.includes(i))));
    const next = stacked ? (top >= 0 ? [top] : []) : visible;
    setLive((prev) => (same(prev, next) ? prev : next));
  }, []);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="relative">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 md:px-6 md:pt-32">
        <p className="text-sm text-blue-300">Trabajos</p>
        <h2
          id="trabajos-titulo"
          className="font-display mt-3 max-w-[15ch] text-[clamp(2.3rem,8.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.6rem] lg:text-[4.4rem]"
        >
          <MaskWords text="Cinco servicios, un mismo equipo." />
        </h2>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-muted md:text-lg">
          Webs, software a medida, agentes de IA, proyectos que unen software con hardware y marketing con
          contenido, redes y pauta. Todo se conecta: lo que pasa en tu web llega al agente, al CRM y a tus números.
        </p>
      </div>

      <ol
        ref={deck}
        aria-label="Trabajos de SEN"
        className="svc-deck mx-auto mt-10 max-w-[640px] px-4 md:mt-14 lg:grid lg:max-w-[1200px] lg:grid-cols-12 lg:gap-5 lg:px-6"
      >
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.key} service={s} index={i} on={on[i]} live={live.includes(i)} />
        ))}
      </ol>
    </section>
  );
}
