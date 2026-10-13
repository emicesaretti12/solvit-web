"use client";

/*
  Hero 01 · Agency Hero Section (ShadcnSpace, 21st.dev), adaptado a SEN:
  - misma composición que el original (Header + HeroSection + BrandSlider); el <main> lo arma
    este componente y el resto de las secciones llegan como children, después del slider
  - detrás de todo va el escenario 3D fijo (Stage) con el isotipo: en escritorio recorre la
    página; en celulares vive en el hero, que queda fijado mientras el resto de la página sube
    encima como una hoja y la S se abre y se atraviesa por encima de ella
  - componente de cliente: los logos y la navegación se arman acá, una sola vez por módulo (la
    navegación es dependencia del observador de la sección activa: tiene que ser estable)
*/
import type { ReactNode } from "react";
import { siGoogleads, siInstagram, siMeta, siWhatsapp } from "simple-icons";
import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider, { type BrandList } from "@/components/ui/hero-01-utils/brand-slider";
import { Stage } from "@/components/three/stage";

// Navegación en el orden de la página
const navigationData: NavigationSection[] = [
  { title: "Servicios", href: "#servicios" },
  { title: "Cómo funciona", href: "#como-funciona" },
  { title: "Proyectos", href: "#proyectos" },
  { title: "Nosotros", href: "#nosotros" },
  { title: "Contacto", href: "#contacto" },
];

// Canales donde escriben los clientes y plataformas de anuncios (logos reales, monocromos)
const brandList: BrandList[] = [siWhatsapp, siInstagram, siMeta, siGoogleads].map((icon) => ({
  name: icon.title,
  path: icon.path,
}));

export default function AgencyHeroSection({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <Stage />
      <Header navigationData={navigationData} />
      <main id="main" className="relative z-10 w-full max-w-full flex-1 overflow-x-clip">
        <HeroSection />
        {/* Hoja: en celulares fijados sube sobre el hero (100svh antes de que termine su tramo) y lo
            tapa entero justo cuando se suelta. Es opaca: la S del escenario se ve solo por encima
            de su borde. El escenario la usa para ubicar la S (data-stage-cover) */}
        <div
          data-stage-cover
          className="relative z-[1] pin:-mt-[100svh] pin:rounded-t-[28px] pin:border-t pin:border-line pin:bg-navy-900 pin:shadow-[0_-22px_50px_-30px_rgb(var(--shade-rgb)/0.55)]"
        >
          <BrandSlider brandList={brandList} />
          {children}
        </div>
      </main>
    </div>
  );
}
