"use client";

/*
  PortfolioGallery (21st.dev), adaptado a SEN:
  - motion/react en lugar de framer-motion, Phosphor en lugar de lucide, next/image y tokens
    de marca (funciona en los dos temas)
  - escritorio: las portadas en abanico 3D que asoman desde el borde inferior del panel; la que
    tiene el puntero o el foco sube entera y muestra su nombre. Entrada escalonada al entrar en
    pantalla; el hover usa un resorte sin retardo (el retardo del original solo va en la entrada)
  - celulares: marquesina de portadas que se pausa al tocar o con foco; con reduced motion queda
    una fila con scroll horizontal y snap
  - cada portada es un enlace (teclado y lectores de pantalla); las copias de la marquesina
    quedan ocultas para ambos
*/
import { ArrowDown } from "@phosphor-icons/react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PortfolioImage {
  src: string;
  alt: string;
  title?: string;
  /** Línea secundaria que acompaña al título (rubro, tipo de proyecto) */
  subtitle?: string;
  /** Destino al elegir la portada (por defecto, ninguno) */
  href?: string;
}

interface PortfolioGalleryProps {
  title?: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  archiveButton?: {
    text: string;
    href: string;
  };
  images: PortfolioImage[];
  className?: string;
  /** Altura (px) que sube la portada central; las demás bajan 20px por posición */
  maxHeight?: number;
  /** Superposición horizontal del abanico */
  spacing?: string;
  onImageClick?: (index: number, event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Pausar la marquesina con hover, toque o foco (celulares)
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Copias de la marquesina (celulares)
   * @default 3
   */
  marqueeRepeat?: number;
}

const EASE = [0.32, 0.72, 0, 1] as const;

function Cover({ image, sizes }: { image: PortfolioImage; sizes: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover object-left-top"
    />
  );
}

export function PortfolioGallery({
  title = "Proyectos realizados",
  eyebrow,
  description,
  archiveButton,
  images,
  className = "",
  maxHeight = 120,
  spacing = "-space-x-[15rem] lg:-space-x-[20rem]",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 3,
}: PortfolioGalleryProps) {
  const headingId = useId();
  const reduce = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const inView = useInView(fanRef, { once: true, amount: 0.35 });
  // El escalonado es solo para la entrada; después cada cambio de hover responde al instante
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setEntered(true), (images.length * 0.06 + 0.9) * 1000);
    return () => window.clearTimeout(t);
  }, [inView, images.length]);

  const total = images.length;
  const middle = Math.floor(total / 2);

  return (
    <div
      aria-labelledby={headingId}
      role="group"
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-line bg-navy-800 p-1.5 shadow-[0_40px_120px_-60px_rgb(var(--shade-rgb)/0.9)] light:shadow-[0_30px_90px_-50px_rgb(var(--shade-rgb)/0.35)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(var(--fg-rgb)/0.05)]">
        {/* Luz y retícula de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_100%,rgb(31_107_255/0.22),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]"
        />

        {/* Encabezado */}
        <div className="relative z-10 flex flex-col items-center px-5 pb-10 pt-14 text-center md:px-10 md:pb-4 md:pt-20">
          {eyebrow}
          <h2
            id={headingId}
            className="font-display mt-5 max-w-[18ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.6rem]"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-ink-muted text-pretty md:text-lg">
              {description}
            </p>
          )}
          {archiveButton && (
            <a
              href={archiveButton.href}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-navy-900 transition-[transform,background-color] duration-150 ease-out hover:bg-ink/90 active:scale-[0.97]"
            >
              {archiveButton.text}
              <span className="flex size-8 items-center justify-center rounded-full bg-navy-900/10 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5">
                <ArrowDown size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
          )}
        </div>

        {/* Escritorio: abanico 3D que asoma desde el borde inferior */}
        <div ref={fanRef} className="relative -mb-[210px] hidden h-[450px] overflow-hidden md:block">
          <ul className={cn("flex items-end justify-center pb-8 pt-48", spacing)}>
            {images.map((image, index) => {
              const distance = Math.abs(index - middle);
              const rest = -(maxHeight - distance * 20);
              const isHovered = hoveredIndex === index;
              const isOtherHovered = hoveredIndex !== null && !isHovered;
              const y = !inView && !reduce ? 260 : isHovered ? -(maxHeight + 52) : isOtherHovered ? rest * 0.55 : rest;

              return (
                <motion.li
                  key={image.src}
                  className="shrink-0"
                  style={{ zIndex: isHovered ? total + 1 : total - index }}
                  initial={false}
                  animate={{
                    transform: `perspective(2400px) rotateY(-40deg) translateY(${y}px)`,
                    opacity: inView || reduce ? 1 : 0,
                  }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : entered
                        ? { type: "spring", stiffness: 320, damping: 32, mass: 0.7 }
                        : { duration: 0.9, delay: index * 0.06, ease: EASE }
                  }
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex((current) => (current === index ? null : current))}
                >
                  <a
                    href={image.href}
                    aria-label={image.title ? `${image.title}: ${image.subtitle ?? image.alt}` : image.alt}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
                    onClick={(event) => onImageClick?.(index, event)}
                    className="group relative block aspect-video w-72 overflow-hidden rounded-xl bg-navy-900 shadow-[1px_0_1px_rgb(var(--shade-rgb)/0.05),6px_0_6px_rgb(var(--shade-rgb)/0.12),24px_0_32px_rgb(var(--shade-rgb)/0.35)] outline-offset-4 ring-1 ring-fg/10 lg:w-[25rem]"
                  >
                    <Cover image={image} sizes="(min-width: 1024px) 400px, 288px" />
                    {image.title && (
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-[#010a18]/90 via-[#010a18]/55 to-transparent px-4 pb-3 pt-10 text-left transition-opacity duration-200",
                          isHovered ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <span className="text-sm font-medium text-white">{image.title}</span>
                        {image.subtitle && <span className="text-xs text-white/70">{image.subtitle}</span>}
                      </span>
                    )}
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Celulares: marquesina de portadas */}
        <div className="relative pb-8 md:hidden">
          <div
            className={cn(
              "group flex overflow-hidden px-2 py-2 [--duration:38s] [--gap:0.875rem] [gap:var(--gap)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
              "motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto motion-reduce:px-4 motion-reduce:[mask-image:none]",
            )}
          >
            {Array.from({ length: marqueeRepeat }, (_, copy) => (
              <ul
                key={copy}
                aria-hidden={copy > 0 || undefined}
                className={cn(
                  "flex shrink-0 animate-marquee flex-row [gap:var(--gap)]",
                  pauseOnHover &&
                    "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] group-active:[animation-play-state:paused]",
                  copy > 0 && "motion-reduce:hidden",
                )}
              >
                {images.map((image, index) => (
                  <li key={`${copy}-${image.src}`} className="shrink-0 snap-start">
                    <a
                      href={image.href}
                      tabIndex={copy > 0 ? -1 : undefined}
                      aria-label={image.title ? `${image.title}: ${image.subtitle ?? image.alt}` : image.alt}
                      onClick={(event) => onImageClick?.(index, event)}
                      className="relative block aspect-video w-64 overflow-hidden rounded-xl bg-navy-900 shadow-[0_18px_40px_-20px_rgb(var(--shade-rgb)/0.7)] ring-1 ring-fg/10 transition-transform duration-150 ease-out active:scale-[0.98]"
                    >
                      <Cover image={image} sizes="256px" />
                      {image.title && (
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#010a18]/85 to-transparent px-3 pb-2 pt-8 text-left text-[13px] font-medium text-white">
                          {image.title}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
