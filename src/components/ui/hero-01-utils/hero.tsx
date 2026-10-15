"use client";

/*
  HeroSection del hero-01, rehecho para SEN con una sola idea: el isotipo en 3D (WebGL, en el
  escenario de la página) y, al lado, lo necesario: la bajada de la marca, el titular, el botón
  de contacto, la prueba (más de 10 proyectos entregados) y los cinco servicios como íconos de
  app que llevan a su tarjeta.

  - El titular entra línea por línea con CSS (se pinta sin esperar a JavaScript); después de
    "ventas" aparece el corte azul de la N del wordmark.
  - Escritorio: texto a la izquierda y la S a la derecha. Al bajar, la S se abre y la cámara la
    atraviesa (las poses las maneja el escenario según las marcas); el texto sube con la página,
    siempre nítido.
  - Celulares: el hero de la primera versión. La S arriba, en su hueco (#hero-slot); abajo el
    titular, una frase, el botón y el enlace a proyectos. Con el scroll común el texto se aleja
    (se desvanece, se achica y sube) y la S se abre en diagonal, avanza y atraviesa la cámara
    (queda en su lugar de la pantalla, no persigue al texto). Con reduced motion la S queda
    quieta y se apaga.
  - Sobre el isotipo hay una superficie para girarlo con el dedo o el mouse: en touch solo toma
    el arrastre horizontal, el vertical sigue siendo scroll. Un toque corto hace respirar a la S
    (las cintas se abren y vuelven) y manda una onda por sus partículas.
  - En escritorio, al cargar, las partículas llegan desde una nube y arman la S; la pieza sólida
    aparece encima con un barrido (todo en el escenario WebGL, ver src/components/three).
*/
import { ArrowDown, Browsers, Code, Cpu, Megaphone, Sparkle, type Icon } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useSyncExternalStore, type CSSProperties, type MouseEvent } from "react";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { HapticLink } from "@/components/nav/haptic-link";
import { getLenis } from "@/components/smooth-scroll";
import { StageMark, useStageDrag } from "@/components/three/stage";
import { DELIVERED, PROJECTS, coverOf } from "@/content/projects";
import { SERVICES, type ServiceKey } from "@/content/services";

const LINES = ["Especialistas en", "solucionar", "tus ventas."];

const DESKTOP_QUERY = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// Accesos a los servicios: el nombre corto va escrito, el completo en aria-label
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
    <nav aria-label="Servicios" className="mt-6 lg:mt-10 lg:max-w-[460px]">
      <ul className="grid grid-cols-5 gap-1.5 lg:gap-3">
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
                  "relative flex size-12 items-center justify-center rounded-[15px] border text-blue-400 lg:size-14 lg:rounded-[17px]",
                  "border-line bg-navy-850 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_10px_22px_-14px_rgb(var(--shade-rgb)/0.9)]",
                  "light:border-line-strong light:shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.08),0_10px_20px_-12px_rgb(var(--shade-rgb)/0.4)]",
                  "transition-[scale,translate,border-color] duration-150 ease-[var(--ease-out)] group-active:scale-[0.92]",
                  "motion-safe:pointer-fine:group-hover:-translate-y-0.5 pointer-fine:group-hover:border-blue-400/50",
                ].join(" ")}
              >
                <Glyph size={22} weight="duotone" />
              </span>
              <span className="text-[11.5px] font-medium leading-none text-ink-muted transition-colors duration-150 pointer-fine:group-hover:text-ink lg:text-[12.5px]">
                {label}
              </span>
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
  // Celulares: el texto se aleja en profundidad mientras la cámara entra en la S. Escritorio: el
  // texto sube con la página, siempre nítido (un fundido ligado al scroll lo dejaba lavado al
  // lado de la S). En el arranque (scroll 0) los dos se ven igual: el HTML coincide
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  // Ya desvanecido, el bloque deja de recibir toques y foco (los botones no quedan invisibles pero activos)
  const visibility = useTransform(opacity, (v) => (v < 0.02 ? "hidden" : "visible"));
  const fade = desktop ? undefined : { opacity, scale, y, visibility };

  return (
    <section ref={ref} id="hero" aria-labelledby="hero-titulo" className="relative">
      {/* Marcas del recorrido de la S (ver choreography.ts) */}
      <StageMark pose="hero" slot="hero-slot" className="absolute left-0 top-0" />
      {/* Escritorio: la S gira de frente, se abre en sus tres cintas, avanza y atraviesa la cámara */}
      <StageMark pose="unfold" className="absolute left-0 top-[17%] max-lg:hidden" />
      <StageMark pose="plunge" className="absolute left-0 top-[38%] max-lg:hidden" />
      <StageMark pose="dive" className="absolute left-0 top-[72%] max-lg:hidden" />
      {/* Celulares: mientras el texto se aleja, la S se abre en diagonal y atraviesa la cámara */}
      <StageMark pose="plunge" className="absolute left-0 top-[55%] lg:hidden" />
      <StageMark pose="dive" className="absolute bottom-0 left-0 lg:hidden" />

      <div
        data-stage-frame
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 lg:justify-center lg:pb-16 lg:pt-28"
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
          className="min-h-[30svh] flex-1 cursor-grab touch-pan-y active:cursor-grabbing lg:hidden motion-reduce:pointer-events-none"
        />

        {/* Mismo estilo en servidor y cliente; con reduced motion, el CSS anula el movimiento y queda el fundido */}
        <motion.div
          style={fade}
          className="pointer-events-none relative mx-auto w-full max-w-[1200px] origin-top-left px-4 md:px-6 motion-reduce:!transform-none"
        >
          <div className="pointer-events-auto max-w-[620px] lg:max-w-[min(54%,720px)]">
            <p className="hero-fade mb-5 hidden text-sm font-medium text-blue-300 [animation-delay:60ms] lg:block">
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

            <p className="hero-fade mt-7 max-w-[38ch] text-[1.06rem] leading-relaxed text-ink-muted [animation-delay:520ms] md:text-lg lg:hidden">
              Atraemos clientes con marketing, los atendemos con agentes de IA y los seguimos en un CRM a
              tu medida.
            </p>
            <p className="hero-fade mt-7 hidden max-w-[40ch] text-lg leading-relaxed text-ink-muted [animation-delay:520ms] lg:block">
              Desarrollo web, software a medida, agentes de IA, hardware y marketing, hechos por un
              mismo equipo para que vendas más.
            </p>

            <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:640ms]">
              <PrimaryCta label={CONTACT_LABEL} />
              <a
                href="#proyectos"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors duration-150 hover:text-blue-300 lg:hidden"
              >
                Ver proyectos
                <ArrowDown
                  size={15}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5"
                />
              </a>
              <Proof className="max-lg:hidden" />
            </div>

            <div className="max-lg:hidden">
              <QuickServices />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
