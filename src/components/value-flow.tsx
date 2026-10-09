"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ChatsCircle, Cpu, Database, Megaphone, Robot, TrendUp, type Icon } from "@phosphor-icons/react";
import { STACK_QUERY } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Stage = {
  icon: Icon;
  short: string;
  stage: string;
  discipline: string;
  does: string;
  text: string;
  log: string;
};

// El flujo de valor integrado de SEN, etapa por etapa
const STAGES: Stage[] = [
  {
    icon: Megaphone,
    short: "Pauta",
    stage: "Marketing y pauta",
    discipline: "Marketing",
    does: "Genera tráfico y demanda.",
    text: "Campañas en Meta Ads y Google Ads optimizadas para atraer prospectos con intención real de compra.",
    log: "meta_ads  campaña: SUV 0km en 60 cuotas  leads: 412",
  },
  {
    icon: ChatsCircle,
    short: "Canales",
    stage: "Interacción inicial",
    discipline: "Canales",
    does: "Recibe cada consulta, en el canal que sea.",
    text: "Instagram Direct, WhatsApp Business y formularios web conectados a un mismo flujo. Ninguna consulta queda sin respuesta.",
    log: "whatsapp  23:47  «Hola, ¿tienen financiación?»",
  },
  {
    icon: Robot,
    short: "Agente IA",
    stage: "Agente de IA",
    discipline: "Inteligencia artificial",
    does: "Filtra, califica y extrae datos críticos, las 24 horas.",
    text: "Conversa en lenguaje natural, entiende la intención de compra, responde dudas técnicas y clasifica al prospecto por prioridad.",
    log: "agente  intención: compra  prioridad: alta  datos: 4 de 4",
  },
  {
    icon: Database,
    short: "CRM",
    stage: "CRM y software central",
    discipline: "Software",
    does: "Organiza, audita métricas y asigna tareas a los equipos.",
    text: "El prospecto calificado llega al CRM y se asigna al vendedor correspondiente, con métricas auditables para cada área.",
    log: "crm  asignado: Asesor 1  etapa: calificado  aviso: 15 min",
  },
  {
    icon: Cpu,
    short: "Hardware",
    stage: "Hardware y operación física",
    discipline: "Hardware e IoT",
    does: "Controla stock, dispensación, accesos y telemetría.",
    text: "Sensores, lectores y controladores registran lo que pasa en el mundo físico, en la misma base de datos que el resto del negocio.",
    log: "esp32  barril_3  flujo: 4,4 L/min  válvula: abierta",
  },
  {
    icon: TrendUp,
    short: "Crecimiento",
    stage: "Crecimiento escalable",
    discipline: "Resultado",
    does: "Un sistema trazable de punta a punta.",
    text: "La intuición y el trabajo manual se reemplazan por procesos estructurados, medibles y rentables, listos para crecer.",
    log: "tablero  ventas, stock y operación en un solo lugar",
  },
];

/*
  Circuito: seis nodos en zigzag unidos por pistas a 45°, todos los tramos del mismo largo,
  así el pulso tarda lo mismo entre cada par de etapas.
*/
const VB_W = 1200;
const VB_H = 200;
const RUN = 40;
const DIAG = 72;
const node = (i: number) => ({ x: 100 + i * 200, y: i % 2 === 0 ? 64 : 136 });
const PATH = STAGES.slice(1)
  .map((_, i) => {
    const a = node(i);
    const b = node(i + 1);
    return `H${a.x + RUN} L${a.x + RUN + DIAG} ${b.y} H${b.x}`;
  })
  .reduce((d, seg) => `${d} ${seg}`, `M${node(0).x} ${node(0).y}`);
const PATH_LEN = (STAGES.length - 1) * (200 - DIAG + DIAG * Math.SQRT2);

const clamp = (n: number) => Math.min(1, Math.max(0, n));

function Circuit({
  progressRef,
  packetRef,
}: {
  progressRef: React.RefObject<SVGPathElement | null>;
  packetRef: React.RefObject<SVGGElement | null>;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative hidden stack:block"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="flow-trace" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#1f6bff" />
            <stop offset="1" stopColor="#8db8ff" />
          </linearGradient>
        </defs>
        {/* Pistas de entrada y salida, como en una placa */}
        <path d={`M0 64 H100`} stroke="rgb(160 178 210 / 0.12)" strokeWidth="1.5" fill="none" />
        <path d={`M1100 136 H1200`} stroke="rgb(160 178 210 / 0.12)" strokeWidth="1.5" fill="none" />
        <path d={PATH} stroke="rgb(160 178 210 / 0.22)" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
        <path
          ref={progressRef}
          d={PATH}
          stroke="url(#flow-trace)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={PATH_LEN}
          strokeDashoffset={PATH_LEN}
        />
        {STAGES.slice(1).map((_, i) => {
          const a = node(i);
          const b = node(i + 1);
          return (
            <circle
              key={i}
              cx={a.x + RUN + DIAG / 2}
              cy={(a.y + b.y) / 2}
              r="3"
              fill="#0a0f1b"
              stroke="rgb(160 178 210 / 0.35)"
              strokeWidth="1.5"
            />
          );
        })}
        <g ref={packetRef} transform={`translate(${node(0).x} ${node(0).y})`}>
          <circle r="11" fill="#1f6bff" opacity="0.22" />
          <circle r="4" fill="#dceaff" />
        </g>
      </svg>
      {STAGES.map((s, i) => {
        const { x, y } = node(i);
        const top = i % 2 === 0;
        return (
          <div
            key={s.stage}
            data-flow-node={i}
            data-state={i === 0 ? "active" : "next"}
            className="group/node absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
          >
            <span
              className={`absolute whitespace-nowrap text-[12px] font-medium text-ink-faint transition-colors duration-300 group-data-[state=active]/node:text-ink group-data-[state=done]/node:text-ink-muted ${
                top ? "bottom-full mb-3" : "top-full mt-3"
              }`}
            >
              {s.short}
            </span>
            <span className="flex size-14 items-center justify-center rounded-2xl border border-line-strong bg-navy-850 text-ink-faint transition-[color,border-color,background-color,box-shadow] duration-300 group-data-[state=active]/node:border-blue-400/70 group-data-[state=active]/node:bg-navy-800 group-data-[state=active]/node:text-blue-300 group-data-[state=active]/node:shadow-[0_0_0_6px_rgb(31_107_255/0.12)] group-data-[state=done]/node:text-ink">
              <s.icon size={24} weight="light" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ValueFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const reduce = useReducedMotion();

  // Móvil y reduced motion: línea vertical que se llena con el scroll (sin fijar la sección)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.65", "end 0.65"] });
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Escritorio: la sección queda fija y el pulso recorre el circuito con el scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(STACK_QUERY, () => {
        const section = sectionRef.current;
        const path = progressRef.current;
        const packet = packetRef.current;
        if (!section || !path || !packet) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-flow-node]", section);
        const panels = gsap.utils.toArray<HTMLElement>("[data-flow-stage]", section);
        let current = -1;

        const apply = (p: number) => {
          // Pausa corta al principio y al final, para leer la primera y la última etapa
          const q = clamp((p - 0.05) / 0.88);
          path.style.strokeDashoffset = String(len * (1 - q));
          const pt = path.getPointAtLength(len * q);
          packet.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          const active = Math.round(q * (STAGES.length - 1));
          if (active === current) return;
          current = active;
          nodes.forEach((n, i) => {
            n.dataset.state = i < active ? "done" : i === active ? "active" : "next";
          });
          panels.forEach((panel, i) => {
            panel.dataset.active = String(i === active);
          });
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => apply(self.progress),
        });
        apply(st.progress);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="flujo"
      aria-labelledby="flujo-titulo"
      className="relative border-t border-line bg-navy-950/40 stack:h-[400svh]"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-36 stack:sticky stack:top-0 stack:flex stack:h-[100svh] stack:flex-col stack:justify-center stack:py-0 stack:pt-20">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-12">
          <h2
            id="flujo-titulo"
            className="font-display max-w-[20ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.2rem]"
          >
            Del anuncio a la operación, sin cortes.
          </h2>
          <p className="max-w-[50ch] text-lg leading-relaxed text-ink-muted">
            Así interactúan las cuatro disciplinas frente a un problema de negocio: cada etapa alimenta a la
            siguiente sobre la misma infraestructura técnica.
          </p>
        </div>

        <div className="mt-14 stack:mt-[clamp(2.5rem,7svh,4.5rem)]">
          <Circuit progressRef={progressRef} packetRef={packetRef} />
        </div>

        <div className="relative mt-14 stack:mt-[clamp(2rem,6svh,4rem)]">
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[21px] top-6 w-px bg-line-strong stack:hidden"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : fill }}
            className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-gradient-to-b from-blue-500 to-blue-300 stack:hidden"
          />
          <ol ref={listRef} className="relative stack:h-[160px]">
            {STAGES.map((s, i) => (
              <li
                key={s.stage}
                data-flow-stage={i}
                data-active={i === 0}
                className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-5 pb-10 last:pb-0 stack:absolute stack:inset-0 stack:block stack:pb-0 stack:opacity-0 stack:[transform:translateY(12px)] stack:transition-[opacity,transform] stack:duration-300 stack:ease-[var(--ease-out)] stack:data-[active=true]:opacity-100 stack:data-[active=true]:[transform:none]"
              >
                <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line-strong bg-navy-900 text-blue-400 stack:hidden">
                  <s.icon size={20} weight="light" aria-hidden="true" />
                </span>
                <div className="min-w-0 stack:grid stack:grid-cols-[0.95fr_1.05fr] stack:gap-14">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl stack:font-display stack:text-[2.2rem] stack:leading-[1.05] stack:tracking-[-0.03em]">
                        {s.stage}
                      </h3>
                      <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[11px] text-ink-muted">
                        {s.discipline}
                      </span>
                    </div>
                    <p className="mt-3 text-lg text-ink stack:text-xl">{s.does}</p>
                  </div>
                  <div className="mt-3 stack:mt-0">
                    <p className="max-w-[52ch] leading-relaxed text-ink-muted stack:text-lg">{s.text}</p>
                    <p className="mt-4 flex max-w-full items-center gap-2 overflow-hidden rounded-lg border border-line bg-navy-950/70 px-3 py-2 font-mono text-[12px] text-ink-muted">
                      <span className="text-blue-400" aria-hidden="true">
                        ›
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-pre">{s.log}</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
