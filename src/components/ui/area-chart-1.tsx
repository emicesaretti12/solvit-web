'use client';

/*
  Area Chart 1 (21st.dev, "Incident Report"), adaptado a SEN:
  - datos, leyenda y métricas por props (antes estaban fijos en el archivo)
  - íconos de Phosphor en lugar de SVG dibujados a mano
  - variables de reaviz en el contenedor (styled-jsx global no se renderiza en el servidor con App Router)
  - motion/react en lugar de framer-motion (mismo motor, ya instalado)
  - tendencia en colores de marca (azul si mejora, gris si empeora), siempre con ícono + texto
  - tabla accesible con los mismos datos para lectores de pantalla
*/
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUp, type Icon } from '@phosphor-icons/react';
import {
  AreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  AreaSeries,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
  type ChartNestedDataShape,
} from 'reaviz';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  key: Date;
  data: number | null | undefined;
}

export interface ChartSeries {
  key: string;
  /** Color categórico de la serie (validado contra la superficie). */
  color: string;
  data: ChartDataPoint[];
}

export interface ChartMetric {
  id: string;
  Icon: Icon;
  label: string;
  value: string;
  trend: 'up' | 'down';
  /** Si la dirección de la tendencia es buena noticia (define color y texto). */
  trendIsGood: boolean;
}

export interface AreaChartCardProps {
  title: string;
  /** Texto chico junto al título, por ejemplo "Datos de ejemplo". */
  caption?: string;
  series: ChartSeries[];
  metrics: ChartMetric[];
  formatTick?: (date: Date) => string;
  className?: string;
}

// Paleta del brand board: el azul es la única señal de color; empeorar se lee en gris + texto
const STATUS_GOOD = '#3d8bff';
const STATUS_CRITICAL = '#a7b0c0';

const validateChartData = (data: ChartSeries[]): ChartNestedDataShape[] =>
  data.map((series) => ({
    key: series.key,
    data: series.data.map((item) => ({
      key: item.key,
      data: typeof item.data !== 'number' || isNaN(item.data) ? 0 : item.data,
    })),
  }));

const defaultTick = (d: Date) =>
  d.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });

function TrendBadge({ trend, good }: { trend: 'up' | 'down'; good: boolean }) {
  const color = good ? STATUS_GOOD : STATUS_CRITICAL;
  const Arrow = trend === 'up' ? ArrowUp : ArrowDown;
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="flex size-6 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}33`, color }}
      >
        <Arrow size={14} weight="bold" aria-hidden="true" />
      </span>
      <span className="text-xs text-muted-foreground">{good ? 'Mejora' : 'Empeora'}</span>
    </span>
  );
}

const AreaChartCard: React.FC<AreaChartCardProps> = ({
  title,
  caption,
  series,
  metrics,
  formatTick = defaultTick,
  className,
}) => {
  const reduce = useReducedMotion();
  const data = validateChartData(series);
  const colors = series.map((s) => s.color);
  const keys = series[0]?.data.map((d) => d.key) ?? [];

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-3xl bg-card p-5 text-card-foreground md:p-7',
        className,
      )}
      style={
        {
          '--reaviz-tick-fill': 'var(--ink-muted)',
          '--reaviz-gridline-stroke': 'var(--line-strong)',
        } as React.CSSProperties
      }
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
        {caption && (
          <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {caption}
          </span>
        )}
      </div>

      <div className="mt-4 grid min-h-0 flex-1 gap-4 md:mt-6 md:grid-cols-[1.55fr_1fr] md:gap-8">
        <div className="flex min-h-0 flex-col">
          <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5" aria-label="Series">
            {series.map((item) => (
              <li key={item.key} className="flex items-center gap-2">
                <span className="size-3 rounded-[3px]" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.key}</span>
              </li>
            ))}
          </ul>
          {/* inert: el gráfico es decorativo para el teclado (la tabla sr-only expone los datos) */}
          <div className="h-[150px] min-h-0 md:h-auto md:flex-1" aria-hidden="true" inert>
            <AreaChart
              id="sen-area-chart"
              data={data}
              xAxis={
                <LinearXAxis
                  type="time"
                  tickSeries={
                    <LinearXAxisTickSeries
                      label={
                        <LinearXAxisTickLabel
                          format={(v) => formatTick(new Date(v))}
                          fill="var(--reaviz-tick-fill)"
                        />
                      }
                      tickSize={10}
                      tickValues={keys}
                    />
                  }
                />
              }
              yAxis={
                <LinearYAxis
                  axisLine={null}
                  tickSeries={<LinearYAxisTickSeries line={null} label={null} tickSize={10} />}
                />
              }
              series={
                <AreaSeries
                  type="grouped"
                  interpolation="smooth"
                  area={
                    <Area
                      gradient={
                        <Gradient
                          stops={[
                            <GradientStop key={1} stopOpacity={0} />,
                            <GradientStop key={2} offset="100%" stopOpacity={0.35} />,
                          ]}
                        />
                      }
                    />
                  }
                  colorScheme={colors}
                />
              }
              gridlines={<GridlineSeries line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} />}
            />
          </div>
          <table className="sr-only">
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">Día</th>
                {series.map((s) => (
                  <th key={s.key} scope="col">
                    {s.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((date, i) => (
                <tr key={date.toISOString()}>
                  <th scope="row">{formatTick(date)}</th>
                  {series.map((s) => (
                    <td key={s.key}>{s.data[i]?.data ?? 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col divide-y divide-border">
          {metrics.map((metric, i) => (
            <motion.li
              key={metric.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex w-full items-center justify-between gap-3 py-2.5 md:flex-col md:items-start md:py-4"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                <metric.Icon size={18} weight="light" aria-hidden="true" className="shrink-0 text-blue-300" />
                <span className="truncate" title={metric.label}>
                  {metric.label}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-lg font-semibold text-foreground md:text-2xl">{metric.value}</span>
                <TrendBadge trend={metric.trend} good={metric.trendIsGood} />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AreaChartCard;
