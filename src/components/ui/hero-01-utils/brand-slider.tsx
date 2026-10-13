"use client";

/*
  BrandSlider del hero-01 (Agency Hero Section de ShadcnSpace), recreado para SEN. Acepta
  imágenes (image / lightimg para el tema claro, como el original) o trazados de simple-icons
  (path), que toman el color del texto y funcionan en los dos temas.

  Cada plataforma va como un ícono de app (el glifo monocromo sobre una baldosa redondeada) con
  su nombre al lado: en el claro, la baldosa es blanca con borde fino y una sombra corta que la
  despega del fondo; en el oscuro, navy con el borde de luz arriba. Así se leen igual de bien
  en los dos temas sin usar los colores de cada marca (el único acento del sitio es el azul).
  En celulares va todo en una sola fila compacta (es lo primero de la hoja que sube sobre el
  hero): el rótulo a la izquierda y las cuatro baldosas a la derecha, con el nombre solo para
  lectores de pantalla; desde sm, cada baldosa con su nombre al lado.
*/
import type { CSSProperties } from "react";

export interface BrandList {
  name: string;
  image?: string;
  lightimg?: string;
  /** Trazado SVG (viewBox 0 0 24 24) de simple-icons */
  path?: string;
}

function BrandGlyph({ brand }: { brand: BrandList }) {
  // El nombre va escrito al lado: el ícono es decorativo
  if (brand.path) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-5 shrink-0 fill-current">
        <path d={brand.path} />
      </svg>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- logos chicos de origen externo */}
      <img src={brand.image} alt="" aria-hidden="true" className="h-5 w-auto light:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element -- versión para fondo claro */}
      <img src={brand.lightimg ?? brand.image} alt="" aria-hidden="true" className="hidden h-5 w-auto light:block" />
    </>
  );
}

export default function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  // Con pocos logos va una fila quieta: la única marquesina de la página es la de clientes
  return (
    <section aria-labelledby="plataformas-titulo" className="relative pb-4 pt-2 md:pb-28 md:pt-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 border-t border-line pt-6 md:pt-8">
          <p id="plataformas-titulo" className="text-sm text-ink-muted">
            Trabajamos con
          </p>
          {/* sd-flip: en celulares con scroll ligado, cada logo gira de canto a frente, de a uno
              (la animación va en el <li>; la baldosa de adentro no tiene preserve-3d) */}
          <ul className="flex items-center gap-2 [perspective:600px] sm:flex-wrap sm:gap-x-8 md:gap-x-10">
            {brandList.map((brand, i) => (
              <li
                key={brand.name}
                style={{ "--n": i } as CSSProperties}
                className="sd-flip group/brand flex items-center gap-3"
              >
                <span
                  className={[
                    "flex size-10 shrink-0 items-center justify-center rounded-[13px] border text-ink sm:size-11 sm:rounded-[14px]",
                    "border-line bg-navy-850 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]",
                    "light:border-line-strong light:shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.08),0_8px_18px_-10px_rgb(var(--shade-rgb)/0.35)]",
                    "transition-[translate] duration-200 ease-[var(--ease-out)] motion-safe:pointer-fine:group-hover/brand:-translate-y-0.5",
                  ].join(" ")}
                >
                  <BrandGlyph brand={brand} />
                </span>
                <span className="sr-only text-sm font-medium text-ink-muted transition-colors duration-200 sm:not-sr-only pointer-fine:group-hover/brand:text-ink">
                  {brand.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
