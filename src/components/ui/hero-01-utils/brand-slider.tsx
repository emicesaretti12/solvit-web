"use client";

/*
  BrandSlider del hero-01 (Agency Hero Section de ShadcnSpace), recreado para SEN. Acepta
  imágenes (image / lightimg para el tema claro, como el original) o trazados de simple-icons
  (path), que toman el color del texto y funcionan en los dos temas.
*/
import type { CSSProperties } from "react";

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
  // Con pocos logos va una fila quieta: la única marquesina de la página es la de clientes
  return (
    <section aria-labelledby="plataformas-titulo" className="relative pb-20 pt-6 md:pb-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="flex flex-col items-start gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p id="plataformas-titulo" className="text-sm text-ink-muted">
            Trabajamos con
          </p>
          {/* sd-flip: en celulares con scroll ligado, cada logo gira de canto a frente, de a uno */}
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 [perspective:600px] md:gap-x-12">
            {brandList.map((brand, i) => (
              <li
                key={brand.name}
                style={{ "--n": i } as CSSProperties}
                className="sd-flip flex items-center text-ink-faint transition-colors duration-200 hover:text-ink"
              >
                <Brand brand={brand} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
