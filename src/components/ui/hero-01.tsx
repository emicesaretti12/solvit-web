"use client";

/*
  Hero 01 · Agency Hero Section (ShadcnSpace, 21st.dev), adaptado a SEN:
  - misma composición que el original (Header + HeroSection + BrandSlider); el <main> lo arma
    este componente y el resto de las secciones llegan como children, después del slider
  - detrás de todo va el escenario 3D (Stage) con el isotipo: en escritorio, fijo, recorre la
    página; en celulares vive en el hero y sube con él como una imagen
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
        <BrandSlider brandList={brandList} />
        {children}
      </main>
    </div>
  );
}
