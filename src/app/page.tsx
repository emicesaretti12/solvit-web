import { Stage } from "@/components/three/stage";
import { About } from "@/components/site/about";
import { ContactBadge } from "@/components/site/contact-badge";
import { Cursor } from "@/components/site/cursor";
import { Facts } from "@/components/site/facts";
import { Finale } from "@/components/site/finale";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { PageObservers } from "@/components/site/page-observers";
import { SectionNav } from "@/components/site/section-nav";
import { Services } from "@/components/site/services";
import { System } from "@/components/site/system";
import { Works } from "@/components/site/works";

/*
  Una sola página, de arriba hacia abajo:
  hero (la S en 3D, el globo y el valle de cintas) → últimos trabajos y marcas → servicios en
  tarjetas que se apilan → el sistema SEN con sus vistas vivas → hechos de cada proyecto →
  detrás de SEN → "¡Hablemos!" con las fichas que caen, y el pie que sube y lo tapa.
  Fijos sobre la página: el encabezado con su menú, los puntos de sección, el botón de contacto
  y el cursor propio. Detrás de todo, el escenario WebGL con el isotipo (Stage).
*/
export default function Home() {
  return (
    <>
      <Stage />
      <Header />
      <SectionNav />
      <ContactBadge />
      <main id="main" className="relative z-10 w-full max-w-full flex-1">
        <Hero />
        <Works />
        <Services />
        <System />
        <Facts />
        <About />
        <Finale />
      </main>
      <PageObservers />
      <Cursor />
    </>
  );
}
