import { useId } from "react";

/*
  Recreación vectorial del logo de Solvit a partir del brand board.
  Reemplazar por el SVG original cuando esté disponible.
*/
export function LogoMark({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 174 230"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a56f0" />
          <stop offset="1" stopColor="#3f8cff" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#123fb8" />
          <stop offset="1" stopColor="#1a56f0" />
        </linearGradient>
      </defs>
      <polygon points="2,57 172,117 172,172 2,117" fill={`url(#${id}-b)`} />
      <polygon points="139,0 139,57 2,117 2,57" fill={`url(#${id}-a)`} />
      <polygon points="172,117 172,172 32,230 32,173" fill={`url(#${id}-a)`} />
    </svg>
  );
}

export function Logo({
  className = "",
  withTagline = false,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-auto shrink-0" />
      <span className="flex flex-col">
        <span className="font-brand text-[1.05rem] leading-none tracking-[0.04em] text-ink">
          SOLVI
          <span className="relative inline-block">
            T
            <span
              aria-hidden="true"
              className="absolute left-[-0.06em] right-[-0.1em] top-[0.1em] h-[0.17em] -skew-x-[28deg] bg-blue-500"
            />
          </span>
        </span>
        {withTagline && (
          <span className="mt-1.5 text-[0.55rem] uppercase tracking-[0.28em] text-ink-muted">
            Ingeniería y Desarrollo de Software
          </span>
        )}
      </span>
      <span className="sr-only">Solvit</span>
    </span>
  );
}
