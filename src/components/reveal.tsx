"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useRevealAttr } from "@/components/in-view";

/*
  Bloque que entra al llegar a la pantalla: sube y aparece, o con `depth` se para en 3D desde
  inclinado (el padre pone la perspectiva). Todo en CSS (globals.css, .reveal):
  - el observer compartido marca data-in y una transición de transform y opacidad hace la
    entrada en el compositor, sin JS por cuadro ni re-render
  - el HTML del servidor y el del cliente son el mismo (sin estilos en línea que dependan de la
    preferencia); sin JavaScript o con reduced motion se ve en su estado final
  - sd-rise / sd-3d: en celulares con animaciones ligadas al scroll, el bloque sube (o se para)
    al ritmo del dedo en lugar de la transición
*/
export function Reveal({
  children,
  delay = 0,
  depth = false,
  className,
  as: Comp = "div",
}: {
  children: ReactNode;
  delay?: number;
  /** Entra parándose en 3D desde inclinado (tarjetas grandes, principios, formulario) */
  depth?: boolean;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useRevealAttr(ref);
  const style = delay ? ({ "--rd": `${delay}s` } as CSSProperties) : undefined;
  const classes = `reveal sd-rise${depth ? " reveal-3d sd-3d" : ""}${className ? ` ${className}` : ""}`;
  return (
    // ref de tipo HTMLElement para cualquiera de las etiquetas posibles
    <Comp ref={ref as never} className={classes} style={style}>
      {children}
    </Comp>
  );
}
