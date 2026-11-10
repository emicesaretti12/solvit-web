/*
  Cierre: una pantalla entera que queda fija mientras el pie blanco sube y la tapa (el pie tiene
  las esquinas de arriba redondeadas, como una hoja). Adentro, la pregunta, un "¡Hablemos!"
  gigante que entra letra por letra y la lluvia de fichas. El pie trae los datos de contacto y
  el formulario corto.
*/
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";
import { CONTACT } from "@/content/contact-info";
import { NAV } from "@/content/nav";
import { LeadForm } from "./lead-form";
import { SplitText } from "./split-text";
import { TileRain } from "./tile-rain";

const CROSSES = ["left-[5vw] top-[9.5%]", "right-[5vw] top-[9.5%]", "left-[5vw] top-[43%]", "left-1/2 top-[43%]", "right-[5vw] top-[43%]"];

const link =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-expo)] hover:bg-[length:100%_1px]";

export function Finale() {
  return (
    <div className="relative">
      <section
        id="contacto"
        aria-labelledby="contacto-titulo"
        className="sticky top-0 z-0 flex h-[100svh] flex-col items-center overflow-hidden bg-haze"
      >
        {CROSSES.map((pos) => (
          <span key={pos} aria-hidden="true" className={`absolute text-[22px] font-light leading-none text-ink ${pos}`}>
            +
          </span>
        ))}
        <p data-reveal className="rise mt-[9.5svh] px-14 text-center text-[12.5px] uppercase text-ink">
          ¿Tu negocio está listo para crecer?
        </p>
        <h2
          id="contacto-titulo"
          className="mt-[19svh] text-[clamp(4.2rem,17vw,19rem)] font-light leading-[0.9] tracking-[-0.055em] text-ink md:mt-[15svh]"
        >
          <SplitText text="¡Hablemos!" />
        </h2>
        <TileRain />
        <a
          href="#contacto-form"
          className="pill group absolute bottom-[max(4.4svh,1.5rem)] z-[4] inline-flex h-14 items-center gap-7 rounded-full bg-white/80 px-8 text-[12px] uppercase text-ink shadow-[0_12px_30px_-16px_rgb(var(--shade-rgb)/0.5)] backdrop-blur-md [--pill-fill:var(--ink)]"
        >
          <ArrowDown size={15} className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-1" />
          Seguí deslizando
          <ArrowDown size={15} className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-1" />
        </a>
      </section>

      <footer
        id="contacto-form"
        className="relative z-10 flex min-h-[100svh] flex-col rounded-t-[2rem] bg-white px-5 pb-8 pt-16 shadow-[0_-30px_80px_rgb(20_30_70/0.14)] md:rounded-t-[2.5vw] md:px-[5vw] md:pt-[7vw]"
      >
        <Logo withTagline />

        <div className="mt-14 grid flex-1 gap-14 md:mt-[6vw] lg:grid-cols-[0.5fr_0.5fr_1fr] lg:gap-10">
          <address className="text-[19px] not-italic leading-[1.35] text-ink">
            Córdoba
            <br />
            Argentina
          </address>

          <div className="flex flex-col gap-12 text-[19px] leading-[1.7] text-ink">
            <ul>
              <li>
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className={link}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={link}>
                  Correo
                </a>
              </li>
            </ul>
            <p>
              Consultas generales
              <br />
              <a href={`mailto:${CONTACT.email}`} className={link}>
                {CONTACT.email}
              </a>
            </p>
            <p>
              Nuevos proyectos
              <br />
              <a href={CONTACT.tel} className={`tabular ${link}`}>
                {CONTACT.phone}
              </a>
            </p>
          </div>

          <div className="max-w-[560px]">
            <p className="text-[clamp(2.1rem,3.7vw,3.4rem)] leading-[1.02] tracking-[-0.035em] text-ink">
              Dejanos tu correo
              <br />y charlamos tu proyecto
            </p>
            <div className="mt-8">
              <LeadForm origin="pie" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 text-[15px] text-ink">
          <p>© 2026 SEN Software</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.slice(1, -1).map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
