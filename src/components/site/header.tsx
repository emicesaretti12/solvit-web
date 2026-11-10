"use client";

/*
  Encabezado fijo: el logo a la izquierda y dos pastillas a la derecha ("Hablemos" y "Menú").
  El menú se abre como tres tarjetas apiladas debajo de los botones (secciones, correo y
  WhatsApp), en cascada; la página queda detrás de un velo y se cierra con Escape, con un
  toque afuera o al elegir una sección. En celulares queda solo el botón redondo del menú.
*/
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { CONTACT } from "@/content/contact-info";
import { NAV } from "@/content/nav";
import { tap } from "@/lib/haptics";
import { LeadForm } from "./lead-form";
import { Magnetic } from "./magnetic";
import { useActiveSection } from "./use-active-section";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  // Pasado el primer tramo, el logo se apoya en una pastilla esmerilada: se lee sobre cualquier fondo
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const card = (i: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : {
          initial: { opacity: 0, y: -18, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE, delay: i * 0.05 } },
          exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.16, delay: (2 - i) * 0.025 } },
        };

  return (
    <>
      {/* Velo: oscurece la página hacia el lado del menú y cierra al tocarlo */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="veil"
            aria-hidden="true"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[51] bg-[linear-gradient(to_left,rgb(10_16_32/0.5),rgb(10_16_32/0.22)_32%,transparent_62%)] max-md:bg-night/35"
          />
        )}
      </AnimatePresence>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[52] px-5 py-4 md:px-[2.6vw] md:py-5">
        <div className="relative flex items-center justify-between">
          <a
            href="#inicio"
            aria-label="SEN Software, ir al inicio"
            className={`drop-in pointer-events-auto -ml-3.5 flex h-[46px] items-center rounded-full px-3.5 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out ${scrolled ? "bg-white/75 shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.1)] backdrop-blur-md" : ""}`}
          >
            <Logo />
          </a>

          <div className="drop-in pointer-events-auto flex items-center gap-2.5 [--d:120ms]">
            <Magnetic className="max-md:hidden">
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="pill hidden h-[52px] items-center gap-3 rounded-full bg-ink px-7 text-[15px] font-medium uppercase tracking-[0.01em] text-white md:inline-flex"
              >
                <span className="roll">
                  <span>Hablemos</span>
                  <span aria-hidden="true">Hablemos</span>
                </span>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                ref={toggle}
                type="button"
                aria-expanded={open}
                aria-controls="menu-principal"
                onClick={() => {
                  tap();
                  setOpen((v) => !v);
                }}
                className={`roll-host group flex h-[46px] items-center gap-6 rounded-full text-[14px] uppercase text-ink shadow-[0_1px_0_rgb(255_255_255/0.7)_inset,0_1px_2px_rgb(var(--shade-rgb)/0.08)] transition-[background-color,transform] duration-200 ease-out active:scale-[0.97] max-md:w-[46px] max-md:justify-center md:pl-8 md:pr-5 ${open ? "bg-white" : "bg-pill hover:bg-white"}`}
              >
                <span className="relative hidden h-5 overflow-hidden md:block">
                  <span
                    className="flex flex-col transition-transform duration-300 ease-[var(--ease-expo)]"
                    style={{ transform: open ? "translateY(-50%)" : "none" }}
                  >
                    <span className="h-5 leading-5">Menú</span>
                    <span className="h-5 leading-5">Cerrar</span>
                  </span>
                </span>
                <span className="sr-only md:hidden">{open ? "Cerrar menú" : "Abrir menú"}</span>
                <span
                  aria-hidden="true"
                  className="flex gap-[5px] transition-transform duration-300 ease-[var(--ease-expo)]"
                  style={{ transform: open ? "rotate(90deg)" : "none" }}
                >
                  <span className="size-[5px] rounded-full bg-ink" />
                  <span className="size-[5px] rounded-full bg-ink" />
                </span>
              </button>
            </Magnetic>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                key="menu"
                id="menu-principal"
                aria-label="Secciones"
                data-lenis-prevent
                className="pointer-events-auto absolute right-0 top-[calc(100%+10px)] flex max-h-[calc(100svh-96px)] w-[min(calc(100vw-40px),320px)] origin-top-right flex-col gap-2.5 overflow-y-auto overscroll-contain"
              >
                <motion.ul
                  {...card(0)}
                  className="origin-top-right rounded-2xl bg-white p-3 shadow-[0_24px_60px_-24px_rgb(var(--shade-rgb)/0.45)]"
                >
                  {NAV.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={active === item.id ? "true" : undefined}
                        className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[26px] uppercase leading-tight tracking-[-0.02em] text-ink transition-colors duration-200 hover:bg-mist"
                      >
                        <span className="transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1.5">
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`size-2 rounded-full bg-blue-500 transition-transform duration-300 ease-out ${active === item.id ? "scale-100" : "scale-0"}`}
                        />
                      </a>
                    </li>
                  ))}
                </motion.ul>
                <motion.div
                  {...card(1)}
                  className="origin-top-right rounded-2xl bg-white p-7 pb-4 shadow-[0_24px_60px_-24px_rgb(var(--shade-rgb)/0.45)]"
                >
                  <p className="mb-6 text-[34px] leading-[1.02] tracking-[-0.03em] text-ink">Dejanos tu correo</p>
                  <LeadForm compact origin="menu" />
                </motion.div>
                <motion.a
                  {...card(2)}
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex origin-top-right items-center justify-between rounded-2xl bg-night px-7 py-6 text-white shadow-[0_24px_60px_-24px_rgb(var(--shade-rgb)/0.6)]"
                >
                  <span className="text-[17px]">
                    <span className="font-bold">Escribinos</span> por WhatsApp
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="transition-transform duration-300 ease-[var(--ease-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </motion.a>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
