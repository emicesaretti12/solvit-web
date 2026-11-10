"use client";

/*
  Demostración de "Software a medida": un CRM con su tablero de etapas. Una consulta entra,
  se le asigna un vendedor, avanza de columna en columna y termina en venta (el contador del
  mes sube). La tarjeta se mueve de verdad entre columnas (animación de layout).
  Es una interfaz de ejemplo, con datos inventados.
*/
import { Check, InstagramLogo, WhatsappLogo, type Icon } from "@phosphor-icons/react";
import { LayoutGroup, motion } from "motion/react";
import { Artboard, DemoFrame, Stepper, useDemoLoop } from "./demo-kit";

const STEPS = ["Entra la consulta", "Se asigna", "Avanza", "Venta cerrada"];
const COLUMNS = ["Nuevas", "En contacto", "Propuesta", "Venta"];

type Card = { title: string; who?: string; Channel: Icon };

// Lo que ya estaba en el tablero (quieto): le da contexto a la consulta que se mueve
const STATIC: Card[][] = [
  [{ title: "Service de moto 110", Channel: InstagramLogo }],
  [
    { title: "Casco y guantes", who: "LP", Channel: WhatsappLogo },
    { title: "Scooter usado", who: "MG", Channel: InstagramLogo },
  ],
  [{ title: "Plan de 12 cuotas", who: "MG", Channel: WhatsappLogo }],
  [{ title: "Moto 150 contado", who: "LP", Channel: WhatsappLogo }],
];

const SPRING = { type: "spring", duration: 0.7, bounce: 0.18 } as const;

function Avatar({ who, tone = "bg-ink/10 text-ink" }: { who: string; tone?: string }) {
  return (
    <span className={`grid size-[1.9em] shrink-0 place-items-center rounded-full text-[0.62em] font-bold ${tone}`}>{who}</span>
  );
}

function StaticCard({ card }: { card: Card }) {
  return (
    <div className="rounded-[0.7em] border border-ink/8 bg-white p-[0.65em]">
      <p className="text-[0.74em] font-semibold leading-tight text-ink/70">{card.title}</p>
      <div className="mt-[0.5em] flex items-center justify-between">
        <card.Channel weight="fill" className="size-[0.95em] text-ink/30" />
        {card.who && <Avatar who={card.who} />}
      </div>
    </div>
  );
}

export function CrmDemo() {
  const { ref, step, pick, running, reduce, ms } = useDemoLoop(STEPS.length, 2100);
  // En qué columna está la consulta que se mueve
  const column = [0, 1, 2, 3][step];
  const assigned = step >= 1;
  const sold = step === 3;

  return (
    <div ref={ref} className="absolute inset-0" role="group" aria-label="Ejemplo: una consulta que avanza por las etapas del CRM">
      <DemoFrame
        stepper={<Stepper steps={STEPS} active={step} onPick={pick} running={running} ms={ms} label="Pasos del ejemplo de CRM" />}
      >
        <Artboard>
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.1em] bg-white shadow-[0_2em_4em_-2em_rgb(var(--shade-rgb)/0.55),0_0_0_1px_rgb(var(--fg-rgb)/0.06)]">
            {/* Barra del sistema */}
            <div className="flex items-center justify-between border-b border-ink/8 px-[1.2em] py-[0.8em]">
              <p className="flex items-center gap-[0.6em] text-[0.95em] font-bold text-ink">
                <span className="size-[1.1em] rounded-[0.3em] bg-blue-500" />
                Consultas
              </p>
              <div className="flex items-center gap-[1em]">
                <span className="flex -space-x-[0.3em]">
                  <Avatar who="LP" tone="bg-haze text-ink ring-[0.12em] ring-white" />
                  <Avatar who="MG" tone="bg-ink text-white ring-[0.12em] ring-white" />
                  <Avatar who="AS" tone="bg-blue-500 text-white ring-[0.12em] ring-white" />
                </span>
                <span className="flex items-center gap-[0.5em] rounded-full bg-mist px-[0.9em] py-[0.4em] text-[0.74em] text-ink-muted">
                  Ventas del mes
                  <span className="tabular relative inline-grid overflow-hidden font-bold text-ink">
                    <motion.span
                      key={sold ? "13" : "12"}
                      initial={reduce ? false : { y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {sold ? 13 : 12}
                    </motion.span>
                  </span>
                </span>
              </div>
            </div>

            {/* Tablero */}
            <LayoutGroup>
              <div className="grid flex-1 grid-cols-4 gap-[0.7em] bg-mist/70 p-[0.9em] @max-md:grid-cols-2 @max-md:grid-rows-2">
                {COLUMNS.map((name, c) => {
                  const here = column === c;
                  const last = c === COLUMNS.length - 1;
                  return (
                    <div
                      key={name}
                      className={`flex flex-col gap-[0.55em] rounded-[0.9em] p-[0.6em] transition-colors duration-500 ${last && sold ? "bg-blue-500/12" : "bg-ink/[0.035]"}`}
                    >
                      <p className="flex items-center justify-between px-[0.2em] text-[0.72em] font-bold text-ink">
                        {name}
                        <span className="tabular rounded-full bg-white px-[0.6em] py-[0.1em] text-[0.9em] font-semibold text-ink-muted">
                          {STATIC[c].length + (here ? 1 : 0)}
                        </span>
                      </p>
                      {here && (
                        <motion.div
                          layoutId="lead"
                          layout
                          transition={reduce ? { duration: 0 } : SPRING}
                          initial={step === 0 && !reduce ? { opacity: 0, y: "-1.2em", scale: 0.94 } : false}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="relative z-[1] rounded-[0.7em] bg-white p-[0.65em] shadow-[0_0_0_0.12em_var(--blue-500),0_1em_1.8em_-1em_rgb(31_107_255/0.7)]"
                        >
                          <p className="text-[0.74em] font-bold leading-tight text-ink">Moto 0km en cuotas</p>
                          <p className="mt-[0.2em] text-[0.62em] text-ink-muted">
                            {sold
                              ? "Seña recibida"
                              : step === 2
                                ? "Presupuesto enviado"
                                : assigned
                                  ? "Respondida en 2 min"
                                  : "Recién llega"}
                          </p>
                          <div className="mt-[0.5em] flex items-center justify-between">
                            <WhatsappLogo weight="fill" className="size-[1em] text-blue-500" />
                            {assigned && (
                              <motion.span
                                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.45, bounce: 0.35 }}
                              >
                                <Avatar who="AS" tone="bg-blue-500 text-white" />
                              </motion.span>
                            )}
                          </div>
                          {sold && (
                            <motion.span
                              initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", duration: 0.5, bounce: 0.4, delay: 0.25 }}
                              className="absolute -right-[0.5em] -top-[0.5em] grid size-[1.6em] place-items-center rounded-full bg-blue-500 text-white"
                            >
                              <Check weight="bold" className="size-[0.95em]" />
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                      {STATIC[c].map((card) => (
                        <motion.div key={card.title} layout transition={reduce ? { duration: 0 } : SPRING}>
                          <StaticCard card={card} />
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        </Artboard>
      </DemoFrame>
    </div>
  );
}
