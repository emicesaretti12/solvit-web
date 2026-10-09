import type { ComponentProps } from "react";
import { ArrowUpRight, ArrowDown } from "@phosphor-icons/react/dist/ssr";

export const CONTACT_LABEL = "Agendar diagnóstico";

const base =
  "group inline-flex items-center gap-3 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97]";

export function PrimaryCta({
  href = "#contacto",
  label = CONTACT_LABEL,
  className = "",
  ...rest
}: {
  href?: string;
  label?: string;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  // Acepta props de <a> (onClick, ref) para poder usarse con Slot (asChild) en menús
  return (
    <a
      {...rest}
      href={href}
      className={`${base} bg-blue-500 py-1.5 pl-5 pr-1.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_30px_-10px_rgb(31_107_255/0.6)] hover:bg-blue-600 ${className}`}
    >
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-0.5">
        <ArrowUpRight size={16} weight="bold" />
      </span>
    </a>
  );
}

export function SecondaryCta({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${base} border border-line-strong py-1.5 pl-5 pr-1.5 text-ink hover:border-blue-400/60 ${className}`}
    >
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-fg/5 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5">
        <ArrowDown size={16} weight="bold" />
      </span>
    </a>
  );
}
