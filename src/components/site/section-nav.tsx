"use client";

/*
  Puntos de sección (escritorio): una pastilla translúcida al costado derecho, con un punto por
  sección (el de la activa, lleno). Cerrada ocupa solo el margen de la página; al pasar el mouse
  o al recorrerla con el teclado se abre y muestra los nombres. Aparece al dejar el hero.
*/
import { useEffect, useState } from "react";
import { NAV } from "@/content/nav";
import { useActiveSection } from "./use-active-section";

export function SectionNav() {
  const active = useActiveSection();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Secciones de la página"
      className={`fixed right-[1.4vw] top-1/2 z-40 hidden -translate-y-1/2 group/nav rounded-[2.2rem] border border-white/70 bg-white/60 px-3 py-4 shadow-[0_10px_40px_-18px_rgb(var(--shade-rgb)/0.35)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] xl:block ${shown ? "opacity-100" : "pointer-events-none translate-x-6 opacity-0"}`}
    >
      <ul className="flex flex-col">
        {NAV.map((item) => {
          const on = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                tabIndex={shown ? 0 : -1}
                className={`group flex items-center py-[7px] text-[10.5px] uppercase tracking-[0.24em] transition-colors duration-300 ${on ? "text-ink" : "text-ink-faint hover:text-ink"}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-[11px] rounded-full transition-[background-color,transform] duration-300 ease-out ${on ? "scale-100 bg-ink" : "scale-[0.82] bg-ink/25 group-hover:bg-ink/60"}`}
                />
                <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[var(--ease-expo)] group-hover/nav:grid-cols-[1fr] group-focus-within/nav:grid-cols-[1fr]">
                  <span className="overflow-hidden whitespace-nowrap pl-0 opacity-0 transition-[opacity,padding] duration-300 group-hover/nav:pl-2.5 group-hover/nav:pr-1.5 group-hover/nav:opacity-100 group-focus-within/nav:pl-2.5 group-focus-within/nav:pr-1.5 group-focus-within/nav:opacity-100">
                    {item.label}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
