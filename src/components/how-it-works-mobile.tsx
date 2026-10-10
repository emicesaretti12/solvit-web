"use client";

/*
  "Cómo funciona" en celulares: los cuatro pasos como tarjetas en el scroll común (sin panel
  fijo ni canvas aparte, nada que se pueda trabar en un teléfono).
  - Cada tarjeta se levanta en 3D al entrar (gira desde acostada sobre su borde de arriba) y en
    su escenario (un piso en perspectiva que avanza) la S, hecha con capas en CSS, arma la pose
    del paso: la cinta que trabaja se adelanta y brilla. En crecer, las tres cintas encajan
  - Una línea a la izquierda une los pasos y una consulta (un punto de luz) la recorre
  - La vista viva de cada paso corre solo con la tarjeta a la vista
  - Todo es transform y opacidad (lo mueve el compositor); con reduced motion, sin giros
*/
import { useInView } from "motion/react";
import { useRef, type ComponentType } from "react";
import { PreviewSuspendContext } from "@/components/previews/preview-shell";
import { S3D } from "@/components/s3d";

export type MobileStep = { verb: string; service: string; title: string; text: string; Preview: ComponentType };

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
        {/* Escenario: la S en 3D parada sobre un piso en perspectiva que avanza hacia la pantalla */}
        <div className="relative -mx-5 -mt-5 mb-5 h-[184px] overflow-hidden border-b border-line [perspective:520px]">
          <div aria-hidden="true" className="absolute inset-x-[-50%] bottom-[-46%] h-[110%] [transform:rotateX(74deg)] [mask-image:linear-gradient(to_top,#000_15%,transparent_75%)]">
            <div className="step-floor absolute inset-x-0 -top-[28px] bottom-0 [background-image:linear-gradient(color-mix(in_oklab,var(--blue-400)_38%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--blue-400)_38%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" />
          </div>
          <p className="absolute left-5 top-4 flex items-baseline gap-2 text-sm">
            <span className="font-mono text-[11px] tabular-nums text-ink-faint">0{index + 1}</span>
            <span className="font-medium text-ink">{step.verb}</span>
            <span className="text-blue-300">· {step.service}</span>
          </p>
          <div className="absolute inset-x-0 bottom-3 top-9 flex items-center justify-center">
            <S3D focus={last ? -2 : index} play={shown} className="h-full" />
          </div>
        </div>
        <h3 className="font-display text-[1.6rem] font-bold leading-[1.06] tracking-[-0.035em] text-ink">{step.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{step.text}</p>
        <div className="mt-5">
          <PreviewSuspendContext.Provider value={!live}>
            <Preview />
          </PreviewSuspendContext.Provider>
        </div>
      </article>
    </li>
  );
}

export function HowItWorksMobile({ steps }: { steps: MobileStep[] }) {
  return (
    <div className="relative mx-auto max-w-[640px] px-4 pb-6 pt-4">
      {/* Línea que une los pasos, con una consulta que la recorre */}
      <div aria-hidden="true" className="absolute bottom-16 left-4 top-14 w-[3px] -translate-x-px overflow-hidden">
        <span className="absolute inset-y-0 left-px w-px bg-line-strong" />
        <span className="journey-dot" />
      </div>
      <ol className="relative space-y-6">
        {steps.map((s, i) => (
          <StepCard key={s.verb} step={s} index={i} last={i === steps.length - 1} />
        ))}
      </ol>
    </div>
  );
}
