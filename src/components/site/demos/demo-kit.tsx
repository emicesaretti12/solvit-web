"use client";

/*
  Piezas comunes de las demostraciones de los servicios (web y CRM): interfaces de ejemplo que
  cuentan, paso a paso, qué hace cada servicio.

  - useDemoLoop: avanza de paso solo, mientras la demo está a la vista y sin reduced motion. Si
    la persona elige un paso, se queda ahí unos segundos y después sigue
  - Artboard: lienzo que se escala con su contenedor (apaisado en escritorio, vertical en
    celulares). Adentro todo se mide en em, así la demo se lee bien en cualquier tamaño
  - Stepper: los pasos con su nombre; el activo llena su barra de tiempo
*/
import { useInView } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { tap } from "@/lib/haptics";

const HOLD = 9000;

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/* Reduced motion sin desajuste de hidratación: el servidor (y el primer render del cliente)
   asumen que no; recién después se lee la preferencia real. Las demos cambian su contenido
   según este valor, así que no puede diferir entre servidor y cliente */
function useSafeReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

export function useDemoLoop(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useSafeReducedMotion();
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const running = inView && !reduce && !held;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % count), ms);
    return () => window.clearTimeout(id);
  }, [running, step, count, ms]);

  useEffect(() => {
    if (!held) return;
    const id = window.setTimeout(() => setHeld(false), HOLD);
    return () => window.clearTimeout(id);
  }, [held, step]);

  const pick = (i: number) => {
    tap();
    setStep(i);
    setHeld(true);
  };

  return { ref, step, pick, running, reduce, ms };
}

export function Artboard({ children }: { children: ReactNode }) {
  // El lienzo mide --aw × --ah em y 1em se calcula para que entre justo en el panel. En paneles
  // angostos (celulares) el lienzo es vertical, de 21 × 27 em: cada demo se reacomoda con
  // variantes @max-md y el texto queda legible. Es una ilustración: los lectores de pantalla
  // leen la descripción del grupo y los pasos, no la interfaz de ejemplo.
  return (
    <div aria-hidden="true" className="absolute inset-0 [container-type:size]">
      <div
        className="absolute left-1/2 top-1/2 h-[calc(var(--ah)*1em)] w-[calc(var(--aw)*1em)] -translate-x-1/2 -translate-y-1/2 [--ah:26] [--aw:34] @max-md:[--ah:27] @max-md:[--aw:21]"
        style={{ fontSize: "min(calc(100cqw / var(--aw)), calc(100cqh / var(--ah)))" } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

export function Stepper({
  steps,
  active,
  onPick,
  running,
  ms,
  label,
}: {
  steps: string[];
  active: number;
  onPick: (i: number) => void;
  running: boolean;
  ms: number;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((name, i) => {
        const on = i === active;
        return (
          <button
            key={name}
            type="button"
            aria-current={on ? "step" : undefined}
            onClick={() => onPick(i)}
            className="group relative flex min-h-12 flex-col justify-end gap-1.5 pb-0 pt-2 text-left"
          >
            <span
              className={`text-[11.5px] font-semibold leading-tight transition-colors duration-200 md:text-[12.5px] ${on ? "text-ink" : "text-ink-faint group-hover:text-ink"}`}
            >
              <span className="tabular mr-1 text-ink-faint">{i + 1}</span>
              {name}
            </span>
            <span aria-hidden="true" className="block h-[3px] overflow-hidden rounded-full bg-ink/10">
              <span
                key={`${active}-${running}`}
                className="block h-full origin-left rounded-full bg-blue-500"
                style={{
                  transform: i < active || (on && !running) ? "scaleX(1)" : "scaleX(0)",
                  animation: on && running ? `sys-fill ${ms}ms linear forwards` : undefined,
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Marco de la demo: el lienzo arriba y los pasos abajo, con la aclaración de que es un ejemplo */
export function DemoFrame({ children, stepper }: { children: ReactNode; stepper: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col p-3.5 md:p-5">
      <div className="relative min-h-0 flex-1">{children}</div>
      <div className="mt-2 shrink-0">{stepper}</div>
    </div>
  );
}
