'use client';

/*
  Area Chart 1 (21st.dev, "Incident Report"), adaptado a SEN:
  - datos, leyenda y métricas por props (antes estaban fijos en el archivo)
  - íconos de Phosphor en lugar de SVG dibujados a mano
  - el gráfico es un SVG propio (antes reaviz, que sumaba ~700 KB de JS por un solo gráfico):
    curvas suaves, relleno en degradé y grilla; al entrar en pantalla las líneas se dibujan y
    el relleno sube desde la base (solo transform, opacidad y stroke-dashoffset)
  - tendencia en colores de marca (azul si mejora, gris si empeora), siempre con ícono + texto
  - tabla accesible con los mismos datos para lectores de pantalla
*/
import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUp, type Icon } from '@phosphor-icons/react';
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
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

// Lienzo del SVG (se estira al contenedor; los trazos no se deforman)
const W = 100;
const H = 40;

const value = (v: number | null | undefined) => (typeof v !== 'number' || isNaN(v) ? 0 : v);

const defaultTick = (d: Date) =>
  d.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });

/* Curva suave que pasa por todos los puntos (Catmull-Rom a Bézier), sin pasarse de los bordes */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1y = Math.min(H, Math.max(0, p1[1] + (p2[1] - p0[1]) / 6));
    const c2y = Math.min(H, Math.max(0, p2[1] - (p3[1] - p1[1]) / 6));
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${c1y} ${p2[0] - (p3[0] - p1[0]) / 6},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

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
      {/* En pantallas angostas queda solo la flecha (el texto sigue para lectores de pantalla) */}
      <span className="sr-only text-xs text-muted-foreground min-[400px]:not-sr-only">{good ? 'Mejora' : 'Empeora'}</span>
    </span>
  );
}

function Plot({ series, ticks }: { series: ChartSeries[]; ticks: string[] }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const drawn = shown || !!reduce;

  const max = Math.max(1, ...series.flatMap((s) => s.data.map((p) => value(p.data)))) * 1.12;
  const n = Math.max(1, (series[0]?.data.length ?? 1) - 1);
  const shapes = series.map((s) => {
    const pts = s.data.map((p, i) => [(i / n) * W, H - (value(p.data) / max) * H] as [number, number]);
    const line = smoothPath(pts);
    return { key: s.key, color: s.color, line, area: `${line} L${W},${H} L0,${H} Z`, last: pts[pts.length - 1] };
  });

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        {/* Grilla: cuatro líneas horizontales */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-px w-full bg-line-strong/70" />
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <defs>
            {shapes.map((s, i) => (
              <linearGradient key={s.key} id={`${id}-g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="1" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {shapes.map((s, i) => (
            <g key={s.key}>
              <path
                d={s.area}
                fill={`url(#${id}-g${i})`}
                style={{
                  transformOrigin: '50% 100%',
                  transform: drawn ? 'scaleY(1)' : 'scaleY(0.4)',
                  opacity: drawn ? 1 : 0,
                  transition: reduce ? 'none' : `transform 900ms ${EASE} ${200 + i * 120}ms, opacity 600ms ${EASE} ${200 + i * 120}ms`,
                }}
              />
              <path
                d={s.line}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1 1"
                style={{
                  strokeDashoffset: drawn ? 0 : 1,
                  transition: reduce ? 'none' : `stroke-dashoffset 1100ms ${EASE} ${i * 120}ms`,
                }}
              />
            </g>
          ))}
        </svg>
        {/* Último punto de cada serie: un punto con halo (HTML para que no se deforme) */}
        {shapes.map((s, i) => (
          <span
            key={s.key}
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4"
            style={
              {
                left: `${(s.last[0] / W) * 100}%`,
                top: `${(s.last[1] / H) * 100}%`,
                backgroundColor: s.color,
                '--tw-ring-color': `${s.color}33`,
                opacity: drawn ? 1 : 0,
                transition: reduce ? 'none' : `opacity 400ms ${EASE} ${900 + i * 120}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
        {ticks.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
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
  const keys = series[0]?.data.map((d) => d.key) ?? [];

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-3xl bg-card p-5 text-card-foreground md:p-7',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">{title}</h3>
        {caption && (
          <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {caption}
          </span>
        )}
      </div>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 md:mt-6 md:grid-cols-[1.55fr_1fr] md:gap-8">
        <div className="flex min-h-0 min-w-0 flex-col">
          <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5" aria-label="Series">
            {series.map((item) => (
              <li key={item.key} className="flex items-center gap-2">
                <span className="size-3 rounded-[3px]" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.key}</span>
              </li>
            ))}
          </ul>
          {/* El gráfico es decorativo para lectores de pantalla (la tabla sr-only expone los datos) */}
          <div className="h-[150px] min-h-0 md:h-auto md:min-h-[150px] md:flex-1" aria-hidden="true">
            <Plot series={series} ticks={keys.map(formatTick)} />
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
                    <td key={s.key}>{value(s.data[i]?.data)}</td>
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
              initial={reduce ? false : { opacity: 0, transform: 'translateY(16px)' }}
              whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 py-2.5 md:flex md:flex-col md:items-start md:py-4"
            >
              {/* En celulares el nombre puede ocupar dos líneas; el valor nunca se parte */}
              <span className="flex min-w-0 items-start gap-2 text-sm leading-snug text-muted-foreground">
                <metric.Icon size={18} weight="light" aria-hidden="true" className="mt-px shrink-0 text-blue-300" />
                <span>{metric.label}</span>
              </span>
              <span className="flex items-center gap-3 whitespace-nowrap">
                <span className="tabular text-lg font-semibold text-foreground md:text-2xl">{metric.value}</span>
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
