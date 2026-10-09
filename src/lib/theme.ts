"use client";

import { useSyncExternalStore } from "react";

/*
  Tema claro/oscuro. El oscuro es el de marca (por defecto); el claro sigue la versión clara
  del brand board. El script del layout fija data-theme en <html> antes de pintar a partir de
  localStorage, y estos helpers lo cambian y avisan a quien dependa del tema en JS
  (canvas, gráficos), que no pueden leer las variables de CSS por sí solos.
*/
import { THEME_COLOR, THEME_KEY, type Theme } from "./theme-config";

export type { Theme };

const read = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Tema actual; en el servidor siempre "dark" (el valor por defecto del HTML). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el tema vale solo para esta visita
  }
}
