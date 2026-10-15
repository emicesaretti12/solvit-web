import AgencyHeroSection from "@/components/ui/hero-01";
import { Services } from "@/components/services";
import { HowItWorks } from "@/components/how-it-works";
import { SalesFlow } from "@/components/sales-flow";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

/*
  Una sola historia: el hero presenta la promesa con el isotipo en 3D, "Trabajos" dice qué
  vendemos (web, software, agentes de IA, marketing y proyectos con hardware), "Cómo funciona" la
  recorre en cuatro pasos (atraer, atender, cerrar, crecer) con las cintas de la S, "El camino
  de cada consulta" muestra el circuito completo (canales → agente de IA → CRM por área →
  venta → crecimiento), después vienen las pruebas (proyectos y clientes), quiénes somos y el contacto.
  El hero arma el <main> y el resto de las secciones van adentro, a continuación del slider.
*/
export default function Home() {
  return (
    <>
      <AgencyHeroSection>
        <Services />
        <HowItWorks />
        <SalesFlow />
        <Projects />
        <About />
        <Contact />
      </AgencyHeroSection>
      <SiteFooter />
    </>
  );
}
