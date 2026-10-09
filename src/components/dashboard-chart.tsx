"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  CalendarCheck,
  ClockCountdown,
  Drop,
  Funnel,
  IdentificationCard,
  InstagramLogo,
  Megaphone,
  Scan,
  Timer,
  UserSwitch,
  WhatsappLogo,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import AreaChartCard, { type ChartMetric, type ChartSeries } from "@/components/ui/area-chart-1";
import { LiveBadge, useLive } from "./previews/preview-shell";
import { LogoMark } from "./logo";

/*
  Datos de ejemplo del tablero (se muestran rotulados como tales).
  Este módulo solo se carga en el cliente: las fechas y horas salen del reloj del visitante.
*/
const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() - offset);
  return d;
};
const week = (values: number[]) => values.map((data, i) => ({ key: day(values.length - 1 - i), data }));

// Paleta del brand board: azul eléctrico y blanco frío, nada más
const SERIES: ChartSeries[] = [
  { key: "Leads recibidos", color: "#3d8bff", data: week([72, 88, 87, 107, 113, 126, 123]) },
  { key: "Calificados por IA", color: "#dbe4f3", data: week([41, 53, 49, 66, 68, 78, 75]) },
];

const METRICS: ChartMetric[] = [
  { id: "respuesta", Icon: Timer, label: "Primera respuesta", value: "38 s", trend: "down", trendIsGood: true },
  { id: "calificados", Icon: Funnel, label: "Leads calificados", value: "61 %", trend: "up", trendIsGood: true },
  { id: "vencidos", Icon: ClockCountdown, label: "Seguimientos vencidos", value: "3", trend: "down", trendIsGood: true },
];

const weekday = (d: Date) => d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");

// Lo que pasa en una operación conectada: ventas, IA, hardware y marketing en el mismo registro
const EVENTS: { icon: Icon; text: string; source: string }[] = [
  { icon: WhatsappLogo, text: "Lead calificado: SUV 0km", source: "Agente IA" },
  { icon: UserSwitch, text: "Asignado a Asesor 2", source: "CRM" },
  { icon: Drop, text: "Barril 3 al 18 % de stock", source: "Telemetría" },
  { icon: IdentificationCard, text: "Acceso permitido: depósito", source: "RFID" },
  { icon: Megaphone, text: "CPA de Meta Ads −4,2 %", source: "Performance" },
  { icon: InstagramLogo, text: "Consulta: 2 ambientes", source: "Instagram" },
  { icon: Scan, text: "Conteo de pallets: 148", source: "Visión" },
  { icon: CalendarCheck, text: "Turno reservado 16:30", source: "Reservas" },
];

type FeedItem = { id: number; event: number; time: string };
const clock = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function LiveFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  // Contador que sobrevive a las pausas (fuera de pantalla), para que las keys no se repitan
  const counter = useRef(4);
  const [items, setItems] = useState<FeedItem[]>(() => {
    const time = clock();
    return [3, 2, 1, 0].map((event) => ({ id: event, event, time }));
  });

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      const n = counter.current++;
      setItems((list) => [{ id: n, event: n % EVENTS.length, time: clock() }, ...list].slice(0, 5));
    }, 2400);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col rounded-3xl bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">Actividad</h3>
        <LiveBadge />
      </div>
      <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden" aria-live="off">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => {
            const e = EVENTS[item.event];
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, transform: "translateY(-8px) scale(0.98)" }}
                animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-start gap-3 rounded-xl border border-line bg-navy-900/70 p-2.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-blue-400">
                  <e.icon size={15} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] text-ink">{e.text}</span>
                  <span className="mt-0.5 block text-[11px] text-ink-faint">
                    {e.source} · <span className="font-mono tabular">{item.time}</span>
                  </span>
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

// Barra de la aplicación: da contexto de producto real a la vitrina
export function AppBar() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <LogoMark className="h-5 w-auto shrink-0" />
        <span className="truncate text-[13px] font-medium text-ink">Panel de operación</span>
        <span className="hidden items-center gap-1 rounded-full border border-line p-0.5 text-[12px] sm:flex">
          <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-ink">Ventas</span>
          <span className="px-2.5 py-0.5 text-ink-faint">Operación</span>
          <span className="px-2.5 py-0.5 text-ink-faint">Stock</span>
        </span>
      </div>
      <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-faint">
        Datos de ejemplo
      </span>
    </div>
  );
}

export default function DashboardChart() {
  return (
    <div className="flex h-full w-full flex-col">
      <AppBar />
      <div className="grid min-h-0 flex-1 gap-2 p-2 md:grid-cols-[1fr_280px]">
        <AreaChartCard
          title="Leads de la semana"
          series={SERIES}
          metrics={METRICS}
          formatTick={weekday}
          className="bg-navy-900/50"
        />
        <div className="hidden min-h-0 md:block">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}
