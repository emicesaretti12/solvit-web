"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { tap } from "@/lib/haptics";
import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/*
  Cambio de tema: un solo botón, el ícono muestra el tema al que se pasa (luna en el claro,
  sol en el oscuro). Al tocarlo, el tema nuevo se revela con un círculo que crece desde el
  centro del botón (View Transition, ver setTheme y native.css); presión con scale(0.94) y un
  golpe háptico corto donde el teléfono lo permite.
  Qué ícono se ve lo decide el CSS (variante light:), no el estado de React: así sale bien
  desde el primer cuadro aunque el HTML del servidor siempre llegue en claro. Sin transición
  de página, los íconos se cruzan con opacidad y un giro corto (transform, 200ms ease-out).
*/
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    tap();
    const box = event.currentTarget.getBoundingClientRect();
    setTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={next === "light" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={next === "light" ? "Modo claro" : "Modo oscuro"}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-[color,border-color,transform] duration-150 ease-[var(--ease-out)] hover:text-ink active:scale-[0.94]",
        className,
      )}
    >
      <Sun
        size={18}
        weight="regular"
        aria-hidden="true"
        className="absolute rotate-0 opacity-100 transition-[opacity,transform] duration-200 ease-[var(--ease-out)] light:-rotate-90 light:scale-75 light:opacity-0"
      />
      <Moon
        size={18}
        weight="regular"
        aria-hidden="true"
        className="absolute rotate-90 scale-75 opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out)] light:rotate-0 light:scale-100 light:opacity-100"
      />
    </button>
  );
}
