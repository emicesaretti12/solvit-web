"use client";

/*
  Titular que reacciona al puntero: cada letra engorda cuanto más cerca le pasa el mouse (Manrope
  es variable, de 200 a 800) y vuelve a su peso al alejarse. Entra letra por letra como el resto
  de los titulares (misma estructura que SplitText). En táctil y con reduced motion queda quieto.
*/
import { useEffect, useRef, type CSSProperties } from "react";

const REST = 300;
const PEAK = 800;

export function ProximityTitle({ text, className = "" }: { text: string; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (
      !el ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>(".split-char"));
    const weights = chars.map(() => REST);
    const targets = chars.map(() => REST);
    let centers: { x: number; y: number }[] = [];
    let frame = 0;

    const measure = () => {
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const tick = () => {
      let moving = false;
      for (let i = 0; i < chars.length; i++) {
        const d = targets[i] - weights[i];
        if (Math.abs(d) > 0.5) {
          weights[i] += d * 0.14;
          moving = true;
        } else weights[i] = targets[i];
        chars[i].style.fontWeight = String(Math.round(weights[i]));
      }
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Las letras cambian de ancho al engordar: se vuelve a medir en cada movimiento (son pocas)
      measure();
      const radius = Math.max(220, window.innerWidth * 0.2);
      for (let i = 0; i < chars.length; i++) {
        const d = Math.hypot(e.clientX - centers[i].x, e.clientY - centers[i].y);
        const near = Math.max(0, 1 - d / radius);
        targets[i] = REST + (PEAK - REST) * near * near;
      }
      run();
    };
    const onLeave = () => {
      targets.fill(REST);
      run();
    };

    const host = el.closest("section") ?? el;
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  let i = 0;
  return (
    <span ref={root} data-reveal className={`split ${className}`} aria-label={text}>
      <span aria-hidden="true" className="split-word">
        {Array.from(text).map((char, c) => (
          <span key={c} className="split-char" style={{ "--i": i++, fontWeight: REST } as CSSProperties}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
