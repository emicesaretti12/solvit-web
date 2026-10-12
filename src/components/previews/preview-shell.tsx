"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useInView, useReducedMotion } from "motion/react";
import { createContext, useContext, useState, type ReactNode, type RefObject } from "react";
import { tap } from "@/lib/haptics";

/*
  true cuando la vista quedó tapada por otra tarjeta del apilado: los loops se detienen igual
  que fuera de pantalla (IntersectionObserver no sabe que hay otra tarjeta encima).
*/
export const PreviewSuspendContext = createContext(false);

/**
 * Estado de los loops de una vista viva. `running` es true solo con la vista en pantalla,
 * sin reduced motion, sin otra tarjeta encima y sin pausa manual (WCAG 2.2.2).
 */
export function usePreviewLoop(ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const suspended = useContext(PreviewSuspendContext);
  const [paused, setPaused] = useState(false);
  return { running: inView && !reduce && !suspended && !paused, paused, setPaused };
}

/*
  Marco común de las vistas vivas: interfaces reales en miniatura, con datos de ejemplo
  rotulados como tales (nunca capturas falsas armadas con divs).
  En celulares el contenido va más compacto (max-lg); la cabecera con la pausa siempre queda a
  la vista. Cada vista tiene el alto trabado (sus listas y su chat no crecen ni se achican en el
  loop): nada de lo que está debajo salta. Los controles responden al apoyar el dedo (escala y
  un golpe háptico donde hay vibración).
*/
export function PreviewShell({
  title,
  subtitle,
  status,
  paused,
  onTogglePause,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  status?: ReactNode;
  /** Con onTogglePause, muestra el botón para pausar o reanudar la vista. */
  paused?: boolean;
  onTogglePause?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-line bg-navy-950/70 shadow-[inset_0_1px_0_rgb(var(--fg-rgb)/0.04)] light:bg-navy-900 light:shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-line py-1.5 pl-4 pr-1.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 py-1">
          <div className="min-w-0 flex-[1_1_11rem]">
            <p className="text-[13px] font-medium leading-snug text-ink">{title}</p>
            {subtitle && <p className="text-[11.5px] leading-snug text-ink-muted">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {status}
            <span className="text-[10.5px] text-ink-faint">Ejemplo</span>
          </div>
        </div>
        {onTogglePause && (
          <button
            type="button"
            onClick={() => {
              tap();
              onTogglePause();
            }}
            aria-label={paused ? "Reanudar la vista de ejemplo" : "Pausar la vista de ejemplo"}
            title={paused ? "Reanudar" : "Pausar"}
            className="group/pause flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none motion-reduce:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-line-strong bg-navy-850 text-ink-muted transition-[color,border-color,scale] duration-150 ease-[var(--ease-out)] group-hover/pause:border-blue-400/60 group-hover/pause:text-ink group-focus-visible/pause:outline-2 group-focus-visible/pause:outline-offset-2 group-focus-visible/pause:outline-blue-400 group-active/pause:scale-[0.9]">
              {paused ? (
                <Play size={12} weight="fill" aria-hidden="true" />
              ) : (
                <Pause size={12} weight="fill" aria-hidden="true" />
              )}
            </span>
          </button>
        )}
      </div>
      <div className="relative min-h-0 flex-1 p-4 max-lg:p-3">{children}</div>
    </div>
  );
}

/* Lugar de una vista mientras carga, o si no puede cargar: reaviz falla con algunos idiomas del
   navegador y, sin el SafeBoundary de cada vista, eso desmontaría la página entera */
export function PreviewPlaceholder() {
  return <div className="h-[300px] rounded-[1.25rem] border border-line bg-navy-900/50 light:bg-navy-800/60" />;
}

export function LiveBadge({ label = "En vivo", paused = false }: { label?: string; paused?: boolean }) {
  return (
    <span className={`text-[11px] ${paused ? "text-ink-muted" : "text-blue-300"}`}>{paused ? "En pausa" : label}</span>
  );
}
