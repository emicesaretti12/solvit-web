import AgencyHeroSection from "@/components/ui/hero-01";
import { BrandPortal } from "@/components/brand-portal";
import { Services } from "@/components/services";
import { ValueFlow } from "@/components/value-flow";
import { PlatformShowcase } from "@/components/platform-showcase";
import { Projects } from "@/components/projects";
import { Sectors } from "@/components/sectors";
import { Testimonials } from "@/components/testimonials";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

/*
  El home es el hero-01 (header, hero y slider de marcas). Como en el componente original,
  el hero arma el <main> y el resto de las secciones van adentro, a continuación del slider.
*/
export default function Home() {
  return (
    <>
      <AgencyHeroSection>
        <BrandPortal />
        <Services />
        <ValueFlow />
        <PlatformShowcase />
        <Projects />
        <Sectors />
        <Testimonials />
        <About />
        <Contact />
      </AgencyHeroSection>
      <SiteFooter />
    </>
  );
}
