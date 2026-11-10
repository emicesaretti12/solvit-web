"use client";

/*
  Observadores de la página, en un solo lugar (no dibuja nada):

  - Entradas: todo lo que lleva data-reveal (titulares letra por letra, bloques que suben,
    portadas que se abren) recibe data-in="true" la primera vez que entra en pantalla; el CSS
    hace la transición (globals.css). Sin JavaScript se ve todo desde el principio
  - Pausa: las secciones llevan data-offscreen mientras están lejos de la pantalla y sus loops
    de CSS (marquesinas, giros) se detienen
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
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      reveal.disconnect();
      pause.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
