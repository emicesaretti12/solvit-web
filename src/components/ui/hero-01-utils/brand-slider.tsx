"use client";

/*
  BrandSlider del hero-01 (Agency Hero Section de ShadcnSpace), recreado para SEN: marquesina
  infinita de logos. Acepta imágenes (image / lightimg para el tema claro, como el original) o
  trazados de simple-icons (path), que toman el color del texto y funcionan en los dos temas.
  Se pausa con hover o foco; con reduced motion queda una grilla quieta.
*/
import { cn } from "@/lib/utils";

export interface BrandList {
  name: string;
  image?: string;
  lightimg?: string;
  /** Trazado SVG (viewBox 0 0 24 24) de simple-icons */
  path?: string;
}

function Brand({ brand }: { brand: BrandList }) {
  if (brand.path) {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={brand.name} className="size-7 shrink-0 fill-current md:size-8">
        <title>{brand.name}</title>
        <path d={brand.path} />
      </svg>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- logos chicos de origen externo */}
      <img src={brand.image} alt={brand.name} className="h-7 w-auto light:hidden md:h-8" />
      {/* eslint-disable-next-line @next/next/no-img-element -- versión para fondo claro */}
      <img src={brand.lightimg ?? brand.image} alt="" aria-hidden="true" className="hidden h-7 w-auto light:block md:h-8" />
    </>
  );
}

export default function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  const row = (copy: number) => (
    <ul
      aria-hidden={copy > 0 || undefined}
      className={cn(
        "flex shrink-0 animate-marquee items-center gap-[var(--gap)] pr-[var(--gap)] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
        copy > 0 && "motion-reduce:hidden",
        "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0",
      )}
    >
      {brandList.map((brand) => (
        <li
          key={`${copy}-${brand.name}`}
          className="flex items-center text-ink-faint transition-colors duration-200 hover:text-ink"
        >
          <Brand brand={brand} />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="plataformas-titulo" className="relative pb-16 md:pb-24">
      <p id="plataformas-titulo" className="px-4 text-center text-sm text-ink-muted">
        Trabajamos con las plataformas que ya usás
      </p>
      <div className="group mx-auto mt-8 flex max-w-[1200px] overflow-hidden [--duration:45s] [--gap:3.5rem] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] motion-reduce:[mask-image:none] md:[--gap:4.5rem]">
        {row(0)}
        {row(1)}
      </div>
    </section>
  );
}
