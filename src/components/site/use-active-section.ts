"use client";

import { useEffect, useState } from "react";
import { NAV, type SectionId } from "@/content/nav";

/*
  Sección activa: la última cuyo borde superior ya pasó el 45 % de la pantalla. Se calcula con
  las posiciones medidas (no con un observador por sección) para que siempre haya exactamente
  una activa, y solo re-renderiza cuando cambia.
*/
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("inicio");
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current: SectionId = "inicio";
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}
