"use client";

/*
  El recorrido de una consulta en celulares, en el scroll común (sin panel fijo): cinco
  bloques en vertical unidos por una línea por la que bajan las consultas. Cada bloque entra en
  3D (gira desde inclinado) y arma su escena:
  - Pauta, web y canales: los canales llegan girando desde el fondo, de a uno
  - El agente de IA filtra: un arco de luz gira alrededor del agente; las consultas se separan
    en "quiere comprar" (sigue) y "solo consultaba" (queda al costado, apagada)
  - El CRM ordena por área: ventas, postventa y service se reparten como cartas
  - Venta cerrada: el check rebota con una onda
  - Crecimiento: barras en 3D que crecen de a una
  Todo es transform y opacidad con transiciones CSS (lo mueve el compositor del teléfono);
  con reduced motion aparece directo, sin giros.
*/
import { ChartLineUp, ChatsCircle, CheckCircle, Globe, Handshake, Kanban, Sparkle, Wrench, type Icon } from "@phosphor-icons/react";
import { useInView } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { siGoogleads, siInstagram, siMeta, siWhatsapp } from "simple-icons";
import { STAGES } from "./sales-flow-data";

type Glyph = { icon: Icon } | { path: string };

function Mark({ glyph, className = "" }: { glyph: Glyph; className?: string }) {
  if ("icon" in glyph) {
    const I = glyph.icon;
    return <I weight="light" className={className} />;
  }
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
      <path d={glyph.path} />
    </svg>
  );
}

const CHANNELS: { label: string; glyph: Glyph }[] = [
  { label: "Meta Ads", glyph: { path: siMeta.path } },
  { label: "Google Ads", glyph: { path: siGoogleads.path } },
  { label: "Tu web", glyph: { icon: Globe } },
  { label: "WhatsApp", glyph: { path: siWhatsapp.path } },
  { label: "Instagram", glyph: { path: siInstagram.path } },
];

const AREAS: { label: string; icon: Icon }[] = [
  { label: "Ventas", icon: Handshake },
  { label: "Postventa", icon: ChatsCircle },
  { label: "Service", icon: Wrench },
];

// Alturas de las barras (relativas): una curva que sube, sin cifras inventadas
const BARS = [0.28, 0.36, 0.33, 0.5, 0.62, 0.78, 1];

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Row({
  index,
  icon,
  scanner = false,
  children,
}: {
  index: number;
  icon: ReactNode;
  scanner?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.35 });
  const stage = STAGES[index];
  return (
    <li ref={ref} data-shown={shown} className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-4 [perspective:900px]">
      {/* Nodo: un ícono de app que rebota al llegar la consulta */}
      <div className="relative z-10 flex justify-center pt-1">
        <div className="journey-node relative grid size-14 place-items-center rounded-[18px] border border-line-strong bg-navy-850 text-ink">
          <span aria-hidden="true" className="journey-ring absolute inset-0 rounded-[inherit] border-2 border-blue-400" />
          {scanner && (
            <span aria-hidden="true" className="absolute -inset-2 rounded-full">
              <span className="flow-scan absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_0_62%,var(--blue-400)_100%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1.5px))]" />
            </span>
          )}
          {icon}
        </div>
      </div>
      <div className="journey-row min-w-0 pb-10">
        <p className="flex items-baseline gap-2 text-sm font-medium text-ink">
          <span className="font-mono text-[11px] tabular-nums text-ink-faint">0{index + 1}</span>
          {stage.title}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{stage.text}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </li>
  );
}

export function JourneyMobile() {
  return (
    <div className="relative mx-auto max-w-[640px] px-4 pb-16 pt-10">
      {/* La línea que une las etapas, con consultas que bajan */}
      <div aria-hidden="true" className="absolute bottom-24 left-[43px] top-14 w-[3px] overflow-hidden">
        <span className="absolute inset-y-0 left-px w-px bg-line-strong" />
        <span className="journey-dot" />
        <span className="journey-dot [animation-delay:-2s]" />
      </div>

      <ol className="relative">
        <Row index={0} icon={<Globe weight="light" className="size-6" />}>
          <ul className="flex flex-wrap gap-2">
            {CHANNELS.map((c, i) => (
              <li
                key={c.label}
                style={d(0.15 + i * 0.09)}
                className="journey-chip flex items-center gap-2 rounded-full border border-line bg-navy-850 py-1.5 pl-2 pr-3 text-[13px] text-ink"
              >
                <Mark glyph={c.glyph} className="size-4 text-ink" />
                {c.label}
              </li>
            ))}
          </ul>
        </Row>

        <Row index={1} scanner icon={<Sparkle weight="light" className="size-6" />}>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span style={d(0.35)} className="journey-chip flex items-center gap-1.5 rounded-full border border-blue-400/60 bg-blue-500/15 px-3 py-1.5 text-ink">
              <span className="size-1.5 rounded-full bg-blue-400" />
              Quiere comprar
            </span>
            <span style={d(0.55)} className="journey-chip journey-chip-muted flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-ink-faint">
              <span className="size-1.5 rounded-full bg-ink-faint" />
              Solo consultaba
            </span>
          </div>
        </Row>

        <Row index={2} icon={<Kanban weight="light" className="size-6" />}>
          <div className="grid grid-cols-3 gap-2 [perspective:700px]">
            {AREAS.map((a, i) => (
              <div
                key={a.label}
                style={{ ...d(0.2 + i * 0.12), "--from": `${(1 - i) * 100}%` } as CSSProperties}
                className="journey-card flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-navy-850 px-2 py-3 text-[13px] text-ink"
              >
                <a.icon weight="light" className="size-5 text-blue-300" />
                {a.label}
              </div>
            ))}
          </div>
        </Row>

        <Row index={3} icon={<CheckCircle weight="light" className="size-6" />} />

        <Row index={4} icon={<ChartLineUp weight="light" className="size-6" />}>
          <div className="flex h-28 items-end gap-2.5 border-b border-line pb-px pl-1 pr-3">
            {BARS.map((h, i) => (
              <span key={i} style={{ ...d(0.15 + i * 0.08), height: `${h * 100}%` }} className="journey-bar" />
            ))}
          </div>
        </Row>
      </ol>
    </div>
  );
}
