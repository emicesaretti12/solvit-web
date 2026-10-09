"use client";

import { useEffect, useRef } from "react";
import { useTheme, type Theme } from "@/lib/theme";

/*
  Campo del portal SEN: pistas de circuito impreso con pulsos de datos que viajan de nodo
  en nodo (software, IA y hardware conectados). Se ve a través de las letras y, al entrar,
  llena la pantalla detrás del contenido.

  Rendimiento: las pistas se dibujan una vez por tamaño en su propio canvas; en cada cuadro
  solo se pintan los pulsos. Se pausa fuera de pantalla o con la pestaña oculta.
  Reduced motion: se dibuja un cuadro fijo.
*/

type Node = { x: number; y: number; links: number[] };
type Pulse = { from: number; to: number; t: number; speed: number; prev: number };

// Colores por tema: en claro, pistas navy sobre papel y pulsos sin composición aditiva
const PALETTE: Record<Theme, { trace: string; pad: string; chip: string; chipFill: string; tail0: string; tail1: string; head: string; blend: GlobalCompositeOperation }> = {
  dark: {
    trace: "rgba(61, 139, 255, 0.14)",
    pad: "rgba(141, 184, 255, 0.32)",
    chip: "rgba(141, 184, 255, 0.22)",
    chipFill: "rgba(3, 16, 36, 0.9)",
    tail0: "rgba(31, 107, 255, 0)",
    tail1: "rgba(61, 139, 255, 0.9)",
    head: "rgba(220, 234, 255, 0.95)",
    blend: "lighter",
  },
  light: {
    trace: "rgba(20, 52, 120, 0.13)",
    pad: "rgba(20, 52, 120, 0.3)",
    chip: "rgba(20, 52, 120, 0.22)",
    chipFill: "rgba(246, 248, 251, 0.95)",
    tail0: "rgba(31, 107, 255, 0)",
    tail1: "rgba(31, 107, 255, 0.85)",
    head: "rgba(16, 64, 190, 1)",
    blend: "source-over",
  },
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(w: number, h: number) {
  const rand = mulberry32(20261009);
  const grid = w < 700 ? 40 : 54;
  const cols = Math.ceil(w / grid) + 1;
  const rows = Math.ceil(h / grid) + 1;
  const nodes: Node[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({ x: c * grid + grid / 2, y: r * grid + grid / 2, links: [] });
    }
  }
  const idx = (r: number, c: number) => r * cols + c;
  const link = (a: number, b: number) => {
    nodes[a].links.push(b);
    nodes[b].links.push(a);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = idx(r, c);
      if (c + 1 < cols && rand() < 0.52) link(a, idx(r, c + 1));
      if (r + 1 < rows && rand() < 0.46) link(a, idx(r + 1, c));
      if (r + 1 < rows && c + 1 < cols && rand() < 0.07) link(a, idx(r + 1, c + 1));
    }
  }
  const chips: { x: number; y: number; w: number; h: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].links.length >= 3 && rand() < 0.08) {
      const horizontal = rand() < 0.6;
      chips.push({ x: nodes[i].x, y: nodes[i].y, w: horizontal ? 18 : 10, h: horizontal ? 10 : 18 });
    }
  }
  return { nodes, chips, rand };
}

export function NetworkField({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const staticCanvas = staticRef.current!;
    const live = liveRef.current!;
    const sctx = staticCanvas.getContext("2d")!;
    const lctx = live.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = PALETTE[theme];

    let w = 0;
    let h = 0;
    let dpr = 1;
    let net = buildNetwork(1, 1);
    let pulses: Pulse[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;

    const spawn = (): Pulse | null => {
      const { nodes, rand } = net;
      for (let tries = 0; tries < 20; tries++) {
        const from = Math.floor(rand() * nodes.length);
        if (nodes[from].links.length) {
          const to = nodes[from].links[Math.floor(rand() * nodes[from].links.length)];
          return { from, to, t: rand(), speed: 0.9 + rand() * 1.4, prev: -1 };
        }
      }
      return null;
    };

    const drawStatic = () => {
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, w, h);
      const { nodes, chips } = net;
      sctx.strokeStyle = colors.trace;
      sctx.lineWidth = 1;
      sctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        for (const j of nodes[i].links) {
          if (j > i) {
            sctx.moveTo(nodes[i].x, nodes[i].y);
            sctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }
      sctx.stroke();
      sctx.fillStyle = colors.pad;
      for (const n of nodes) {
        if (n.links.length) sctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
      }
      sctx.strokeStyle = colors.chip;
      for (const c of chips) {
        sctx.fillStyle = colors.chipFill;
        sctx.fillRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h);
        sctx.strokeRect(c.x - c.w / 2 + 0.5, c.y - c.h / 2 + 0.5, c.w - 1, c.h - 1);
      }
    };

    const drawPulses = (dt: number) => {
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, w, h);
      lctx.globalCompositeOperation = colors.blend;
      const { nodes, rand } = net;
      for (const p of pulses) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        p.t += (dt * p.speed * 60) / len;
        if (p.t >= 1) {
          // Sigue por otra pista desde el nodo de llegada (no vuelve por la misma si puede)
          const options = b.links.filter((n) => n !== p.from);
          const next = options.length ? options[Math.floor(rand() * options.length)] : p.from;
          p.prev = p.from;
          p.from = p.to;
          p.to = next;
          p.t -= 1;
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const tail = Math.min(26, len * p.t + 8);
        const ux = (b.x - a.x) / len;
        const uy = (b.y - a.y) / len;
        const g = lctx.createLinearGradient(x - ux * tail, y - uy * tail, x, y);
        g.addColorStop(0, colors.tail0);
        g.addColorStop(1, colors.tail1);
        lctx.strokeStyle = g;
        lctx.lineWidth = 1.6;
        lctx.beginPath();
        lctx.moveTo(x - ux * tail, y - uy * tail);
        lctx.lineTo(x, y);
        lctx.stroke();
        lctx.fillStyle = colors.head;
        lctx.beginPath();
        lctx.arc(x, y, 1.7, 0, Math.PI * 2);
        lctx.fill();
      }
      lctx.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [staticCanvas, live]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      net = buildNetwork(w, h);
      const count = Math.round(Math.min(70, Math.max(18, (w * h) / 22000)));
      pulses = Array.from({ length: count }, spawn).filter(Boolean) as Pulse[];
      drawStatic();
      drawPulses(0);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      drawPulses(dt);
      schedule();
    };
    const schedule = () => {
      if (!raf && visible && !reduce && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else stop();
    });
    io.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : schedule());
    document.addEventListener("visibilitychange", onVisibility);
    schedule();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // Al cambiar de tema se rearma todo (pistas y pulsos) con la paleta nueva
  }, [theme]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,#0b1f45_0%,#031024_62%,#010a18_100%)] light:bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,#ffffff_0%,#eef2f8_62%,#dfe6f1_100%)] ${className}`}
    >
      <div className="absolute left-1/2 top-[42%] size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_107_255/0.14),transparent)] light:bg-[radial-gradient(closest-side,rgb(31_107_255/0.1),transparent)]" />
      <canvas ref={staticRef} className="absolute inset-0 size-full" />
      <canvas ref={liveRef} className="absolute inset-0 size-full" />
    </div>
  );
}
