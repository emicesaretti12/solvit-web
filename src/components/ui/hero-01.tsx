"use client";

/*
  Hero 01 · Agency Hero Section (ShadcnSpace, 21st.dev), adaptado a SEN:
  - mismos datos y composición que el original (Header + HeroSection + BrandSlider), con
    contenido de SEN: navegación por secciones, avatares de rubros reales y logos de plataformas
  - el <main> lo arma este componente, como en el original; el resto de las secciones de la
    página llegan como children y van a continuación del slider
  - avatares sin caras de stock (íconos de rubros de proyectos reales); logos de simple-icons
  - componente de cliente: los íconos (componentes) no se pueden pasar como props desde el
    servidor; las secciones que llegan como children siguen renderizándose en el servidor
*/
import type { ReactNode } from "react";
import { BatteryCharging, BeerStein, Factory, FirstAidKit, Motorcycle } from "@phosphor-icons/react";
import {
  siEspressif,
  siGoogleads,
  siGooglecloud,
  siInstagram,
  siMercadopago,
  siMeta,
  siMongodb,
  siNextdotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siVercel,
  siWhatsapp,
} from "simple-icons";
import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider, { type BrandList } from "@/components/ui/hero-01-utils/brand-slider";
import type { AvatarList, HeroStat } from "@/components/ui/hero-01-utils/hero";
import { DELIVERED, SECTORS } from "@/content/projects";

export default function AgencyHeroSection({ children }: { children?: ReactNode }) {
  const avatarList: AvatarList[] = [
    { image: "", icon: Motorcycle, label: "Concesionaria de motos" },
    { image: "", icon: BatteryCharging, label: "Venta de baterías" },
    { image: "", icon: Factory, label: "Industria" },
    { image: "", icon: FirstAidKit, label: "Salud" },
    { image: "", icon: BeerStein, label: "Cervecería" },
  ];

  const stats: HeroStat[] = [
    { value: DELIVERED, prefix: "+", label: "proyectos entregados" },
    { value: SECTORS, label: "rubros con clientes satisfechos" },
    { value: 24, suffix: "/7", label: "agentes de IA atendiendo" },
  ];

  const navigationData: NavigationSection[] = [
    { title: "Inicio", href: "#hero", isActive: true },
    { title: "Servicios", href: "#servicios" },
    { title: "Proyectos", href: "#proyectos" },
    { title: "Cómo trabajamos", href: "#flujo" },
    { title: "Sectores", href: "#sectores" },
    { title: "Nosotros", href: "#nosotros" },
  ];

  // Canales, pagos, datos, nube y hardware con los que integramos (logos reales, monocromos)
  const brandList: BrandList[] = [
    siWhatsapp,
    siInstagram,
    siMeta,
    siGoogleads,
    siMercadopago,
    siNextdotjs,
    siReact,
    siVercel,
    siSupabase,
    siPostgresql,
    siMongodb,
    siGooglecloud,
    siEspressif,
  ].map((icon) => ({ name: icon.title, path: icon.path }));

  return (
    <div className="relative flex flex-1 flex-col">
      <Header navigationData={navigationData} />
      <main id="main" className="w-full max-w-full flex-1 overflow-x-clip">
        <HeroSection avatarList={avatarList} stats={stats} />
        <BrandSlider brandList={brandList} />
        {children}
      </main>
    </div>
  );
}
