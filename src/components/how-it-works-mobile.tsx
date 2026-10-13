"use client";

/*
  "Cómo funciona" en celulares: los cuatro pasos como tarjetas en el scroll común (sin panel
  fijo ni canvas aparte, nada que se pueda trabar en un teléfono).
  - Cada tarjeta se levanta en 3D al entrar (gira desde acostada sobre su borde de arriba) y en
    su escenario (un piso en perspectiva que avanza) la S, hecha con capas en CSS, arma la pose
    del paso: la cinta que trabaja se adelanta y brilla. En crecer, las tres cintas encajan
  - Una línea a la izquierda une los pasos y una consulta (un punto de luz) la recorre
  - La vista viva de cada paso corre solo con la tarjeta a la vista
  - Donde el navegador las tiene, animaciones ligadas al scroll (animation-timeline: view(), en
    el compositor y sin JS): la tarjeta se despliega al ritmo del dedo y se aleja en
    profundidad al salir, una luz la cruza al pasar por el centro, el número gigante del paso
    queda detrás en paralaje y la línea se llena con una punta de luz que sigue el scroll. Sin
    ese soporte, todo queda como antes (transiciones al entrar)
  - Todo es transform y opacidad (lo mueve el compositor); con reduced motion, sin giros
*/
import { useInView } from "motion/react";
import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { PreviewPlaceholder, PreviewSuspendContext } from "@/components/previews/preview-shell";
import { S3D } from "@/components/s3d";
import { SafeBoundary } from "@/components/safe-boundary";

export type MobileStep = { verb: string; service: string; title: string; text: string; Preview: ComponentType };

/* Alto que nunca baja: la vista viva arranca completa (el HTML del servidor) y en su loop se
   vacía y se vuelve a llenar; sin esto, todo lo que está debajo saltaría en cada vuelta */
function LockHeight({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let max = 0;
    const lock = () => {
      el.style.minHeight = "";
      const h = el.offsetHeight;
      if (h > max) max = h;
      el.style.minHeight = `${max}px`;
    };
    const ro = new ResizeObserver(lock);
    ro.observe(el.firstElementChild ?? el);
    lock();
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function StepCard({ step, index, last }: { step: MobileStep; index: number; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.22 });
  const live = useInView(ref, { amount: 0.15 });
  const { Preview } = step;
  return (
    <li ref={ref} className="relative pl-7 [perspective:1100px]">
      {/* Nodo de la línea: se enciende cuando la tarjeta llega */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-9 size-[11px] -translate-x-1/2 rounded-full border-2 transition-colors duration-500 ${
          shown ? "border-blue-400 bg-blue-400" : "border-line-strong bg-navy-900"
        }`}
      />
      <article
        data-shown={shown}
        className="step-card relative overflow-hidden rounded-[1.6rem] border border-line bg-navy-850 p-5 shadow-[0_30px_60px_-40px_rgb(var(--shade-rgb)/0.9)]"
      >
        {/* Paso: en su propia fila, arriba (la S nunca lo tapa) */}
        <p className="relative z-10 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-mono text-[11px] tabular-nums text-ink-faint">0{index + 1}</span>
          <span className="font-medium text-ink">{step.verb}</span>
          <span className="text-blue-300">· {step.service}</span>
        </p>
        {/* Escenario: la S en 3D parada sobre un piso en perspectiva que avanza hacia la pantalla */}
        <div className="relative -mx-5 mb-5 mt-2 h-[168px] overflow-hidden border-b border-line [perspective:520px]">
          <div aria-hidden="true" className="absolute inset-x-[-50%] bottom-[-46%] h-[110%] [transform:rotateX(74deg)] [mask-image:linear-gradient(to_top,#000_15%,transparent_75%)]">
            <div className="step-floor absolute inset-x-0 -top-[28px] bottom-0 [background-image:linear-gradient(color-mix(in_oklab,var(--blue-400)_38%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--blue-400)_38%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" />
          </div>
          {/* Número gigante del paso, detrás de la S (paralaje con el scroll) */}
          <span
            aria-hidden="true"
            className="step-num font-display pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[148px] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_color-mix(in_oklab,var(--blue-400)_45%,transparent)]"
          >
            0{index + 1}
          </span>
          <div className="absolute inset-x-0 bottom-3 top-5 flex items-center justify-center">
            <S3D focus={last ? -2 : index} play={shown} className="h-full" />
          </div>
        </div>
        <h3 className="font-display text-[1.6rem] font-bold leading-[1.06] tracking-[-0.035em] text-ink">{step.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{step.text}</p>
        <LockHeight className="mt-5">
          <PreviewSuspendContext.Provider value={!live}>
            <SafeBoundary fallback={<PreviewPlaceholder />}>
              <Preview />
            </SafeBoundary>
          </PreviewSuspendContext.Provider>
        </LockHeight>
      </article>
    </li>
  );
}

export function HowItWorksMobile({ steps }: { steps: MobileStep[] }) {
  return (
    <div className="relative mx-auto max-w-[640px] px-4 pb-6 pt-4">
      {/* Línea que une los pasos, con una consulta que la recorre */}
      <div aria-hidden="true" className="absolute bottom-16 left-4 top-14 w-4 -translate-x-1/2 overflow-hidden">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
        <span className="journey-dot" />
        {/* Con scroll ligado: la línea se llena y una punta de luz sigue al dedo */}
        <span className="rail-fill" />
        <span className="rail-head" />
      </div>
      <ol className="relative space-y-6">
        {steps.map((s, i) => (
          <StepCard key={s.verb} step={s} index={i} last={i === steps.length - 1} />
        ))}
      </ol>
    </div>
  );
}
