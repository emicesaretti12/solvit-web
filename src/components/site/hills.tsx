"use client";

/*
  El valle del pie del hero (canvas 2D): cintas finas con el degradé del isotipo (azul eléctrico
  a cian) que dibujan dos lomas a los costados y un valle al medio, y ondean como un campo con
  viento. Con mouse, las cintas se levantan cerca del puntero. Es el "terreno" donde crece el
  negocio: el mismo trazo de las cintas de la S. No dibuja fuera de pantalla; con reduced motion
  queda quieto.
*/
import { useEffect, useRef } from "react";

const LINES = 44;

export function Hills({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let pointerX = -1;
    let pointerPull = 0;
    let pullTarget = 0;
    let stroke: CanvasGradient | null = null;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      stroke = ctx.createLinearGradient(0, 0, w, 0);
      stroke.addColorStop(0, "#0052ff");
      stroke.addColorStop(0.5, "#1fdcff");
      stroke.addColorStop(1, "#0052ff");
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!stroke) return;
      pointerPull += (pullTarget - pointerPull) * 0.08;
      const top = h * 0.04;
      const depth = h * 0.5;
      const gap = (h * 0.62) / LINES;
      const amp = Math.min(10, h * 0.018);
      const step = Math.max(6, w / 160);
      const sigma = Math.max(90, w * 0.09);
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = stroke;

      for (let k = 0; k < LINES; k++) {
        const f = k / (LINES - 1);
        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          const u = x / w;
          const e = Math.abs(2 * u - 1);
          const valley = 1 - Math.pow(e, 2.3);
          const sway = Math.sin(u * 5.2 + t * 0.55 + k * 0.21) * amp + Math.sin(u * 12.5 - t * 0.8 + k * 0.37) * amp * 0.38;
          let y = top + valley * depth + k * gap + sway * (0.35 + f * 0.9);
          if (pointerPull > 0.01) {
            const dx = x - pointerX;
            y -= Math.exp(-(dx * dx) / (2 * sigma * sigma)) * 22 * pointerPull * (0.4 + f * 0.6);
          }
          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (k === 0) {
          // La primera cinta tapa lo que pasa por detrás (el isotipo al irse)
          ctx.save();
          ctx.lineTo(w + step, h);
          ctx.lineTo(-step, h);
          ctx.closePath();
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 0.16 + 0.8 * Math.pow(1 - f, 0.7) * (0.75 + 0.25 * Math.sin(k * 0.9));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      draw(now);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pullTarget = e.clientY > rect.top - 80 && e.clientY < rect.bottom ? 1 : 0;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduce) frame = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    if (reduce) draw(0);
    else {
      frame = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
