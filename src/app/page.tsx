import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Services } from "@/components/services";
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
        <Manifesto />
        <Services />
        <Method />
        <Sectors />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
