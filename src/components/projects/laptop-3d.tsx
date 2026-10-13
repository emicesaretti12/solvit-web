"use client";

/*
  Laptop 3D en CSS para los casos destacados: la portada del proyecto va en la pantalla.
  - La tapa se abre sobre su bisagra con el scroll y la laptop gira hasta quedar de frente
    (projects.css: lp3d-open, lp3d-turn); sin scroll ligado, data-shown dispara las mismas
    poses con transiciones; con reduced motion queda abierta y quieta
  - La base es un plano acostado (teclado y touchpad dibujados con degradés, una sola capa) y
    el canto de adelante le da espesor; atrás de la tapa, el isotipo
  - Sin opacidad en los grupos 3D: el único fundido es el reflejo del vidrio (una hoja)
*/
import Image from "next/image";
import { useInView } from "motion/react";
import { useRef } from "react";
import { LogoMark } from "@/components/logo";
import "./projects.css";

export function Laptop3D({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div ref={ref} data-shown={shown} className="lp3d">
      <div className="lp3d-rig">
        <div className="lp3d-base" aria-hidden="true">
          <span className="lp3d-shadow" />
          <span className="lp3d-deck">
            <span className="lp3d-keys" />
            <span className="lp3d-pad" />
          </span>
          <span className="lp3d-lip" />
        </div>
        <div className="lp3d-lid">
          <div className="lp3d-back" aria-hidden="true">
            <LogoMark className="h-[18%] w-auto opacity-80" />
          </div>
          <div className="lp3d-screen">
            <div className="lp3d-display">
              <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-left-top" />
              <span aria-hidden="true" className="lp3d-glare" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
