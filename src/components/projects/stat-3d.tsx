"use client";

/*
  Contador 3D de la vitrina ("+10"): la cifra con volumen, como el wordmark del pie.
  - Capas de la misma cifra en profundidad (la extrusión): las cercanas en el azul del isotipo
    (el canto iluminado) y las del fondo en navy, con colores sólidos para que se pisen sin
    sumar brillo; adelante, el frente claro con el "+" en azul
  - Se para desde el piso con el scroll (projects.css: pv-stat-rise); sin scroll ligado,
    data-shown (un IntersectionObserver) dispara la misma pose con una transición
  - Con mouse, la vitrina escribe --px/--py en su envoltorio (se heredan) y la cifra gira apenas
    hacia el puntero
  - Decorativa: el número lo lee el titular (sr-only)
*/
import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";
import "./projects.css";

// Capas de la extrusión (la 1 es la más cercana al frente)
const DEPTH = 14;
const LAYERS = Array.from({ length: DEPTH }, (_, n) => DEPTH - n);

export function Stat3D({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.5 });
  const text = (
    <>
      <span className="pv-stat-plus">+</span>
      {value}
    </>
  );
  return (
    <span ref={ref} data-shown={shown} aria-hidden="true" className="pv-stat select-none">
      <span className="pv-stat-tilt">
        <span className="pv-stat-obj">
          {LAYERS.map((k) => {
            // De la capa más cercana (azul) a la del fondo (navy)
            const far = Math.round(((k - 1) / (DEPTH - 1)) * 100);
            const style = {
              "--k": k,
              color: `color-mix(in oklab, #071634 ${far}%, #2a74ff)`,
            } as CSSProperties;
            return (
              <span key={k} className="pv-stat-num pv-stat-layer" style={style}>
                {text}
              </span>
            );
          })}
          <span className="pv-stat-num pv-stat-front">{text}</span>
        </span>
      </span>
      <span className="pv-stat-floor" />
    </span>
  );
}
