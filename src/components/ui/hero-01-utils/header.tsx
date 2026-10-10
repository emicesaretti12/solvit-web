"use client";

/*
  Header del hero-01 (Agency Hero Section de ShadcnSpace en 21st.dev), recreado para SEN a partir
  de la API del componente original (los archivos de hero-01-utils no vinieron con el pedido):
  - pill flotante fijo con el logo, NavigationMenu de Radix en escritorio y sección activa
  - menú móvil en un Sheet (Radix Dialog: foco atrapado, Escape, devuelve el foco)
  - selector de tema y CTA principal
  - Lenis: se frena con el menú abierto y se reactiva antes de seguir un ancla
*/
import { List } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "@/components/logo";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLenis } from "@/components/smooth-scroll";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface NavigationSection {
  title: string;
  href: string;
  isActive?: boolean;
}

/*
  Sección activa: la que cruza una franja fina a media pantalla. Si ninguna de las enlazadas la
  cruza (portal, plataforma, contacto...), el menú queda sin marcar.
*/
function useActiveSection(items: NavigationSection[]) {
  const [active, setActive] = useState<string | null>(() => items.find((i) => i.isActive)?.href ?? null);
  useEffect(() => {
    const targets = items
      .map((i) => document.querySelector<HTMLElement>(i.href))
      .filter((el): el is HTMLElement => el !== null);
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(`#${entry.target.id}`);
          else inBand.delete(`#${entry.target.id}`);
        }
        setActive(items.find((i) => inBand.has(i.href))?.href ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);
  return active;
}

export default function Header({ navigationData }: { navigationData: NavigationSection[] }) {
  const reduce = useReducedMotion();
  const active = useActiveSection(navigationData);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Con scroll, el pill gana opacidad y sombra (solo cambia al cruzar el umbral)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El scroll de fondo se frena con el menú abierto (Radix bloquea el nativo; Lenis va aparte)
  const onOpenChange = (next: boolean) => {
    if (next) getLenis()?.stop();
    else getLenis()?.start();
    setOpen(next);
  };

  // Lenis ignora el ancla si sigue detenido: se reactiva antes de que procese el clic
  const followAnchor = () => getLenis()?.start();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-5">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-line pl-5 pr-2 backdrop-blur-xl transition-[background-color,box-shadow] duration-300",
          scrolled
            ? "bg-navy-900/85 shadow-[0_10px_30px_-18px_rgb(var(--shade-rgb)/0.6)]"
            : "bg-navy-900/60 shadow-[inset_0_1px_0_rgb(var(--fg-rgb)/0.05)]",
        )}
      >
        <a href="#hero" aria-label="SEN Software, inicio" onClick={followAnchor} className="shrink-0">
          <Logo />
        </a>

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            {navigationData.map((item) => {
              const isActive = active === item.href;
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <a
                      href={item.href}
                      onClick={followAnchor}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-150 hover:bg-transparent focus:bg-transparent xl:px-4",
                        isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={reduce ? undefined : "nav-active"}
                          className="absolute inset-0 rounded-full bg-fg/[0.07]"
                          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        />
                      )}
                      <span className="relative">{item.title}</span>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="hidden lg:block">
            <PrimaryCta />
          </div>
          <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú"
                className="flex size-11 items-center justify-center rounded-full bg-fg/5 text-ink transition-transform duration-150 active:scale-[0.96] lg:hidden"
              >
                <List size={20} aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88%] max-w-sm gap-0 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]"
            >
              <SheetTitle className="sr-only">Menú</SheetTitle>
              <SheetDescription className="sr-only">Secciones de la página de SEN Software</SheetDescription>
              <div className="flex h-11 items-center pr-12">
                <LogoMark className="h-7 w-auto" />
              </div>
              <nav aria-label="Menú" className="mt-8 flex-1 overflow-y-auto">
                <ul className="flex flex-col">
                  {navigationData.map((item, i) => {
                    const isActive = active === item.href;
                    return (
                      <motion.li
                        key={item.href}
                        initial={reduce ? false : { opacity: 0, transform: "translateX(16px)" }}
                        animate={{ opacity: 1, transform: "translateX(0px)" }}
                        transition={{ duration: 0.4, delay: 0.06 + i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <SheetClose asChild>
                          <a
                            href={item.href}
                            onClick={followAnchor}
                            aria-current={isActive ? "true" : undefined}
                            className={cn(
                              "font-display flex min-h-12 items-center justify-between border-b border-line py-2 text-[1.6rem] font-semibold tracking-[-0.03em] transition-colors duration-150",
                              isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                            )}
                          >
                            {item.title}
                            {isActive && <span className="size-1.5 rounded-full bg-blue-400" aria-hidden="true" />}
                          </a>
                        </SheetClose>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
              <div className="mt-8 flex flex-col gap-5">
                <SheetClose asChild>
                  <PrimaryCta label={CONTACT_LABEL} onClick={followAnchor} className="justify-between" />
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
