"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/*
  Cambio de tema: un solo botón, el ícono muestra el tema al que se pasa.
  Los íconos se cruzan con opacidad y un giro corto (transform, 200ms ease-out).
*/
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "light" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={next === "light" ? "Modo claro" : "Modo oscuro"}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-[color,border-color,transform] duration-150 hover:text-ink active:scale-[0.94]",
        className,
      )}
    >
      <Sun
        size={18}
        weight="regular"
        aria-hidden="true"
        className={cn(
          "absolute transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          next === "light" ? "rotate-0 opacity-100" : "-rotate-90 scale-75 opacity-0",
        )}
      />
      <Moon
        size={18}
        weight="regular"
        aria-hidden="true"
        className={cn(
          "absolute transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          next === "dark" ? "rotate-0 opacity-100" : "rotate-90 scale-75 opacity-0",
        )}
      />
    </button>
  );
}
