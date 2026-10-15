"use client";

import { useSyncExternalStore } from "react";

/*
  Tema claro/oscuro. El claro (versión clara del brand board) es el principal y el de partida;
  el oscuro es el navy medianoche de la marca. El script del layout fija data-theme en <html>
  antes de pintar a partir de localStorage, y estos helpers lo cambian y avisan a quien dependa
  del tema en JS (canvas, gráficos, toasts), que no pueden leer las variables de CSS por sí solos.

  El cambio se revela con una View Transition: un círculo que nace en el botón y se abre hasta
  cubrir la pantalla con el tema nuevo (clip-path sobre ::view-transition-new(root), en
  native.css). Sin soporte, sin punto de origen o con reduced motion, el cambio es directo.
*/
import { DEFAULT_THEME, THEME_COLOR, THEME_KEY, type Theme } from "./theme-config";

export type { Theme };

const read = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Tema actual; en el servidor siempre el claro (el valor por defecto del HTML). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  // Barra del navegador y de estado: siguen al tema elegido, no al del sistema
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el tema vale solo para esta visita
  }
}

// Cada cambio con transición lleva un número: si se toca de nuevo antes de que termine, la
// limpieza de la anterior no le borra el origen a la nueva
let switchId = 0;

/**
 * Cambia el tema. Con `origin` (el centro del botón, en px de la ventana) el tema nuevo se
 * revela con un círculo que crece desde ahí.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const canAnimate =
    origin &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canAnimate || read() === theme) {
    apply(theme);
    return;
  }

  // Radio hasta la esquina más lejana; abajo suma el alto de la barra del navegador que puede
  // estar escondida (la captura de la transición cubre el viewport más grande)
  const w = window.innerWidth;
  const h = window.innerHeight + 96;
  const r = Math.hypot(Math.max(origin.x, w - origin.x), Math.max(origin.y, h - origin.y));
  root.style.setProperty("--vt-x", `${origin.x}px`);
  root.style.setProperty("--vt-y", `${origin.y}px`);
  root.style.setProperty("--vt-r", `${Math.ceil(r)}px`);

  const id = ++switchId;
  const transition = document.startViewTransition(() => {
    // Activa las reglas de la transición y apaga las transiciones de color de la página nueva:
    // el círculo ya es el cambio, adentro el tema tiene que aparecer quieto. Va dentro del
    // callback para no tocar la captura del estado viejo
    root.setAttribute("data-theme-switch", "");
    apply(theme);
  });
  const done = () => {
    if (id !== switchId) return;
    root.removeAttribute("data-theme-switch");
    root.style.removeProperty("--vt-x");
    root.style.removeProperty("--vt-y");
    root.style.removeProperty("--vt-r");
  };
  // Si otra transición la interrumpe, ready se rechaza: el tema ya quedó aplicado igual
  transition.ready.catch(() => {});
  transition.finished.then(done, done);
}
