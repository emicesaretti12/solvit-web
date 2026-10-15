import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
  SEN: botones pill (regla de forma del sitio) con respuesta de control nativo.
  - presión: scale(0.97) en :active, 150ms con la ease-out fuerte. Tailwind escala con la
    propiedad scale (no transform), así que es la que transiciona
  - hover solo con mouse o trackpad (pointer-fine): en touch el hover queda pegado
  - sin selección de texto ni menú de mantener presionado (también con asChild sobre un <a>)
*/
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background [-webkit-touch-callout:none] transition-[color,background-color,border-color,scale] duration-150 ease-[var(--ease-out)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground active:bg-primary/90 pointer-fine:hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground active:bg-destructive/90 pointer-fine:hover:bg-destructive/90",
        outline:
          "border border-input bg-background active:bg-accent pointer-fine:hover:bg-accent pointer-fine:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground active:bg-secondary/80 pointer-fine:hover:bg-secondary/80",
        ghost: "active:bg-accent pointer-fine:hover:bg-accent pointer-fine:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 pointer-fine:hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
