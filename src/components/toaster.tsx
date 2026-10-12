"use client";

import type { ComponentProps, CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/lib/theme";

/*
  El único <Toaster /> del sitio. Sigue el tema elegido (no el del sistema), con los colores,
  el radio y la tipografía de la marca (variables propias de Sonner). Abajo a la derecha en
  escritorio y a lo ancho en celulares, siempre por encima de la barra de inicio del teléfono
  (área segura: el viewport usa viewport-fit=cover).
*/
const brand = {
  "--normal-bg": "var(--navy-850)",
  "--normal-border": "var(--line-strong)",
  "--normal-text": "var(--ink)",
  "--border-radius": "1rem",
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
} as CSSProperties;

const safe = (side: "bottom" | "left" | "right", gap: number) =>
  `calc(${gap}px + env(safe-area-inset-${side}, 0px))`;

const offset = { bottom: safe("bottom", 24), right: safe("right", 24), left: safe("left", 24) };
const mobileOffset = { bottom: safe("bottom", 16), right: safe("right", 16), left: safe("left", 16) };

export function Toaster({ style, ...props }: ComponentProps<typeof Sonner>) {
  const theme = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      containerAriaLabel="Notificaciones"
      offset={offset}
      mobileOffset={mobileOffset}
      style={{ ...brand, ...style }}
      {...props}
    />
  );
}
