"use client";

import { useEffect, useState } from "react";
import { NAV, type SectionId } from "@/content/nav";

/*
  Sección activa: la última cuyo borde superior ya pasó el 45 % de la pantalla.
  Las posiciones se miden una vez (y de nuevo cuando cambia el alto del documento o la ventana);
  durante el scroll solo se compara un número, sin medir nada: así no se fuerza un layout por
  cuadro. Solo re-renderiza cuando cambia la sección.
*/
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("inicio");
  useEffect(() => {
    let tops: { id: SectionId; top: number }[] = [];
    let frame = 0;
    let timer = 0;

    const read = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.45;
      let current: SectionId = "inicio";
      for (const t of tops) if (t.top <= line) current = t.id;
      setActive((prev) => (prev === current ? prev : current));
    };
    const measure = () => {
      const y = window.scrollY;
      tops = NAV.map(({ id }) => {
        const el = document.getElementById(id);
        // Una sección pegada (sticky) se mide por su contenedor: su propio borde se mueve
        const box = el && getComputedStyle(el).position === "sticky" ? el.parentElement : el;
        return { id, top: box ? box.getBoundingClientRect().top + y : Infinity };
      });
      read();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 150);
    };

    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return active;
}
