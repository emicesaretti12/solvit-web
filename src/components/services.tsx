import {
  Code,
  Sparkle,
  Cpu,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType, ReactNode } from "react";
import { Reveal } from "./reveal";
import { Photo } from "./photo";
import { img } from "@/lib/images";

type IconType = ComponentType<{ size?: number; weight?: "light" | "regular" }>;

function Shell({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      as="article"
      className={`rounded-[2rem] border border-line bg-white/[0.025] p-1.5 ${className}`}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(255_255_255/0.06)]">
        {children}
      </div>
    </Reveal>
  );
}

function Body({
  icon: Icon,
  title,
  text,
  items,
}: {
  icon: IconType;
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <div className="relative mt-auto p-7 md:p-8">
      <span className="mb-5 flex size-11 items-center justify-center rounded-full border border-line-strong bg-navy-900/60 text-blue-300">
        <Icon size={22} weight="light" />
      </span>
      <h3 className="text-2xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 max-w-[48ch] leading-relaxed text-ink-muted">{text}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((i) => (
          <li
            key={i}
            className="rounded-full border border-line bg-navy-950/40 px-3 py-1.5 text-[0.8rem] text-ink-muted"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Services() {
  return (
    <section id="servicios" className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32">
        <Reveal>
          <h2 className="max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Cuatro disciplinas, un solo equipo.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
            Cada unidad resuelve una parte del problema. Juntas, cubren el
            recorrido completo de tu negocio.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <Shell className="md:col-span-7 md:row-span-2">
            <Photo
              src={img("photo-1555066931-4365d14bab8c", 1400)}
              alt="Código fuente de una aplicación en un editor"
              sizes="(min-width: 768px) 700px, 100vw"
              className="aspect-[16/10] w-full md:aspect-auto md:min-h-[300px] md:flex-1"
            />
            <Body
              icon={Code}
              title="Ingeniería de software"
              text="El núcleo de Solvit. Arquitecturas robustas y escalables que centralizan operaciones complejas en un solo lugar."
              items={[
                "CRM y plataformas propietarias",
                "Roles y niveles de acceso",
                "Apps web y cloud",
                "Tableros en tiempo real",
                "Reservas, turnos y catálogos",
                "Integración de APIs y pagos",
              ]}
            />
          </Shell>

          <Shell className="md:col-span-5" delay={0.08}>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,rgb(47_116_255/0.45),transparent_65%),radial-gradient(60%_50%_at_0%_100%,rgb(26_86_240/0.25),transparent_70%)]"
            />
            <Body
              icon={Sparkle}
              title="Inteligencia artificial"
              text="No como accesorio. Como herramienta para bajar costos y responder más rápido que tu competencia."
              items={[
                "Agentes que califican leads 24/7",
                "WhatsApp, Instagram y web",
                "Traspaso automático al CRM",
                "Visión artificial",
              ]}
            />
          </Shell>

          <Shell className="md:col-span-5" delay={0.12}>
            <Photo
              src={img("photo-1555664424-778a1e5e1b48", 1000)}
              alt="Detalle de una placa electrónica con circuitos integrados"
              sizes="(min-width: 768px) 480px, 100vw"
              className="aspect-[16/9] w-full"
            />
            <Body
              icon={Cpu}
              title="Hardware e IoT"
              text="Llevamos la ingeniería digital al mundo físico, donde el software solo no llega."
              items={[
                "ESP32 y sistemas embebidos",
                "Sensores, RFID y NFC",
                "Telemetría y válvulas",
                "Control de acceso",
              ]}
            />
          </Shell>

          <Shell className="md:col-span-12" delay={0.08}>
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              <Body
                icon={ChartLineUp}
                title="Marketing de performance"
                text="Demanda predecible para que la tecnología que construimos trabaje con volumen real de prospectos."
                items={[
                  "Meta Ads y Google Ads",
                  "Embudos B2B y B2C",
                  "Reducción del CPA",
                  "Identidad y posicionamiento",
                ]}
              />
              <Photo
                src={img("photo-1460925895917-afdab827c52f", 1400)}
                alt="Laptop mostrando gráficos de rendimiento de campañas digitales"
                sizes="(min-width: 768px) 620px, 100vw"
                className="order-first aspect-[16/9] w-full md:order-none md:aspect-auto md:min-h-[320px]"
              />
            </div>
          </Shell>
        </div>
      </div>
    </section>
  );
}
