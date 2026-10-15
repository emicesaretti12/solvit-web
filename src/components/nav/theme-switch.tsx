"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { tap } from "@/lib/haptics";
import { setTheme, useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/*
  Selector de tema segmentado (Claro | Oscuro), como el de los ajustes de iOS: para el menú de
  celulares, donde hay lugar para decir qué hace cada opción. La pastilla clara se desliza a la
  opción elegida (transform, ease-in-out porque se mueve dentro de la pantalla) y el tema nuevo
  se revela con el círculo que nace en el botón tocado (setTheme). Durante ese cambio la página
  nueva aparece quieta (native.css), así que el círculo ya la muestra en su lugar.
  Se monta recién con el menú abierto: el tema que lee ya es el del cliente.
*/
const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Claro", Icon: Sun },
  { value: "dark", label: "Oscuro", Icon: Moon },
];

export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useTheme();

  const choose = (value: Theme) => (event: MouseEvent<HTMLButtonElement>) => {
    if (value === theme) return;
    tap();
    const box = event.currentTarget.getBoundingClientRect();
    setTheme(value, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  };

  return (
    <div role="group" aria-label="Tema" className={cn("relative grid grid-cols-2 rounded-full bg-fg/[0.06] p-1", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-navy-700 shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.12),0_4px_12px_-4px_rgb(var(--shade-rgb)/0.3)] transition-[translate] duration-300 ease-[var(--ease-in-out)] light:bg-navy-850 motion-reduce:transition-none",
          theme === "dark" && "translate-x-full",
        )}
      />
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={choose(value)}
            className={cn(
              "relative flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium transition-[color,scale] duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
              active ? "text-ink" : "text-ink-muted pointer-fine:hover:text-ink",
            )}
          >
            <Icon size={17} weight={active ? "fill" : "regular"} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
