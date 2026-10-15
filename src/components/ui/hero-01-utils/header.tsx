"use client";

/*
  Header del hero-01 (Agency Hero Section de ShadcnSpace en 21st.dev), recreado para SEN a partir
  de la API del componente original (los archivos de hero-01-utils no vinieron con el pedido),
  con la sensación de la barra de una app:
  - píldora flotante, fija y translúcida (material con desenfoque; sólida si el sistema pide
    menos transparencia) con el logo, NavigationMenu de Radix en escritorio y sección activa
  - progreso de lectura: una línea azul fina sobre el borde de abajo de la píldora, que se llena
    con scaleX ligada al scroll en CSS (sin soporte la mueve useScrollChrome)
  - en celulares se esconde al bajar rápido y vuelve apenas se sube (solo transform)
  - menú de celulares en una hoja inferior (Sheet side="bottom" sobre Radix Dialog: foco
    atrapado, Escape, devuelve el foco): sube con la curva de iOS, se cierra arrastrándola hacia
    abajo, los ítems entran escalonados y al pie están el cambio de tema y el contacto
  - golpe háptico al abrir el menú (y en el botón de contacto, ver cta.tsx)
  - Lenis: se frena con el menú abierto y se reactiva antes de seguir un ancla
*/
import { CaretRight, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { Logo, LogoMark } from "@/components/logo";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLenis } from "@/components/smooth-scroll";
import { ThemeSwitch } from "@/components/nav/theme-switch";
import { useScrollChrome } from "@/components/nav/use-scroll-chrome";
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
import { tap } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import "@/components/nav/native-nav.css";

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

// Dos trazos, como el menú de las apps de iOS (más liviano que tres)
function MenuGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
      <path d="M3.5 7.25h13M3.5 12.75h13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

// Controles redondos del header y de la hoja: presión con scale(0.97) y hover solo con mouse
const roundControl =
  "flex size-11 shrink-0 select-none items-center justify-center rounded-full transition-[scale,background-color,color] duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

export default function Header({ navigationData }: { navigationData: NavigationSection[] }) {
  const reduce = useReducedMotion();
  const active = useActiveSection(navigationData);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  useScrollChrome(headerRef, progressRef, open);

  // El scroll de fondo se frena con el menú abierto (Radix bloquea el nativo; Lenis va aparte)
  const onOpenChange = (next: boolean) => {
    if (next) {
      tap();
      getLenis()?.stop();
    } else {
      getLenis()?.start();
    }
    setOpen(next);
  };

  // Si la ventana se ensancha a escritorio (lg) con la hoja abierta, se cierra: el botón que la
  // abre ya no está. Por el mismo camino que el resto de los cierres, así Lenis vuelve a andar
  const closeSheet = useEffectEvent(() => onOpenChange(false));
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeSheet();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  // Lenis ignora el ancla si sigue detenido: se reactiva antes de que procese el clic
  const followAnchor = () => getLenis()?.start();

  return (
    <header
      ref={headerRef}
      className="nav-chrome group/nav fixed inset-x-0 top-0 z-40 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] md:pt-5"
    >
      <div
        className={cn(
          "nav-pill relative mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-line pl-5 pr-2 backdrop-blur-xl backdrop-saturate-150",
          "bg-navy-850/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[background-color,box-shadow] duration-300 ease-[var(--ease-out)]",
          // Con scroll gana opacidad y una sombra que la separa del contenido de abajo
          "group-data-[scrolled=true]/nav:bg-navy-850/85 group-data-[scrolled=true]/nav:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_32px_-18px_rgb(var(--shade-rgb)/0.55)]",
        )}
      >
        <a
          href="#hero"
          aria-label="SEN Software, inicio"
          onClick={followAnchor}
          className="shrink-0 select-none rounded-full transition-[scale] duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
        >
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
                        "relative block rounded-full px-3.5 py-2 text-sm transition-[color,scale] duration-150 ease-[var(--ease-out)] hover:bg-transparent focus:bg-transparent active:scale-[0.97] xl:px-4",
                        isActive ? "text-ink" : "text-ink-muted pointer-fine:hover:text-ink",
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
          {/* Mismo tamaño táctil (44px) que el botón del menú */}
          <ThemeToggle className="size-11" />
          <div className="hidden lg:block">
            <PrimaryCta />
          </div>
          <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú"
                className={cn(
                  roundControl,
                  "border border-line text-ink active:bg-fg/5 pointer-fine:hover:bg-fg/5 lg:hidden",
                )}
              >
                <MenuGlyph />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" showCloseButton={false}>
              <SheetTitle className="sr-only">Menú</SheetTitle>
              <SheetDescription className="sr-only">
                Secciones de la página de SEN Software, cambio de tema y contacto
              </SheetDescription>
              <div className="flex shrink-0 items-center justify-between pl-6 pr-3">
                <LogoMark className="h-7 w-auto" />
                <SheetClose
                  className={cn(
                    roundControl,
                    "text-ink-muted active:bg-fg/5 pointer-fine:hover:bg-fg/5 pointer-fine:hover:text-ink",
                  )}
                >
                  <X size={20} aria-hidden="true" />
                  <span className="sr-only">Cerrar menú</span>
                </SheetClose>
              </div>

              {/* Secciones: filas grandes, fáciles de acertar con el pulgar */}
              <nav aria-label="Secciones" data-sheet-scroll className="mt-1 min-h-0 flex-1 px-3">
                <ul className="flex flex-col">
                  {navigationData.map((item, i) => {
                    const isActive = active === item.href;
                    return (
                      <li key={item.href} className="sheet-item" style={{ "--i": i } as CSSProperties}>
                        <SheetClose asChild>
                          <a
                            href={item.href}
                            onClick={followAnchor}
                            aria-current={isActive ? "true" : undefined}
                            className={cn(
                              "font-display flex min-h-14 items-center justify-between gap-4 rounded-2xl px-3 text-[1.65rem] font-semibold tracking-[-0.03em]",
                              "transition-[scale,background-color,color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] active:bg-fg/[0.06]",
                              isActive ? "text-ink" : "text-ink-muted pointer-fine:hover:bg-fg/[0.04] pointer-fine:hover:text-ink",
                            )}
                          >
                            {item.title}
                            {isActive ? (
                              <span className="mr-1.5 size-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                            ) : (
                              <CaretRight size={18} weight="bold" aria-hidden="true" className="shrink-0 text-ink-faint" />
                            )}
                          </a>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div
                className="sheet-item mt-4 flex shrink-0 flex-col gap-3 px-5"
                style={{ "--i": navigationData.length } as CSSProperties}
              >
                <ThemeSwitch />
                <SheetClose asChild>
                  <PrimaryCta
                    label={CONTACT_LABEL}
                    onClick={followAnchor}
                    className="justify-between py-2.5 pl-6 text-base"
                  />
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Progreso de lectura (decorativo): scaleX de 0 a 1 con el scroll, ver native-nav.css */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="nav-progress pointer-events-none absolute inset-x-7 -bottom-px h-0.5 rounded-full bg-blue-500"
        />
      </div>
    </header>
  );
}
