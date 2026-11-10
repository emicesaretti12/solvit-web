"use client";

/*
  Cursor propio (solo con mouse y sin reduced motion): un punto que va con el puntero y un aro
  que lo sigue con inercia. Sobre enlaces y botones el aro crece; sobre lo que lleva
  data-cursor="texto" se vuelve una burbuja azul con ese texto (por ejemplo "Ver sitio" en las
  portadas). El aro usa mix-blend-difference: negro sobre lo claro, claro sobre lo oscuro.
  Todo se mueve con transform, fuera de React.
*/
import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const root = document.documentElement;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let scale = 1;
    let target = 1;
    let bubbleScale = 0.6;
    let bubbleTarget = 0;
    let bubbleAlpha = 0;
    let shown = false;
    let frame = 0;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (target - scale) * 0.18;
      bubbleScale += (0.6 + 0.4 * bubbleTarget - bubbleScale) * 0.18;
      bubbleAlpha += (bubbleTarget - bubbleAlpha) * 0.22;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
      // La burbuja nunca nace de la nada: crece desde 0,6 mientras se funde
      if (bubble.current) {
        bubble.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${bubbleScale})`;
        bubble.current.style.opacity = shown ? String(bubbleAlpha) : "0";
      }
      frame = requestAnimationFrame(loop);
    };

    const show = (v: boolean) => {
      if (shown === v) return;
      shown = v;
      for (const el of [dot.current, ring.current]) if (el) el.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        root.classList.add("has-cursor");
        show(true);
      }
      const el = e.target instanceof Element ? e.target : null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        if (label.current) label.current.textContent = tagged.dataset.cursor ?? "";
        bubbleTarget = 1;
        target = 0;
        return;
      }
      bubbleTarget = 0;
      target = el?.closest("a, button, [role='button'], [data-cursor-hover], input, textarea, label") ? 1.7 : 1;
    };
    const onLeave = () => show(false);
    const onDown = () => (target *= 0.8);

    frame = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div className="mix-blend-difference">
        <div
          ref={ring}
          className="absolute -left-5 -top-5 size-10 rounded-full border border-white opacity-0 transition-opacity duration-300"
        />
        <div
          ref={dot}
          className="absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-white opacity-0 transition-opacity duration-300"
        />
      </div>
      <div
        ref={bubble}
        className="absolute -left-11 -top-11 grid size-[88px] place-items-center rounded-full bg-blue-500 text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.04em] text-white opacity-0"
        style={{ transform: "scale(0.6)" }}
      >
        <span ref={label} className="max-w-[70px]" />
      </div>
    </div>
  );
}
