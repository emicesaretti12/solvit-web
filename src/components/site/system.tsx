"use client";

/*
  El sistema SEN: a la izquierda, el titular grande en mayúsculas y los dos botones; a la
  derecha, una ventana con las vistas vivas de ejemplo (el embudo de campañas, el agente de IA y
  el CRM), que rotan solas, y debajo tres tarjetas, una por etapa, que también sirven de
  pestañas: la activa llena su barra de tiempo. La rotación se frena fuera de pantalla, con
  reduced motion o si la persona elige una etapa.
*/
import { WhatsappLogo } from "@phosphor-icons/react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { AgentPreview } from "@/components/previews/agent-preview";
import { CrmPreview } from "@/components/previews/crm-preview";
import { MarketingPreview } from "@/components/previews/marketing-preview";
import { SafeBoundary } from "@/components/safe-boundary";
import { CONTACT } from "@/content/contact-info";
import { tap } from "@/lib/haptics";
import { SplitText } from "./split-text";

type Step = { key: string; title: string; text: string; url: string; Preview: ComponentType };

const STEPS: Step[] = [
  {
    key: "atraer",
    title: "Atraer",
    text: "Contenido y pauta en Meta y Google que traen consultas, medidas hasta la venta.",
    url: "campañas",
    Preview: MarketingPreview,
  },
  {
    key: "atender",
    title: "Atender",
    text: "Un agente de IA responde al instante por WhatsApp, Instagram y tu web, a cualquier hora.",
    url: "agente",
    Preview: AgentPreview,
  },
  {
    key: "cerrar",
    title: "Cerrar",
    text: "Un CRM a tu medida ordena cada consulta por vendedor y por etapa, para que ninguna se pierda.",
    url: "crm",
    Preview: CrmPreview,
  },
];

const TURN = 9000;

export function System() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { amount: 0.3 });
  const reduce = useReducedMotion();
  const running = auto && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((v) => (v + 1) % STEPS.length), TURN);
    return () => window.clearTimeout(id);
  }, [running, active]);

  const step = STEPS[active];

  return (
    <section id="sistema" aria-labelledby="sistema-titulo" className="relative border-y border-line bg-paper py-20 md:py-[8vw]">
      <div className="mx-auto grid gap-14 px-5 md:px-[5.8vw] lg:grid-cols-[0.82fr_1.18fr] lg:gap-[5vw]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="sistema-titulo"
            className="text-[clamp(2.2rem,4vw,3.9rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-ink"
          >
            <SplitText text="Atraer, atender y cerrar." />
            <br />
            <span className="font-medium">
              <SplitText text="Un solo sistema para vender más." delay={220} />
            </span>
          </h2>
          <p data-reveal className="rise mt-8 max-w-[46ch] text-[17px] leading-[1.55] text-ink-muted [--delay:150ms]">
            Unimos el marketing, la atención y la gestión en un mismo circuito: cada consulta entra, se responde al
            instante y llega al vendedor correcto. Vos ves en un tablero qué campaña trajo cada venta.
          </p>
          <div data-reveal className="rise mt-9 flex flex-wrap gap-3 [--delay:250ms]">
            <a href="#contacto" className="pill inline-flex h-14 items-center rounded-full bg-ink px-8 text-[16px] font-medium text-white">
              <span className="roll">
                <span>Pedí tu diagnóstico</span>
                <span aria-hidden="true">Pedí tu diagnóstico</span>
              </span>
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="pill inline-flex h-14 items-center gap-2.5 rounded-full bg-blue-500 px-8 text-[16px] font-medium text-white [--pill-fill:var(--ink)]"
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          {/* Ventana con la vista viva de la etapa */}
          <div
            ref={frame}
            data-reveal
            className="rise overflow-hidden rounded-[1.75rem] bg-white shadow-[0_0_0_1px_rgb(var(--fg-rgb)/0.06),0_40px_90px_-50px_rgb(var(--shade-rgb)/0.55)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
              </span>
              <span className="mx-auto flex h-7 w-[min(60%,300px)] items-center justify-center overflow-hidden rounded-full bg-mist font-mono text-[11px] text-ink-faint">
                sistema.sen /{" "}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={step.url}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="ml-1 text-ink"
                  >
                    {step.url}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="relative h-[540px] p-3 md:h-[500px] md:p-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.key}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.985 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  <SafeBoundary>
                    <step.Preview />
                  </SafeBoundary>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Etapas: tarjetas que también son pestañas */}
          <div role="tablist" aria-label="Etapas del sistema" className="mt-4 grid gap-3 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    tap();
                    setActive(i);
                    setAuto(false);
                  }}
                  className={`relative overflow-hidden rounded-3xl border p-5 pb-6 text-left transition-[border-color,background-color,transform] duration-300 ease-out active:scale-[0.98] ${on ? "border-ink/25 bg-white" : "border-line bg-white/60 hover:border-ink/20"}`}
                >
                  <span className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                    <span className="tabular text-[12px] font-medium text-ink-faint">0{i + 1}</span>
                    {s.title}
                  </span>
                  <span className="mt-2.5 block text-[14.5px] leading-[1.5] text-ink-muted">{s.text}</span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
                    <span
                      key={`${active}-${running}`}
                      className="block h-full origin-left bg-blue-500"
                      style={{
                        transform: on && !running ? "scaleX(1)" : "scaleX(0)",
                        animation: on && running ? `sys-fill ${TURN}ms linear forwards` : undefined,
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[12.5px] text-ink-faint">Las vistas usan datos de ejemplo.</p>
        </div>
      </div>
    </section>
  );
}
