import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Integrations } from "@/components/integrations";
import { BrandPortal } from "@/components/brand-portal";
import { Services } from "@/components/services";
import { ValueFlow } from "@/components/value-flow";
import { PlatformShowcase } from "@/components/platform-showcase";
import { Sectors } from "@/components/sectors";
import { Testimonials } from "@/components/testimonials";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="w-full max-w-full flex-1 overflow-x-clip">
        <Hero />
        <Integrations />
        <BrandPortal />
        <Services />
        <ValueFlow />
        <PlatformShowcase />
        <Sectors />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
