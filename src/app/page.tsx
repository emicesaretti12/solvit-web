import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { BrandPortal } from "@/components/brand-portal";
import { Services } from "@/components/services";
import { PlatformShowcase } from "@/components/platform-showcase";
import { Method } from "@/components/method";
import { Sectors } from "@/components/sectors";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <BrandPortal />
        <Services />
        <PlatformShowcase />
        <Method />
        <Sectors />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
