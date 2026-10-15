"use client";

/*
  Abanico de portadas (tablets y escritorio): las portadas giran alrededor de un pivote común
  debajo del panel, como cartas en la mano. La del centro queda arriba y entera; las demás
  asoman su borde, todo adentro del panel (sin cortes).
  - Entrada 3D escalonada: el mazo se para desde el piso y se abre de adentro hacia afuera
    (transiciones en CSS cuando data-shown pasa a true; projects.css)
  - Ya abierto (data-settled), la portada con el mouse o el foco sube, pasa adelante y muestra
    su nombre; las demás se apagan. Todo en CSS (:hover, :focus-within), sin re-render
  - El plano sigue un poco al mouse (--px, escrito directo en el estilo, sin estado)
  - Reduced motion: abierto y quieto desde el primer cuadro
*/
import Image from "next/image";
import { useInView } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type Ref } from "react";
import type { PortfolioImage } from "@/components/ui/portfolio-gallery";
import "./projects.css";

type OnImageClick = (index: number, event: MouseEvent<HTMLAnchorElement>) => void;

export function CoverFan({
  images,
  onImageClick,
  planeRef,
}: {
  images: PortfolioImage[];
  onImageClick?: OnImageClick;
  /** Plano del abanico: la vitrina le escribe --px con el mouse */
  planeRef?: Ref<HTMLUListElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.3 });
  const [settled, setSettled] = useState(false);
  const total = images.length;
  const mid = (total - 1) / 2;

  // El escalonado es solo para la entrada: cuando termina, cada hover responde al instante
  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setSettled(true), (0.15 + mid * 0.07 + 1.1) * 1000);
    return () => window.clearTimeout(t);
  }, [shown, mid]);

  return (
    <div ref={ref} data-shown={shown} data-settled={settled} className="pv-fan hidden md:block">
      <span aria-hidden="true" className="pv-fan-floor" />
      <ul ref={planeRef} aria-label="Portadas de los proyectos" className="pv-fan-plane">
        {images.map((image, index) => {
          const off = index - mid;
          // La del centro arriba; hacia los costados, cada una debajo de la anterior
          const style = { "--off": off, "--o": Math.abs(off), zIndex: total * 2 - Math.round(Math.abs(off) * 2) } as CSSProperties;
          return (
            <li key={image.src} className="pv-fan-card" style={style}>
              <a
                href={image.href}
                aria-label={image.title ? `${image.title}: ${image.subtitle ?? image.alt}` : image.alt}
                onClick={(event) => onImageClick?.(index, event)}
                className="pv-fan-face"
              >
                <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 336px, 240px" className="object-cover object-left-top" />
                <span aria-hidden="true" className="pv-fan-shade" />
                {image.title && (
                  <span aria-hidden="true" className="pv-fan-label">
                    <span className="text-sm font-medium text-white">{image.title}</span>
                    {image.subtitle && <span className="text-xs text-white/75">{image.subtitle}</span>}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
