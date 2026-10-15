"use client";

/*
  Anillo de portadas (celulares): galería 3D con scroll horizontal nativo y snap, así la física
  del dedo es la del navegador. Cada portada se ubica en un anillo según su distancia al centro:
  gira (rotateY), se aleja (translateZ) y se apaga hacia los costados; la del frente queda
  grande (78 % del ancho) con un brillo que la cruza al pasar.
  - Con animaciones ligadas al scroll (animation-timeline: view(inline)) todo corre en el
    compositor (projects.css: pv-ring). Sin soporte (iOS < 26), Motion lee el scroll del
    carrusel y aplica las mismas poses (RING)
  - Reduced motion: carrusel plano, sin giros
  - Debajo, la leyenda de la portada del frente (nombre y rubro), "3 / 10" con flechas y los
    puntos de posición
  - Tocar la portada del frente lleva a su caso o fila (onImageClick); tocar una del costado la
    trae al frente
*/
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import type { PortfolioImage } from "@/components/ui/portfolio-gallery";
import { cn } from "@/lib/utils";
import "./projects.css";

type OnImageClick = (index: number, event: MouseEvent<HTMLAnchorElement>) => void;

// Poses del anillo según el avance de la portada por el carrusel (0 = entra por la derecha,
// 0,5 = al frente, 1 = sale por la izquierda). Mismos valores que @keyframes pv-ring
const RING = {
  at: [0, 0.037, 0.27, 0.5, 0.73, 0.963, 1],
  x: ["-24%", "-19%", "-4%", "0%", "4%", "19%", "24%"],
  z: [-170, -130, -46, 0, -46, -130, -170],
  rotateY: [60, 52, 26, 0, -26, -52, -60],
  shade: [0.85, 0.7, 0.3, 0, 0.3, 0.7, 0.85],
};

// Soporte de animaciones ligadas al scroll. En el servidor (y al hidratar) se asume que sí:
// es el HTML sin estilos en línea; si el navegador no las tiene, después se monta el respaldo
const noop = () => () => {};
const hasScrollTimeline = () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
function useScrollTimeline() {
  return useSyncExternalStore(noop, hasScrollTimeline, () => true);
}

function label(image: PortfolioImage) {
  return image.title ? `${image.title}: ${image.subtitle ?? image.alt}` : image.alt;
}

function Face({ image }: { image: PortfolioImage }) {
  return (
    <>
      <Image src={image.src} alt="" fill sizes="(max-width: 767px) 80vw, 1px" className="object-cover object-left-top" />
      <span aria-hidden="true" className="pv-ring-shade" />
      <span aria-hidden="true" className="pv-ring-sheen" />
    </>
  );
}

type CardProps = {
  image: PortfolioImage;
  index: number;
  onPick: (index: number, event: MouseEvent<HTMLAnchorElement>) => void;
  onFocus: (event: FocusEvent<HTMLAnchorElement>) => void;
};

/* Portada con las poses en CSS (compositor) */
function RingCard({ image, index, onPick, onFocus }: CardProps) {
  return (
    <li className="pv-ring-item">
      <a href={image.href} aria-label={label(image)} onClick={(e) => onPick(index, e)} onFocus={onFocus} className="pv-ring-card">
        <Face image={image} />
      </a>
    </li>
  );
}

/* Respaldo sin animation-timeline: las mismas poses, calculadas por Motion con el scroll */
function RingCardMotion({ image, index, onPick, onFocus, container }: CardProps & { container: RefObject<HTMLUListElement | null> }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollXProgress } = useScroll({ container, target: ref, axis: "x", offset: ["start end", "end start"] });
  const x = useTransform(scrollXProgress, RING.at, RING.x);
  const z = useTransform(scrollXProgress, RING.at, RING.z);
  const rotateY = useTransform(scrollXProgress, RING.at, RING.rotateY);
  const shade = useTransform(scrollXProgress, RING.at, RING.shade);
  return (
    <motion.li ref={ref} style={{ x, z, rotateY }} className="pv-ring-item">
      <a href={image.href} aria-label={label(image)} onClick={(e) => onPick(index, e)} onFocus={onFocus} className="pv-ring-card">
        <Image src={image.src} alt="" fill sizes="(max-width: 767px) 80vw, 1px" className="object-cover object-left-top" />
        <motion.span aria-hidden="true" style={{ opacity: shade }} className="pv-ring-shade" />
      </a>
    </motion.li>
  );
}

export function RingCarousel({ images, onImageClick }: { images: PortfolioImage[]; onImageClick?: OnImageClick }) {
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const timeline = useScrollTimeline();
  const [active, setActive] = useState(0);
  const total = images.length;

  // Distancia entre portadas (ancho + separación), medida en el DOM
  const pitch = () => {
    const items = listRef.current?.children;
    if (!items || items.length < 2) return 1;
    return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft || 1;
  };

  // La portada del frente sale del scroll (una vez por cuadro como mucho y sin re-render si
  // no cambió)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      setActive(Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / pitch()))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const go = (index: number) => {
    const el = listRef.current;
    if (!el) return;
    const i = Math.max(0, Math.min(total - 1, index));
    el.scrollTo({ left: i * pitch(), behavior: reduce ? "auto" : "smooth" });
  };

  // La del frente lleva a su caso; una del costado primero pasa al frente
  const onPick = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    if (index !== active) {
      event.preventDefault();
      go(index);
      return;
    }
    onImageClick?.(index, event);
  };

  // Con teclado, la portada enfocada pasa al frente (si no, queda tapada por el costado)
  const onFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (!event.currentTarget.matches(":focus-visible")) return;
    event.currentTarget.parentElement?.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
  };

  const current = images[active];
  const animated = !timeline && !reduce;

  return (
    <div className="md:hidden">
      <div className="pv-ring-wrap">
        <ul ref={listRef} aria-label="Portadas de los proyectos" className="pv-ring">
          {images.map((image, index) =>
            animated ? (
              <RingCardMotion key={image.src} image={image} index={index} onPick={onPick} onFocus={onFocus} container={listRef} />
            ) : (
              <RingCard key={image.src} image={image} index={index} onPick={onPick} onFocus={onFocus} />
            ),
          )}
        </ul>
      </div>

      {/* Leyenda de la portada del frente y posición */}
      <div className="flex items-center justify-between gap-3 px-5">
        <div key={active} className="pv-cap min-w-0">
          <p className="truncate text-[15px] font-medium leading-snug text-ink">{current?.title}</p>
          {current?.subtitle && <p className="truncate text-[13px] leading-snug text-ink-faint">{current.subtitle}</p>}
        </div>
        <div className="-mr-2.5 flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-label="Proyecto anterior"
            className="flex size-11 items-center justify-center rounded-full text-ink transition-[opacity,transform] duration-150 ease-out active:scale-[0.92] disabled:opacity-30"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-line-strong">
              <CaretLeft size={14} weight="bold" aria-hidden="true" />
            </span>
          </button>
          <span className="min-w-[3.25rem] text-center font-mono text-xs tabular-nums text-ink-muted">
            {active + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === total - 1}
            aria-label="Proyecto siguiente"
            className="flex size-11 items-center justify-center rounded-full text-ink transition-[opacity,transform] duration-150 ease-out active:scale-[0.92] disabled:opacity-30"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-line-strong">
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="mt-3 flex justify-center pb-7">
        <div className="pv-dots" style={{ "--i": active } as CSSProperties}>
          {images.map((image) => (
            <span key={image.src} className="pv-dot" />
          ))}
          <span className={cn("pv-dots-pill")} />
        </div>
      </div>
    </div>
  );
}
