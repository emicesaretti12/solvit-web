"use client";

import { useRef, type CSSProperties } from "react";
import { useRevealAttr } from "@/components/in-view";

/*
  Texto de un titular que entra palabra por palabra: cada palabra se para en 3D sobre su base
  desde debajo de su propia línea (gira desde acostada hacia atrás), en cascada. Va adentro del
  <h2> (que conserva id y estilos).
  - Solo CSS (globals.css, .mw-*): el observer compartido marca data-in y cada palabra hace su
    transición con un retardo según su orden (--n). Sin JS por cuadro ni re-render
  - El lector de pantalla lee la frase entera (sr-only); las palabras animadas son decorativas
  - Mismo HTML en servidor y cliente; sin JavaScript o con reduced motion aparece quieto
  - El relleno de cada máscara (compensado con margen negativo) deja lugar a los descendentes
    y a los acentos y colas que sobresalen de la caja por el tracking negativo
  - En celulares con animaciones ligadas al scroll, cada palabra se para al ritmo del dedo
*/
export function MaskWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useRevealAttr(ref, "-18%");
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className="mw block"
        style={delay ? ({ "--mw-delay": `${delay}s` } as CSSProperties) : undefined}
      >
        {words.map((word, i) => (
          <span key={i}>
            <span className="mw-mask -mx-[0.08em] -mb-[0.14em] inline-block overflow-hidden px-[0.08em] pb-[0.14em] align-top">
              <span className="mw-word inline-block" style={{ "--n": i } as CSSProperties}>
                {word}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}
