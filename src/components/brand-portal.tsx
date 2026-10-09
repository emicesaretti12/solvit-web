"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import {
  ArrowDown,
  ChartLineUp,
  Code,
  Cpu,
  GearSix,
  Sparkle,
  TrendUp,
  type Icon,
} from "@phosphor-icons/react";
import GlyphPortal, { type GlyphPortalStyle } from "@/components/ui/glyph-portal";
import { NetworkField } from "./network-field";
import { LogoMark } from "./logo";

const WORD = "SEN";
const FONT_SPEC = '400 100px "Krona One"';
// Solo la familia real: el fallback métrico de next/font nunca se carga cuando la fuente
// está disponible, y el portal lo tomaría como fuente pendiente (modo estático).
const FONT = '"Krona One", sans-serif';
const SCROLL_LENGTH = 1.8;

const portalStyle: GlyphPortalStyle = {
  "--gp-paper": "var(--navy-900)",
  "--gp-ink": "var(--ink-muted)",
  "--gp-field": "var(--navy-900)",
  "--gp-foreground": "var(--ink)",
  fontFamily: "var(--font-geist-sans)",
};

/*
  El portal congela la tipografía al montarse: si Krona One todavía no cargó, arranca en modo
  estático (que igual se renderiza en el servidor, con el contenido en el HTML). Cuando la
  fuente está lista lo volvemos a montar con otra `key` para activar la animación, salvo que
  el visitante ya esté dentro de la sección (evita un salto a mitad del recorrido).
*/
function useFontReady(frame: React.RefObject<HTMLDivElement | null>) {
  // La key no llega al DOM, así que esto no genera diferencias de hidratación.
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.fonts.check(FONT_SPEC, WORD),
  );
  useEffect(() => {
    let cancelled = false;
    document.fonts.load(FONT_SPEC, WORD).then(
      () => {
        if (cancelled) return;
        const rect = frame.current?.getBoundingClientRect();
        if (!rect || rect.top > 0 || rect.bottom <= 0) setReady(true);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [frame]);
  return ready;
}

const STEPS: { icon: Icon; name: string; text: string }[] = [
  {
    icon: Code,
    name: "Software a medida",
    text: "Arquitecturas que centralizan operaciones complejas en un solo lugar.",
  },
  {
    icon: Sparkle,
    name: "Inteligencia artificial",
    text: "Agentes que conversan, califican y derivan prospectos las 24 horas.",
  },
  {
    icon: Cpu,
    name: "Hardware e IoT",
    text: "Sensores y controladores donde el software por sí solo no llega.",
  },
  {
    icon: ChartLineUp,
    name: "Marketing de performance",
    text: "Demanda predecible para que la tecnología trabaje con volumen real.",
  },
];

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/*
  Dentro de las letras: primero el blanco del wordmark (como en el brand board) y, a medida
  que la cámara entra, ese relleno se desvanece y aparece la red del sistema por dentro.
*/
function Field() {
  return (
    <div className="absolute inset-0" style={{ transform: "scale(var(--gp-field-scale, 1))" }}>
      <NetworkField />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#eef2fa_48%,#bccdee_100%)]"
        style={{ opacity: "calc(var(--portal-fill, 1) * 0.94)" }}
      />
    </div>
  );
}

// Lockup del brand board: la bajada va debajo del wordmark
function Front() {
  return (
    <p
      className="label-caps absolute inset-x-4 m-0 text-center !text-[10px] !tracking-[0.24em] sm:!text-[12px] sm:!tracking-[0.42em]"
      style={{ top: "calc(var(--gp-word-bottom, 60%) + 26px)" }}
    >
      Software · Ing. &amp; Soluciones
    </p>
  );
}

function ProblemCard({ icon: IconCmp, title, items }: { icon: Icon; title: string; items: string[] }) {
  return (
    <div className="rounded-[2rem] border border-line bg-white/[0.02] p-1.5">
      <div className="h-full rounded-[calc(2rem-6px)] bg-navy-900/85 p-5 shadow-[inset_0_1px_1px_rgb(255_255_255/0.05)] md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-line-strong bg-navy-800 text-blue-400">
            <IconCmp size={18} weight="light" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold tracking-tight text-ink md:text-lg">{title}</h3>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line bg-navy-850 px-3 py-1.5 text-[13px] text-ink-muted md:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BrandPortal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const fontReady = useFontReady(frameRef);
  const stepRef = useRef(-1);

  // Información durante el zoom: se escribe directo en el DOM, nunca con estado de React
  const onProgress = (p: number) => {
    frameRef.current?.style.setProperty("--portal-fill", String(1 - smooth(0.06, 0.42, p)));
    const hud = hudRef.current;
    if (!hud) return;
    const local = clamp((p - 0.04) / (0.74 - 0.04));
    hud.style.opacity = String(smooth(0.02, 0.08, p) * (1 - smooth(0.7, 0.78, p)));
    const step = Math.min(STEPS.length - 1, Math.floor(local * STEPS.length));
    if (step !== stepRef.current) {
      stepRef.current = step;
      hud.dataset.step = String(step);
    }
    hud.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg, i) => {
      seg.style.transform = `scaleX(${clamp(local * STEPS.length - i)})`;
    });
  };

  // Con teclado, el enlace de la portada se muestra en su cuadro inicial (sin capas encima).
  // Se espera un frame para no pelear con el scroll que hace el navegador al enfocar.
  const onFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.matches("[data-gp-enter]:focus-visible")) return;
    requestAnimationFrame(() => {
      if (document.activeElement === target) {
        frameRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
  };

  return (
    // Reserva la altura final, (SCROLL_LENGTH + 1) pantallas = 280svh, para que montar
    // o activar la animación no mueva lo que viene después (anclas, CLS).
    <div
      ref={frameRef}
      onFocusCapture={onFocusCapture}
      className="sen-portal-frame relative min-h-[280svh] motion-reduce:min-h-0"
    >
      <noscript>
        <style>{".sen-portal-frame{min-height:0!important}"}</style>
      </noscript>
      <GlyphPortal
        key={fontReady ? "ready" : "pending"}
        word={WORD}
        fontFamily={FONT}
        fontWeight={400}
        interactive={false}
        scrollLength={SCROLL_LENGTH}
        enterLabel="Conocé nuestro enfoque"
        enterIcon={<ArrowDown size={16} weight="bold" />}
        background={<Field />}
        front={<Front />}
        style={portalStyle}
        className="sen-portal"
        onProgress={onProgress}
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="label-caps">Por qué SEN</p>
          <h2 className="font-display mt-4 max-w-[26ch] text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance text-ink sm:text-4xl lg:text-[2.9rem]">
            No somos una agencia de publicidad ni una factoría de software aislada de tus
            objetivos.
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-ink-muted md:text-lg">
            Operamos como tu socio tecnológico de punta a punta: resolvemos los cuellos de
            botella operativos y la demanda comercial, y unificamos todo el flujo sobre una
            misma infraestructura técnica.
          </p>
          <div className="mt-7 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
            <ProblemCard
              icon={GearSix}
              title="Cuellos de botella operativos"
              items={["Procesos manuales", "Desorganización interna", "Falta de telemetría física"]}
            />
            <ProblemCard
              icon={TrendUp}
              title="Expansión comercial"
              items={["Generación de prospectos calificados", "Conversión", "Cierre de ventas"]}
            />
          </div>
          <div className="mt-3 flex items-center gap-4 rounded-[1.5rem] border border-blue-500/30 bg-blue-500/[0.08] px-5 py-4 md:mt-4">
            <LogoMark className="h-7 w-auto shrink-0" />
            <p className="text-sm text-ink md:text-base">
              Todo sobre una misma infraestructura técnica, diseñada y operada por un solo equipo.
            </p>
          </div>
        </div>
      </GlyphPortal>

      {/* Panel fijo durante el zoom: las cuatro disciplinas que convergen en el sistema */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 motion-reduce:hidden">
        <div className="sticky top-0 h-[100svh]">
          <div
            ref={hudRef}
            data-step="0"
            className="portal-hud absolute inset-x-4 bottom-5 md:inset-x-auto md:bottom-10 md:left-10 md:w-[400px]"
            style={{ opacity: 0 }}
          >
            <div className="rounded-[1.5rem] border border-line-strong bg-navy-900/70 p-5 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.8)] backdrop-blur-md">
              <div className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <span key={s.name} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      data-seg={i}
                      className="block h-full origin-left bg-blue-400"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ))}
              </div>
              <div className="relative mt-4 h-[72px]">
                {STEPS.map((s, i) => (
                  <div key={s.name} data-hud-item={i} className="absolute inset-0 flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-navy-800 text-blue-400">
                      <s.icon size={20} weight="light" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{s.name}</p>
                      <p className="mt-1 text-[13px] leading-snug text-ink-muted">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
