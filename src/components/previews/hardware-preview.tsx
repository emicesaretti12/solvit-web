"use client";

import { AnimatePresence, motion } from "motion/react";
import { Cpu, IdentificationCard, Drop } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LiveBadge, PreviewShell, useLive } from "./preview-shell";

const POINTS = 32;
const START = Array.from({ length: POINTS }, (_, i) => 4.2 + Math.sin(i / 3) * 0.6);
const CARDS = ["04:A1:7F:2C", "1B:9E:44:D0", "7C:03:E5:81", "A2:6F:19:BB"];

// `at` es el segundo de lectura; se muestra como tiempo relativo (igual en servidor y cliente)
type Access = { id: number; card: string; ok: boolean; at: number };
const SEED: Access[] = [
  { id: -1, card: CARDS[1], ok: true, at: -4 },
  { id: -2, card: CARDS[2], ok: false, at: -19 },
  { id: -3, card: CARDS[3], ok: true, at: -47 },
];

const fmt = (n: number, d = 1) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
const ago = (s: number) => (s < 1 ? "ahora" : s < 60 ? `hace ${s} s` : `hace ${Math.floor(s / 60)} min`);

function sparkPath(values: number[], w: number, h: number) {
  const min = 2.5;
  const max = 6;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function HardwarePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  const [flow, setFlow] = useState(START);
  const [valveOpen, setValveOpen] = useState(true);
  const [dispensed, setDispensed] = useState(18.4);
  const [stock, setStock] = useState(62);
  const [log, setLog] = useState<Access[]>(SEED);
  const [now, setNow] = useState(0);
  // El reloj sigue desde donde quedó si la vista sale y vuelve a la pantalla
  const tickRef = useRef(0);

  // Telemetría: una lectura por segundo mientras la vista está en pantalla
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      const tick = ++tickRef.current;
      setNow(tick);
      const open = tick % 12 < 9; // ciclos de dispensación: 9s abierta, 3s cerrada
      setValveOpen(open);
      setFlow((prev) => {
        const last = prev[prev.length - 1];
        const target = open ? 4.4 : 2.7;
        const next = Math.min(5.8, Math.max(2.6, last + (target - last) * 0.45 + (Math.random() - 0.5) * 0.5));
        return [...prev.slice(1), next];
      });
      if (open) {
        setDispensed((d) => d + 0.07);
        if (tick % 4 === 0) setStock((s) => Math.max(8, s - 1));
      }
      if (tick % 5 === 2) {
        setLog((l) => [{ id: tick, card: CARDS[tick % CARDS.length], ok: tick % 3 !== 1, at: tick }, ...l].slice(0, 3));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const current = flow[flow.length - 1];

  return (
    <div ref={ref} className="h-full">
      <PreviewShell title="Nodo ESP32 · Barril 3" status={<LiveBadge label="En línea" />}>
        <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col rounded-xl border border-line bg-navy-900/80 p-3">
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              <Drop size={12} className="text-blue-400" /> Medidor de flujo
            </p>
            <p className="mt-2 font-mono text-3xl font-medium text-ink tabular">
              {fmt(current)} <span className="text-sm text-ink-muted">L/min</span>
            </p>
            <svg viewBox="0 0 220 60" className="mt-auto h-20 w-full pt-2" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="hw-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1f6bff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#1f6bff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${sparkPath(flow, 220, 56)} L220,60 L0,60 Z`} fill="url(#hw-fill)" />
              <path d={sparkPath(flow, 220, 56)} fill="none" stroke="#3d8bff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <div className="rounded-xl border border-line bg-navy-900/80 p-3">
              <p className="text-[11px] text-ink-faint">Válvula solenoide</p>
              <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-ink">
                <span
                  className={`size-2 rounded-full transition-colors duration-300 ${valveOpen ? "bg-blue-400" : "bg-ink-faint"}`}
                />
                {valveOpen ? "Abierta" : "Cerrada"}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-navy-900/80 p-3">
              <p className="text-[11px] text-ink-faint">Dispensado hoy</p>
              <p className="mt-1 font-mono text-[15px] text-ink tabular">{fmt(dispensed)} L</p>
            </div>
            <div className="col-span-2 rounded-xl border border-line bg-navy-900/80 p-3 sm:col-span-1">
              <div className="flex items-center justify-between text-[11px] text-ink-faint">
                <span>Stock del barril</span>
                <span className="font-mono text-ink tabular">{stock}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full origin-left rounded-full bg-blue-400 transition-transform duration-700 ease-out"
                  style={{ transform: `scaleX(${stock / 100})` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-line bg-navy-900/80 p-3">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
            <IdentificationCard size={12} className="text-blue-400" /> Control de acceso RFID
          </p>
          <ul className="mt-2 min-h-[72px] space-y-1.5" aria-live="off">
            {log.length === 0 && (
              <li className="flex items-center gap-2 text-[12px] text-ink-faint">
                <Cpu size={13} /> Esperando lecturas del lector
              </li>
            )}
            <AnimatePresence initial={false}>
              {log.map((a) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center justify-between gap-2 font-mono text-[11.5px]"
                >
                  <span className="text-ink-muted">Tarjeta {a.card}</span>
                  <span className={a.ok ? "text-blue-300" : "text-ink-faint"}>
                    {a.ok ? "Permitido" : "Denegado"} · {ago(now - a.at)}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </PreviewShell>
    </div>
  );
}
