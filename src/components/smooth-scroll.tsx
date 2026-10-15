"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Lenis activo (o null en pantallas táctiles, con reduced motion o antes de montar). */
export const getLenis = () => instance;

/*
  Scroll con inercia para la rueda del mouse. Lenis mueve el scroll nativo de la ventana,
  así que position: sticky y los useScroll de Motion siguen funcionando.
  Solo con mouse o trackpad: en pantallas táctiles el scroll ya tiene la inercia del sistema y
  Lenis solo sumaría trabajo en cada cuadro, así que ni se descarga. Con reduced motion
  tampoco se monta: el scroll queda 100% nativo.
*/
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};
    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      const lenis = new LenisClass({
        lerp: 0.1,
        smoothWheel: true,
        // Las anclas (#servicios, #contacto) también se deslizan; Lenis ya descuenta el
        // scroll-padding-top del html (el alto del header fijo), así que no lleva offset propio
        anchors: true,
      });
      instance = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        instance = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
