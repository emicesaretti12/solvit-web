"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  Megaphone,
  ChatsCircle,
  Robot,
  Database,
  Cpu,
  TrendUp,
} from "@phosphor-icons/react";
import { useRef } from "react";

const steps = [
  {
    icon: Megaphone,
    stage: "Marketing y pauta",
    title: "Generamos la demanda",
    text: "Campañas en Meta Ads y Google Ads optimizadas para atraer prospectos con intención real de compra.",
  },
  {
    icon: ChatsCircle,
    stage: "Interacción inicial",
    title: "Recibimos cada consulta",
    text: "WhatsApp, Instagram y formularios web conectados a un mismo flujo. Ninguna consulta queda sin respuesta.",
  },
  {
    icon: Robot,
    stage: "Agente de IA",
    title: "Calificamos al instante",
    text: "El agente conversa, entiende la intención, extrae los datos clave y prioriza cada prospecto las 24 horas.",
  },
  {
    icon: Database,
    stage: "CRM y software central",
    title: "Organizamos y asignamos",
    text: "El prospecto llega al CRM y se asigna al vendedor correcto, con métricas auditables para cada equipo.",
  },
  {
    icon: Cpu,
    stage: "Hardware y operación física",
    title: "Controlamos lo tangible",
    text: "Sensores y controladores registran stock, dispensación, accesos y telemetría en la misma base de datos.",
  },
  {
    icon: TrendUp,
    stage: "Crecimiento escalable",
    title: "Escalamos con datos",
    text: "Un sistema trazable de punta a punta reemplaza la intuición y el trabajo manual.",
  },
];

export function Method() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="metodo" className="border-t border-line bg-navy-950/50">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-4 py-24 md:px-6 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-blue-300">
            Flujo de valor
          </p>
          <h2 className="max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Del anuncio a la operación, sin cortes.
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-muted">
            Cada etapa alimenta a la siguiente sobre la misma infraestructura.
            Así se ve un problema de negocio resuelto por Solvit.
          </p>
        </div>

        <ol ref={ref} className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[21px] top-6 w-px bg-line-strong"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-gradient-to-b from-blue-500 to-blue-300"
          />
          {steps.map((s, i) => (
            <motion.li
              key={s.stage}
              initial={reduce ? false : { opacity: 0.25 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.9, margin: "0px 0px -25% 0px" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative grid grid-cols-[44px_1fr] gap-5 pb-12 last:pb-0"
            >
              <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line-strong bg-navy-900 text-blue-300">
                <s.icon size={20} weight="light" />
              </span>
              <div className="pt-1">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                  {s.stage}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[52ch] leading-relaxed text-ink-muted">
                  {s.text}
                </p>
                {i < steps.length - 1 && <span className="sr-only">luego</span>}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
