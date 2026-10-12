"use client";

/*
  Piezas 3D del pie (el resto del pie es del servidor):
  - El lockup del brand board: el ícono de app con espesor (capas en profundidad) gira desde
    acostado, la línea azul crece y los pilares caen de a uno como paletas de un cartel
  - El wordmark de cierre con volumen: diez capas en profundidad, más oscuras hacia atrás (la
    extrusión), y el frente con un degradé de luz; al llegar al final se para desde el piso
  Donde el navegador tiene animaciones ligadas al scroll, todo va al ritmo del dedo y en el
  compositor (scenes.css); si no, data-shown (un IntersectionObserver) dispara las mismas
  poses con transiciones. Mismo HTML en servidor y cliente: el estado oculto solo vale con la
  clase .js y sin reduced motion (lo resuelve el CSS).
*/
import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { AppIcon, Wordmark } from "@/components/logo";

// Capas del espesor del ícono, de atrás hacia adelante; la última es el filo azul del borde
const ICON_LAYERS = ["#040e22", "#071634", "#0a1d44", "#12357f"];

export function FooterLockup({ pillars }: { pillars: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} data-shown={shown} className="ft-lockup mt-9 flex items-center gap-5">
      <span aria-hidden="true" className="ft-icon">
        {ICON_LAYERS.map((color, i) => (
          <span
            key={color}
            className="ft-icon-layer"
            style={{ background: color, transform: `translateZ(${-(ICON_LAYERS.length - i) * 2.4}px)` }}
          />
        ))}
        <AppIcon className="ft-icon-face w-16" />
      </span>
      <span aria-hidden="true" className="ft-rule h-[4.5rem] w-px bg-blue-500/60" />
      <ul aria-label="Lo que hace SEN" className="ft-pillars label-caps space-y-1 !text-[10px] !leading-[1.5] !text-ink">
        {pillars.map((p, n) => (
          <li key={p} style={{ "--n": n } as CSSProperties}>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Capas de la extrusión del wordmark (la 1 es la más cercana al frente)
const DEPTH = 10;
const LAYERS = Array.from({ length: DEPTH }, (_, n) => DEPTH - n);

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      ref={ref}
      data-shown={shown}
      aria-hidden="true"
      className="wm3d-stage pointer-events-none relative select-none overflow-hidden px-4 pt-10 md:px-6"
    >
      {/* Degradé del frente: lo toma el path del wordmark con fill: url(#wm3d-face) (scenes.css) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="wm3d-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--wm-front-a)" }} />
            <stop offset="1" style={{ stopColor: "var(--wm-front-b)" }} />
          </linearGradient>
        </defs>
      </svg>
      <span className="wm3d-floor" />
      <div className="wm3d mx-auto w-full max-w-[1200px]">
        {LAYERS.map((k) => {
          // De la capa más cercana (clara) a la del fondo (oscura): colores sólidos, así las
          // capas se pisan sin sumar brillo
          const far = Math.round(((k - 1) / (DEPTH - 1)) * 100);
          const style = {
            "--k": k,
            color: `color-mix(in oklab, var(--wm-far) ${far}%, var(--wm-near))`,
            "--wm-acc": `color-mix(in oklab, var(--wm-acc-far) ${far}%, var(--wm-acc-near))`,
          } as CSSProperties;
          return (
            <span key={k} className="wm3d-layer" style={style}>
              <Wordmark className="block h-auto w-full" accentClassName="wm3d-acc" />
            </span>
          );
        })}
        <span className="wm3d-layer wm3d-front">
          <Wordmark className="block h-auto w-full" />
        </span>
      </div>
    </div>
  );
}
