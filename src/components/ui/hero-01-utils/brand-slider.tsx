"use client";

/*
  BrandSlider del hero-01 (Agency Hero Section de ShadcnSpace), recreado para SEN. Acepta
  imágenes (image / lightimg para el tema claro, como el original) o trazados de simple-icons
  (path), que toman el color del texto y funcionan en los dos temas.
*/

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
    <section aria-labelledby="plataformas-titulo" className="relative px-4 pb-20 pt-6 md:px-6 md:pb-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p id="plataformas-titulo" className="text-sm text-ink-muted">
          Funciona con lo que tus clientes ya usan
        </p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 md:gap-x-12">
          {brandList.map((brand) => (
            <li key={brand.name} className="flex items-center text-ink-faint transition-colors duration-200 hover:text-ink">
              <Brand brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
