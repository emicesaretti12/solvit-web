/*
  El sitio es de un solo tema (claro, la versión clara del brand board). Queda este módulo
  mínimo porque la escena 3D del isotipo elige sus luces según el tema.
*/
import type { Theme } from "./theme-config";

export type { Theme };

export function useTheme(): Theme {
  return "light";
}
