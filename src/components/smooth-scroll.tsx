"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Lenis activo (o null con reduced motion / antes de montar). */
export const getLenis = () => instance;

/*
  Scroll con inercia para las secciones animadas. Lenis mueve el scroll nativo de la ventana,
  así que position: sticky, el portal y los useScroll de Motion siguen funcionando.
  Con reduced motion no se monta: el scroll queda 100% nativo.
*/
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Las anclas (#servicios, #contacto) también se deslizan, compensando el header fijo
      anchors: { offset: -96 },
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
