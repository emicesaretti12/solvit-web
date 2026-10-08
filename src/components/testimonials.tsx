"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useState } from "react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { TESTIMONIALS } from "@/content/testimonials";
import { Reveal } from "./reveal";

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

export function Testimonials() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="testimonios" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32">
        <Reveal>
          <h2 className="max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Lo que cambia cuando todo está conectado.
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-muted">
            Equipos que dejaron las planillas y las respuestas tardías.
          </p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-ink-muted transition-[color,border-color,transform] duration-150 hover:border-blue-400/60 hover:text-ink active:scale-[0.97] motion-reduce:hidden"
          >
            {paused ? <Play size={14} weight="fill" aria-hidden="true" /> : <Pause size={14} weight="fill" aria-hidden="true" />}
            {paused ? "Reanudar" : "Pausar"}
          </button>
        </Reveal>

        <div className="mt-12 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={30} paused={paused} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={38} paused={paused} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={34} paused={paused} />
        </div>
      </div>
    </section>
  );
}
