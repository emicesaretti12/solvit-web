/*
  Respuesta háptica de los controles, como en una app nativa: un golpe corto de 8 ms al tocar.
  Solo donde existe navigator.vibrate (Android); en iOS y en escritorio no hace nada. Llamarla
  dentro del manejador del toque (onClick): el navegador ignora la vibración sin un gesto real
  del usuario.
*/
export function tap() {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(8);
  } catch {
    // Algunos navegadores bloquean la vibración en iframes o sin activación: se ignora
  }
}
