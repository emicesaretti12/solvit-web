"use client";

/*
  PortfolioGallery (21st.dev), adaptado a SEN:
  - motion/react en lugar de framer-motion, Phosphor en lugar de lucide, next/image y tokens
    de marca (funciona en los dos temas)
  - escritorio: las portadas en abanico 3D que asoman desde el borde inferior del panel; la que
    tiene el puntero o el foco sube entera y muestra su nombre. Entrada escalonada al entrar en
    pantalla; el hover usa un resorte sin retardo (el retardo del original solo va en la entrada)
  - celulares: carrusel con scroll nativo y snap; cada portada gira en 3D (coverflow) según su
    distancia al centro. Con reduced motion queda el carrusel plano
  - cada portada es un enlace (teclado y lectores de pantalla)
*/
import { ArrowDown } from "@phosphor-icons/react";
import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from "react";
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

function CoverflowCard({
  image,
  index,
  container,
  onImageClick,
}: {
  image: PortfolioImage;
  index: number;
  container: RefObject<HTMLUListElement | null>;
  onImageClick?: PortfolioGalleryProps["onImageClick"];
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // 0 = entra por la derecha, 0,5 = centrada, 1 = sale por la izquierda
  const { scrollXProgress } = useScroll({ container, target: ref, axis: "x", offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [48, 0, -48]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollXProgress, [0, 0.5, 1], [0.45, 1, 0.45]);
  const x = useTransform(scrollXProgress, [0, 0.5, 1], [-28, 0, 28]);

  return (
    <li ref={ref} className="w-[72vw] max-w-[300px] shrink-0 snap-center [perspective:900px]">
      <motion.a
        href={image.href}
        aria-label={image.title ? `${image.title}: ${image.subtitle ?? image.alt}` : image.alt}
        onClick={(event) => onImageClick?.(index, event)}
        style={reduce ? undefined : { rotateY, scale, opacity, x }}
        className="relative block aspect-video overflow-hidden rounded-xl bg-navy-900 shadow-[0_24px_50px_-24px_rgb(var(--shade-rgb)/0.8)] ring-1 ring-fg/10"
      >
        <Cover image={image} sizes="300px" />
      </motion.a>
      {image.title && (
        <p className="mt-3 text-center text-sm font-medium text-ink">
          {image.title}
          {image.subtitle && <span className="block text-xs font-normal text-ink-faint">{image.subtitle}</span>}
        </p>
      )}
    </li>
  );
}

function Coverflow({ images, onImageClick }: { images: PortfolioImage[]; onImageClick?: PortfolioGalleryProps["onImageClick"] }) {
  const container = useRef<HTMLUListElement>(null);
  return (
    <div className="relative pb-10 md:hidden">
      <ul
        ref={container}
        aria-label="Portadas de los proyectos"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-min(36vw,150px))] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <CoverflowCard key={image.src} image={image} index={index} container={container} onImageClick={onImageClick} />
        ))}
      </ul>
    </div>
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
        "relative overflow-hidden rounded-[1.75rem] border border-line bg-navy-850",
        className,
      )}
    >
      <div className="relative overflow-hidden">

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

        {/* Celulares: carrusel en 3D con scroll nativo y snap; cada portada gira al pasar por el centro */}
        <Coverflow images={images} onImageClick={onImageClick} />
      </div>
    </div>
  );
}
