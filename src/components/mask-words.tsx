"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

/*
  Texto de un titular que entra palabra por palabra desde una máscara: cada palabra sube desde
  debajo de su propia línea, en cascada. Va adentro del <h2> (que conserva id y estilos).
  - El lector de pantalla lee la frase entera (sr-only); las palabras animadas son decorativas
  - Mismo estado inicial en servidor y cliente; con reduced motion aparece sin moverse
  - El relleno de cada máscara (compensado con margen negativo) deja lugar a los descendentes
    y a los acentos y colas que sobresalen de la caja por el tracking negativo
  - En celulares con animaciones ligadas al scroll (globals.css, .mw-*), cada palabra se para en
    3D al ritmo del dedo: gira desde acostada sobre su base, de a una (pisa el estilo de Motion)
*/
const EASE = [0.23, 1, 0.32, 1] as const;

export function MaskWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="mw block"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: reduce ? 0 : 0.045, delayChildren: reduce ? 0 : delay }}
      >
        {words.map((word, i) => (
          <span key={i}>
            <span className="mw-mask -mx-[0.08em] -mb-[0.14em] inline-block overflow-hidden px-[0.08em] pb-[0.14em] align-top">
              <motion.span
                className="mw-word inline-block motion-reduce:!transform-none"
                style={{ "--n": i } as CSSProperties}
                variants={{
                  hidden: { transform: "translateY(110%)" },
                  shown: { transform: "translateY(0%)" },
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </>
  );
}
