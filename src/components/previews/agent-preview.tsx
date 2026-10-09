"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Sparkle, WhatsappLogo } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { PreviewShell, LiveBadge, usePreviewLoop } from "./preview-shell";

type Msg = { from: "cliente" | "agente"; text: string };

const MESSAGES: Msg[] = [
  { from: "cliente", text: "Hola, vi el anuncio del SUV 0km. ¿Tienen financiación?" },
  { from: "agente", text: "Hola. Sí, hay planes de hasta 60 cuotas. ¿Para cuándo pensás la compra?" },
  { from: "cliente", text: "Este mes. Tengo un usado para entregar." },
  { from: "agente", text: "Perfecto. Le paso tu consulta a un asesor de ventas ahora mismo." },
];

// Ficha que el agente va extrayendo de la conversación
const FIELDS = [
  { label: "Interés", value: "SUV 0km", after: 1 },
  { label: "Financiación", value: "Sí, en cuotas", after: 2 },
  { label: "Plazo de compra", value: "Este mes", after: 3 },
  { label: "Permuta", value: "Usado", after: 3 },
];

// Momentos (ms) en que aparece cada mensaje; el agente "escribe" antes de responder
const TIMELINE = [500, 2300, 3900, 5700];
const ASSIGN_AT = 6500;
const LOOP = 10500;

export function AgentPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { running, paused, setPaused } = usePreviewLoop(ref);
  // Sin animación (o fuera de pantalla al inicio) se muestra la conversación completa
  const [shown, setShown] = useState(MESSAGES.length);
  const [assigned, setAssigned] = useState(true);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timers: number[] = [];
    const run = () => {
      setShown(0);
      setAssigned(false);
      setTyping(false);
      TIMELINE.forEach((t, i) => {
        if (MESSAGES[i].from === "agente") {
          timers.push(window.setTimeout(() => setTyping(true), t - 900));
        }
        timers.push(
          window.setTimeout(() => {
            setTyping(false);
            setShown(i + 1);
          }, t),
        );
      });
      timers.push(window.setTimeout(() => setAssigned(true), ASSIGN_AT));
    };
    timers.push(window.setTimeout(run, 0));
    const loop = window.setInterval(run, LOOP);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(loop);
    };
  }, [running]);

  const priorityKnown = shown >= 3;

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col">
      <PreviewShell
        title="Agente de IA · WhatsApp Business"
        status={<LiveBadge label="Atendiendo" paused={paused} />}
        paused={paused}
        onTogglePause={() => setPaused((p) => !p)}
      >
        <div className="grid h-full gap-3 sm:grid-cols-[1.25fr_1fr] stack-sm:flex stack-sm:min-h-0 stack-sm:flex-col">
          <div className="flex min-h-[230px] flex-col justify-end gap-2 rounded-xl border border-line bg-navy-900/80 p-3 stack-sm:min-h-[200px]">
            <AnimatePresence initial={false}>
              {MESSAGES.slice(0, shown).map((m, i) => (
                <motion.div
                  key={`${i}-${m.from}`}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${
                    m.from === "cliente"
                      ? "self-start rounded-bl-md bg-navy-700 text-ink"
                      : "self-end rounded-br-md bg-blue-500 text-white"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-1 self-end rounded-2xl rounded-br-md bg-blue-500/20 px-3 py-2.5"
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 animate-bounce rounded-full bg-blue-300"
                      style={{ animationDelay: `${d * 120}ms` }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* En el apilado de celulares la ficha se resume en una línea (prioridad y asignación) */}
          <div
            className={`hidden items-center justify-between gap-2 rounded-xl border px-3 py-2 text-[12px] transition-[opacity,border-color] duration-300 stack-sm:flex ${
              assigned ? "border-blue-400/40 bg-blue-500/10 text-ink" : "border-line text-ink-muted"
            }`}
          >
            <span>Prioridad {priorityKnown ? "alta" : "en análisis"}</span>
            <span className={`transition-opacity duration-300 ${assigned ? "opacity-100" : "opacity-0"}`}>
              Asignado a Asesor 1
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-line bg-navy-900/80 p-3 stack-sm:hidden">
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              <Sparkle size={12} className="text-blue-400" /> Ficha del prospecto
            </p>
            <dl className="mt-1 grid gap-1.5 text-[12px]">
              {FIELDS.map((f) => {
                const known = shown >= f.after;
                return (
                  <div key={f.label} className="flex items-center justify-between gap-2 border-b border-line pb-1.5">
                    <dt className="text-ink-muted">{f.label}</dt>
                    <dd className={`text-right transition-opacity duration-300 ${known ? "text-ink opacity-100" : "opacity-0"}`}>
                      {f.value}
                    </dd>
                  </div>
                );
              })}
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted">Prioridad</dt>
                <dd
                  className={`rounded-full border px-2 py-0.5 text-[11px] transition-[opacity,transform] duration-300 ${
                    priorityKnown ? "border-blue-400/50 bg-blue-500/15 text-blue-300 opacity-100" : "scale-95 opacity-0"
                  }`}
                >
                  Alta
                </dd>
              </div>
            </dl>
            <div
              className={`mt-auto flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11.5px] transition-[opacity,transform,border-color] duration-300 ${
                assigned ? "border-blue-400/40 bg-blue-500/10 text-ink opacity-100" : "translate-y-1 border-line opacity-0"
              }`}
            >
              <WhatsappLogo size={14} className="shrink-0 text-ink-muted" aria-hidden="true" />
              <ArrowRight size={12} className="shrink-0 text-blue-400" aria-hidden="true" />
              Asignado a Asesor 1 en el CRM
            </div>
          </div>
        </div>
      </PreviewShell>
    </div>
  );
}
