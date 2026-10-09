/*
  Consulta de las secciones que se fijan con el scroll (servicios apilados, flujo de valor):
  pantalla ancha y alta, donde cada vista entra completa, y sin reduced motion.
  Es la misma que la variante `stack:` declarada en globals.css.
*/
export const STACK_QUERY =
  "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

// Versión compacta para celulares y tablets (variante `stack-sm:` de globals.css)
export const STACK_SM_QUERY =
  "(max-width: 1023.98px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

// Escritorio o celular (variante `pin:`): la consulta de media de CSS acepta la lista con coma
export const PIN_QUERY = `${STACK_QUERY}, ${STACK_SM_QUERY}`;

// Curvas del sistema (globals.css: --ease-out y --ease-in-out)
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
