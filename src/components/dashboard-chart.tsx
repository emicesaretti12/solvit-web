"use client";

import { ClockCountdown, Funnel, Timer } from "@phosphor-icons/react";
import AreaChartCard, { type ChartMetric, type ChartSeries } from "@/components/ui/area-chart-1";
import { useTheme } from "@/lib/theme";

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

// Paleta del brand board: azul eléctrico y blanco frío en oscuro; azul y navy en claro
const RECIBIDOS = week([72, 88, 87, 107, 113, 126, 123]);
const CALIFICADOS = week([41, 53, 49, 66, 68, 78, 75]);
const SERIES: Record<"dark" | "light", ChartSeries[]> = {
  dark: [
    { key: "Consultas recibidas", color: "#3d8bff", data: RECIBIDOS },
    { key: "Calificados por IA", color: "#dbe4f3", data: CALIFICADOS },
  ],
  light: [
    { key: "Consultas recibidas", color: "#1f6bff", data: RECIBIDOS },
    { key: "Calificados por IA", color: "#23345c", data: CALIFICADOS },
  ],
};

const METRICS: ChartMetric[] = [
  { id: "respuesta", Icon: Timer, label: "Primera respuesta", value: "38 s", trend: "down", trendIsGood: true },
  { id: "calificados", Icon: Funnel, label: "Consultas calificadas", value: "61 %", trend: "up", trendIsGood: true },
  { id: "vencidos", Icon: ClockCountdown, label: "Seguimientos vencidos", value: "3", trend: "down", trendIsGood: true },
];

const weekday = (d: Date) => d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");

// Solo el gráfico de la semana, para el capítulo "Crecer"
export function GrowthChart() {
  const theme = useTheme();
  return (
    <AreaChartCard
      title="Consultas de la semana"
      caption="Datos de ejemplo"
      series={SERIES[theme]}
      metrics={METRICS}
      formatTick={weekday}
      className="h-full bg-navy-900/50"
    />
  );
}
