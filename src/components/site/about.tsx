"use client";

/*
  Detrás de SEN: el manifiesto en grande. Las palabras pasan de apagadas a encendidas a medida
  que el párrafo cruza la pantalla (ligado al scroll). Debajo, la firma del equipo y los tres
  principios de trabajo.
*/
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { AppIcon, BRAND_TAGLINE } from "@/components/logo";

const MANIFESTO =
  "SEN es un equipo de ingenieros y desarrolladores. Software, hardware, IA y marketing con un mismo objetivo: que tu negocio crezca.";

const PRINCIPLES = [
  "Te hablamos en números de ventas.",
  "Un solo equipo: nadie se pasa la pelota.",
  "Trabajamos por etapas que podés medir.",
];

function Word({
  children,
  range,
  progress,
  still,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  /** Con reduced motion: encendida desde el principio */
  still: boolean;
}) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.13, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

export function About() {
  const text = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: text, offset: ["start 0.86", "end 0.5"] });
  const words = MANIFESTO.split(" ");

  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="relative overflow-hidden bg-mist py-24 md:py-[9vw]">
      <div className="mx-auto px-5 md:px-[5.8vw]">
        <h2 id="nosotros-titulo" data-reveal className="rise text-[12px] uppercase tracking-[0.32em] text-ink">
          Detrás de SEN
        </h2>
        <span aria-hidden="true" className="mt-14 block h-9 text-[5.5rem] font-extrabold leading-none text-ink md:mt-20">
          “
        </span>
        <p
          ref={text}
          aria-label={MANIFESTO}
          className="mt-8 max-w-[24ch] text-[clamp(2rem,5vw,4.6rem)] font-medium leading-[1.07] tracking-[-0.04em] text-ink md:max-w-[26ch]"
        >
          {/* Siempre la misma estructura (el servidor no sabe si hay reduced motion) */}
          {words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              still={Boolean(reduce)}
              range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]}
            >
              {word}
            </Word>
          ))}
        </p>

        <div className="mt-16 grid gap-12 md:mt-[6vw] lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <ul className="grid gap-6 sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p}
                data-reveal
                className="rise border-t border-ink/15 pt-5"
                style={{ ["--delay" as string]: `${i * 90}ms` }}
              >
                <p className="text-[17px] leading-[1.35] text-ink">{p}</p>
              </li>
            ))}
          </ul>
          <div data-reveal className="rise flex flex-col items-start gap-6 lg:items-end [--delay:200ms]">
            <div className="flex items-center gap-4">
              <AppIcon className="size-[74px] shadow-[0_16px_36px_-16px_rgb(var(--shade-rgb)/0.7)]" />
              <p className="text-[17px] leading-snug lg:text-right">
                <span className="block font-semibold text-ink">SEN Software</span>
                <span className="block text-ink-muted">{BRAND_TAGLINE}</span>
              </p>
            </div>
            <a
              href="#contacto"
              className="pill inline-flex h-12 items-center rounded-full bg-ink px-7 text-[13px] font-semibold uppercase text-white"
            >
              <span className="roll">
                <span>Trabajemos juntos</span>
                <span aria-hidden="true">Trabajemos juntos</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
