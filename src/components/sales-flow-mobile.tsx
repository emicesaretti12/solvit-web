"use client";

/*
  El recorrido de una consulta en celulares. Mismo circuito que en escritorio, pero armado para
  que un teléfono lo mueva sin tirones:
  - El scroll solo elige la etapa; cada cambio dispara transiciones CSS con su orden (--delay):
    se dibuja el tramo, el nodo se enciende con un rebote y una onda. Nada se recalcula por
    cuadro mientras se hace scroll
  - Las consultas que viajan son puntos HTML animados con la Web Animations API sobre
    transform (los mueve el compositor, no el hilo principal): recorren cada tramo ya dibujado
  - Nodos como íconos de app; el agente de IA, más grande, con un escáner que gira mientras
    filtra. Las que solo consultaban se van en gris al costado
  - El tamaño sale del contenedor (container queries): el diagrama ocupa todo el alto que deja
    el panel sin deformarse
  - Fuera de pantalla los puntos se pausan; con reduced motion no hay puntos ni rebotes
*/
import { useEffect, useRef, useState } from "react";
import { EDGES, MOBILE, NODES, type NodeDef } from "./sales-flow-data";

// Cuándo se enciende cada cosa dentro de su etapa (segundos desde el cambio)
const NODE_TIMING: Record<string, { stage: number; delay: number }> = {
  meta: { stage: 0, delay: 0 },
  google: { stage: 0, delay: 0.06 },
  web: { stage: 0, delay: 0.12 },
  whatsapp: { stage: 0, delay: 0.18 },
  instagram: { stage: 0, delay: 0.24 },
  ai: { stage: 0, delay: 0.95 },
  discard: { stage: 1, delay: 0.7 },
  crm: { stage: 1, delay: 0.75 },
  ventas: { stage: 2, delay: 0.7 },
  postventa: { stage: 2, delay: 0.78 },
  service: { stage: 2, delay: 0.86 },
  venta: { stage: 3, delay: 0.7 },
};
// Los tramos arrancan a dibujarse a este tiempo de su etapa (los de las fuentes, cuando ya
// se encendieron)
const EDGE_DELAY: Record<number, number> = { 0: 0.3, 1: 0, 2: 0, 3: 0, 4: 0 };
const DRAW = 0.75;

const VB_W = 360;
const VB_H = 500;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Node({ def, on, delay }: { def: NodeDef; on: boolean; delay: number }) {
  const at = MOBILE.nodes[def.id];
  const ai = def.id === "ai";
  const muted = def.tone === "muted";
  const style = { left: `${(at.x / VB_W) * 100}%`, top: `${(at.y / VB_H) * 100}%`, "--delay": `${delay}s` } as React.CSSProperties;
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      <div
        data-on={on}
        className={`flow-node relative grid place-items-center border ${ai ? "size-[13.5cqw] rounded-[32%]" : "size-[10.4cqw] rounded-[30%]"} ${
          on
            ? muted
              ? "border-ink-faint/50 bg-navy-850 text-ink-muted opacity-100"
              : "border-blue-400 bg-[color-mix(in_oklab,var(--blue-400)_16%,var(--navy-850))] text-ink opacity-100"
            : "border-line-strong bg-navy-850 text-ink-faint opacity-45"
        }`}
        style={{ "--delay": `${delay}s` } as React.CSSProperties}
      >
        <span aria-hidden="true" className={`flow-ring absolute inset-0 rounded-[inherit] border-2 opacity-0 ${muted ? "border-ink-faint" : "border-blue-400"}`} />
        {/* El agente filtra: un arco de luz gira alrededor mientras está encendido */}
        {ai && (
          <span
            aria-hidden="true"
            className={`absolute -inset-[1.6cqw] rounded-full transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: on ? `${delay}s` : "0s" }}
          >
            <span className="flow-scan absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_0_62%,var(--blue-400)_100%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1.5px))]" />
          </span>
        )}
        {"icon" in def.glyph ? (
          <def.glyph.icon weight="light" className={ai ? "size-[6.4cqw]" : "size-[5cqw]"} />
        ) : (
          <svg viewBox="0 0 24 24" className="size-[4.2cqw] fill-current" aria-hidden="true">
            <path d={def.glyph.path} />
          </svg>
        )}
      </div>
      <span
        className={`absolute left-1/2 top-full mt-[1.4cqw] -translate-x-1/2 whitespace-nowrap text-[max(10px,3.2cqw)] transition-colors duration-500 ${
          on ? (muted ? "text-ink-faint" : "text-ink-muted") : "text-ink-faint/70"
        }`}
      >
        {def.label}
      </span>
    </div>
  );
}

export function MobileFlow({ stage, reduce }: { stage: number; reduce: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const paths = useRef<Record<string, SVGPathElement | null>>({});
  const dots = useRef<Record<string, (HTMLElement | null)[]>>({});
  const [ready, setReady] = useState(false);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  // Largo de cada trazo (para dibujarlo con stroke-dashoffset en unidades reales, sin depender
  // de pathLength) y tamaño del diagrama
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.querySelectorAll<SVGPathElement>("path[data-measure]").forEach((p) => {
      p.style.setProperty("--len", `${Math.ceil(p.getTotalLength()) + 1}`);
    });
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    // Recién con los largos puestos se muestran los trazos (si no, se verían enteros un cuadro)
    const raf = requestAnimationFrame(() => setReady(true));
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Consultas viajando: una animación de transform por punto, en los tramos ya dibujados. Al
  // cambiar de etapa solo se suman (o se quitan) los tramos que cambiaron: los demás siguen
  // corriendo sin reiniciarse
  const anims = useRef(new Map<string, Animation[]>());
  const builtFor = useRef(0);
  useEffect(() => {
    const running = anims.current;
    const clear = () => {
      running.forEach((list) => list.forEach((a) => a.cancel()));
      running.clear();
    };
    if (reduce || !width) {
      clear();
      return;
    }
    // Otro ancho: las posiciones cambian, se arma todo de nuevo
    if (builtFor.current !== width) {
      clear();
      builtFor.current = width;
    }
    const k = width / VB_W;
    for (const edge of EDGES) {
      const active = edge.stage <= stage;
      const current = running.get(edge.id);
      if (!active) {
        current?.forEach((a) => a.cancel());
        running.delete(edge.id);
        continue;
      }
      if (current) continue;
      const path = paths.current[edge.id];
      if (!path) continue;
      const len = path.getTotalLength();
      const samples = 18;
      const frames: Keyframe[] = Array.from({ length: samples }, (_, i) => {
        const t = i / (samples - 1);
        const pt = path.getPointAtLength(len * easeInOut(t));
        return {
          offset: t,
          transform: `translate3d(${(pt.x * k).toFixed(1)}px, ${(pt.y * k).toFixed(1)}px, 0)`,
          opacity: i === 0 || i === samples - 1 ? 0 : 1,
        };
      });
      const dur = edge.tone === "muted" ? 2600 : 2100;
      // En la etapa que llega, los puntos salen cuando el tramo terminó de dibujarse
      const lead = edge.stage === stage ? (EDGE_DELAY[edge.stage] + DRAW) * 1000 : 0;
      const list: Animation[] = [];
      (dots.current[edge.id] ?? []).forEach((dot, i) => {
        if (!dot) return;
        list.push(
          dot.animate(frames, {
            duration: dur,
            delay: lead + (i * dur) / edge.particles + (edge.stage % 2) * 350,
            iterations: Infinity,
            easing: "linear",
            fill: "backwards",
          }),
        );
      });
      running.set(edge.id, list);
    }
  }, [stage, width, reduce]);

  // Fuera de pantalla, en pausa
  useEffect(() => {
    anims.current.forEach((list) => list.forEach((a) => (visible ? a.play() : a.pause())));
  }, [visible, stage, width]);

  // Al desmontar, nada queda corriendo
  useEffect(() => {
    const running = anims.current;
    return () => running.forEach((list) => list.forEach((a) => a.cancel()));
  }, []);

  const chartOn = stage >= 4;

  return (
    <div className="relative h-full max-h-[66svh] w-full [container-type:size]">
      <div
        ref={box}
        className={`absolute left-1/2 top-1/2 aspect-[360/500] w-[min(100cqw,72cqh)] -translate-x-1/2 -translate-y-1/2 [container-type:inline-size] ${ready ? "flow-ready" : ""}`}
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          {/* Tramos: la base tenue y, encima, el tramo encendido que se dibuja */}
          {EDGES.map((e) => (
            <path key={`b-${e.id}`} d={MOBILE.edges[e.id]} className="fill-none stroke-line-strong" strokeWidth={1.5} />
          ))}
          {EDGES.map((e) => {
            const on = stage >= e.stage;
            return (
              <path
                key={e.id}
                ref={(el) => {
                  paths.current[e.id] = el;
                }}
                data-measure=""
                data-on={on}
                d={MOBILE.edges[e.id]}
                style={{ "--delay": `${EDGE_DELAY[e.stage]}s` } as React.CSSProperties}
                className={`flow-edge fill-none ${e.tone === "muted" ? "stroke-ink-faint" : "stroke-blue-400"}`}
                strokeWidth={e.tone === "muted" ? 1.5 : 2.25}
                strokeLinecap="round"
              />
            );
          })}
          {/* Crecimiento: la curva se dibuja y debajo aparece el área */}
          <defs>
            <linearGradient id="flow-mobile-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--blue-400)" stopOpacity="0.38" />
              <stop offset="1" stopColor="var(--blue-400)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={MOBILE.chart.area}
            data-on={chartOn}
            fill="url(#flow-mobile-area)"
            className="flow-fade"
            style={{ "--delay": "1.15s" } as React.CSSProperties}
          />
          <path
            data-measure=""
            data-on={chartOn}
            d={MOBILE.chart.line}
            style={{ "--delay": "0.45s" } as React.CSSProperties}
            className="flow-edge fill-none stroke-blue-400"
            strokeWidth={2.75}
            strokeLinecap="round"
          />
        </svg>

        {/* Consultas en viaje */}
        <div aria-hidden="true" className="absolute inset-0">
          {EDGES.map((e) =>
            Array.from({ length: e.particles }, (_, i) => (
              <i
                key={`${e.id}-${i}`}
                ref={(el) => {
                  (dots.current[e.id] ??= [])[i] = el;
                }}
                data-tone={e.tone}
                className="flow-dot"
              />
            )),
          )}
        </div>

        {NODES.map((n) => {
          const timing = NODE_TIMING[n.id];
          return <Node key={n.id} def={n} on={stage >= timing.stage} delay={timing.delay} />;
        })}
      </div>
    </div>
  );
}
