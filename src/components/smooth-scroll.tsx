"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/** Lenis activo (o null en pantallas táctiles, con reduced motion o antes de montar). */
export const getLenis = () => instance;

/*
  Scroll con inercia para la rueda del mouse y el trackpad. Lenis mueve el scroll nativo de la
  ventana, así que position: sticky y las animaciones ligadas al scroll siguen funcionando.

  - Solo con puntero fino y hover (mouse o trackpad). En pantallas táctiles el scroll queda
    100% nativo, con la inercia del teléfono. Ahí las anclas se deslizan con scroll-behavior
    (native.css).
  - Con reduced motion no se monta: el scroll es el nativo y las anclas saltan.
  - Corre con su propio requestAnimationFrame, que se detiene mientras la pestaña está oculta.
  - Zoom: Lenis ignora la rueda con Ctrl (el pellizco del trackpad); el bloqueo del zoom lo hace
    el script del layout (ZOOM_GUARD_SCRIPT).
*/
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      // Las anclas (#servicios, #contacto) también se deslizan; Lenis ya descuenta el
      // scroll-padding-top del html (el alto del header fijo), así que no lleva offset propio
      anchors: true,
    });
    instance = lenis;

    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
