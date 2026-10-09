"use client";

import { useRef, type ComponentType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Browsers,
  ChartLineUp,
  ChatCircleDots,
  Code,
  Cpu,
  FlowArrow,
  Fingerprint,
  Funnel,
  Gauge,
  PlugsConnected,
  Scan,
  SealCheck,
  Sparkle,
  Target,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import { CrmPreview } from "./previews/crm-preview";
import { AgentPreview } from "./previews/agent-preview";
import { HardwarePreview } from "./previews/hardware-preview";
import { MarketingPreview } from "./previews/marketing-preview";
import { Reveal } from "./reveal";
import { STACK_QUERY } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STICKY_TOP = 92; // px, debajo del header flotante (termina en 76px)
const STEP = 12; // px que asoma cada tarjeta anterior

type Service = {
  key: string;
  icon: Icon;
  title: string;
  intro: string;
  items: { icon: Icon; title: string; text: string }[];
  Preview: ComponentType;
};

const SERVICES: Service[] = [
  {
    key: "software",
    icon: Code,
    title: "Ingeniería y desarrollo de software",
    intro:
      "El núcleo de SEN. Arquitecturas robustas y escalables que centralizan operaciones complejas en un solo lugar.",
    items: [
      {
        icon: UsersThree,
        title: "CRM y plataformas operativas propietarias",
        text: "Adaptados a la lógica interna de tu empresa, con niveles de acceso para administración, supervisión, ventas y soporte.",
      },
      {
        icon: Browsers,
        title: "Aplicaciones web y plataformas cloud",
        text: "Gestión interna, tableros analíticos en tiempo real, catálogos digitales interactivos y sistemas de reservas o turnos.",
      },
      {
        icon: PlugsConnected,
        title: "Integración de APIs y ecosistemas de datos",
        text: "Bases relacionales y no relacionales conectadas con pasarelas de pago, mensajería y servicios en la nube, siempre sincronizadas.",
      },
    ],
    Preview: CrmPreview,
  },
  {
    key: "ia",
    icon: Sparkle,
    title: "Inteligencia artificial y automatización",
    intro:
      "No como accesorio estético: como herramienta para bajar costos y responder más rápido que tu competencia.",
    items: [
      {
        icon: ChatCircleDots,
        title: "Agentes que califican leads",
        text: "En Instagram Direct, WhatsApp Business y formularios web: entienden la intención de compra, responden dudas técnicas, extraen datos y priorizan cada prospecto.",
      },
      {
        icon: FlowArrow,
        title: "Automatización del embudo de ventas",
        text: "El prospecto calificado pasa directo al CRM y se asigna al vendedor correspondiente, sin intervención humana.",
      },
      {
        icon: Scan,
        title: "Visión artificial y procesamiento de datos",
        text: "Análisis visual para líneas de producción, conteo volumétrico, monitoreo logístico y control de inventario.",
      },
    ],
    Preview: AgentPreview,
  },
  {
    key: "hardware",
    icon: Cpu,
    title: "Hardware y automatización física",
    intro:
      "Llevamos la ingeniería digital al mundo tangible, para digitalizar procesos donde el software por sí solo no llega.",
    items: [
      {
        icon: Cpu,
        title: "Sistemas embebidos y microcontroladores",
        text: "Diseño, programación y ensamblaje de placas con ESP32 y microcontroladores industriales para maquinaria y puntos de servicio.",
      },
      {
        icon: Gauge,
        title: "Telemetría, sensores y actuadores",
        text: "Medidores de flujo, sensores de proximidad, lectores RFID y NFC y válvulas solenoides para dispensación, pesaje, stock y accesos.",
      },
      {
        icon: Fingerprint,
        title: "Control de acceso y presencia",
        text: "Conectado a la red corporativa para supervisar ingresos, trazar la operación del personal y auditar maquinaria en tiempo real.",
      },
    ],
    Preview: HardwarePreview,
  },
  {
    key: "marketing",
    icon: ChartLineUp,
    title: "Marketing digital y captación",
    intro:
      "Demanda predecible y constante, para que la tecnología que construimos trabaje con volumen real de prospectos.",
    items: [
      {
        icon: Target,
        title: "Campañas de performance",
        text: "Configuración técnica y optimización algorítmica en Meta Ads y Google Ads, enfocadas en adquirir leads de forma rentable.",
      },
      {
        icon: Funnel,
        title: "Embudos de adquisición B2B y B2C",
        text: "El recorrido completo, del anuncio a la interfaz de contacto, diseñado para convertir más y bajar el costo por adquisición.",
      },
      {
        icon: SealCheck,
        title: "Posicionamiento e identidad digital",
        text: "El ecosistema visual y de marca que proyecta autoridad, respaldo técnico y confianza frente a tus clientes.",
      },
    ],
    Preview: MarketingPreview,
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { icon: IconCmp, title, intro, items, Preview } = service;
  return (
    <article className="service-card relative rounded-[2rem] border border-line bg-navy-800 p-1.5 shadow-[0_-24px_60px_-30px_rgb(6_10_18/0.9)]">
      <div className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(255_255_255/0.05)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(31_107_255/0.1),transparent)]"
        />
        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:p-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-line-strong bg-navy-900 text-blue-400">
                <IconCmp size={22} weight="light" aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="flex gap-1">
                {SERVICES.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-[3px] w-5 rounded-full ${i === index ? "bg-blue-400" : "bg-white/10"}`}
                  />
                ))}
              </span>
            </div>
            <h3 className="font-display mt-6 text-2xl font-semibold leading-[1.1] tracking-[-0.025em] text-ink text-balance md:text-[1.85rem]">
              {title}
            </h3>
            <p className="mt-3 max-w-[50ch] leading-relaxed text-ink-muted">{intro}</p>
            <ul className="mt-6 border-t border-line">
              {items.map((item) => (
                <li key={item.title} className="grid grid-cols-[20px_1fr] gap-3 border-b border-line py-4 last:border-b-0 last:pb-0">
                  <item.icon size={18} weight="light" className="mt-0.5 text-blue-400" aria-hidden="true" />
                  <div>
                    <h4 className="text-[15px] font-medium text-ink">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 lg:self-center">
            <Preview />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="service-shade pointer-events-none absolute inset-0 rounded-[2rem] bg-navy-950 opacity-0"
      />
    </article>
  );
}

export function Services() {
  const listRef = useRef<HTMLOListElement>(null);

  // Apilado: cuando la tarjeta siguiente sube, la anterior retrocede (escala y se oscurece)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(STACK_QUERY, () => {
        const slots = gsap.utils.toArray<HTMLElement>(".service-slot");
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          if (!next) return;
          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: `top ${STICKY_TOP + (i + 1) * STEP}px`,
            scrub: true,
          };
          gsap.to(slot.querySelector(".service-card"), {
            scale: 0.93,
            transformOrigin: "50% 0%",
            ease: "none",
            scrollTrigger,
          });
          gsap.to(slot.querySelector(".service-shade"), { opacity: 0.6, ease: "none", scrollTrigger });
        });
      });
    },
    { scope: listRef },
  );

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-36">
        <Reveal className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-12">
          <h2
            id="servicios-titulo"
            className="font-display max-w-[17ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Cuatro disciplinas, un mismo sistema.
          </h2>
          <p className="max-w-[50ch] text-lg leading-relaxed text-ink-muted">
            Cada unidad resuelve una parte del problema y comparte la infraestructura técnica con
            las otras tres. Así se ve cada una funcionando.
          </p>
        </Reveal>

        {/*
          Apilado: la separación va como margin-top de la tarjeta siguiente (un margin-bottom
          en un sticky lo despega antes de tiempo) y el ::after final (el padding no cuenta para
          el límite de un sticky) deja que todas sigan fijas mientras llega la última, aunque
          las alturas difieran un poco.
        */}
        <ol
          ref={listRef}
          className="mt-14 space-y-5 md:mt-20 stack:space-y-0 stack:after:block stack:after:h-16"
        >
          {SERVICES.map((service, i) => (
            <li
              key={service.key}
              className="service-slot stack:sticky stack:not-first:mt-[12vh]"
              style={{ top: `${STICKY_TOP + i * STEP}px` }}
            >
              <Reveal>
                <ServiceCard service={service} index={i} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
