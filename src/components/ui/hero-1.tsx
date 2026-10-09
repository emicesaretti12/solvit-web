"use client"

/*
  Hero 1 (21st.dev), adaptado a SEN:
  - ícono de Phosphor (familia única del sitio) en lugar de lucide-react
  - colores del brand board: fondo medianoche, el azul solo como borde de luz del horizonte
    (antes era un degradé azul saturado) y luces difusas grises como las del board
  - `isolate` para que la retícula con -z-10 quede sobre el fondo de la sección
  - el degradado inferior usa var(--background) (los tokens son hex, no HSL)
  - eyebrowHref, ctaHref y un enlace secundario opcional
  - `children`: pieza visual que sube desde el horizonte (el slot con perspectiva del original)
  - min-h-[100svh]: alto estable en celulares (sin saltos al ocultarse la barra del navegador)
*/
import type { ReactNode } from "react"
import { ArrowUpRight, CaretRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  eyebrowHref?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  children?: ReactNode
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  eyebrowHref = "#",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
  secondaryLabel,
  secondaryHref = "#",
  children,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative isolate mx-auto w-full overflow-hidden rounded-b-xl px-4 pt-32 text-center md:px-8 md:pt-36
      min-h-[100svh]
      bg-navy-900 bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgb(31_107_255/0.16),transparent_70%)]"
    >
      {/* Grid BG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-[600px] w-full opacity-70
        bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Luces difusas grises, como las del brand board */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 -z-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(220_226_240/0.07),transparent)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/3 -z-10 size-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(220_226_240/0.05),transparent)] blur-2xl"
      />

      {/* Radial Accent: horizonte con un borde fino de luz (azul que termina en blanco) */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(100%-90px)] -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-[100%] opacity-0
        md:h-[500px] md:w-[1100px] lg:top-[calc(100%-150px)] lg:h-[750px] lg:w-[140%]
        bg-navy-900 bg-[radial-gradient(closest-side,var(--navy-900)_88%,rgb(31_107_255/0.85)_97.5%,rgb(244_246_250/0.9))]
        animate-fade-up [animation-delay:200ms]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href={eyebrowHref} className="group inline-block">
          <span
            className="mx-auto flex w-fit items-center justify-center rounded-full border border-line-strong
            bg-white/[0.03] py-2 pl-5 pr-4 text-[10px] uppercase tracking-[0.18em] text-ink-muted sm:text-[11px] sm:tracking-[0.3em]
            transition-colors duration-150 group-hover:text-ink"
          >
            {eyebrow}
            <CaretRight
              aria-hidden="true"
              className="ml-2 inline h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1"
            />
          </span>
        </a>
      )}

      {/* Title */}
      <h1
        className="font-display mx-auto max-w-6xl -translate-y-4 animate-fade-in text-balance
        bg-gradient-to-br from-white from-30% to-white/60
        bg-clip-text py-6 text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.035em]
        text-transparent opacity-0 sm:text-5xl lg:text-[3.6rem] xl:text-[3.85rem]"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="mx-auto mb-12 max-w-[50ch] -translate-y-4 animate-fade-in text-balance
        text-lg text-ink-muted opacity-0 [animation-delay:120ms] md:text-xl"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="mt-[-20px] flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7">
          <Button
            asChild
            className="group z-20 h-auto gap-3 py-1.5 pl-6 pr-1.5 text-base font-medium tracking-tight
            shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_12px_32px_-14px_rgb(31_107_255/0.8)]
            opacity-0 animate-fade-in [animation-delay:240ms]"
          >
            <a href={ctaHref}>
              {ctaLabel}
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-0.5">
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
          </Button>
          {secondaryLabel && (
            <a
              href={secondaryHref}
              className="text-sm font-medium text-ink-muted underline-offset-[6px] opacity-0 animate-fade-in transition-colors duration-150 [animation-delay:300ms] hover:text-ink hover:underline"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      )}

      {/* Pieza visual que sube desde el horizonte */}
      {children && (
        <div className="relative z-10 mt-14 md:mt-16">{children}</div>
      )}

      {/* Bottom Fade */}
      <div
        aria-hidden="true"
        className="relative mt-16 opacity-0 animate-fade-up [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,var(--background)_10%,transparent)]"
      />
    </section>
  )
}
