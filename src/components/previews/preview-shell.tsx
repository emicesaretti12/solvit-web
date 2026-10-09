"use client";

import { useInView, useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";

/** true solo cuando la vista está en pantalla y no hay reduced motion: ahí corren los loops. */
export function useLive(ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  return inView && !reduce;
}

/*
  Marco común de las vistas vivas: interfaces reales en miniatura, con datos de ejemplo
  rotulados como tales (nunca capturas falsas armadas con divs).
*/
export function PreviewShell({
  title,
  status,
  children,
  className = "",
}: {
  title: string;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-navy-950/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="truncate text-[13px] font-medium text-ink">{title}</p>
        <div className="flex shrink-0 items-center gap-2">
          {status}
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint">
            Vista de ejemplo
          </span>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 p-4">{children}</div>
    </div>
  );
}

export function LiveBadge({ label = "En vivo" }: { label?: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-blue-300">
      <span className="live-dot relative size-1.5 rounded-full bg-blue-400 text-blue-400" />
      {label}
    </span>
  );
}
