"use client";

/*
  Botón flotante de contacto: el isotipo en un círculo blanco con la palabra "contacto" girando
  alrededor. Lleva a WhatsApp. Se esconde al llegar al cierre de la página (ahí el contacto ya
  ocupa toda la pantalla).
*/
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { CONTACT } from "@/content/contact-info";
import { Magnetic } from "./magnetic";

export function ContactBadge() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contacto");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className={`drop-in group fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-[92px] place-items-center transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] [--d:600ms] md:bottom-7 md:right-[2.4vw] md:size-[108px] ${hidden ? "pointer-events-none scale-75 opacity-0" : ""}`}
    >
      {/* Gira el contenedor, no el SVG: rotar texto sobre un trazo dentro del SVG obliga a
          recalcular su layout en cada cuadro; así es una capa que gira en el compositor */}
      <span aria-hidden="true" className={`absolute inset-0 animate-spin-slow ${hidden ? "[animation-play-state:paused]" : ""}`}>
        <svg viewBox="0 0 100 100" className="size-full">
          <defs>
            <path id="badge-circle" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
          </defs>
          <text className="fill-ink text-[9.5px] font-medium lowercase" letterSpacing="2.6">
            <textPath href="#badge-circle">contacto • contacto • contacto •</textPath>
          </text>
        </svg>
      </span>
      <Magnetic strength={0.35} className="size-[62%]">
        <span className="grid size-full place-items-center rounded-full bg-white shadow-[0_8px_28px_-10px_rgb(var(--shade-rgb)/0.55),0_0_0_1px_rgb(var(--fg-rgb)/0.05)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110 group-active:scale-95">
          <LogoMark className="h-[52%] w-auto" />
        </span>
      </Magnetic>
    </a>
  );
}
