"use client";

/*
  Servicios: cinco tarjetas navy que se apilan. Cada una queda pegada bajo el encabezado y la
  siguiente la tapa; la que queda debajo se achica y se apaga un poco (al ritmo del scroll). A
  la izquierda, la promesa y lo que entregamos; a la derecha, en un panel claro, lo que hace el
  servicio: web y software a medida muestran una demostración paso a paso (demos/), y los otros
  tres su objeto 3D (CSS, ver services-3d.tsx), que se arma al llegar y corre solo a la vista.
  En celulares las tarjetas van en fila común, sin pila.
*/
import { ArrowRight, Code, Cpu, Megaphone, Robot, SquaresFour, type Icon } from "@phosphor-icons/react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ServiceScene } from "@/components/services-3d";
import { CrmDemo } from "./demos/crm-demo";
import { WebDemo } from "./demos/web-demo";
import { SERVICES, type Service, type ServiceKey } from "@/content/services";
import { SplitText } from "./split-text";

const ICONS: Record<ServiceKey, Icon> = {
  web: Code,
  software: SquaresFour,
  ia: Robot,
  hardware: Cpu,
  marketing: Megaphone,
};

const N = SERVICES.length;

function Card({ service, index, progress }: { service: Service; index: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const on = useInView(stage, { once: true, amount: 0.45 });
  const live = useInView(stage, { amount: 0.3 });
  // Mientras llegan las tarjetas siguientes, esta se achica: más cuanto más abajo de la pila
  // (la tarjeta i queda pegada en el tramo i de N - 1; la siguiente la tapa durante ese tramo)
  const from = index / (N - 1);
  const scale = useTransform(progress, [from, 1], [1, 1 - (N - 1 - index) * 0.035]);
  const lastCard = index === N - 1;
  const dim = useTransform(progress, lastCard ? [0, 1] : [(index + 0.45) / (N - 1), (index + 1) / (N - 1)], [
    0,
    lastCard ? 0 : 0.4,
  ]);
  const Glyph = ICONS[service.key];

  return (
    <li
      className="lg:sticky lg:top-[6svh] lg:flex lg:h-[88svh] lg:items-center"
      style={{ paddingTop: `calc(${index} * 0.9rem)` }}
    >
      <motion.article
        style={reduce ? undefined : { scale }}
        className="stack-card relative grid w-full overflow-hidden rounded-[2rem] bg-night text-white shadow-[0_-18px_50px_-30px_rgb(4_8_20/0.7)] lg:h-[min(74svh,640px)] lg:grid-cols-[1fr_1.02fr] lg:rounded-[2.75rem]"
      >
        <div className="flex flex-col p-7 pb-6 md:p-12 lg:p-[clamp(2.4rem,4.2vw,4rem)]">
          <p
            data-reveal
            className="rise flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/80">
              <Glyph size={15} weight="bold" aria-hidden="true" />
            </span>
            <span className="leading-snug">
              <span className="tabular">0{index + 1}</span> · {service.lead.replace(/\.$/, "")}
            </span>
          </p>
          <h3
            data-reveal
            className="rise mt-7 max-w-[13ch] [--delay:80ms] text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
          >
            {service.title}
          </h3>
          <p
            data-reveal
            className="rise mt-6 max-w-[40ch] text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.5] text-white/60 [--delay:160ms]"
          >
            {service.text}
          </p>
          <ul
            data-reveal
            aria-label={`Qué incluye ${service.title.toLowerCase()}`}
            className="rise mt-6 flex flex-wrap gap-2 [--delay:240ms]"
          >
            {service.deliverables.map((d) => (
              <li key={d} className="rounded-full border border-white/14 px-3.5 py-1.5 text-[12.5px] text-white/70">
                {d}
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            className="group mt-10 flex items-center justify-between border-t border-white/12 pt-6 text-[13px] font-semibold uppercase lg:mt-auto"
          >
            <span className="roll-host">
              <span className="roll">
                <span>Pedí tu diagnóstico</span>
                <span aria-hidden="true">Pedí tu diagnóstico</span>
              </span>
            </span>
            <span className="grid size-12 place-items-center rounded-full bg-white text-ink transition-[transform,background-color,color] duration-500 ease-[var(--ease-expo)] group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white">
              <ArrowRight
                size={18}
                weight="bold"
                className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-rotate-45"
              />
            </span>
          </a>
        </div>

        {/* Panel claro con el objeto 3D del servicio */}
        <div className="p-3 pt-0 lg:p-10 lg:pl-0">
          <div
            ref={stage}
            data-on={on}
            data-live={live}
            className={`svc-card relative overflow-hidden rounded-[1.6rem] ${service.key === "web" || service.key === "software" ? "h-[440px]" : "h-[320px]"} bg-[linear-gradient(160deg,#ffffff,#e9eefa)] [--fit:1.05] md:h-[380px] md:[--fit:1.35] lg:h-full lg:rounded-[2rem] lg:[--fit:1.6]`}
          >
            {service.key === "web" ? <WebDemo /> : service.key === "software" ? <CrmDemo /> : <ServiceScene kind={service.key} />}
          </div>
        </div>

        {/* Velo: la tarjeta tapada se apaga */}
        <motion.span
          aria-hidden="true"
          style={reduce ? { opacity: 0 } : { opacity: dim }}
          className="pointer-events-none absolute inset-0 bg-[#060a16] max-lg:hidden"
        />
      </motion.article>
    </li>
  );
}

export function Services() {
  const list = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start start", "end end"] });

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="relative bg-paper pt-20 md:pt-[7vw]">
      <div className="mx-auto px-5 md:px-[5.8vw]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            id="servicios-titulo"
            className="text-[clamp(2.6rem,6vw,5.6rem)] font-medium leading-[1] tracking-[-0.04em] text-balance text-ink"
          >
            <SplitText text="Tecnología que vende." />
          </h2>
          <a
            href="#contacto"
            data-reveal
            className="rise roll-host mb-1 inline-flex min-h-11 items-center text-[13px] font-medium uppercase text-ink underline decoration-ink/25 underline-offset-[6px] transition-colors duration-200 hover:decoration-ink [--delay:200ms]"
          >
            <span className="roll">
              <span>Contanos qué necesitás</span>
              <span aria-hidden="true">Contanos qué necesitás</span>
            </span>
          </a>
        </div>
      </div>

      <ul ref={list} className="mx-auto mt-10 flex flex-col gap-5 px-3 pb-20 md:px-[5.8vw] lg:mt-0 lg:gap-0 lg:pb-[8vh]">
        {SERVICES.map((service, i) => (
          <Card key={service.key} service={service} index={i} progress={scrollYProgress} />
        ))}
      </ul>
    </section>
  );
}
