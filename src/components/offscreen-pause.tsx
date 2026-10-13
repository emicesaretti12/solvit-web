"use client";

/*
  Pausa los loops de tiempo (CSS) de las secciones que no están a la vista: cada sección y el
  pie llevan data-offscreen mientras están lejos de la pantalla y globals.css pausa sus
  animaciones infinitas (el piso y la S de los pasos, el brillo del recorrido, la marquesina de
  clientes, los puntos "en vivo"). Las animaciones ligadas al scroll no hace falta pausarlas:
  no gastan si no se scrollea; los objetos de los servicios y las vistas vivas ya se pausan
  solos. No dibuja nada.
*/
import { useEffect } from "react";

export function OffscreenPause() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      },
      // Un margen de un cuarto de pantalla: el loop ya corre cuando la sección asoma
      { rootMargin: "25% 0px" },
    );
    // Las secciones y el pie, y además las piezas largas que tienen loops adentro (cada tarjeta
    // de los pasos y la fila de la marquesina): así se pausa lo que no se ve aunque su sección
    // esté a la vista
    const targets = new Set<Element>(document.querySelectorAll("main section[id], footer, .step-card"));
    document.querySelectorAll(".animate-marquee, .animate-marquee-reverse").forEach((row) => {
      if (row.parentElement) targets.add(row.parentElement);
    });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
