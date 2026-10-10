"use client";

/*
  El recorrido de una consulta, de punta a punta: pauta, web y canales → el agente de IA filtra
  → el CRM ordena por área → venta cerrada → crecimiento.

  - Panel sticky dentro de un tramo alto: el scroll dibuja cada tramo del circuito y enciende
    cada nodo cuando la consulta llega (sin GSAP pin; convive con Lenis)
  - Las consultas son puntos que viajan por las líneas (SMIL animateMotion: corre en el
    compositor del SVG, sin JS por cuadro). Las que solo consultaban se van en gris al costado
  - Dos composiciones del mismo circuito: vertical en celulares, horizontal en escritorio
  - Fuera de pantalla las animaciones se pausan; con reduced motion no hay puntos en viaje
*/
import {
  ChatsCircle,
  CheckCircle,
  Globe,
  Handshake,
  Kanban,
  Sparkle,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { siGoogleads, siInstagram, siMeta, siWhatsapp } from "simple-icons";
import { MaskWords } from "./mask-words";

const STAGES = [
  {
    title: "Pauta, web y canales",
    text: "Las consultas llegan de tus anuncios, tu web, WhatsApp e Instagram.",
  },
  {
    title: "El agente de IA filtra",
    text: "Responde al instante y separa a quien quiere comprar de quien solo consulta.",
  },
  {
    title: "El CRM las ordena por área",
    text: "Cada consulta calificada llega al área que corresponde: ventas, postventa o service.",
  },
  {
    title: "Venta cerrada",
    text: "El vendedor recibe la conversación completa y cierra.",
  },
  {
    title: "Crecimiento",
    text: "Ves qué anuncio trae ventas y repetís lo que funciona.",
  },
];

type Glyph = { icon: Icon } | { path: string };
type NodeDef = {
  id: string;
  label: string;
  glyph: Glyph;
  /** Momento (en etapas, 0 a 5) en que se enciende */
  at: number;
  tone?: "muted";
};
type EdgeDef = { id: string; stage: number; particles: number; tone?: "muted" };
type Point = { x: number; y: number };
type Layout = {
  viewBox: string;
  r: number;
  iconSize: number;
  labelSize: number;
  labelGap: number;
  nodes: Record<string, Point>;
  /** Trazos; los que salen hacia abajo arrancan debajo del nombre del nodo, no lo cruzan */
  edges: Record<string, string>;
  chart: { line: string; area: string };
};

const SOURCES = [
  { id: "meta", label: "Meta Ads", glyph: { path: siMeta.path } },
  { id: "google", label: "Google Ads", glyph: { path: siGoogleads.path } },
  { id: "web", label: "Tu web", glyph: { icon: Globe } },
  { id: "whatsapp", label: "WhatsApp", glyph: { path: siWhatsapp.path } },
  { id: "instagram", label: "Instagram", glyph: { path: siInstagram.path } },
] as const;

const NODES: NodeDef[] = [
  ...SOURCES.map((s) => ({ ...s, glyph: s.glyph as Glyph, at: 0.15 })),
  { id: "ai", label: "Agente de IA", glyph: { icon: Sparkle }, at: 0.9 },
  { id: "discard", label: "Solo consultaban", glyph: { icon: ChatsCircle }, at: 1.75, tone: "muted" },
  { id: "crm", label: "CRM", glyph: { icon: Kanban }, at: 1.9 },
  { id: "ventas", label: "Ventas", glyph: { icon: Handshake }, at: 2.75 },
  { id: "postventa", label: "Postventa", glyph: { icon: ChatsCircle }, at: 2.75 },
  { id: "service", label: "Service", glyph: { icon: Wrench }, at: 2.75 },
  { id: "venta", label: "Venta cerrada", glyph: { icon: CheckCircle }, at: 3.8 },
];

const EDGES: EdgeDef[] = [
  ...SOURCES.map((s) => ({ id: `${s.id}-ai`, stage: 0, particles: 1 })),
  { id: "ai-crm", stage: 1, particles: 2 },
  { id: "ai-discard", stage: 1, particles: 1, tone: "muted" },
  { id: "crm-ventas", stage: 2, particles: 1 },
  { id: "crm-postventa", stage: 2, particles: 1 },
  { id: "crm-service", stage: 2, particles: 1 },
  { id: "ventas-venta", stage: 3, particles: 1 },
  { id: "venta-chart", stage: 4, particles: 1 },
];

const DESKTOP: Layout = {
  viewBox: "0 0 1160 460",
  r: 26,
  iconSize: 22,
  labelSize: 13,
  labelGap: 46,
  nodes: {
    meta: { x: 80, y: 50 },
    google: { x: 80, y: 135 },
    web: { x: 80, y: 220 },
    whatsapp: { x: 80, y: 305 },
    instagram: { x: 80, y: 390 },
    ai: { x: 360, y: 220 },
    discard: { x: 360, y: 390 },
    crm: { x: 620, y: 220 },
    ventas: { x: 860, y: 100 },
    postventa: { x: 860, y: 220 },
    service: { x: 860, y: 340 },
    venta: { x: 1060, y: 100 },
  },
  edges: {
    "meta-ai": "M106 50 C 230 50, 220 220, 334 220",
    "google-ai": "M106 135 C 230 135, 220 220, 334 220",
    "web-ai": "M106 220 L 334 220",
    "whatsapp-ai": "M106 305 C 230 305, 220 220, 334 220",
    "instagram-ai": "M106 390 C 230 390, 220 220, 334 220",
    "ai-crm": "M386 220 L 594 220",
    "ai-discard": "M360 280 L 360 364",
    "crm-ventas": "M646 220 C 760 220, 750 100, 834 100",
    "crm-postventa": "M646 220 L 834 220",
    "crm-service": "M646 220 C 760 220, 750 340, 834 340",
    "ventas-venta": "M886 100 L 1034 100",
    "venta-chart": "M1060 160 L 1060 262",
  },
  chart: {
    line: "M990 372 C 1020 366, 1032 344, 1056 340 S 1096 304, 1130 276",
    area: "M990 372 C 1020 366, 1032 344, 1056 340 S 1096 304, 1130 276 L 1130 392 L 990 392 Z",
  },
};

const MOBILE: Layout = {
  viewBox: "0 0 360 620",
  r: 19,
  iconSize: 17,
  labelSize: 11,
  labelGap: 33,
  nodes: {
    meta: { x: 36, y: 34 },
    google: { x: 108, y: 34 },
    web: { x: 180, y: 34 },
    whatsapp: { x: 252, y: 34 },
    instagram: { x: 324, y: 34 },
    ai: { x: 180, y: 190 },
    discard: { x: 312, y: 262 },
    crm: { x: 180, y: 330 },
    ventas: { x: 60, y: 450 },
    postventa: { x: 180, y: 450 },
    service: { x: 300, y: 450 },
    venta: { x: 60, y: 556 },
  },
  edges: {
    "meta-ai": "M36 72 C 36 130, 180 110, 180 171",
    "google-ai": "M108 72 C 108 130, 180 112, 180 171",
    "web-ai": "M180 72 L 180 171",
    "whatsapp-ai": "M252 72 C 252 130, 180 112, 180 171",
    "instagram-ai": "M324 72 C 324 130, 180 110, 180 171",
    "ai-crm": "M180 233 L 180 311",
    "ai-discard": "M196 202 C 250 214, 300 222, 310 243",
    "crm-ventas": "M180 373 C 180 410, 60 398, 60 431",
    "crm-postventa": "M180 373 L 180 431",
    "crm-service": "M180 373 C 180 410, 300 398, 300 431",
    "ventas-venta": "M60 494 L 60 537",
    "venta-chart": "M79 556 L 122 556",
  },
  chart: {
    line: "M128 596 C 170 590, 190 566, 228 562 S 290 530, 334 512",
    area: "M128 596 C 170 590, 190 566, 228 562 S 290 530, 334 512 L 334 606 L 128 606 Z",
  },
};

const ease = [0.16, 1, 0.3, 1] as const;

function Edge({
  prefix,
  id,
  d,
  stage,
  tone,
  sf,
}: {
  prefix: string;
  id: string;
  d: string;
  stage: number;
  tone?: "muted";
  sf: MotionValue<number>;
}) {
  // El tramo se dibuja en el primer 70 % de su etapa
  const dash = useTransform(sf, [stage, stage + 0.7], [1, 0]);
  return (
    <g>
      <path d={d} pathLength={1} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      <motion.path
        id={`${prefix}-${id}`}
        d={d}
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: dash }}
        className={`fill-none ${tone === "muted" ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={tone === "muted" ? 1.5 : 2}
        strokeLinecap="round"
      />
    </g>
  );
}

function Particles({
  prefix,
  edge,
  sf,
  r,
}: {
  prefix: string;
  edge: EdgeDef;
  sf: MotionValue<number>;
  r: number;
}) {
  // Los puntos aparecen cuando el tramo ya está dibujado
  const opacity = useTransform(sf, [edge.stage + 0.55, edge.stage + 0.85], [0, 1]);
  const dur = edge.tone === "muted" ? 2.6 : 2.1;
  return (
    <motion.g style={{ opacity }} className="motion-reduce:hidden">
      {Array.from({ length: edge.particles }, (_, i) => (
        <circle
          key={i}
          r={r}
          className={edge.tone === "muted" ? "fill-ink-faint" : "fill-blue-400"}
          opacity={0}
        >
          <animateMotion
            dur={`${dur}s`}
            begin={`${(i * dur) / edge.particles + (edge.stage % 2) * 0.35}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyPoints="0;1"
            keyTimes="0;1"
            keySplines="0.45 0 0.25 1"
          >
            <mpath href={`#${prefix}-${edge.id}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            dur={`${dur}s`}
            begin={`${(i * dur) / edge.particles + (edge.stage % 2) * 0.35}s`}
            repeatCount="indefinite"
            values="0;1;1;0"
            keyTimes="0;0.12;0.85;1"
          />
        </circle>
      ))}
    </motion.g>
  );
}

function FlowNode({
  def,
  at,
  layout,
  sf,
}: {
  def: NodeDef;
  at: Point;
  layout: Layout;
  sf: MotionValue<number>;
}) {
  const on = useTransform(sf, [def.at - 0.3, def.at], [0, 1]);
  const dim = useTransform(on, [0, 1], [0.35, 1]);
  const scale = useTransform(on, [0, 1], [0.9, 1]);
  // Pulso: una onda que sale del nodo justo cuando se enciende (y vuelve si el scroll retrocede)
  const wave = useTransform(sf, [def.at - 0.05, def.at + 0.4], [0, 1]);
  const waveScale = useTransform(wave, [0, 1], [1, 2]);
  const waveOpacity = useTransform(wave, [0, 0.12, 1], [0, 0.6, 0]);
  const { r, iconSize, labelSize, labelGap } = layout;
  const muted = def.tone === "muted";
  return (
    <motion.g style={{ opacity: dim, scale }}>
      <motion.circle
        cx={at.x}
        cy={at.y}
        r={r}
        style={{ scale: waveScale, opacity: waveOpacity }}
        className={`fill-none motion-reduce:hidden ${muted ? "stroke-ink-faint" : "stroke-blue-400"}`}
        strokeWidth={1.5}
      />
      <circle cx={at.x} cy={at.y} r={r} className="fill-navy-850 stroke-line-strong" strokeWidth={1.5} />
      {/* Aro encendido cuando la consulta llega */}
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

function Chart({ layout, sf, prefix }: { layout: Layout; sf: MotionValue<number>; prefix: string }) {
  const dash = useTransform(sf, [4.05, 4.75], [1, 0]);
  const fill = useTransform(sf, [4.4, 4.9], [0, 1]);
  return (
    <g>
      <defs>
        <linearGradient id={`${prefix}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--blue-400)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--blue-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={layout.chart.area} style={{ opacity: fill }} fill={`url(#${prefix}-area)`} />
      <motion.path
        d={layout.chart.line}
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: dash }}
        className="fill-none stroke-blue-400"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Diagram({ layout, sf, className }: { layout: Layout; sf: MotionValue<number>; className: string }) {
  const prefix = useId().replace(/:/g, "");
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

  const r = layout === MOBILE ? 3 : 4;
  return (
    <svg ref={svg} viewBox={layout.viewBox} aria-hidden="true" preserveAspectRatio="xMidYMid meet" className={className}>
      {EDGES.map((e) => (
        <Edge key={e.id} prefix={prefix} id={e.id} d={layout.edges[e.id]} stage={e.stage} tone={e.tone} sf={sf} />
      ))}
      <Chart layout={layout} sf={sf} prefix={prefix} />
      {EDGES.map((e) => (
        <Particles key={e.id} prefix={prefix} edge={e} sf={sf} r={r} />
      ))}
      {NODES.map((n) => (
        <FlowNode key={n.id} def={n} at={layout.nodes[n.id]} layout={layout} sf={sf} />
      ))}
    </svg>
  );
}

export function SalesFlow() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // Etapas como número continuo (0 a 5): cada tramo y cada nodo leen su parte
  const sf = useTransform(scrollYProgress, [0, 0.92], [0, 5]);

  useMotionValueEvent(sf, "change", (v) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section id="recorrido" aria-labelledby="recorrido-titulo" className="relative border-t border-line">
      <div ref={track} className="relative" style={{ height: `${STAGES.length * 60 + 100}svh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-4 pb-6 pt-[92px] md:px-6 lg:pb-10 lg:pt-28">
            <h2
              id="recorrido-titulo"
              className="font-display max-w-[20ch] text-[clamp(1.85rem,7vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[2.8rem] lg:max-w-none lg:text-[3.4rem]"
            >
              <MaskWords text="El camino de cada consulta, del anuncio a la venta." />
            </h2>

            <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center lg:mt-6">
              <Diagram layout={MOBILE} sf={sf} className="h-full max-h-[60svh] w-full lg:hidden" />
              <Diagram layout={DESKTOP} sf={sf} className="hidden h-full max-h-[58svh] w-full lg:block" />
            </div>

            {/* Etapas: en escritorio las cinco a la vista; en celulares, la activa */}
            <ol className="mt-4 grid gap-3 lg:mt-6 lg:grid-cols-5 lg:gap-6">
              {STAGES.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.title}
                    aria-current={on ? "step" : undefined}
                    className={`${on ? "block" : "sr-only lg:not-sr-only lg:block"} border-t pt-3 transition-colors duration-300 ${
                      on ? "border-blue-400" : "border-line"
                    }`}
                  >
                    <motion.div
                      key={on ? `on-${i}` : `off-${i}`}
                      initial={on ? { opacity: 0, transform: "translateY(8px)" } : false}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      transition={{ duration: 0.5, ease }}
                      className="motion-reduce:!transform-none"
                    >
                      <p className={`text-sm font-medium ${on ? "text-ink" : "text-ink-faint"}`}>
                        <span className="mr-1.5 font-mono text-[11px] tabular-nums text-ink-faint">0{i + 1}</span>
                        {s.title}
                      </p>
                      <p
                        className={`mt-1 text-[13px] leading-relaxed lg:text-sm ${
                          on ? "text-ink-muted" : "text-ink-faint lg:opacity-0"
                        }`}
                      >
                        {s.text}
                      </p>
                    </motion.div>
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
