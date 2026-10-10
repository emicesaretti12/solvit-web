"use client";

/*
  HeroSection del hero-01, rehecho para SEN con una sola idea: el isotipo en 3D (WebGL, en el
  escenario fijo de la página) a la derecha y, a la izquierda, solo lo necesario: titular,
  una frase, el botón de contacto y el enlace a proyectos.

  - El titular entra línea por línea con CSS (se pinta sin esperar a JavaScript); después de
    "ventas" aparece el corte azul de la N del wordmark.
  - Al bajar, el texto se aleja y la cámara se zambulle entre las cintas de la S (la pose la
    maneja el escenario según las marcas de cada sección).
  - Sobre el isotipo hay una superficie para girarlo con el dedo o el mouse: en touch solo
    toma el arrastre horizontal, el vertical sigue siendo scroll.
*/
import { ArrowDown } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { StageMark, useStageDrag } from "@/components/three/stage";

const LINES = ["Especialistas en", "solucionar", "tus ventas."];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const drag = useStageDrag();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // El texto se aleja en profundidad mientras la cámara entra en la S
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  // Ya desvanecido, el bloque deja de recibir toques y foco (los botones no quedan invisibles pero activos)
  const visibility = useTransform(opacity, (v) => (v < 0.02 ? "hidden" : "visible"));

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 lg:justify-center lg:pb-20"
    >
      <StageMark pose="hero" slot="hero-slot" className="absolute left-0 top-0" />
      <StageMark pose="plunge" className="absolute left-0 top-[55%]" />
      <StageMark pose="dive" className="absolute bottom-0 left-0" />

      {/* Arrastre del isotipo: mitad derecha en escritorio, la parte de arriba en celulares */}
      <div
        {...drag}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[48%] cursor-grab touch-pan-y active:cursor-grabbing lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[46%] motion-reduce:hidden"
      />

      {/* En celulares, el hueco de arriba es del isotipo (el escenario toma su centro y su alto) */}
      <div id="hero-slot" aria-hidden="true" className="min-h-[30svh] flex-1 lg:hidden" />

      {/* Mismo estilo en servidor y cliente; con reduced motion, el CSS anula el movimiento y queda el fundido */}
      <motion.div
        style={{ opacity, scale, y, visibility }}
        className="pointer-events-none relative mx-auto w-full max-w-[1200px] origin-top-left px-4 md:px-6 motion-reduce:!transform-none"
      >
        <div className="pointer-events-auto max-w-[620px] lg:max-w-[min(54%,720px)]">
          <h1
            id="hero-titulo"
            className="font-display text-[clamp(2.45rem,10.6vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink sm:text-[4.4rem] lg:text-[clamp(3.6rem,5vw,4.7rem)]"
          >
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {line}
                  {i === LINES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hero-accent ml-[0.12em] inline-block h-[0.62em] w-[0.34em] -skew-x-[24.5deg] bg-blue-500 align-[0.02em]"
                    />
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-fade mt-7 max-w-[38ch] text-[1.06rem] leading-relaxed text-ink-muted [animation-delay:520ms] md:text-lg">
            Atraemos clientes con marketing, los atendemos con agentes de IA y los seguimos en un CRM a
            tu medida.
          </p>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:640ms]">
            <PrimaryCta label={CONTACT_LABEL} />
            <a
              href="#proyectos"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors duration-150 hover:text-blue-300"
            >
              Ver proyectos
              <ArrowDown
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
