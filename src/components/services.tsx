"use client";

/*
  Trabajos: lo que vendemos, en cinco líneas de servicio (desarrollo web, software a medida,
  agentes de IA, marketing y proyectos que unen software con hardware). Cada tarjeta dice qué
  incluye, muestra el servicio en una escena chica y nombra los proyectos reales donde lo
  hicimos (llevan a su ficha en Proyectos).
  - Escritorio: grilla asimétrica (7/5, 5/7 y una tarjeta ancha); celulares: una columna
  - Las escenas son HTML y SVG con animaciones CSS de transform y opacidad: se arman al entrar
    en pantalla y sus loops corren solo mientras la tarjeta se ve (data-live)
  - Con reduced motion quedan quietas en su estado final
*/
import {
  ArrowUpRight,
  Broadcast,
  Code,
  Cpu,
  Globe,
  Kanban,
  Lightning,
  Megaphone,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import { useInView } from "motion/react";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { siGoogleads, siInstagram, siMeta, siTiktok, siWhatsapp } from "simple-icons";
import { MaskWords } from "@/components/mask-words";
import { Reveal } from "@/components/reveal";
import { getLenis } from "@/components/smooth-scroll";
import { PROJECTS } from "@/content/projects";

type Service = {
  id: string;
  icon: Icon;
  name: string;
  title: string;
  text: string;
  items: string[];
  /** Proyectos reales (slugs de content/projects) donde lo hicimos */
  work: string[];
  Scene: () => ReactNode;
  /** Columnas en la grilla de escritorio (de 12) */
  span: string;
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Brand({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d={path} />
    </svg>
  );
}

/* Web: un sitio que se arma en el navegador y, abajo, llega una consulta */
function WebScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center px-5 pt-6">
      <div className="svc-pop relative w-full max-w-[380px] overflow-hidden rounded-t-xl border border-b-0 border-line-strong bg-navy-900 shadow-[0_30px_60px_-30px_rgb(var(--shade-rgb)/0.9)]">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <span className="flex gap-1">
            <span className="size-1.5 rounded-full bg-fg/20" />
            <span className="size-1.5 rounded-full bg-fg/20" />
            <span className="size-1.5 rounded-full bg-fg/20" />
          </span>
          <span className="flex-1 truncate rounded-full bg-fg/[0.06] px-2.5 py-0.5 text-center font-mono text-[10px] text-ink-faint">
            tunegocio.com.ar
          </span>
        </div>
        <div className="space-y-2.5 p-3.5">
          <div className="flex items-center justify-between">
            <span style={d(0.1)} className="svc-bar h-1.5 w-12 rounded-full bg-fg/25" />
            <span className="flex gap-1.5">
              <span style={d(0.15)} className="svc-bar h-1.5 w-6 rounded-full bg-fg/15" />
              <span style={d(0.2)} className="svc-bar h-1.5 w-6 rounded-full bg-fg/15" />
              <span style={d(0.25)} className="svc-bar h-1.5 w-6 rounded-full bg-fg/15" />
            </span>
          </div>
          <span style={d(0.3)} className="svc-bar block h-3 w-[78%] rounded-full bg-ink/80" />
          <span style={d(0.38)} className="svc-bar block h-3 w-[52%] rounded-full bg-ink/80" />
          <span
            style={d(0.5)}
            className="svc-rise svc-press relative inline-flex items-center gap-1.5 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-medium text-white"
          >
            <Brand path={siWhatsapp.path} className="size-3" />
            Escribinos
          </span>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={d(0.6 + i * 0.08)}
                className="svc-rise block h-12 rounded-md border border-line bg-[linear-gradient(140deg,color-mix(in_oklab,var(--blue-500)_35%,transparent),transparent_70%)]"
              />
            ))}
          </div>
        </div>
      </div>
      {/* La consulta que llega desde la web */}
      <span className="svc-toast absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-line-strong bg-navy-850 px-2.5 py-1.5 text-[11px] text-ink shadow-[0_16px_30px_-16px_rgb(var(--shade-rgb)/0.9)]">
        <span className="size-1.5 rounded-full bg-blue-400" />
        Nueva consulta desde la web
      </span>
    </div>
  );
}

/* Software: un tablero donde la consulta avanza de columna hasta "Ganada" */
function SoftwareScene() {
  const cols = ["Nuevas", "En curso", "Ganadas"];
  return (
    <div className="absolute inset-0 flex items-center px-5">
      <div className="relative grid w-full grid-cols-3 gap-2">
        {cols.map((c, i) => (
          <div key={c} style={d(0.1 + i * 0.1)} className="svc-rise rounded-xl border border-line bg-navy-900/80 p-2">
            <p className="mb-2 flex items-center justify-between text-[10px] text-ink-faint">
              {c}
              <span className="font-mono tabular-nums">{[4, 2, 7][i]}</span>
            </p>
            <div className="space-y-1.5">
              {Array.from({ length: [3, 2, 3][i] }, (_, k) => (
                <span key={k} className="block h-7 rounded-md border border-line bg-navy-850 px-1.5 pt-1.5">
                  <span className="block h-1 w-3/4 rounded-full bg-fg/20" />
                  <span className="mt-1 block h-1 w-1/2 rounded-full bg-fg/10" />
                </span>
              ))}
            </div>
          </div>
        ))}
        {/* La tarjeta que avanza (mismo ancho que una columna menos su relleno) */}
        <span
          aria-hidden="true"
          className="svc-move pointer-events-none absolute left-2 top-[34px] flex h-7 w-[calc((100%-16px)/3-16px)] items-center gap-1.5 rounded-md border border-blue-400/70 bg-blue-500/20 px-1.5 text-[9.5px] font-medium text-ink shadow-[0_10px_24px_-10px_rgb(31_107_255/0.7)]"
        >
          <span className="size-1.5 shrink-0 rounded-full bg-blue-400" />
          <span className="truncate">Pedido mayorista</span>
        </span>
      </div>
    </div>
  );
}

/* Agentes de IA: los canales entran al agente y cada consulta sale con su etiqueta */
function AgentScene() {
  const inputs = [siWhatsapp, siInstagram, siMeta];
  const tags = ["Quiere comprar", "Turno agendado", "Pasa a Ventas"];
  return (
    <div className="absolute inset-0 flex items-center justify-between gap-3 px-5">
      <ul className="flex flex-col gap-2.5">
        {inputs.map((s, i) => (
          <li
            key={s.title}
            style={d(0.1 + i * 0.1)}
            className="svc-rise grid size-9 place-items-center rounded-xl border border-line bg-navy-900 text-ink"
          >
            <Brand path={s.path} className="size-4" />
          </li>
        ))}
      </ul>
      {/* Las consultas viajan hacia el agente */}
      <div aria-hidden="true" className="relative h-24 flex-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute inset-x-0 h-px bg-line-strong" style={{ top: `${18 + i * 32}%` }}>
            {/* El tramo entero se desplaza (100 % = el largo de la línea) y lleva el punto */}
            <span className="svc-packet absolute inset-0" style={{ animationDelay: `${i * -0.9}s` }}>
              <span className="absolute -top-[2px] left-0 size-[5px] rounded-full bg-blue-400 shadow-[0_0_8px_var(--blue-400)]" />
            </span>
          </span>
        ))}
      </div>
      <div style={d(0.2)} className="svc-pop relative grid size-[68px] shrink-0 place-items-center rounded-[22px] border border-blue-400/60 bg-blue-500/15 text-blue-300">
        <span aria-hidden="true" className="svc-halo absolute -inset-2 rounded-[26px] border border-blue-400/40" />
        <Sparkle weight="light" className="size-7" />
      </div>
      <ul className="flex min-w-0 flex-col gap-2">
        {tags.map((t, i) => (
          <li
            key={t}
            style={d(0.45 + i * 0.12)}
            className="svc-rise flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line-strong bg-navy-850 px-2.5 py-1 text-[10.5px] text-ink"
          >
            <span className="size-1.5 rounded-full bg-blue-400" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Marketing: un posteo, un reel y un anuncio en abanico, con las plataformas donde pautamos */
function MarketingScene() {
  const platforms = [siMeta, siInstagram, siGoogleads, siTiktok];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6 px-5">
      <div className="relative h-[150px] w-[200px] shrink-0">
        {/* Posteo */}
        <div className="svc-fan svc-fan-l absolute left-0 top-3 h-[132px] w-[86px] overflow-hidden rounded-xl border border-line-strong bg-navy-900">
          <span className="block h-[78px] bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--blue-400)_70%,transparent),transparent_65%),linear-gradient(160deg,var(--navy-700),var(--navy-850))]" />
          <span className="mx-2 mt-2 block h-1 w-3/4 rounded-full bg-fg/25" />
          <span className="mx-2 mt-1 block h-1 w-1/2 rounded-full bg-fg/15" />
          <span className="mx-2 mt-2 block text-[9px] text-ink-faint">Contenido</span>
        </div>
        {/* Anuncio (adelante) */}
        <div className="svc-fan svc-fan-r absolute right-0 top-3 h-[132px] w-[86px] overflow-hidden rounded-xl border border-line-strong bg-navy-900">
          <span className="block px-2 pt-1.5 text-[8.5px] text-ink-faint">Publicidad</span>
          <span className="mx-2 mt-1 block h-[58px] rounded-md bg-[linear-gradient(140deg,var(--blue-500),color-mix(in_oklab,var(--blue-300)_60%,transparent))]" />
          <span className="mx-2 mt-2 block rounded-full bg-blue-500 py-1 text-center text-[8.5px] font-medium text-white">
            Enviar mensaje
          </span>
          <span className="mx-2 mt-1.5 block text-[9px] text-ink-faint">Pauta</span>
        </div>
        {/* Reel (al centro, adelante de todo) */}
        <div className="svc-fan svc-fan-c absolute left-1/2 top-0 h-[140px] w-[86px] -translate-x-1/2 overflow-hidden rounded-xl border border-blue-400/50 bg-navy-850 shadow-[0_24px_40px_-20px_rgb(var(--shade-rgb)/0.9)]">
          <span className="relative block h-[104px] bg-[linear-gradient(200deg,color-mix(in_oklab,var(--blue-500)_55%,transparent),var(--navy-900)_80%)]">
            <span className="absolute left-1/2 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/20">
              <span className="ml-0.5 size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
            </span>
            <span className="absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/25">
              <span className="svc-progress block h-full w-full origin-left rounded-full bg-white" />
            </span>
          </span>
          <span className="mx-2 mt-2 block text-[9px] text-ink-faint">Reels</span>
        </div>
      </div>
      <ul className="hidden flex-col gap-2 min-[400px]:flex">
        {platforms.map((s, i) => (
          <li
            key={s.title}
            style={d(0.3 + i * 0.08)}
            className="svc-rise flex items-center gap-2 rounded-full border border-line bg-navy-900 py-1 pl-1.5 pr-2.5 text-[10.5px] text-ink"
          >
            <Brand path={s.path} className="size-3.5" />
            {s.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Híbridos: una placa conectada a sensores, una pantalla y un tablero; los datos viajan por las pistas */
function HybridScene() {
  const nodes = [
    { label: "Sensor de flujo", x: 18, y: 20 },
    { label: "Válvula", x: 18, y: 80 },
    { label: "Pantalla", x: 82, y: 20 },
    { label: "Tablero en la nube", x: 82, y: 80 },
  ];
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full">
        {nodes.map((n, i) => {
          const path = `M50,50 L${n.x < 50 ? 38 : 62},50 L${n.x < 50 ? 30 : 70},${n.y} L${n.x},${n.y}`;
          return (
            <g key={n.label}>
              <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <path
                d={path}
                fill="none"
                stroke="var(--blue-400)"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={100}
                className="svc-trace"
                // El sensor manda datos hacia la placa; el resto los recibe de ella
                style={{ animationDelay: `${i * -0.55}s`, animationDirection: i === 0 ? "reverse" : "normal" }}
              />
            </g>
          );
        })}
      </svg>
      {/* La placa */}
      <div
        style={d(0.1)}
        className="svc-pop absolute left-1/2 top-1/2 grid size-[74px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-blue-400/60 bg-navy-900 text-blue-300 shadow-[0_0_0_6px_color-mix(in_oklab,var(--blue-500)_10%,transparent)]"
      >
        <span aria-hidden="true" className="absolute inset-x-3 -top-1.5 flex justify-between">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="h-1.5 w-1 rounded-sm bg-fg/25" />
          ))}
        </span>
        <span aria-hidden="true" className="absolute inset-x-3 -bottom-1.5 flex justify-between">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="h-1.5 w-1 rounded-sm bg-fg/25" />
          ))}
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <Cpu weight="light" className="size-6" />
          <span className="font-mono text-[9px] text-ink-muted">ESP32</span>
        </span>
      </div>
      {nodes.map((n, i) => (
        <span
          key={n.label}
          style={{ ...d(0.25 + i * 0.1), left: `${n.x}%`, top: `${n.y}%` }}
          className="svc-node absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line-strong bg-navy-850 px-2.5 py-1 text-[10.5px] text-ink"
        >
          {n.label}
        </span>
      ))}
    </div>
  );
}

const SERVICES: Service[] = [
  {
    id: "web",
    icon: Globe,
    name: "Desarrollo web",
    title: "Webs rápidas, pensadas para que te escriban.",
    text: "Diseñamos y programamos sitios que cargan rápido en el celular, aparecen en Google y llevan cada visita a una consulta.",
    items: ["Landing pages para campañas", "Sitios institucionales", "Catálogos y tiendas online", "SEO para búsquedas locales"],
    work: ["baterias-cordoba", "adami-industrial", "rental-cordoba"],
    Scene: WebScene,
    span: "lg:col-span-7",
  },
  {
    id: "software",
    icon: Kanban,
    name: "Software a medida",
    title: "Sistemas hechos para cómo trabaja tu equipo.",
    text: "CRM, reservas y paneles de gestión que se adaptan a tu negocio, y no al revés.",
    items: ["CRM y seguimiento de clientes", "Sistemas de reservas y turnos", "Paneles y tableros", "Integraciones con lo que ya usás"],
    work: ["motobox-cordoba", "non-sistemas-reservas"],
    Scene: SoftwareScene,
    span: "lg:col-span-5",
  },
  {
    id: "ia",
    icon: Sparkle,
    name: "Agentes de IA",
    title: "Atienden por WhatsApp e Instagram, a toda hora.",
    text: "Responden en segundos, detectan quién quiere comprar y le pasan la conversación al vendedor indicado.",
    items: ["Respuestas al instante, 24/7", "Calificación de consultas", "Turnos y visitas agendadas", "Derivación al vendedor"],
    work: [],
    Scene: AgentScene,
    span: "lg:col-span-5",
  },
  {
    id: "marketing",
    icon: Megaphone,
    name: "Marketing",
    title: "Contenido, redes y pauta que traen clientes.",
    text: "Creamos el contenido, manejamos tus redes y pautamos en Meta y Google para que lleguen consultas todos los días.",
    items: ["Creación de contenido: foto, video y diseño", "Community management", "Pauta en Meta Ads y Google Ads", "Reportes con resultados en ventas"],
    work: [],
    Scene: MarketingScene,
    span: "lg:col-span-7",
  },
  {
    id: "hibridos",
    icon: Lightning,
    name: "Proyectos híbridos",
    title: "Software y hardware, conectados.",
    text: "Cuando la solución también es física: placas, sensores y pantallas que se comunican con tu sistema y te muestran todo en tiempo real.",
    items: ["Placas ESP32 y sensores", "Pantallas e interfaces para tus clientes", "Telemetría y control a distancia", "Automatización de procesos"],
    work: ["cerveceria-automatica"],
    Scene: HybridScene,
    span: "lg:col-span-12",
  },
];

/* Lleva a la ficha del proyecto; si el filtro de Proyectos la ocultaba, primero lo quita */
function goToProject(slug: string, event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.dispatchEvent(new CustomEvent("sen:show-project", { detail: slug }));
  const target = document.getElementById(`proyecto-${slug}`);
  if (!target) return;
  target.focus({ preventScroll: true });
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target);
  } else target.scrollIntoView({ block: "start" });
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.3 });
  const live = useInView(ref, { amount: 0.05 });
  const wide = service.id === "hibridos";
  const work = service.work.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const { Scene, icon: ServiceIcon } = service;

  return (
    <Reveal as="article" delay={(index % 2) * 0.08} className={`${service.span} min-w-0`}>
      {/* Doble bisel: bandeja exterior y núcleo con su propio brillo */}
      <div
        ref={ref}
        id={`trabajo-${service.id}`}
        data-shown={shown}
        data-live={live}
        className="svc-card group h-full rounded-[2rem] border border-line bg-fg/[0.025] p-1.5"
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-navy-850 shadow-[inset_0_1px_0_rgb(var(--fg-rgb)/0.06)] ${
            wide ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""
          }`}
        >
          {/* Escena del servicio */}
          <div
            className={`relative h-[200px] shrink-0 overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_oklab,var(--blue-500)_12%,transparent),transparent_70%)] sm:h-[220px] ${
              wide ? "lg:order-2 lg:h-auto lg:min-h-[300px] lg:border-b-0 lg:border-l" : ""
            }`}
          >
            <div aria-hidden="true" className="svc-grid absolute inset-0" />
            <div aria-hidden="true" className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
              <Scene />
            </div>
          </div>

          {/* Qué es, qué incluye y dónde lo hicimos */}
          <div className={`flex flex-1 flex-col p-6 md:p-7 ${wide ? "lg:p-10" : ""}`}>
            <p className="flex items-center gap-2 text-sm font-medium text-blue-300">
              <ServiceIcon weight="light" aria-hidden="true" className="size-[18px]" />
              {service.name}
            </p>
            <h3 className="font-display mt-3 max-w-[22ch] text-[1.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink md:text-[1.75rem]">
              {service.title}
            </h3>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">{service.text}</p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 text-[14px] text-ink sm:grid-cols-2">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-2.5 shrink-0 -skew-x-[24.5deg] bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
            {work.length > 0 && (
              <div className="mt-auto pt-6">
                <p className="text-xs text-ink-faint">Lo hicimos para</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {work.map((p) => (
                    <li key={p.slug}>
                      <a
                        href={`#proyecto-${p.slug}`}
                        onClick={(e) => goToProject(p.slug, e)}
                        className="group/link inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-strong py-1 pl-3 pr-2 text-[13px] text-ink transition-colors duration-150 hover:border-blue-400/60 hover:text-blue-300"
                      >
                        {p.client ?? p.name}
                        <ArrowUpRight
                          size={13}
                          weight="bold"
                          aria-hidden="true"
                          className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/link:-translate-y-px group-hover/link:translate-x-0.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

const SUMMARY: { icon: Icon; label: string; href: string }[] = [
  { icon: Code, label: "Desarrollo web", href: "#trabajo-web" },
  { icon: Kanban, label: "Software a medida", href: "#trabajo-software" },
  { icon: Sparkle, label: "Agentes de IA", href: "#trabajo-ia" },
  { icon: Broadcast, label: "Marketing y redes", href: "#trabajo-marketing" },
  { icon: Cpu, label: "Software + hardware", href: "#trabajo-hibridos" },
];

export function Services() {
  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-36">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2
            id="trabajos-titulo"
            className="font-display max-w-[17ch] text-[clamp(2.3rem,8.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.6rem] lg:text-[4.2rem]"
          >
            <MaskWords text="Todo lo que tu negocio necesita para vender." />
          </h2>
          <div>
            <p className="max-w-[46ch] text-base leading-relaxed text-ink-muted md:text-lg">
              Webs, software, agentes de IA, marketing y proyectos que unen software con hardware. Un solo
              equipo, de la idea a los resultados.
            </p>
            {/* Índice: lleva a cada servicio */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {SUMMARY.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong bg-navy-850/60 px-3.5 text-[13px] text-ink transition-colors duration-150 hover:border-blue-400/60 hover:text-blue-300"
                  >
                    <s.icon weight="light" aria-hidden="true" className="size-4 text-blue-300" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 lg:grid-cols-12 lg:gap-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
