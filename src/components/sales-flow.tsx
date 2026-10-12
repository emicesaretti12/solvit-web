"use client";

/*
  El recorrido de una consulta, de punta a punta: pauta, web y canales → el agente de IA filtra
  → el CRM ordena por área → venta cerrada → crecimiento.

  - Panel sticky dentro de un tramo alto: el scroll elige la etapa y el cambio se reproduce con
    tiempo propio (se dibuja el tramo, el nodo se eleva con una onda), así se ve completo aunque
    el dedo pase rápido; si salta varias etapas, las encadena de a una
  - El circuito es una placa en 3D, inclinada como sobre una mesa, que se endereza mientras el
    panel está fijo (animation-timeline, en el compositor). Los nodos son fichas con espesor
    paradas sobre la placa: cuando llega la consulta se elevan, dejan su sombra en la placa y
    sueltan una onda. Sin soporte de animaciones ligadas al scroll, la placa queda inclinada fija
  - Todo con CSS: el estado de cada pieza es un atributo (data-on) y las transiciones hacen el
    resto (trazo con stroke-dashoffset y pathLength, fichas con transform, fundidos con
    opacidad). Cada pieza tiene su momento dentro de la etapa (--t). Nada de JS por cuadro
  - Las consultas son puntos que viajan por las líneas (SMIL animateMotion, sin JS por cuadro).
    Las que solo consultaban se van en gris al costado. Fuera de pantalla se pausan
  - Esto es el escritorio; en celulares, journey-mobile: bloques en vertical en el scroll
    común, cada uno con su escena en 3D con CSS (sin panel fijo)
  - Con reduced motion: placa quieta, sin puntos en viaje y cambios sin transición
*/
import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { MaskWords } from "./mask-words";
import { JourneyMobile } from "./journey-mobile";
import { DESKTOP, EDGES, NODES, STAGES, type EdgeDef, type NodeDef } from "./sales-flow-data";

// viewBox del circuito de escritorio: las fichas se ubican en % de la placa
const VB = { w: 1160, h: 460 };
// Segundos que dura una etapa: cada pieza entra en su fracción (--t)
const STAGE_S = 1.1;
// Capas del canto de cada ficha (de la más profunda a la cara)
const TILE_DEPTH = [3, 2, 1];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const t = (s: number) => ({ "--t": `${s.toFixed(2)}s` }) as CSSProperties;

function Edge({ d, edge, on }: { d: string; edge: EdgeDef; on: boolean }) {
  const muted = edge.tone === "muted";
  return (
    <g>
      <path d={d} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      {/* pathLength 1: el trazo se dibuja con stroke-dashoffset de 1 a 0 (igual en Safari) */}
      <path
        d={d}
        pathLength={1}
        data-on={on}
        className={`flow-edge fill-none ${muted ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={muted ? 1.5 : 2}
        strokeLinecap="round"
      />
    </g>
  );
}

function Particles({ d, edge, on }: { d: string; edge: EdgeDef; on: boolean }) {
  // Los puntos aparecen cuando el tramo ya está dibujado. animateMotion lleva el trazado en su
  // propio atributo path (sin <mpath href>, que algunos Safari no resuelven)
  const dur = edge.tone === "muted" ? 2.6 : 2.1;
  return (
    <g data-on={on} style={t(0.65 * STAGE_S)} className="flow-fade motion-reduce:hidden">
      {Array.from({ length: edge.particles }, (_, i) => {
        const begin = `${(i * dur) / edge.particles + (edge.stage % 2) * 0.35}s`;
        return (
          <circle key={i} r={4} className={edge.tone === "muted" ? "fill-ink-faint" : "fill-blue-400"} opacity={0}>
            <animateMotion
              path={d}
              dur={`${dur}s`}
              begin={begin}
              repeatCount="indefinite"
              calcMode="spline"
              keyPoints="0;1"
              keyTimes="0;1"
              keySplines="0.45 0 0.25 1"
            />
            <animate
              attributeName="opacity"
              dur={`${dur}s`}
              begin={begin}
              repeatCount="indefinite"
              values="0;1;1;0"
              keyTimes="0;0.12;0.85;1"
            />
          </circle>
        );
      })}
    </g>
  );
}

/* Ficha del circuito: un zócalo en la placa, la sombra y la ficha con su canto, que se eleva
   cuando la consulta llega. El nombre queda en la placa, debajo */
function FlowNode({ def, on }: { def: NodeDef; on: boolean }) {
  const at = DESKTOP.nodes[def.id];
  const muted = def.tone === "muted";
  const stage = Math.floor(def.at);
  return (
    <div
      data-on={on}
      data-tone={muted ? "muted" : undefined}
      className="fn"
      style={{ left: pct(at.x, VB.w), top: pct(at.y, VB.h), ...t((def.at - stage) * STAGE_S) }}
    >
      <span aria-hidden="true" className="fn-shadow" />
      <div className="fn-tile">
        {TILE_DEPTH.map((z) => (
          <span key={z} aria-hidden="true" className="fn-side" style={{ "--z": z } as CSSProperties} />
        ))}
        <span className="fn-face">
          <span aria-hidden="true" className="fn-wave" />
          {"icon" in def.glyph ? (
            <def.glyph.icon weight="light" className="fn-icon" />
          ) : (
            <svg viewBox="0 0 24 24" className="fn-icon fn-icon-brand fill-current" aria-hidden="true">
              <path d={def.glyph.path} />
            </svg>
          )}
        </span>
      </div>
      <span className="fn-label">{def.label}</span>
    </div>
  );
}

function Board({ stage }: { stage: number }) {
  const gradientId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-area`;
  const svg = useRef<SVGSVGElement>(null);
  const inView = useInView(svg, { amount: 0.1 });
  const reduce = useReducedMotion();

  // Los puntos solo corren con el diagrama a la vista y sin reduced motion
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (inView && !reduce) el.unpauseAnimations();
    else el.pauseAnimations();
  }, [inView, reduce]);

  return (
    <div className="flow-stage" aria-hidden="true">
      <div className="flow-board">
        <span className="flow-board-edge" />
        <svg ref={svg} viewBox={DESKTOP.viewBox} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          {EDGES.map((e) => (
            <Edge key={e.id} d={DESKTOP.edges[e.id]} edge={e} on={stage >= e.stage} />
          ))}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--blue-400)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--blue-400)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Crecimiento: el área aparece y la curva se dibuja después de la venta */}
          <path d={DESKTOP.chart.area} data-on={stage >= 4} style={t(0.45 * STAGE_S)} className="flow-fade" fill={`url(#${gradientId})`} />
          <path
            d={DESKTOP.chart.line}
            pathLength={1}
            data-on={stage >= 4}
            style={t(0.05 * STAGE_S)}
            className="flow-edge fill-none stroke-blue-400"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {EDGES.map((e) => (
            <Particles key={e.id} d={DESKTOP.edges[e.id]} edge={e} on={stage >= e.stage} />
          ))}
        </svg>
        {NODES.map((n) => (
          <FlowNode key={n.id} def={n} on={stage >= Math.floor(n.at)} />
        ))}
      </div>
    </div>
  );
}

/* La etapa que se muestra avanza de a una hacia la del scroll (~0,4 s por etapa): con un
   deslizamiento rápido o un salto, las etapas igual se encienden en orden (y el texto acompaña
   al diagrama). Hacia atrás, más rápido */
function useChainedStage(target: number, reduce: boolean) {
  const [shown, setShown] = useState(target);
  const lastStep = useRef(0);
  useEffect(() => {
    if (shown === target) return;
    const gap = reduce ? 0 : target > shown ? 420 : 160;
    const wait = Math.max(0, gap - (performance.now() - lastStep.current));
    const timer = setTimeout(() => {
      lastStep.current = performance.now();
      setShown((s) => (reduce ? target : s + Math.sign(target - s)));
    }, wait);
    return () => clearTimeout(timer);
  }, [shown, target, reduce]);
  return shown;
}

export function SalesFlow() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // -1: el panel todavía no llegó (todo apagado); 0 a 4: la etapa a la vista
  const [stage, setStage] = useState(-1);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.015 ? -1 : Math.min(STAGES.length - 1, Math.floor((v / 0.92) * STAGES.length));
    setStage((current) => (current === next ? current : next));
  });

  const shown = useChainedStage(stage, Boolean(reduce));
  const active = Math.max(0, shown);

  return (
    <section id="recorrido" aria-labelledby="recorrido-titulo" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 pt-24 md:px-6 md:pt-36">
        <h2
          id="recorrido-titulo"
          className="font-display max-w-[20ch] text-[clamp(2.1rem,7.6vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[2.8rem] lg:max-w-none lg:text-[3.4rem]"
        >
          <MaskWords text="El camino de cada consulta, del anuncio a la venta." />
        </h2>
      </div>

      {/* Celulares: el recorrido en el scroll común, con bloques que entran en 3D */}
      <div className="lg:hidden">
        <JourneyMobile />
      </div>

      {/* Escritorio: el circuito en un panel fijo que se arma con el scroll */}
      <div ref={track} className="flow-track relative hidden lg:block" style={{ height: `${STAGES.length * 60 + 100}svh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 pb-10 pt-28">
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <Board stage={shown} />
            </div>

            {/* Las cinco etapas a la vista; la activa se enciende y muestra su texto */}
            <ol className="mt-6 grid grid-cols-5 gap-6">
              {STAGES.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.title}
                    aria-current={on ? "step" : undefined}
                    className={`border-t pt-3 transition-[border-color] duration-500 ease-[var(--ease-out)] ${
                      on ? "border-blue-400" : "border-line"
                    }`}
                  >
                    <p className={`text-sm font-medium transition-colors duration-500 ${on ? "text-ink" : "text-ink-faint"}`}>
                      <span className="mr-1.5 font-mono text-[11px] tabular-nums text-ink-faint">0{i + 1}</span>
                      {s.title}
                    </p>
                    <p
                      className={`mt-1 text-sm leading-relaxed transition-[opacity,translate] duration-500 ease-[var(--ease-out)] ${
                        on ? "text-ink-muted" : "translate-y-1 text-ink-faint opacity-0"
                      }`}
                    >
                      {s.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
