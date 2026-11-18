"use client";

/*
  Observadores de la página, en un solo lugar (no dibuja nada):

  - Entradas: todo lo que lleva data-reveal (titulares letra por letra, bloques que suben,
    portadas que se abren) recibe data-in="true" la primera vez que entra en pantalla; el CSS
    hace la transición (globals.css). Sin JavaScript se ve todo desde el principio
  - Pausa: las secciones llevan data-offscreen mientras están lejos de la pantalla y sus loops
    de CSS (marquesinas, giros) se detienen
  - Marquesinas con inercia: aceleran con la velocidad del scroll y vuelven solas a su paso
    (se cambia el playbackRate de la animación de CSS: sigue corriendo en el compositor)
*/
import { useEffect } from "react";

export function PageObservers() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-in", "true"));
      return;
    }
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "true");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    const pause = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      },
      { rootMargin: "25% 0px" },
    );
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => reveal.observe(el));
      document.querySelectorAll("main section[id], footer").forEach((el) => pause.observe(el));
    };
    scan();
    // Lo que se monta después (por ejemplo, al ver todos los proyectos) también se observa
    // (agrupado: muchas piezas cambian el DOM seguido y no hace falta mirar en cada cambio)
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = window.setTimeout(() => {
        pending = 0;
        scan();
      }, 250);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Marquesinas con inercia
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let speed = 0;
    let rate = 1;
    let applied = 1;
    let frame = 0;
    let marquees: Animation[] = [];
    let listedAt = 0;
    const list = (now: number) => {
      if (now - listedAt < 1500) return;
      listedAt = now;
      marquees = document.getAnimations().filter((a) => (a as CSSAnimation).animationName?.startsWith("marquee"));
    };
    const tick = (now: number) => {
      speed *= 0.9;
      const target = 1 + Math.min(3.5, speed * 1.4);
      rate += (target - rate) * 0.12;
      list(now);
      // En escalones de un cuarto: cambiar la velocidad reinicia la animación en el compositor,
      // así que se toca pocas veces por gesto y no en cada cuadro
      const stepped = Math.round(rate * 4) / 4;
      if (stepped !== applied) {
        applied = stepped;
        for (const a of marquees) a.playbackRate = stepped;
      }
      if (Math.abs(rate - 1) > 0.01 || speed > 0.01) frame = requestAnimationFrame(tick);
      else {
        for (const a of marquees) a.playbackRate = 1;
        rate = 1;
        applied = 1;
        frame = 0;
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      // px por milisegundo, suavizado
      speed = Math.max(speed, Math.abs(window.scrollY - lastY) / dt);
      lastY = window.scrollY;
      lastT = now;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      reveal.disconnect();
      pause.disconnect();
      mo.disconnect();
      window.clearTimeout(pending);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
