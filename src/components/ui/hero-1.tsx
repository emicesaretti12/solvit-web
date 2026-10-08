"use client"

/*
  Hero 1 (21st.dev), adaptado a Solvit:
  - ícono de Phosphor (familia única del sitio) en lugar de lucide-react
  - horizonte en azul de marca sobre azul marino; tema oscuro fijo
  - `isolate` para que la retícula con -z-10 quede sobre el fondo de la sección
  - el degradado inferior usa var(--background) (los tokens son hex, no HSL)
  - eyebrowHref y ctaHref configurables; flecha anidada en el CTA como el resto del sitio
*/
import { ArrowUpRight, CaretRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  eyebrowHref?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  eyebrowHref = "#",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative isolate mx-auto w-full overflow-hidden rounded-b-xl px-4 pt-32 text-center md:px-8 md:pt-36
      min-h-[100dvh]
      bg-[linear-gradient(to_bottom,var(--navy-900),var(--navy-900)_40%,#10265c_80%,#1d4fd0_100%)]"
    >
      {/* Grid BG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-[600px] w-full opacity-80
        bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent: horizonte con borde de luz azul */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(100%-90px)] -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-[100%] opacity-0
        md:h-[500px] md:w-[1100px] lg:top-[calc(100%-150px)] lg:h-[750px] lg:w-[140%]
        bg-navy-900 bg-[radial-gradient(closest-side,var(--navy-900)_82%,var(--blue-400))]
        animate-fade-up [animation-delay:200ms]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href={eyebrowHref} className="group inline-block">
          <span
            className="mx-auto flex w-fit items-center justify-center rounded-3xl border-2 border-white/5
            bg-gradient-to-tr from-blue-400/10 via-white/5 to-transparent px-5 py-2
            text-sm uppercase tracking-tight text-ink-muted transition-colors duration-150 group-hover:text-ink"
          >
            {eyebrow}
            <CaretRight
              aria-hidden="true"
              className="ml-2 inline h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1"
            />
          </span>
        </a>
      )}

      {/* Title */}
      <h1
        className="mx-auto max-w-5xl -translate-y-4 animate-fade-in text-balance
        bg-gradient-to-br from-white from-30% to-white/55
        bg-clip-text py-6 text-5xl font-semibold leading-[1.02] tracking-tighter
        text-transparent opacity-0 sm:text-6xl lg:text-7xl"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="mx-auto mb-12 max-w-[46ch] -translate-y-4 animate-fade-in text-balance
        text-lg tracking-tight text-ink-muted opacity-0 [animation-delay:120ms] md:text-xl"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center">
          <Button
            asChild
            className="group z-20 mt-[-20px] h-auto gap-3 py-1.5 pl-6 pr-1.5 text-base font-medium tracking-tight
            shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_30px_-10px_rgb(47_116_255/0.7)]
            opacity-0 animate-fade-in [animation-delay:240ms]"
          >
            <a href={ctaHref}>
              {ctaLabel}
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-0.5">
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
          </Button>
        </div>
      )}

      {/* Bottom Fade */}
      <div
        aria-hidden="true"
        className="relative mt-32 opacity-0 animate-fade-up [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,var(--background)_10%,transparent)]"
      />
    </section>
  )
}
