import { Hero as HeroBase } from "@/components/ui/hero-1";
import { BrandTile3D } from "./brand-tile-3d";
import { CONTACT_LABEL } from "./cta";

export function Hero() {
  return (
    <HeroBase
      eyebrow="Ingeniería y Desarrollo de Software"
      eyebrowHref="#servicios"
      title="Reemplazamos el trabajo manual por sistemas que escalan."
      subtitle="Software a medida, agentes de IA, hardware conectado y marketing de performance, integrados por un mismo equipo técnico."
      ctaLabel={CONTACT_LABEL}
      ctaHref="#contacto"
      secondaryLabel="Ver cómo funciona"
      secondaryHref="#flujo"
    >
      <BrandTile3D />
    </HeroBase>
  );
}
