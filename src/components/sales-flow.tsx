"use client";

/*
  El recorrido de una consulta, de punta a punta: pauta, web y canales → el agente de IA filtra
  → el CRM ordena por área → venta cerrada → crecimiento.

  - Panel sticky dentro de un tramo alto: el scroll elige la etapa y el cambio se reproduce con
    tiempo propio (se dibuja el tramo, se enciende el nodo con una onda), así se ve completo
    aunque el dedo pase rápido; mientras tanto el scroll no mueve nada del SVG
  - Las consultas son puntos que viajan por las líneas (SMIL animateMotion, sin JS por cuadro).
    Las que solo consultaban se van en gris al costado
  - Solo atributos SVG (pathLength, r) y opacidad: sin transforms ni guiones en px, que Safari
    resuelve distinto
  - En escritorio, este SVG horizontal; en celulares, sales-flow-mobile (vertical, con
    animaciones que resuelve el compositor para que el teléfono no se trabe)
  - Fuera de pantalla las animaciones se pausan; con reduced motion no hay puntos en viaje
*/
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { MaskWords } from "./mask-words";
import { MobileFlow } from "./sales-flow-mobile";
import { DESKTOP, EDGES, NODES, STAGES, type EdgeDef, type Layout, type NodeDef, type Point } from "./sales-flow-data";

// Cada cambio de etapa se reproduce con su propio tiempo (no atado a la velocidad del dedo)
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function Edge({ d, stage, tone, sf }: { d: string; stage: number; tone?: "muted"; sf: MotionValue<number> }) {
  // El tramo se dibuja en el primer 70 % de su etapa. Motion pone pathLength y el trazo como
  // atributos sin unidades (así se dibuja igual en Safari); en 0 se oculta para que el remate
  // redondeado no deje un punto suelto
  const length = useTransform(sf, [stage, stage + 0.7], [0, 1]);
  const opacity = useTransform(length, [0, 0.02], [0, 1]);
  const muted = tone === "muted";
  return (
    <g>
      <path d={d} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      <motion.path
        d={d}
        style={{ pathLength: length, opacity }}
        className={`fill-none ${muted ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={muted ? 1.5 : 2}
        strokeLinecap="round"
      />
    </g>
  );
}

function Particles({ d, edge, sf, r }: { d: string; edge: EdgeDef; sf: MotionValue<number>; r: number }) {
  // Los puntos aparecen cuando el tramo ya está dibujado. animateMotion lleva el trazado en su
  // propio atributo path (sin <mpath href>, que algunos Safari no resuelven)
  const opacity = useTransform(sf, [edge.stage + 0.55, edge.stage + 0.85], [0, 1]);
  const dur = edge.tone === "muted" ? 2.6 : 2.1;
  return (
    <motion.g style={{ opacity }} className="motion-reduce:hidden">
      {Array.from({ length: edge.particles }, (_, i) => {
        const begin = `${(i * dur) / edge.particles + (edge.stage % 2) * 0.35}s`;
        return (
          <circle key={i} r={r} className={edge.tone === "muted" ? "fill-ink-faint" : "fill-blue-400"} opacity={0}>
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
    </motion.g>
  );
}

function FlowNode({ def, at, layout, sf }: { def: NodeDef; at: Point; layout: Layout; sf: MotionValue<number> }) {
  const { r, iconSize, labelSize, labelGap } = layout;
  // Arranca en 0 aunque el nodo se encienda temprano (las fuentes): en la etapa -1 todo apagado
  const on = useTransform(sf, [Math.max(0, def.at - 0.3), def.at], [0, 1]);
  const dim = useTransform(on, [0, 1], [0.35, 1]);
  // Al encenderse, el relleno crece desde el centro y una onda sale del nodo (y todo vuelve si
  // se retrocede). Solo atributos (r) y opacidad: nada de transforms sobre el SVG
  const fillR = useTransform(on, [0, 1], [r * 0.55, r]);
  // La onda corre con su propio tiempo cuando el nodo termina de encenderse (si saliera de sf,
  // quedaría a medio abrir cuando la etapa se detiene)
  const wave = useMotionValue(0);
  useMotionValueEvent(on, "change", (v) => {
    const prev = on.getPrevious() ?? 0;
    if (v >= 0.999 && prev < 0.999) animate(wave, [0, 1], { duration: 0.9, ease: EASE_OUT });
    else if (v < 0.5 && wave.get() > 0) wave.set(0);
  });
  const waveR = useTransform(wave, [0, 1], [r, r * 2.1]);
  const waveOpacity = useTransform(wave, [0, 0.12, 1], [0, 0.6, 0]);
  const muted = def.tone === "muted";
  return (
    <motion.g style={{ opacity: dim }}>
      <motion.circle
        cx={at.x}
        cy={at.y}
        style={{ r: waveR, opacity: waveOpacity }}
        className={`fill-none motion-reduce:hidden ${muted ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={1.5}
      />
      <circle cx={at.x} cy={at.y} r={r} className="fill-navy-850 stroke-line-strong" strokeWidth={1.5} />
      {/* Encendido: relleno tenue y aro de color cuando la consulta llega */}
      <motion.circle
        cx={at.x}
        cy={at.y}
        style={{ r: fillR, opacity: on }}
        className={muted ? "fill-ink-faint/10" : "fill-blue-400/15"}
      />
      <motion.circle
        cx={at.x}
        cy={at.y}
        r={r}
        style={{ opacity: on }}
        className={`fill-none ${muted ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={2}
      />
      {"icon" in def.glyph ? (
        <def.glyph.icon
          x={at.x - iconSize / 2}
          y={at.y - iconSize / 2}
          size={iconSize}
          weight="light"
          className={muted ? "text-ink-faint" : "text-ink"}
        />
      ) : (
        <svg
          x={at.x - iconSize * 0.4}
          y={at.y - iconSize * 0.4}
          width={iconSize * 0.8}
          height={iconSize * 0.8}
          viewBox="0 0 24 24"
          className="fill-ink"
        >
          <path d={def.glyph.path} />
        </svg>
      )}
      <text
        x={at.x}
        y={at.y + labelGap}
        textAnchor="middle"
        fontSize={labelSize}
        className={muted ? "fill-ink-faint" : "fill-ink-muted"}
      >
        {def.label}
      </text>
    </motion.g>
  );
}

function Chart({ layout, sf, gradientId }: { layout: Layout; sf: MotionValue<number>; gradientId: string }) {
  const length = useTransform(sf, [4.05, 4.75], [0, 1]);
  const lineOpacity = useTransform(length, [0, 0.02], [0, 1]);
  const fill = useTransform(sf, [4.4, 4.9], [0, 1]);
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--blue-400)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--blue-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={layout.chart.area} style={{ opacity: fill }} fill={`url(#${gradientId})`} />
      <motion.path
        d={layout.chart.line}
        style={{ pathLength: length, opacity: lineOpacity }}
        className="fill-none stroke-blue-400"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Diagram({ layout, sf, className }: { layout: Layout; sf: MotionValue<number>; className: string }) {
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

  const r = 4;
  return (
    <svg ref={svg} viewBox={layout.viewBox} aria-hidden="true" preserveAspectRatio="xMidYMid meet" className={className}>
      {EDGES.map((e) => (
        <Edge key={e.id} d={layout.edges[e.id]} stage={e.stage} tone={e.tone} sf={sf} />
      ))}
      <Chart layout={layout} sf={sf} gradientId={gradientId} />
      {EDGES.map((e) => (
        <Particles key={e.id} d={layout.edges[e.id]} edge={e} sf={sf} r={r} />
      ))}
      {NODES.map((n) => (
        <FlowNode key={n.id} def={n} at={layout.nodes[n.id]} layout={layout} sf={sf} />
      ))}
    </svg>
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
    const t = setTimeout(() => {
      lastStep.current = performance.now();
      setShown((s) => (reduce ? target : s + Math.sign(target - s)));
    }, wait);
    return () => clearTimeout(t);
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

  // Etapas como número continuo (0 a 5): cada tramo y cada nodo leen su parte. El scroll solo
  // elige la etapa; el recorrido hasta ella se anima con tiempo propio, así se ve completo
  // aunque el dedo pase rápido (y si salta varias etapas, las encadena más rápido)
  const sf = useMotionValue(0);
  useEffect(() => {
    const target = stage + 1;
    // En celulares el diagrama es otro (sales-flow-mobile): el de escritorio no se anima
    if (reduce || window.matchMedia("(max-width: 1023.98px)").matches) {
      sf.set(target);
      return;
    }
    const distance = Math.abs(target - sf.get());
    const controls = animate(sf, target, {
      duration: Math.min(2.4, 1.25 + 0.3 * Math.max(0, distance - 1)),
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [stage, reduce, sf]);

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

      <div ref={track} className="relative" style={{ height: `${STAGES.length * 60 + 100}svh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-4 pb-6 pt-[84px] md:px-6 lg:pb-10 lg:pt-28">
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <div className="h-full w-full lg:hidden">
                <MobileFlow stage={shown} reduce={Boolean(reduce)} />
              </div>
              <Diagram layout={DESKTOP} sf={sf} className="hidden h-full max-h-[62svh] w-full lg:block" />
            </div>

            {/* Etapas: en escritorio las cinco a la vista; en celulares, la activa. En celulares
                comparten una celda (el texto más largo fija el alto, así el diagrama no cambia
                de tamaño) y se relevan sin pisarse: la que sale se va rápido hacia arriba y la
                que llega entra desde abajo apenas después */}
            <ol className="mt-4 grid lg:mt-6 lg:grid-cols-5 lg:gap-6">
              {STAGES.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.title}
                    aria-current={on ? "step" : undefined}
                    className={`col-start-1 row-start-1 border-t pt-3 transition-[opacity,translate,border-color] ease-[var(--ease-out)] motion-reduce:!translate-none lg:col-start-auto lg:row-start-auto ${
                      on
                        ? "border-blue-400 delay-150 duration-500"
                        : `border-line duration-200 max-lg:opacity-0 ${i < active ? "max-lg:-translate-y-2" : "max-lg:translate-y-2"}`
                    }`}
                  >
                    <p className={`text-sm font-medium transition-colors duration-500 ${on ? "text-ink" : "text-ink-faint"}`}>
                      <span className="mr-1.5 font-mono text-[11px] tabular-nums text-ink-faint">0{i + 1}</span>
                      {s.title}
                    </p>
                    <p
                      className={`mt-1 text-[13px] leading-relaxed transition-opacity duration-500 lg:text-sm ${
                        on ? "text-ink-muted" : "text-ink-faint lg:opacity-0"
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
