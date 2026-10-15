"use client";

/*
  PortfolioGallery (21st.dev), adaptado a SEN como una vitrina:
  - panel navy oscuro en los dos temas (projects.css: .pv fija los tokens del tema oscuro
    adentro), con la luz que baja desde arriba; sobre la página blanca queda como un bloque
    premium y las portadas, que son oscuras, resaltan
  - un protagonista opcional (stat), por ejemplo el contador 3D, junto al titular
  - celulares: anillo 3D de portadas con scroll nativo y snap (RingCarousel)
  - tablets y escritorio: abanico 3D entero adentro del panel; la portada con el mouse o el
    foco sube y muestra su nombre (CoverFan)
  - con mouse, el contador y el abanico siguen apenas al puntero (variables CSS escritas en el
    estilo, una vez por cuadro y sin re-render)
  - cada portada es un enlace (teclado y lectores de pantalla)
*/
import { ArrowDown } from "@phosphor-icons/react";
import { useEffect, useId, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { CoverFan } from "@/components/projects/cover-fan";
import { RingCarousel } from "@/components/projects/ring-carousel";
import "@/components/projects/projects.css";
import { cn } from "@/lib/utils";
import { MaskWords } from "../mask-words";

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
  /** Protagonista decorativo junto al titular (por ejemplo, un contador 3D). Su envoltorio
   *  recibe --px/--py con el mouse (las variables se heredan: el protagonista las usa para girar) */
  stat?: ReactNode;
  archiveButton?: {
    text: string;
    href: string;
  };
  images: PortfolioImage[];
  className?: string;
  onImageClick?: (index: number, event: MouseEvent<HTMLAnchorElement>) => void;
}

export function PortfolioGallery({
  title = "Proyectos realizados",
  eyebrow,
  description,
  stat,
  archiveButton,
  images,
  className = "",
  onImageClick,
}: PortfolioGalleryProps) {
  const headingId = useId();
  const tiltEl = useRef<HTMLDivElement | null>(null);
  const planeEl = useRef<HTMLUListElement | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Solo mouse: -1..1 desde el centro del panel, escrito directo en el estilo de las dos piezas
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || frame.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      for (const el of [tiltEl.current, planeEl.current]) {
        el?.style.setProperty("--px", px.toFixed(3));
        el?.style.setProperty("--py", py.toFixed(3));
      }
    });
  };
  const onPointerLeave = () => {
    for (const el of [tiltEl.current, planeEl.current]) {
      el?.style.setProperty("--px", "0");
      el?.style.setProperty("--py", "0");
    }
  };

  return (
    <div
      aria-labelledby={headingId}
      role="group"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("pv relative isolate overflow-hidden rounded-[1.75rem] md:rounded-[2rem]", className)}
    >
      {/* Encabezado: el protagonista y el titular (uno sobre otro en celulares, lado a lado
          desde tablets) */}
      <div
        className={cn(
          "relative z-10 grid justify-items-center px-5 pt-11 text-center",
          "md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:justify-items-start md:gap-x-12 md:px-12 md:pt-16 md:text-left lg:gap-x-16 lg:px-16",
        )}
      >
        {stat && (
          <div ref={tiltEl} className="md:-mb-4">
            {stat}
          </div>
        )}
        <div className="mt-6 flex flex-col items-center md:mt-0 md:items-start">
          {eyebrow}
          <h2
            id={headingId}
            className="font-display max-w-[18ch] text-[2.15rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.6rem]"
          >
            {typeof title === "string" ? <MaskWords text={title} /> : title}
          </h2>
          {description && (
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted text-pretty md:mt-5 md:text-lg">
              {description}
            </p>
          )}
          {archiveButton && (
            <a
              href={archiveButton.href}
              className="group mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-navy-900 transition-[transform,background-color] duration-150 ease-out hover:bg-ink/90 active:scale-[0.97]"
            >
              {archiveButton.text}
              <span className="flex size-8 items-center justify-center rounded-full bg-navy-900/10 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5">
                <ArrowDown size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Piso de la vitrina */}
      <div aria-hidden="true" className="pv-floorline mx-6 mt-9 md:mx-12 md:mt-12" />

      {/* Celulares: anillo 3D de portadas */}
      <RingCarousel images={images} onImageClick={onImageClick} />

      {/* Tablets y escritorio: abanico 3D */}
      <CoverFan images={images} onImageClick={onImageClick} planeRef={planeEl} />
    </div>
  );
}
