"use client";

/*
  Servicios: desarrollo web, software a medida, agentes de IA, hardware e IoT y marketing.
  Cada tarjeta tiene su objeto 3D en CSS (services-3d), que se arma cuando la tarjeta llega y
  queda en reposo (con su loop) mientras está a la vista.

  - Celulares (con al menos 640px de alto): un mazo. Cada tarjeta se queda pegada arriba y la
    siguiente sube y la tapa; la de abajo se inclina hacia atrás, se achica y se apaga. Donde el
    navegador tiene animaciones ligadas al scroll, eso y el giro de cada objeto van al ritmo del
    dedo y en el compositor (scenes.css); si no, el mazo se apila igual, sin inclinarse
  - Escritorio: grilla con tamaños distintos; cada objeto gira apenas al cruzar la pantalla
  - Solo la tarjeta de arriba del mazo (o las visibles, en la grilla) corre sus loops
  - Con reduced motion: los objetos armados y quietos, sin mazo inclinado (lo resuelve el CSS: el
    servidor no conoce la preferencia y el HTML tiene que coincidir al hidratar)
*/
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { MaskWords } from "@/components/mask-words";
import { ServiceScene } from "@/components/services-3d";
import { SERVICES, type ServiceKey } from "@/content/services";

// Misma consulta que el mazo de scenes.css
const DECK_QUERY = "(max-width: 1023.98px) and (min-height: 640px)";

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
   tapa la siguiente; su objeto gira desde que llega hasta que queda tapado */
const deckVars = (i: number) =>
  ({
    "--i": i,
    "--r0": `exit-crossing ${i * SEG}%`,
    "--r1": `exit-crossing ${(i + 1) * SEG}%`,
    "--t0": i === 0 ? "entry 35%" : `exit-crossing ${(i - 1) * SEG}%`,
    "--t1": `exit-crossing ${Math.min(100, (i + 1) * SEG)}%`,
  }) as CSSProperties;

const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

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
    const stacked = window.matchMedia(DECK_QUERY).matches;
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
    <section id="servicios" aria-labelledby="servicios-titulo" className="relative">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 md:px-6 md:pt-32">
        <p className="text-sm text-blue-300">Servicios</p>
        <h2
          id="servicios-titulo"
          className="font-display mt-3 max-w-[15ch] text-[clamp(2.3rem,8.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.6rem] lg:text-[4.4rem]"
        >
          <MaskWords text="Cinco servicios, un mismo equipo." />
        </h2>
        <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-ink-muted md:text-lg">
          Cada uno resuelve una parte de tu negocio y todos se conectan: lo que pasa en tu web llega al agente, al CRM
          y a tus números.
        </p>
      </div>

      <ol
        ref={deck}
        aria-label="Servicios de SEN"
        className="svc-deck mx-auto mt-10 max-w-[640px] px-4 md:mt-14 lg:grid lg:max-w-[1200px] lg:grid-cols-12 lg:gap-5 lg:px-6"
      >
        {SERVICES.map((s, i) => (
          <li key={s.key} className={`svc-item svc-item-${s.key} ${SPAN[s.key]}`} style={deckVars(i)}>
            <article
              aria-labelledby={`servicio-${s.key}`}
              data-on={on[i]}
              data-live={live.includes(i)}
              data-last={i === N - 1 || undefined}
              className="svc-card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-navy-850"
            >
              <div className="svc-stage relative h-[216px] shrink-0">
                <ServiceScene kind={s.key} />
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
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
