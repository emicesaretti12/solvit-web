"use client";

/*
  Demostración de "Desarrollo web": el recorrido de un cliente, en tres pasos.
  1. Te buscan: alguien escribe en el buscador y tu sitio aparece primero
  2. Entran a tu web: el sitio arma su portada, igual de rápido en la compu y en el celular
  3. Te consultan: tocan "Consultar por WhatsApp" y te llega la consulta
  Es una interfaz de ejemplo (negocio inventado), no una captura.
*/
import { MagnifyingGlass, WhatsappLogo } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Artboard, DemoFrame, Stepper, useDemoLoop } from "./demo-kit";

const STEPS = ["Te buscan", "Entran a tu web", "Te consultan"];
const QUERY = "baterías en córdoba";
const EASE = [0.16, 1, 0.3, 1] as const;

function Typed({ text, run }: { text: string; run: boolean }) {
  const [n, setN] = useState(run ? 0 : text.length);
  useEffect(() => {
    if (!run) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [run, text]);
  return (
    <>
      {text.slice(0, n)}
      <span aria-hidden="true" className="ml-[0.1em] inline-block h-[1.1em] w-px translate-y-[0.15em] bg-ink" />
    </>
  );
}

const bar = "block rounded-full bg-ink/10";

/* El sitio del ejemplo: `compact` es la versión de celular */
function Site({ compact, pressed }: { compact?: boolean; pressed: boolean }) {
  const item = (i: number) => ({
    initial: { opacity: 0, y: "0.8em" },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.06 * i } },
  });
  return (
    <div className={`flex h-full flex-col ${compact ? "gap-[0.7em] p-[0.9em]" : "gap-[1em] p-[1.4em]"}`}>
      <motion.div {...item(0)} className="flex items-center justify-between">
        <span className="flex items-center gap-[0.4em] text-[0.85em] font-bold text-ink">
          <span className="size-[1em] rounded-[0.3em] bg-blue-500" />
          {compact ? "" : "Tu negocio"}
        </span>
        <span className="flex gap-[0.5em]">
          <span className={`${bar} h-[0.35em] w-[2.2em]`} />
          {!compact && <span className={`${bar} h-[0.35em] w-[2.2em]`} />}
          {!compact && <span className={`${bar} h-[0.35em] w-[2.2em]`} />}
        </span>
      </motion.div>
      <div className={`grid flex-1 items-center gap-[1em] ${compact ? "" : "grid-cols-[1.15fr_1fr]"}`}>
        <div>
          <motion.p
            {...item(1)}
            className={`font-bold leading-[1.1] tracking-[-0.02em] text-ink ${compact ? "text-[1.05em]" : "text-[1.7em]"}`}
          >
            Baterías para tu auto, colocadas hoy
          </motion.p>
          <motion.span {...item(2)} className={`${bar} mt-[0.9em] h-[0.4em] w-[80%]`} />
          <motion.span {...item(2)} className={`${bar} mt-[0.5em] h-[0.4em] w-[55%]`} />
          <motion.span
            {...item(3)}
            className={`mt-[1em] inline-flex items-center gap-[0.4em] rounded-full bg-blue-500 font-semibold text-white transition-transform duration-150 ease-out ${compact ? "px-[0.9em] py-[0.5em] text-[0.7em]" : "px-[1.1em] py-[0.6em] text-[0.82em]"} ${pressed ? "scale-[0.94]" : ""}`}
          >
            <WhatsappLogo weight="fill" className="size-[1.2em]" />
            Consultar por WhatsApp
          </motion.span>
        </div>
        {!compact && (
          <motion.div
            {...item(2)}
            className="aspect-[4/3] rounded-[0.9em] bg-[linear-gradient(140deg,#0b2a66,#1f6bff_70%,#1fdcff)]"
          />
        )}
      </div>
      <div className={`grid gap-[0.6em] ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((i) => (
          <motion.div key={i} {...item(4 + i)} className="rounded-[0.7em] border border-ink/8 p-[0.6em]">
            <span className="block aspect-[5/3] rounded-[0.4em] bg-ink/6" />
            <span className={`${bar} mt-[0.5em] h-[0.35em] w-[70%]`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Results({ run }: { run: boolean }) {
  return (
    <div className="flex h-full flex-col gap-[1em] p-[1.4em]">
      <div className="flex items-center gap-[0.6em] rounded-full border border-ink/12 px-[1em] py-[0.65em] text-[0.95em] text-ink shadow-[0_0.3em_1em_-0.5em_rgb(var(--shade-rgb)/0.4)]">
        <MagnifyingGlass className="size-[1.1em] text-ink-faint" />
        <span>
          <Typed text={QUERY} run={run} />
        </span>
      </div>
      <motion.div
        initial={run ? { opacity: 0, y: "0.8em" } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: run ? 0.7 : 0 }}
        className="relative rounded-[0.9em] bg-blue-500/8 p-[0.9em] shadow-[0_0_0_0.12em_var(--blue-500)]"
      >
        <span className="absolute -right-[0.5em] -top-[0.7em] rounded-full bg-blue-500 px-[0.7em] py-[0.25em] text-[0.7em] font-bold text-white">
          1.º
        </span>
        <p className="text-[0.7em] text-ink-muted">tunegocio.com.ar</p>
        <p className="mt-[0.15em] text-[1.05em] font-bold text-blue-400">Baterías en Córdoba · Colocación en el día</p>
        <span className={`${bar} mt-[0.6em] h-[0.4em] w-[85%]`} />
      </motion.div>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          initial={run ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: run ? 0.85 + i * 0.08 : 0 }}
          className="px-[0.9em]"
        >
          <span className={`${bar} h-[0.35em] w-[26%]`} />
          <span className={`${bar} mt-[0.5em] h-[0.5em] w-[62%]`} />
          <span className={`${bar} mt-[0.5em] h-[0.35em] w-[78%]`} />
        </motion.div>
      ))}
    </div>
  );
}

export function WebDemo() {
  const { ref, step, pick, running, reduce, ms } = useDemoLoop(STEPS.length, 3000);
  // En el paso 3 el botón se aprieta y después llega la consulta
  const [pressed, setPressed] = useState(false);
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    if (step !== 2) return;
    const still = reduce;
    const t1 = window.setTimeout(() => setPressed(true), still ? 0 : 550);
    const t2 = window.setTimeout(() => setPressed(false), still ? 0 : 800);
    const t3 = window.setTimeout(() => setArrived(true), still ? 0 : 950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      setPressed(false);
      setArrived(false);
    };
  }, [step, reduce]);

  const scene = step === 0 ? "search" : "site";

  return (
    <div ref={ref} className="absolute inset-0" role="group" aria-label="Ejemplo: cómo una web trae consultas">
      <DemoFrame
        stepper={<Stepper steps={STEPS} active={step} onPick={pick} running={running} ms={ms} label="Pasos del ejemplo de web" />}
      >
        <Artboard>
          {/* Navegador */}
          <div className="absolute bottom-[0.6em] left-0 top-[2.6em] w-[28.5em] overflow-hidden rounded-[1.1em] bg-white @max-md:hidden shadow-[0_2em_4em_-2em_rgb(var(--shade-rgb)/0.55),0_0_0_1px_rgb(var(--fg-rgb)/0.06)]">
            <div className="flex items-center gap-[0.8em] border-b border-ink/8 px-[1em] py-[0.7em]">
              <span className="flex gap-[0.35em]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-[0.6em] rounded-full bg-ink/15" />
                ))}
              </span>
              <span className="flex-1 rounded-full bg-mist px-[1em] py-[0.3em] text-center font-mono text-[0.7em] text-ink-muted">
                {scene === "search" ? "buscador" : "tunegocio.com.ar"}
              </span>
            </div>
            <div className="relative h-[calc(100%-2.6em)] text-[0.8em]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={scene}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {scene === "search" ? <Results run={!reduce} /> : <Site pressed={pressed} />}
                </motion.div>
              </AnimatePresence>
              {/* El puntero va al botón en el paso 3 */}
              {step === 2 && !reduce && (
                <motion.svg
                  viewBox="0 0 24 24"
                  className="absolute size-[1.8em] drop-shadow-[0_0.2em_0.3em_rgb(0_0_0/0.25)]"
                  initial={{ left: "70%", top: "20%", opacity: 0 }}
                  animate={{ left: "22%", top: "62%", opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                >
                  <path d="M5 3l14 8-6 1.5L10 19z" fill="#0b1222" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                </motion.svg>
              )}
            </div>
          </div>

          {/* Celular */}
          <div className="absolute bottom-0 right-0 h-[19.5em] w-[9.8em] rounded-[1.7em] bg-night p-[0.42em] @max-md:right-[4.1em] @max-md:h-[24.6em] @max-md:w-[12.8em] shadow-[0_2em_3.5em_-1.6em_rgb(var(--shade-rgb)/0.8)]">
            <div className="relative h-full overflow-hidden rounded-[1.3em] bg-white">
              <span className="absolute left-1/2 top-[0.5em] z-[1] h-[0.7em] w-[3.4em] -translate-x-1/2 rounded-full bg-night" />
              <div className="h-full pt-[1.3em] text-[0.78em] @max-md:text-[1em]">
                <AnimatePresence mode="wait" initial={false}>
                  {scene === "search" ? (
                    <motion.div
                      key="wait"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      className="flex h-full flex-col gap-[0.7em] p-[0.9em]"
                    >
                      <span className="flex items-center gap-[0.4em] rounded-full border border-ink/12 px-[0.7em] py-[0.5em]">
                        <MagnifyingGlass className="size-[0.9em] shrink-0 text-ink-faint" />
                        <span className="truncate text-[0.72em] text-ink">
                          <Typed text={QUERY} run={!reduce} />
                        </span>
                      </span>
                      <span className="rounded-[0.7em] bg-blue-500/8 p-[0.7em] shadow-[0_0_0_0.1em_var(--blue-500)]">
                        <span className="block text-[0.72em] font-bold leading-tight text-blue-400">Baterías en Córdoba</span>
                        <span className={`${bar} mt-[0.5em] h-[0.3em] w-[80%]`} />
                      </span>
                      <span className={`${bar} h-[0.4em] w-[60%]`} />
                      <span className={`${bar} h-[0.3em] w-[85%]`} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="site"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <Site compact pressed={pressed} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* La consulta que llega */}
          <AnimatePresence>
            {step === 2 && arrived && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: "-1em", scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
                className="absolute left-[7.5em] top-0 z-[2] flex w-[19em] origin-top @max-md:left-[1em] items-center gap-[0.8em] rounded-[1.1em] bg-night p-[0.9em] text-white shadow-[0_1.4em_3em_-1.2em_rgb(4_8_20/0.7)]"
              >
                <span className="grid size-[2.4em] shrink-0 place-items-center rounded-full bg-blue-500">
                  <WhatsappLogo weight="fill" className="size-[1.4em]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.82em] font-bold">Nueva consulta</span>
                  <span className="block truncate text-[0.78em] text-white/70">Hola, ¿tienen batería para Gol Trend?</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Artboard>
      </DemoFrame>
    </div>
  );
}
