import type { ComponentProps } from "react";
import { ArrowUpRight, ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HapticLink } from "@/components/nav/haptic-link";
import { cn } from "@/lib/utils";

export const CONTACT_LABEL = "Pedí tu diagnóstico";

/*
  Botones-enlace del sitio (pill, 44px táctiles), con la respuesta de un control nativo:
  - presión: scale(0.97) en :active, 150ms con la ease-out fuerte (Tailwind escala con la
    propiedad scale, por eso es la que transiciona); se siente al apoyar el dedo, no al soltar
  - hover solo con mouse o trackpad (pointer-fine: hover y puntero fino): en touch el hover
    queda pegado después del toque. El empujoncito de la flecha, solo sin reduced motion
  - golpe háptico al tocarlos (HapticLink); sin selección ni menú de mantener presionado
  - className se combina con cn(): lo que pase quien lo usa pisa el estilo de base
*/
const base =
  "group inline-flex select-none items-center gap-3 whitespace-nowrap rounded-full text-sm font-medium [-webkit-touch-callout:none] transition-[scale,background-color,border-color,box-shadow] duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

export function PrimaryCta({
  href = "#contacto",
  label = CONTACT_LABEL,
  className,
  ...rest
}: {
  href?: string;
  label?: string;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  // Acepta props de <a> (onClick, ref) para poder usarse con Slot (asChild) en menús
  return (
    <HapticLink
      {...rest}
      href={href}
      className={cn(
        base,
        "bg-blue-500 py-1.5 pl-5 pr-1.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_30px_-12px_rgb(31_107_255/0.55)] active:bg-blue-600 pointer-fine:hover:bg-blue-600",
        className,
      )}
    >
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-white/15 transition-[translate] duration-200 ease-[var(--ease-out)] motion-safe:pointer-fine:group-hover:-translate-y-px motion-safe:pointer-fine:group-hover:translate-x-0.5">
        <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
      </span>
    </HapticLink>
  );
}

export function SecondaryCta({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <HapticLink
      href={href}
      className={cn(
        base,
        "border border-line-strong py-1.5 pl-5 pr-1.5 text-ink active:bg-fg/5 pointer-fine:hover:border-blue-400/60",
        className,
      )}
    >
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-fg/5 transition-[translate] duration-200 ease-[var(--ease-out)] motion-safe:pointer-fine:group-hover:translate-y-0.5">
        <ArrowDown size={16} weight="bold" aria-hidden="true" />
      </span>
    </HapticLink>
  );
}
