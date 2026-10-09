"use client";

import { useRef, type ComponentType, type CSSProperties } from "react";
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
import { STACK_QUERY, STACK_SM_QUERY } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Posición fija de cada tarjeta apilada: debajo del header flotante, cada una asoma un poco
const STICKY = {
  desktop: { top: 92, step: 12 },
  mobile: { top: 80, step: 10 },
};

type Service = {
  key: string;
  icon: Icon;
  title: string;
  /** Especialidad independiente del flujo comercial (hardware) */
  standalone?: boolean;
  intro: string;
  items: { icon: Icon; title: string; text: string }[];
  Preview: ComponentType;
};

const SERVICES: Service[] = [
  {
    key: "software",
    icon: Code,
    title: "Desarrollo web y software a medida",
    intro:
      "El núcleo de SEN. Sitios, sistemas y plataformas propias que centralizan operaciones complejas en un solo lugar.",
    items: [
      {
        icon: Browsers,
        title: "Sitios y aplicaciones web",
        text: "Webs institucionales, catálogos, sistemas de reservas y tiendas, rápidos y pensados para convertir visitas en consultas.",
      },
      {
        icon: UsersThree,
        title: "CRM y plataformas propietarias",
        text: "Adaptados a la lógica de tu empresa, con niveles de acceso para administración, supervisión, ventas y soporte.",
      },
      {
        icon: PlugsConnected,
        title: "Integración de APIs y datos",
        text: "Bases relacionales y no relacionales conectadas con pasarelas de pago, mensajería y servicios en la nube.",
      },
    ],
    Preview: CrmPreview,
  },
  {
    key: "ia",
    icon: Sparkle,
    title: "Agentes de IA",
    intro:
      "No como accesorio estético: como herramienta para bajar costos y responder más rápido que tu competencia.",
    items: [
      {
        icon: ChatCircleDots,
        title: "Agentes que califican leads",
        text: "En WhatsApp Business, Instagram Direct y formularios web: entienden la intención de compra, responden dudas y priorizan cada prospecto.",
      },
      {
        icon: FlowArrow,
        title: "Traspaso automático al CRM",
        text: "El prospecto calificado llega al CRM y se asigna al vendedor correspondiente, sin intervención humana.",
      },
      {
        icon: Scan,
        title: "Visión artificial y datos",
        text: "Análisis visual para líneas de producción, conteo volumétrico, monitoreo logístico y control de inventario.",
      },
    ],
    Preview: AgentPreview,
  },
  {
    key: "marketing",
    icon: ChartLineUp,
    title: "Marketing digital",
    intro:
      "Demanda predecible y constante, para que la tecnología que construimos trabaje con volumen real de prospectos.",
    items: [
      {
        icon: Target,
        title: "Campañas de performance",
        text: "Configuración técnica y optimización en Meta Ads y Google Ads, enfocadas en adquirir leads de forma rentable.",
      },
      {
        icon: Funnel,
        title: "Embudos B2B y B2C",
        text: "El recorrido completo, del anuncio a la interfaz de contacto, diseñado para convertir más y bajar el costo por adquisición.",
      },
      {
        icon: SealCheck,
        title: "Posicionamiento e identidad",
        text: "El ecosistema visual y de marca que proyecta autoridad, respaldo técnico y confianza frente a tus clientes.",
      },
    ],
    Preview: MarketingPreview,
  },
  {
    key: "hardware",
    icon: Cpu,
    title: "Hardware e IoT",
    standalone: true,
    intro:
      "Una especialidad aparte: no forma parte del flujo comercial. La sumamos cuando un proyecto necesita llevar el software al mundo físico.",
    items: [
      {
        icon: Cpu,
        title: "Sistemas embebidos con ESP32",
        text: "Diseño, programación y ensamblaje de placas y microcontroladores para maquinaria y puntos de servicio.",
      },
      {
        icon: Gauge,
        title: "Telemetría, sensores y actuadores",
        text: "Medidores de flujo, sensores, lectores RFID y NFC y válvulas para dispensación, pesaje, stock y accesos.",
      },
      {
        icon: Fingerprint,
        title: "Control de acceso y presencia",
        text: "Conectado a la red de la empresa para supervisar ingresos y auditar maquinaria en tiempo real.",
      },
    ],
    Preview: HardwarePreview,
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { icon: IconCmp, title, intro, items, Preview, standalone } = service;
  return (
    <article className="service-card relative rounded-[2rem] border border-line bg-navy-800 p-1.5 shadow-[0_-24px_60px_-30px_rgb(var(--shade-rgb)/0.9)] light:shadow-[0_-18px_50px_-30px_rgb(var(--shade-rgb)/0.35)] stack-sm:flex stack-sm:h-[calc(100svh-120px)] stack-sm:flex-col">
      <div className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(var(--fg-rgb)/0.05)] stack-sm:flex stack-sm:min-h-0 stack-sm:flex-1 stack-sm:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(31_107_255/0.1),transparent)]"
        />
        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:p-10 stack-sm:flex stack-sm:min-h-0 stack-sm:flex-1 stack-sm:flex-col stack-sm:gap-4 stack-sm:p-4 md:stack-sm:p-6">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-line-strong bg-navy-900 text-blue-400 stack-sm:size-10">
                <IconCmp size={22} weight="light" aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="flex gap-1">
                {SERVICES.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-[3px] w-5 rounded-full ${i === index ? "bg-blue-400" : "bg-fg/10"}`}
                  />
                ))}
              </span>
              {standalone && (
                <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
                  Módulo aparte
                </span>
              )}
            </div>
            <h3 className="font-display mt-6 text-2xl font-semibold leading-[1.1] tracking-[-0.025em] text-ink text-balance md:text-[1.85rem] stack-sm:mt-3 stack-sm:text-[1.4rem]">
              {title}
            </h3>
            <p className="mt-3 max-w-[50ch] leading-relaxed text-ink-muted stack-sm:mt-1.5 stack-sm:line-clamp-2 stack-sm:text-[15px]">
              {intro}
            </p>
            {/* Detalle completo; en el apilado de celulares quedan solo los títulos (chips) */}
            <ul className="mt-6 border-t border-line stack-sm:hidden">
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
            <ul className="mt-3 hidden flex-wrap gap-1.5 stack-sm:flex">
              {items.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-navy-900/70 px-2.5 py-1 text-[12px] text-ink"
                >
                  <item.icon size={13} weight="light" className="text-blue-400" aria-hidden="true" />
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 lg:self-center stack-sm:flex stack-sm:min-h-0 stack-sm:flex-1 stack-sm:flex-col">
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

  // Apilado: cuando la tarjeta siguiente sube, la anterior retrocede (escala y se oscurece).
  // Mismo efecto en escritorio y en celulares, cada uno con su posición fija.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const stack = ({ top, step }: { top: number; step: number }) => () => {
        const slots = gsap.utils.toArray<HTMLElement>(".service-slot");
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          if (!next) return;
          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: `top ${top + (i + 1) * step}px`,
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
      };
      mm.add(STACK_QUERY, stack(STICKY.desktop));
      mm.add(STACK_SM_QUERY, stack(STICKY.mobile));
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
            Cuatro especialidades, un mismo equipo.
          </h2>
          <p className="max-w-[50ch] text-lg leading-relaxed text-ink-muted">
            Desarrollo, agentes de IA y marketing trabajan juntos para que entren más clientes.
            El hardware es un módulo aparte, para proyectos que necesitan llevar el software al
            mundo físico.
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
          className="mt-14 space-y-5 md:mt-20 stack:space-y-0 stack:after:block stack:after:h-16 stack-sm:space-y-0 stack-sm:after:block stack-sm:after:h-10"
        >
          {SERVICES.map((service, i) => (
            <li
              key={service.key}
              className="service-slot stack:sticky stack:top-[calc(92px+var(--i)*12px)] stack:not-first:mt-[12vh] stack-sm:sticky stack-sm:top-[calc(80px+var(--i)*10px)] stack-sm:not-first:mt-[8vh]"
              style={{ "--i": i } as CSSProperties}
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
