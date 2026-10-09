"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { PrimaryCta } from "./cta";
import { getLenis } from "./smooth-scroll";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#flujo", label: "Flujo de valor" },
  { href: "#sectores", label: "Sectores" },
  { href: "#nosotros", label: "Nosotros" },
];

/*
  Sección activa: la que cruza una franja fina a media pantalla. Las secciones sin enlace
  (portal, plataforma, casos, contacto) dejan el menú sin marcar.
*/
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const targets = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(`#${entry.target.id}`);
          else inBand.delete(`#${entry.target.id}`);
        }
        setActive(links.find((l) => inBand.has(l.href))?.href ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return active;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const active = useActiveSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Con el menú abierto, la página de fondo no se desplaza (ni con Lenis ni nativo)
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Lenis ignora el ancla si sigue detenido: se reactiva antes de que procese el clic
  const closeForAnchor = () => {
    getLenis()?.start();
    document.documentElement.style.overflow = "";
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-5">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-line bg-navy-900/70 pl-5 pr-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-xl"
      >
        <a href="#hero" aria-label="SEN Software, inicio" onClick={closeForAnchor}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-150 ${
                    isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={reduce ? undefined : "nav-active"}
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <PrimaryCta />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative flex size-10 items-center justify-center rounded-full bg-white/5 active:scale-[0.97] lg:hidden"
        >
          <span
            className={`absolute h-px w-4 bg-ink transition-transform duration-300 ease-[var(--ease-out)] ${open ? "rotate-45" : "-translate-y-[3px]"}`}
          />
          <span
            className={`absolute h-px w-4 bg-ink transition-transform duration-300 ease-[var(--ease-out)] ${open ? "-rotate-45" : "translate-y-[3px]"}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            data-lenis-prevent
            className="fixed inset-0 -z-10 flex flex-col overflow-y-auto overscroll-contain bg-navy-950/95 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 backdrop-blur-2xl lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ duration: 0.45, delay: 0.05 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={closeForAnchor}
                    aria-current={active === l.href ? "true" : undefined}
                    className="font-display block py-2 text-4xl font-semibold tracking-[-0.03em] text-ink aria-[current=true]:text-blue-300"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto pt-10" onClick={closeForAnchor}>
              <PrimaryCta />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
