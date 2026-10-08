"use client";

/*
  Testimonials Columns 1 (21st.dev), adaptado a Solvit:
  - el tipo `Testimonial` se exporta (el original usaba `typeof testimonials`, que no existe en este archivo)
  - la imagen es opcional: sin foto se muestra un ícono o las iniciales
  - el desplazamiento es una animación CSS: corre fuera del hilo principal y se puede pausar
    (al pasar el mouse, con foco dentro, o con `paused`), como pide WCAG 2.2.2
  - con prefers-reduced-motion queda quieto
  - la copia duplicada que cierra el loop se oculta a lectores de pantalla
*/
import React from "react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  image?: string;
  /** Contenido alternativo al avatar cuando no hay foto (un ícono, por ejemplo). */
  avatar?: React.ReactNode;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  paused?: boolean;
}) => {
  return (
    <div
      className={cn("group/column", props.className)}
      data-paused={props.paused || undefined}
    >
      <div
        className="testimonials-track flex flex-col gap-6 bg-background pb-6"
        style={{ "--testimonials-duration": `${props.duration || 10}s` } as React.CSSProperties}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, avatar, name, role }, i) => (
                <figure
                  className="w-full max-w-xs rounded-3xl border bg-card p-8 shadow-lg shadow-primary/10 md:p-10"
                  key={i}
                  aria-hidden={index === 1 || undefined}
                >
                  <blockquote className="leading-relaxed text-card-foreground">{text}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- avatares chicos de origen externo
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-secondary text-sm font-medium text-blue-300"
                      >
                        {avatar ?? initials(name)}
                      </span>
                    )}
                    <span className="flex flex-col">
                      <span className="font-medium leading-5 tracking-tight">{name}</span>
                      <span className="leading-5 tracking-tight text-muted-foreground">{role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </React.Fragment>
          )),
        ]}
      </div>
    </div>
  );
};
