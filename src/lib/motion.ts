/*
  Consulta de las secciones que se fijan con el scroll (servicios apilados, flujo de valor):
  pantalla ancha y alta, donde cada vista entra completa, y sin reduced motion.
  Es la misma que la variante `stack:` declarada en globals.css.
*/
export const STACK_QUERY =
  "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

// Curvas del sistema (globals.css: --ease-out y --ease-in-out)
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
