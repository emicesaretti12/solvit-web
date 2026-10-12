"use client";

/*
  HeroSection del hero-01, rehecho para SEN con una sola idea: el isotipo en 3D (WebGL, en el
  escenario fijo de la página) a la derecha y, a la izquierda, solo lo necesario: la bajada de
  la marca, el titular, los cinco servicios en una frase, el botón de contacto y el enlace a
  servicios.

  - El titular entra línea por línea con CSS (se pinta sin esperar a JavaScript); después de
    "ventas" aparece el corte azul de la N del wordmark.
  - Al bajar, el texto se aleja y la cámara se zambulle entre las cintas de la S (las poses las
    maneja el escenario según las marcas de cada sección).
  - En celulares el hero queda fijado durante un tramo de scroll (sticky, sin JS): primero se va
    el texto, después la S llega al centro, se abre y la cámara la atraviesa. Como nada se
    mueve mientras tanto, la S nunca pasa por encima del texto ni se desfasa del contenido. Con
    reduced motion no se fija: la S queda en su lugar y se apaga.
  - Sobre el isotipo hay una superficie para girarlo con el dedo o el mouse: en touch solo
    toma el arrastre horizontal, el vertical sigue siendo scroll. Un toque corto hace respirar
    a la S (las cintas se abren y vuelven) y manda una onda por sus partículas.
  - Al cargar, las partículas llegan desde una nube y arman la S; la pieza sólida aparece encima
    con un barrido (todo en el escenario WebGL, ver src/components/three).
*/
import { ArrowDown } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { StageMark, useStageDrag } from "@/components/three/stage";

const LINES = ["Especialistas en", "solucionar", "tus ventas."];

const DESKTOP_QUERY = "(min-width: 1024px)";
// Celular con movimiento: el hero se fija (misma condición que las clases max-lg:motion-safe:)
const PINNED_QUERY = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
const useMedia = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const drag = useStageDrag();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // El texto se aleja en profundidad mientras la cámara entra en la S. Cada caso tiene su ritmo
  // (en el arranque, scroll 0, todos valen lo mismo: el HTML del servidor coincide)
  const desktop = useMedia(DESKTOP_QUERY);
  const pinned = useMedia(PINNED_QUERY);
  // Celular fijado: el tramo mide 175svh y el texto se va en el primer 9 % (antes de que la S
  // salga de su hueco)
  const opacityPinned = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const scalePinned = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const yPinned = useTransform(scrollYProgress, [0, 0.1], [0, -36]);
  const opacityMobile = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scaleMobile = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const yMobile = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  const opacityDesktop = useTransform(scrollYProgress, [0, 0.26], [1, 0]);
  const scaleDesktop = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);
  const yDesktop = useTransform(scrollYProgress, [0, 0.3], [0, 40]);
  const opacity = desktop ? opacityDesktop : pinned ? opacityPinned : opacityMobile;
  const scale = desktop ? scaleDesktop : pinned ? scalePinned : scaleMobile;
  const y = desktop ? yDesktop : pinned ? yPinned : yMobile;
  // Ya desvanecido, el bloque deja de recibir toques y foco (los botones no quedan invisibles pero activos)
  const hide = (v: number) => (v < 0.02 ? "hidden" : "visible");
  const visibility = useTransform(opacity, hide);

  return (
    // Celulares con movimiento: un tramo de 175svh con el hero fijado arriba durante 75svh
    <section ref={ref} id="hero" aria-labelledby="hero-titulo" className="relative max-lg:motion-safe:h-[175svh]">
      {/* Marcas del recorrido de la S. En celulares, sobre el tramo fijado: gira en su hueco
          mientras se va el texto, llega al centro, se abre y la cámara la atraviesa antes de que
          el hero se suelte (42 % < 43 %) */}
      <StageMark pose="hero" slot="hero-slot" className="absolute left-0 top-0" />
      {/* Escritorio: mientras el texto se va, la S gira de frente y se abre en sus tres cintas */}
      <StageMark pose="unfold" className="absolute left-0 top-[17%] max-lg:hidden" />
      <StageMark pose="rise" slot="hero-slot" className="absolute left-0 top-[13%] lg:hidden" />
      <StageMark pose="center" className="absolute left-0 top-[26%] lg:hidden" />
      <StageMark pose="plunge" className="absolute left-0 top-[36%] lg:top-[38%]" />
      <StageMark pose="dive" className="absolute left-0 top-[42%] lg:top-[72%]" />

      <div
        data-stage-frame
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 max-lg:motion-safe:sticky max-lg:motion-safe:top-0 max-lg:motion-safe:h-[100svh] lg:justify-center lg:pb-20"
      >
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
            <p className="hero-fade mb-4 text-sm font-medium text-blue-300 [animation-delay:60ms] md:mb-5">
              Ingeniería y desarrollo de software
            </p>
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

            <p className="hero-fade mt-7 max-w-[40ch] text-[1.06rem] leading-relaxed text-ink-muted [animation-delay:520ms] md:text-lg">
              Desarrollo web, software a medida, agentes de IA, hardware y marketing, hechos por un
              mismo equipo para que vendas más.
            </p>

            <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:640ms]">
              <PrimaryCta label={CONTACT_LABEL} />
              <a
                href="#servicios"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors duration-150 hover:text-blue-300"
              >
                Ver servicios
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
      </div>
    </section>
  );
}
