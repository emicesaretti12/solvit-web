import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Input de shadcn/ui con los tokens de SEN: radio de 0.75rem, panel navy-800, borde line-strong
  y foco azul. Texto de 16px en todos los tamaños (iOS no hace zoom al enfocar) y alto de 48px
  para que el objetivo táctil sea cómodo.
*/
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border border-line-strong bg-navy-800 px-4 py-2 text-base text-ink placeholder:text-ink-faint",
        "transition-[border-color,box-shadow] duration-150 ease-out outline-none",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        "focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30",
        "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
