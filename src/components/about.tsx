"use client";

import { Fragment, useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "./reveal";
import { Wordmark } from "./logo";
import { DELIVERED, SECTORS } from "@/content/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Quiénes somos, palabra por palabra
const MANIFESTO =
  "es un equipo de ingenieros y desarrolladores que se ocupa de todo el camino de la venta, del anuncio al cierre.";

const PRINCIPLES = [
  "Te hablamos en números de ventas.",
  "Un solo equipo: nadie se pasa la pelota.",
  "Trabajamos por etapas que podés medir.",
];

// Datos reales: proyectos publicados, rubros distintos entre ellos y las líneas de servicio
const STATS: { value: number; prefix?: string; suffix?: string; label: string }[] = [
  { value: DELIVERED, prefix: "+", label: "proyectos entregados" },
  { value: SECTORS, label: "rubros distintos, de motos a salud" },
  { value: 5, label: "especialidades bajo un mismo equipo" },
  { value: 24, suffix: "/7", label: "atención con agentes de IA" },
];

/* El número cuenta desde cero al entrar en pantalla. El HTML trae el valor final (sin JS o con
   reduced motion queda ese) y la cuenta escribe el texto directo, sin re-renderizar React */
function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

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

        <dl className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-24 lg:grid-cols-4 lg:gap-x-10">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} className="flex flex-col border-t border-line-strong pt-5">
              <dt className="order-2 mt-2 max-w-[22ch] text-sm leading-snug text-ink-muted md:text-[15px]">{stat.label}</dt>
              <dd className="font-display order-1 text-[2.9rem] font-bold leading-none tracking-[-0.05em] text-ink md:text-[4rem]">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>

        <ul className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-12">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p} as="li" delay={i * 0.08} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-[0.55em] h-2 w-3.5 shrink-0 -skew-x-[24.5deg] bg-blue-500" />
              <p className="text-lg leading-snug text-ink md:text-xl">{p}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
