"use client";

import { motion, useReducedMotion } from "motion/react";
import { PrimaryCta, SecondaryCta } from "./cta";
import { Photo } from "./photo";
import { img } from "@/lib/images";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-28 md:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full bg-blue-600/20 blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-20 md:px-6 lg:min-h-[calc(100dvh-8rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <div>
          <motion.p
            {...enter(0)}
            className="mb-6 text-xs uppercase tracking-[0.24em] text-blue-300"
          >
            Ingeniería y Desarrollo de Software
          </motion.p>
          <motion.h1
            {...enter(0.08)}
            className="max-w-[20ch] text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.5rem]"
          >
            Operación y ventas, en un mismo sistema.
          </motion.h1>
          <motion.p
            {...enter(0.16)}
            className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-muted"
          >
            Software a medida, inteligencia artificial, hardware y marketing de
            performance, integrados por un solo equipo técnico.
          </motion.p>
          <motion.div {...enter(0.24)} className="mt-10 flex flex-wrap gap-3">
            <PrimaryCta />
            <SecondaryCta href="#servicios" label="Ver servicios" />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="rounded-[2rem] border border-line bg-white/[0.03] p-1.5"
        >
          <Photo
            src={img("photo-1518770660439-4636190af475", 1400)}
            alt="Placa de circuito impreso con microcontroladores y componentes electrónicos"
            sizes="(min-width: 1024px) 560px, 100vw"
            preload
            className="aspect-[4/5] rounded-[calc(2rem-6px)] shadow-[inset_0_1px_1px_rgb(255_255_255/0.1)] sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </motion.div>
      </div>
    </section>
  );
}
