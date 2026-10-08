"use client";

import { Timer, Funnel, ClockCountdown } from "@phosphor-icons/react";
import AreaChartCard, {
  type ChartMetric,
  type ChartSeries,
} from "@/components/ui/area-chart-1";

/*
  Datos de ejemplo del tablero (se muestran rotulados como tales).
  Este módulo solo se carga en el cliente: las fechas salen del día del visitante.
*/
const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() - offset);
  return d;
};
const week = (values: number[]) =>
  values.map((data, i) => ({ key: day(values.length - 1 - i), data }));

// Paleta categórica validada (skill dataviz) contra la superficie #0f182c
const SERIES: ChartSeries[] = [
  { key: "WhatsApp", color: "#3987e5", data: week([42, 51, 47, 63, 58, 71, 66]) },
  { key: "Instagram", color: "#d95926", data: week([18, 22, 19, 27, 31, 29, 34]) },
  { key: "Web", color: "#199e70", data: week([12, 15, 21, 17, 24, 26, 23]) },
];

const METRICS: ChartMetric[] = [
  { id: "respuesta", Icon: Timer, label: "Primera respuesta", value: "38 s", trend: "down", trendIsGood: true },
  { id: "calificados", Icon: Funnel, label: "Leads calificados", value: "61 %", trend: "up", trendIsGood: true },
  { id: "vencidos", Icon: ClockCountdown, label: "Seguimientos vencidos", value: "3", trend: "down", trendIsGood: true },
];

const weekday = (d: Date) =>
  d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");

export default function DashboardChart() {
  return (
    <AreaChartCard
      title="Leads de la semana"
      caption="Datos de ejemplo"
      series={SERIES}
      metrics={METRICS}
      formatTick={weekday}
    />
  );
}
