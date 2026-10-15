"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Lenis activo (o null en pantallas táctiles, con reduced motion o antes de montar). */
export const getLenis = () => instance;

/*
  Scroll con inercia para la rueda del mouse y el trackpad. Lenis mueve el scroll nativo de la
  ventana, así que position: sticky, el portal y los useScroll de Motion siguen funcionando.

  - Solo con puntero fino y hover (mouse o trackpad). En pantallas táctiles el scroll queda
    100% nativo, con la inercia del teléfono: Lenis igual dejaba pasar el dedo, pero sus
    escuchas táctiles no pasivas hacían que cada toque esperara al hilo principal antes de
    scrollear. Ahí las anclas se deslizan con scroll-behavior (native.css).
  - Con reduced motion no se monta: el scroll es el nativo y las anclas saltan.
  - Zoom: Lenis ignora la rueda con Ctrl (el pellizco del trackpad), así que no la convierte
    en scroll; el bloqueo del zoom lo hace el script del layout (ZOOM_GUARD_SCRIPT).
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

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
