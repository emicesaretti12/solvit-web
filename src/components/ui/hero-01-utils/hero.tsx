"use client";

/*
  HeroSection del hero-01, rehecho para SEN con una sola idea: el isotipo en 3D (WebGL, en el
  escenario fijo de la página) y, al lado, lo necesario: la bajada de la marca, el titular, el
  botón de contacto y el camino a los servicios.

  - El titular entra línea por línea con CSS (se pinta sin esperar a JavaScript); después de
    "ventas" aparece el corte azul de la N del wordmark.
  - Escritorio: texto a la izquierda y la S a la derecha. Al bajar, el texto se aleja y la cámara
    se zambulle entre las cintas (las poses las maneja el escenario según las marcas).
  - Celulares: la S arriba, entera y centrada en su hueco (#hero-slot); abajo el titular, el
    botón, la prueba (proyectos entregados) y los cinco servicios como íconos de app que llevan
    a su tarjeta. En vertical y con movimiento el hero queda fijado (sticky, sin JS) y el resto
    de la página sube encima como una hoja (data-stage-cover, en hero-01.tsx): primero se va el
    texto, la S crece y se abre en capas por encima de la hoja y la cámara la atraviesa justo
    antes de que la hoja tape el hero. Nunca queda una pantalla vacía. Acostado o con reduced
    motion, el hero es una pantalla común y la S se va con él.
  - Sobre el isotipo hay una superficie para girarlo con el dedo o el mouse: en touch solo toma
    el arrastre horizontal, el vertical sigue siendo scroll. Un toque corto hace respirar a la S
    (las cintas se abren y vuelven) y manda una onda por sus partículas.
  - Al cargar, las partículas llegan desde una nube y arman la S; la pieza sólida aparece encima
    con un barrido (todo en el escenario WebGL, ver src/components/three).
*/
import { ArrowDown, Browsers, Code, Cpu, Megaphone, Sparkle, type Icon } from "@phosphor-icons/react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useSyncExternalStore, type CSSProperties, type MouseEvent } from "react";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { HapticLink } from "@/components/nav/haptic-link";
import { getLenis } from "@/components/smooth-scroll";
import { StageMark, useStageDrag } from "@/components/three/stage";
import { DELIVERED, PROJECTS, coverOf } from "@/content/projects";
import { SERVICES, type ServiceKey } from "@/content/services";

const LINES = ["Especialistas en", "solucionar", "tus ventas."];

// Accesos a los servicios (celulares): el nombre corto va escrito, el completo en aria-label
const QUICK: { key: ServiceKey; label: string; icon: Icon }[] = [
  { key: "web", label: "Web", icon: Browsers },
  { key: "software", label: "Software", icon: Code },
  { key: "ia", label: "IA", icon: Sparkle },
  { key: "hardware", label: "Hardware", icon: Cpu },
  { key: "marketing", label: "Marketing", icon: Megaphone },
];
const TITLE: Record<ServiceKey, string> = Object.fromEntries(SERVICES.map((s) => [s.key, s.title])) as Record<
  ServiceKey,
  string
>;

const DESKTOP_QUERY = "(min-width: 1024px)";
// Celular o tablet en vertical y con movimiento: el hero se fija (misma consulta que la
// variante pin: de globals.css)
const PINNED_QUERY = "(max-width: 1023.98px) and (orientation: portrait) and (prefers-reduced-motion: no-preference)";
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

/* Prueba: tres portadas apiladas y el total de proyectos entregados */
function Proof({ className = "" }: { className?: string }) {
  return (
    <HapticLink
      href="#proyectos"
      className={`group inline-flex min-h-11 select-none items-center gap-3 [-webkit-touch-callout:none] ${className}`}
    >
      <span aria-hidden="true" className="flex">
        {PROJECTS.slice(0, 3).map((p, i) => (
          <span
            key={p.slug}
            style={{ "--r": `${(i - 1) * 7}deg` } as CSSProperties}
            className="relative -ml-3 h-7 w-10 overflow-hidden rounded-md bg-navy-950 shadow-[0_6px_14px_-6px_rgb(var(--shade-rgb)/0.6)] ring-2 ring-navy-900 [rotate:var(--r)] first:ml-0 transition-[rotate,translate] duration-200 ease-[var(--ease-out)] group-active:translate-y-px"
          >
            <Image src={coverOf(p)} alt="" fill sizes="40px" className="object-cover object-left-top" />
          </span>
        ))}
      </span>
      <span className="text-[13px] leading-[1.15] text-ink-muted">
        <span className="font-semibold text-ink">Más de {DELIVERED}</span>
        <br />
        proyectos entregados
      </span>
    </HapticLink>
  );
}

/* Lleva a la tarjeta de un servicio. En el mazo de celulares las tarjetas son sticky: con el
   ancla común el navegador apunta al título y la tarjeta siguiente queda tapándola a medias. Se
   calcula el scroll en que la tarjeta recién llega arriba del mazo (su lugar en el flujo menos
   su top de sticky), entera y todavía sin nada encima. En la grilla, el ancla común sirve */
function goToService(key: ServiceKey, event: MouseEvent<HTMLAnchorElement>) {
  const card = document.getElementById(`servicio-${key}`)?.closest<HTMLElement>("li");
  const deck = card?.parentElement;
  if (!card || !deck || getComputedStyle(card).position !== "sticky") return;
  event.preventDefault();
  let y = deck.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(deck).paddingTop);
  for (const li of Array.from(deck.children) as HTMLElement[]) {
    y += parseFloat(getComputedStyle(li).marginTop) || 0;
    if (li === card) break;
    y += li.offsetHeight;
  }
  const top = Math.max(0, y - (parseFloat(getComputedStyle(card).top) || 0));
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top });
}

/* Los cinco servicios como íconos de app: llevan a su tarjeta */
function QuickServices() {
  return (
    <nav aria-label="Servicios" className="mt-6 lg:hidden">
      <ul className="grid grid-cols-5 gap-1.5">
        {QUICK.map(({ key, label, icon: Glyph }, i) => (
          <li key={key} className="hero-fade" style={{ animationDelay: `${700 + i * 45}ms` }}>
            <HapticLink
              href={`#servicio-${key}`}
              aria-label={TITLE[key]}
              onClick={(event) => goToService(key, event)}
              className="group flex select-none flex-col items-center gap-1.5 [-webkit-touch-callout:none]"
            >
              <span
                aria-hidden="true"
                className={[
                  "relative flex size-12 items-center justify-center rounded-[15px] border text-blue-400",
                  "border-line bg-navy-850 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_10px_22px_-14px_rgb(var(--shade-rgb)/0.9)]",
                  "light:border-line-strong light:shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.08),0_10px_20px_-12px_rgb(var(--shade-rgb)/0.4)]",
                  "transition-[scale,translate] duration-150 ease-[var(--ease-out)] group-active:scale-[0.92]",
                ].join(" ")}
              >
                <Glyph size={22} weight="duotone" />
              </span>
              <span className="text-[11.5px] font-medium leading-none text-ink-muted">{label}</span>
            </HapticLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const drag = useStageDrag();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // El texto se aleja en profundidad mientras la cámara entra en la S. Cada caso tiene su ritmo
  // (en el arranque, scroll 0, todos valen lo mismo: el HTML del servidor coincide)
  const desktop = useMedia(DESKTOP_QUERY);
  const pinned = useMedia(PINNED_QUERY);
  // Celular fijado: el tramo mide 200svh y el texto se va en los primeros 12svh (antes de que la
  // S salga de su hueco y mientras la hoja empieza a subir)
  const opacityPinned = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const scalePinned = useTransform(scrollYProgress, [0, 0.065], [1, 0.95]);
  const yPinned = useTransform(scrollYProgress, [0, 0.065], [0, -36]);
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
    // Celulares fijados: un tramo de 200svh con el hero fijado arriba durante 100svh; la hoja
    // que sigue (hero-01.tsx) sube encima desde el primer scroll y lo tapa entero al soltarse
    <section ref={ref} id="hero" aria-labelledby="hero-titulo" className="relative pin:h-[200svh]">
      {/* Marcas del recorrido de la S (ver choreography.ts) */}
      <StageMark pose="hero" slot="hero-slot" className="absolute left-0 top-0" />
      {/* Escritorio: mientras el texto se va, la S gira de frente y se abre en sus tres cintas */}
      <StageMark pose="unfold" className="absolute left-0 top-[17%] max-lg:hidden" />
      <StageMark pose="plunge" className="absolute left-0 top-[38%] max-lg:hidden" />
      <StageMark pose="dive" className="absolute left-0 top-[72%] max-lg:hidden" />
      {/* Celulares fijados: gira en su hueco mientras se va el texto, crece sobre la hoja que
          sube, se abre en capas, avanza y la cámara la atraviesa antes de que la hoja tape todo */}
      <StageMark pose="rise" slot="hero-slot" className="absolute left-0 top-[7svh] hidden pin:block" />
      <StageMark pose="center" region className="absolute left-0 top-[20svh] hidden pin:block" />
      <StageMark pose="explode" region className="absolute left-0 top-[38svh] hidden pin:block" />
      <StageMark pose="plunge" region className="absolute left-0 top-[56svh] hidden pin:block" />
      <StageMark pose="dive" region className="absolute left-0 top-[76svh] hidden pin:block" />
      {/* Celulares sin tramo fijado: la S se va con el hero y se apaga al final */}
      <StageMark pose="leave" slot="hero-slot" className="absolute bottom-0 left-0 hidden loose:block" />

      <div
        data-stage-frame
        className="relative flex min-h-[100svh] flex-col overflow-hidden pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[calc(max(1rem,env(safe-area-inset-top))+4.25rem)] pin:sticky pin:top-0 pin:h-[100svh] lg:justify-center lg:pb-20 lg:pt-28"
      >
        {/* Arrastre del isotipo en escritorio: la mitad derecha */}
        <div
          {...drag}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[46%] cursor-grab touch-pan-y active:cursor-grabbing lg:block motion-reduce:hidden"
        />

        {/* Celulares: el hueco de arriba es del isotipo (el escenario toma su centro y su alto) y
            también la superficie para girarlo */}
        <div
          id="hero-slot"
          {...drag}
          aria-hidden="true"
          className="min-h-[22svh] flex-1 cursor-grab touch-pan-y active:cursor-grabbing lg:hidden motion-reduce:pointer-events-none"
        />

        {/* Mismo estilo en servidor y cliente; con reduced motion, el CSS anula el movimiento y queda el fundido */}
        <motion.div
          style={{ opacity, scale, y, visibility }}
          className="pointer-events-none relative mx-auto w-full max-w-[1200px] origin-top-left px-4 md:px-6 motion-reduce:!transform-none"
        >
          <div className="pointer-events-auto max-w-[620px] lg:max-w-[min(54%,720px)]">
            <p className="hero-fade mb-3 text-[13px] font-medium text-blue-300 [animation-delay:60ms] md:mb-5 md:text-sm">
              Ingeniería y desarrollo de software
            </p>
            <h1
              id="hero-titulo"
              className="font-display text-[clamp(2.3rem,10.4vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink max-lg:[@media(max-height:600px)]:text-[2.05rem] sm:text-[4.4rem] lg:text-[clamp(3.6rem,5vw,4.7rem)]"
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

            {/* En celulares bajos la frase cede su lugar a la S: los servicios ya están en los íconos */}
            <p className="hero-fade mt-4 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted [animation-delay:520ms] max-lg:[@media(max-height:719px)]:hidden md:mt-7 md:text-lg">
              Desarrollo web, software a medida, agentes de IA, hardware y marketing, hechos por un
              mismo equipo para que vendas más.
            </p>

            <div className="hero-fade mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 [animation-delay:640ms] md:mt-9 lg:gap-x-7">
              <PrimaryCta label={CONTACT_LABEL} />
              <Proof className="lg:hidden" />
              <a
                href="#servicios"
                className="group hidden min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors duration-150 hover:text-blue-300 lg:inline-flex"
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

            <QuickServices />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
