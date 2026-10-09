"use client";

import { motion } from "motion/react";
import { TrendDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { PreviewShell, useLive } from "./preview-shell";

type Channel = "Meta Ads" | "Google Ads";
const CHANNELS: Channel[] = ["Meta Ads", "Google Ads"];

// Embudo de ejemplo por canal: del anuncio a la venta cerrada
const FUNNEL: Record<Channel, { stage: string; value: number }[]> = {
  "Meta Ads": [
    { stage: "Impresiones", value: 48200 },
    { stage: "Clics", value: 1930 },
    { stage: "Leads", value: 412 },
    { stage: "Calificados por IA", value: 168 },
    { stage: "Ventas", value: 37 },
  ],
  "Google Ads": [
    { stage: "Impresiones", value: 31500 },
    { stage: "Clics", value: 2210 },
    { stage: "Leads", value: 356 },
    { stage: "Calificados por IA", value: 151 },
    { stage: "Ventas", value: 41 },
  ],
};

const CPA: Record<Channel, { now: string; before: string; delta: string }> = {
  "Meta Ads": { now: "$ 18.400", before: "$ 26.900", delta: "−31,6 %" },
  "Google Ads": { now: "$ 21.700", before: "$ 29.300", delta: "−25,9 %" },
};

const fmt = (n: number) => n.toLocaleString("es-AR");

// Escala logarítmica: con valores lineales las últimas etapas serían invisibles
const MAX_LOG = Math.log10(48200);
const width = (v: number) => Math.max(0.08, Math.log10(v) / MAX_LOG);

export function MarketingPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  const [channel, setChannel] = useState<Channel>("Meta Ads");
  const [manual, setManual] = useState(false);

  // Alterna de canal sola hasta que la persona elige uno
  useEffect(() => {
    if (!live || manual) return;
    const id = window.setInterval(() => {
      setChannel((c) => (c === "Meta Ads" ? "Google Ads" : "Meta Ads"));
    }, 3600);
    return () => window.clearInterval(id);
  }, [live, manual]);

  const rows = FUNNEL[channel];
  const cpa = CPA[channel];
  const rate = ((rows[4].value / rows[2].value) * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 });

  return (
    <div ref={ref} className="h-full">
      <PreviewShell title="Embudo de adquisición · últimos 30 días">
        <div role="group" aria-label="Canal" className="inline-flex gap-1 rounded-xl border border-line bg-navy-900 p-1">
          {CHANNELS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={c === channel}
              onClick={() => {
                setManual(true);
                setChannel(c);
              }}
              className={`relative rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 active:scale-[0.97] ${
                c === channel ? "text-white" : "text-ink-muted hover:text-ink"
              }`}
            >
              {c === channel && (
                <motion.span
                  layoutId="mkt-channel"
                  className="absolute inset-0 rounded-lg bg-blue-500"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>

        <ol className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <li key={r.stage} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <span className="text-[12px] text-ink-muted">{r.stage}</span>
              <span className="text-right font-mono text-[12px] text-ink tabular">{fmt(r.value)}</span>
              <span className="col-span-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className={`block h-full origin-left rounded-full transition-transform duration-700 ease-[var(--ease-out)] ${
                    i >= 3 ? "bg-blue-400" : "bg-white/25"
                  }`}
                  style={{ transform: `scaleX(${width(r.value)})` }}
                />
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-navy-900/80 p-3">
            <p className="text-[11px] text-ink-faint">Costo por adquisición</p>
            <p className="mt-1 font-mono text-[15px] text-ink tabular">{cpa.now}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-blue-300">
              <TrendDown size={12} weight="bold" aria-hidden="true" /> {cpa.delta} vs. {cpa.before}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-navy-900/80 p-3">
            <p className="text-[11px] text-ink-faint">Lead a venta</p>
            <p className="mt-1 font-mono text-[15px] text-ink tabular">{rate} %</p>
            <p className="mt-1 text-[11px] text-ink-muted">Cada venta, atribuida a su anuncio</p>
          </div>
        </div>
      </PreviewShell>
    </div>
  );
}
