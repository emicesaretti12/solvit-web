import { Hero as HeroBase } from "@/components/ui/hero-1";
import { CONTACT_LABEL } from "./cta";

export function Hero() {
  return (
    <HeroBase
      eyebrow="Ingeniería y Desarrollo de Software"
      eyebrowHref="#servicios"
      title="Operación y ventas, en un mismo sistema."
      subtitle="Software a medida, inteligencia artificial, hardware y marketing de performance, integrados por un solo equipo técnico."
      ctaLabel={CONTACT_LABEL}
      ctaHref="#contacto"
    />
  );
}
