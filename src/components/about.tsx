"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Compass, Target } from "@phosphor-icons/react";
import { Reveal } from "./reveal";
import { Wordmark } from "./logo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// El cierre de la propuesta de SEN, palabra por palabra
const MANIFESTO =
  "actúa como un motor de ingeniería aplicada que reemplaza la intuición y el trabajo manual por sistemas estructurados, trazables y altamente rentables.";

const BLOCKS = [
  {
    icon: Target,
    label: "Misión",
    text: "Potenciar el crecimiento y la rentabilidad de los negocios transformando radicalmente sus procesos internos mediante software a medida, automatización con hardware e inteligencia artificial, respaldados por una estrategia de captación y marketing integral.",
  },
  {
    icon: Compass,
    label: "Visión",
    text: "Consolidarse como el socio estratégico de referencia en innovación e ingeniería aplicada para empresas que buscan optimizar sus recursos, erradicar ineficiencias operativas y escalar sus modelos de negocio con tecnología propietaria.",
  },
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 size-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(167_176_192/0.07),transparent)]"
      />
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

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-16">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08} className="border-t border-line-strong pt-8">
              <h3 className="flex items-center gap-2.5 text-sm font-medium text-blue-300">
                <b.icon size={18} weight="light" aria-hidden="true" />
                {b.label}
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-ink md:text-[1.3rem] md:leading-[1.55]">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
