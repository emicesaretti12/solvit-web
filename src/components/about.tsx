"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "./reveal";
import { Wordmark } from "./logo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Quiénes somos, palabra por palabra (los pilares del brand board: software, hardware, IA,
// marketing y crecimiento)
const MANIFESTO =
  "es un equipo de ingenieros y desarrolladores. Software, hardware, IA y marketing con un mismo objetivo: que tu negocio crezca.";

const PRINCIPLES = [
  "Te hablamos en números de ventas.",
  "Un solo equipo: nadie se pasa la pelota.",
  "Trabajamos por etapas que podés medir.",
];

export function About() {
  const ref = useRef<HTMLElement>(null);

  // Las palabras pasan de apagadas a encendidas a medida que el párrafo cruza la pantalla
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 85%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="nosotros"
      aria-labelledby="nosotros-titulo"
      className="relative overflow-hidden border-t border-line"
    >
      <div className="relative mx-auto max-w-[1200px] px-4 py-28 md:px-6 md:py-44">
        <h2 id="nosotros-titulo" className="sr-only">
          Quiénes somos
        </h2>
        <p
          data-manifesto
          className="font-display max-w-[28ch] text-[1.85rem] font-semibold leading-[1.14] tracking-[-0.03em] text-ink sm:text-[2.6rem] lg:text-[3.35rem]"
        >
          <span data-word className="inline-block">
            <Wordmark className="inline-block h-[0.74em] w-auto align-baseline" />
            <span className="sr-only">SEN</span>
          </span>{" "}
          {MANIFESTO.split(" ").map((word, i) => (
            <Fragment key={i}>
              <span data-word>{word}</span>{" "}
            </Fragment>
          ))}
        </p>

        <ul className="mt-16 grid gap-8 [perspective:1100px] md:mt-24 md:grid-cols-3 md:gap-12">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p} as="li" delay={i * 0.08} className="sd-3d border-t border-line-strong pt-6">
              <p className="text-lg leading-snug text-ink md:text-xl">{p}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
