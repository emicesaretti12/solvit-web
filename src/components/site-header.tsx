"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { PrimaryCta } from "./cta";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#sectores", label: "Sectores" },
  { href: "#nosotros", label: "Nosotros" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:pt-5">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-line bg-navy-900/70 pl-5 pr-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-xl"
      >
        <a href="#hero" aria-label="Solvit, inicio" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
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
            className="fixed inset-0 -z-10 flex flex-col bg-navy-950/90 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-4xl font-medium tracking-tight text-ink"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto" onClick={() => setOpen(false)}>
              <PrimaryCta />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
