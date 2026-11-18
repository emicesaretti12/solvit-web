"use client";

/*
  El sistema SEN, contado con una sola consulta que lo recorre de punta a punta.

  Un panel navy con tres estaciones en fila, unidas por una línea por donde viaja la consulta:
  1. Atraer: un anuncio en Instagram. Suben los números, alguien toca "Enviar mensaje"
  2. Atender: el chat de WhatsApp. El agente de IA responde, califica y deriva
  3. Cerrar: el CRM. La consulta tiene vendedor, avanza de etapa y termina en venta, con la
     campaña que la trajo

  La estación activa está al frente y corre su secuencia; las anteriores quedan resueltas y las
  siguientes, en espera. Avanza sola (se frena fuera de pantalla), y los tres pasos de abajo
  dejan elegir. En celulares se ve una estación por vez y la fila se desliza.
  Todo es una interfaz de ejemplo, con datos inventados.
*/
import { ArrowRight, Check, InstagramLogo, Megaphone, Robot, SquaresFour, WhatsappLogo, type Icon } from "@phosphor-icons/react";
import { animate, AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CONTACT } from "@/content/contact-info";
import { useDemoLoop } from "./demos/demo-kit";
import { SplitText } from "./split-text";

type Stage = { key: string; title: string; line: string; detail: string; Glyph: Icon };

const STAGES: Stage[] = [
  {
    key: "atraer",
    title: "Atraer",
    line: "Tu anuncio y tu web traen la consulta.",
    detail: "Pautamos en Meta y Google, y medimos cuánta gente ve, consulta y compra.",
    Glyph: Megaphone,
  },
  {
    key: "atender",
    title: "Atender",
    line: "El agente de IA responde al instante.",
    detail: "Contesta por WhatsApp, Instagram y tu web a cualquier hora, y detecta quién quiere comprar.",
    Glyph: Robot,
  },
  {
    key: "cerrar",
    title: "Cerrar",
    line: "Tu vendedor la recibe lista en el CRM.",
    detail: "Cada consulta queda con dueño y etapa, y cada venta con la campaña que la trajo.",
    Glyph: SquaresFour,
  },
];

const TURN = 5200;
const EASE = [0.16, 1, 0.3, 1] as const;
const pop = { type: "spring", duration: 0.5, bounce: 0.3 } as const;

type Mode = "pending" | "active" | "done";

/* Secuencia de una estación: devuelve cuántos hitos ya pasaron. Solo corre con la estación
   activa (el componente se vuelve a montar en cada activación, así que arranca de cero) */
function useTimeline(delays: number[], run: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const ids = delays.map((d, i) => window.setTimeout(() => setN(i + 1), d));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // Los hitos son constantes de cada estación
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);
  return n;
}

/* Número que sube hasta su valor cuando la estación se activa */
function Ticker({ to, run }: { to: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !run) return;
    const controls = animate(0, to, {
      duration: 1.3,
      ease: EASE,
      onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString("es-AR")),
    });
    return () => controls.stop();
  }, [run, to]);
  return (
    <span ref={ref} className="tabular">
      {to.toLocaleString("es-AR")}
    </span>
  );
}

function Head({ Glyph, title, note, live }: { Glyph: Icon; title: string; note: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink/8 px-4 py-3">
      <span className="grid size-7 place-items-center rounded-lg bg-ink text-white">
        <Glyph size={15} weight="fill" />
      </span>
      <span className="truncate text-[13px] font-bold text-ink">{title}</span>
      <span
        className={`ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11.5px] ${live ? "text-blue-400" : "text-ink-faint"}`}
      >
        {live && <span className="live-dot relative size-1.5 rounded-full bg-current" />}
        {note}
      </span>
    </div>
  );
}

/* En espera: la estación todavía no recibió la consulta */
function Waiting({ text }: { text: string }) {
  return (
    <div className="grid flex-1 place-items-center p-6 text-center">
      <p className="max-w-[18ch] text-[13px] leading-snug text-ink-faint">{text}</p>
    </div>
  );
}

/* ── 1. Atraer: el anuncio ── */
function Attract({ mode, animated }: { mode: Mode; animated: boolean }) {
  const run = mode === "active" && animated;
  const n = useTimeline([1700, 2100, 2500], run);
  const phase = run ? n : 3;
  const sent = phase >= 3;
  return (
    <>
      <Head Glyph={InstagramLogo} title="Anuncio en Instagram" note="Publicidad" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <motion.div
          initial={run ? { opacity: 0, y: 16, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex min-h-[112px] flex-1 flex-col justify-end overflow-hidden rounded-xl bg-[linear-gradient(140deg,#0b2a66,#1f6bff_65%,#1fdcff)] p-4 text-white"
        >
          <span className="sys-sheen" />
          <span className="text-[22px] font-extrabold leading-none tracking-[-0.03em]">Moto 0km</span>
          <span className="mt-1.5 text-[13px] font-medium text-white/85">12 cuotas sin interés</span>
        </motion.div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {(
            [
              ["Lo vieron", 48200],
              ["Clics", 1930],
              ["Consultas", 412],
            ] as const
          ).map(([label, value], i) => (
            <motion.div
              key={label}
              initial={run ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: run ? 0.25 + i * 0.07 : 0 }}
              className="rounded-lg bg-mist py-2"
            >
              <dd className="text-[15px] font-bold text-ink">
                <Ticker to={value} run={run} />
              </dd>
              <dt className="text-[11px] text-ink-muted">{label}</dt>
            </motion.div>
          ))}
        </dl>

        <div className="relative">
          <span
            className={`flex h-11 items-center justify-center gap-2 rounded-full text-[13.5px] font-semibold text-white transition-[transform,background-color] duration-200 ease-out ${sent ? "bg-ink" : "bg-blue-500"} ${phase === 2 ? "scale-[0.95]" : ""}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={sent ? "sent" : "send"}
                initial={animated ? { y: 14, opacity: 0, filter: "blur(3px)" } : false}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -14, opacity: 0, filter: "blur(3px)" }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-center gap-2"
              >
                {sent ? <Check size={15} weight="bold" /> : <WhatsappLogo size={16} weight="fill" />}
                {sent ? "Consulta enviada" : "Enviar mensaje"}
              </motion.span>
            </AnimatePresence>
          </span>
          {/* El dedo que toca: llega, aprieta y deja una onda */}
          {run && phase >= 1 && phase < 3 && (
            <motion.span
              initial={{ opacity: 0, x: 60, y: 46 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
              className="pointer-events-none absolute left-[58%] top-1/2 size-7 -translate-y-1/2 rounded-full border-2 border-white bg-white/35 shadow-[0_4px_12px_rgb(4_8_20/0.35)]"
            >
              {phase === 2 && <span className="sys-ripple" />}
            </motion.span>
          )}
        </div>
      </div>
    </>
  );
}

/* ── 2. Atender: el chat con el agente ── */
function Bubble({ me, children, animated }: { me?: boolean; children: ReactNode; animated: boolean }) {
  return (
    <motion.p
      initial={animated ? { opacity: 0, y: 12, scale: 0.94 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={pop}
      className={`max-w-[84%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${me ? "origin-bottom-right self-end rounded-br-md bg-blue-500 text-white" : "origin-bottom-left self-start rounded-bl-md bg-mist text-ink"}`}
    >
      {children}
    </motion.p>
  );
}

function Attend({ mode, animated }: { mode: Mode; animated: boolean }) {
  const run = mode === "active" && animated;
  const n = useTimeline([300, 1000, 1900, 2800, 3500], run);
  const phase = run ? n : 5;
  if (mode === "pending") {
    return (
      <>
        <Head Glyph={WhatsappLogo} title="Agente de IA" note="En línea" />
        <Waiting text="El agente está en línea, esperando la consulta." />
      </>
    );
  }
  return (
    <>
      <Head Glyph={WhatsappLogo} title="Agente de IA" note="Responde en segundos" live={run} />
      <div className="flex flex-1 flex-col justify-end gap-2 p-4">
        {/* La hora cuenta: el agente atiende cuando el local está cerrado */}
        <p className="mb-auto self-center rounded-full bg-mist px-3 py-1 text-[11px] font-medium text-ink-muted">
          Sábado, 23:14 · local cerrado
        </p>
        {phase >= 1 && <Bubble animated={run}>Hola, ¿la moto 0km se puede en cuotas?</Bubble>}
        {phase === 2 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex origin-bottom-right gap-1 self-end rounded-2xl rounded-br-md bg-blue-500/15 px-3.5 py-3"
          >
            {[0, 1, 2].map((d) => (
              <span key={d} className="typing-dot size-1.5 rounded-full bg-blue-500" style={{ animationDelay: `${d * 130}ms` }} />
            ))}
          </motion.span>
        )}
        {phase >= 3 && (
          <Bubble me animated={run}>
            ¡Hola! Sí, hasta 12 cuotas sin interés. ¿Te paso con un asesor?
          </Bubble>
        )}
        {phase >= 4 && <Bubble animated={run}>Dale, gracias</Bubble>}
        {phase >= 5 && (
          <motion.p
            initial={run ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-1 flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/8 px-3 py-2 text-[12px] font-semibold text-blue-400"
          >
            <Check size={14} weight="bold" className="shrink-0" />
            Calificada: quiere financiar. Pasa a ventas.
          </motion.p>
        )}
      </div>
    </>
  );
}

/* ── 3. Cerrar: el CRM ── */
const PIPE = ["Nueva", "Contacto", "Propuesta", "Venta"];
const FEED = ["Asignada a un asesor", "El asesor la llamó", "Presupuesto enviado", "Seña recibida"];

function Close({ mode, animated }: { mode: Mode; animated: boolean }) {
  const run = mode === "active" && animated;
  const n = useTimeline([350, 1000, 1650, 2300, 2900], run);
  const phase = run ? n : 5;
  if (mode === "pending") {
    return (
      <>
        <Head Glyph={SquaresFour} title="CRM · Ventas" note="12 ventas este mes" />
        <Waiting text="El equipo de ventas recibe solo las consultas listas." />
      </>
    );
  }
  // Hasta qué etapa llegó: Nueva al entrar, Venta al final
  const reached = Math.min(PIPE.length - 1, Math.max(0, phase - 1));
  const sold = phase >= 5;
  return (
    <>
      <Head Glyph={SquaresFour} title="CRM · Ventas" note={`${sold ? 13 : 12} ventas este mes`} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <motion.div
          initial={run ? { opacity: 0, y: 16, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-xl border border-ink/10 p-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-bold text-ink">Moto 0km en cuotas</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-muted">
                <WhatsappLogo size={13} weight="fill" className="text-blue-500" />
                Llegó por WhatsApp
              </p>
            </div>
            {phase >= 1 && (
              <motion.span
                initial={run ? { opacity: 0, scale: 0.6 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={pop}
                className="flex items-center gap-1.5 rounded-full bg-mist py-1 pl-1 pr-2.5 text-[11.5px] font-semibold text-ink"
              >
                <span className="grid size-6 place-items-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                  AS
                </span>
                Asesor
              </motion.span>
            )}
          </div>

          {/* Etapas: la barra se llena y la etapa actual se enciende */}
          <ol className="mt-4 grid grid-cols-4 gap-1.5">
            {PIPE.map((name, i) => {
              const on = i <= reached && phase >= 1;
              return (
                <li key={name}>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <span
                      className="block h-full origin-left rounded-full bg-blue-500 transition-transform duration-500 ease-[var(--ease-expo)]"
                      style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }}
                    />
                  </span>
                  <span
                    className={`mt-1.5 block text-[11px] transition-colors duration-300 ${i === reached && phase >= 1 ? "font-bold text-ink" : "text-ink-faint"}`}
                  >
                    {name}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.div>

        {/* Lo que va pasando con la consulta, etapa por etapa */}
        <ul className="grid gap-1.5 px-1 text-[12px] text-ink-muted">
          {FEED.map(
            (item, i) =>
              phase >= i + 1 &&
              i < 4 && (
                <motion.li
                  key={item}
                  initial={run ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: i === Math.min(3, phase - 1) ? 1 : 0.55, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-center gap-2"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                  {item}
                </motion.li>
              ),
          )}
        </ul>

        <div className="mt-auto grid gap-2">
          {sold && (
            <motion.p
              initial={run ? { opacity: 0, y: 12, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={pop}
              className="flex items-center gap-2.5 rounded-xl bg-ink px-3.5 py-3 text-[13.5px] font-bold text-white"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-500">
                <Check size={13} weight="bold" />
              </span>
              Venta cerrada
              <span className="ml-auto text-[11.5px] font-medium text-white/65">vino de Instagram</span>
            </motion.p>
          )}
        </div>
      </div>
    </>
  );
}

const BODIES = [Attract, Attend, Close];

export function System() {
  const { ref, step, pick, running, reduce, ms } = useDemoLoop(STAGES.length, TURN);
  const stage = STAGES[step];
  const animated = !reduce;

  return (
    <section id="sistema" aria-labelledby="sistema-titulo" className="relative bg-paper py-20 md:py-[8vw]">
      <div className="mx-auto px-5 md:px-[5.8vw]">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-[6vw]">
          <h2
            id="sistema-titulo"
            className="text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-ink"
          >
            <SplitText text="Atraer, atender y cerrar." />
            <br />
            <span className="font-medium">
              <SplitText text="Un solo sistema." delay={220} />
            </span>
          </h2>
          <div data-reveal className="rise [--delay:150ms]">
            <p className="max-w-[46ch] text-[17px] leading-[1.55] text-ink-muted">
              Seguí una consulta de punta a punta: entra por un anuncio, la atiende el agente de IA y llega lista a tu vendedor.
              Vos ves qué campaña trajo cada venta.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#contacto"
                className="pill inline-flex h-13 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-white"
              >
                <span className="roll">
                  <span>Pedí tu diagnóstico</span>
                  <span aria-hidden="true">Pedí tu diagnóstico</span>
                </span>
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="pill inline-flex h-13 items-center gap-2.5 rounded-full bg-blue-500 px-7 text-[15px] font-medium text-white [--pill-fill:var(--ink)]"
              >
                <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* El recorrido */}
        <div
          ref={ref}
          data-reveal
          role="group"
          aria-label="Ejemplo: el recorrido de una consulta por el sistema"
          className="rise relative mt-12 overflow-hidden rounded-[2rem] bg-night text-white md:mt-[4.5vw] lg:rounded-[2.75rem]"
          style={{ "--i": step } as CSSProperties}
        >
          {/* Qué está pasando */}
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 px-6 pt-7 md:px-10 md:pt-10">
            <div className="min-h-[5.6rem] md:min-h-[6.6rem]">
              <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white/50">
                <span className={`relative size-1.5 rounded-full bg-cyan ${running ? "live-dot text-cyan" : ""}`} />
                Consulta de ejemplo
              </p>
              <p
                aria-live="polite"
                className="mt-2 overflow-hidden text-[clamp(1.45rem,2.7vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em]"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={stage.key}
                    initial={animated ? { y: "105%" } : false}
                    animate={{ y: 0 }}
                    exit={animated ? { y: "-105%" } : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="block"
                  >
                    <span className="tabular mr-3 text-white/35">0{step + 1}</span>
                    {stage.line}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
            <p className="max-w-[40ch] pb-1 text-[14.5px] leading-[1.5] text-white/60 max-md:hidden">{stage.detail}</p>
          </div>

          {/* Estaciones */}
          <div className="mt-7 overflow-hidden px-6 md:mt-9 md:px-10">
            <div className="relative">
              {/* La consulta que viaja (escritorio): una pastilla que salta de estación en estación */}
              <div aria-hidden="true" className="sys-token max-lg:hidden">
                <span className="flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 text-[11.5px] font-bold text-white shadow-[0_10px_22px_-10px_rgb(31_107_255/0.9)]">
                  <WhatsappLogo size={13} weight="fill" />
                  Consulta
                </span>
              </div>

              <ol className="sys-track pt-4" aria-hidden="true">
                {STAGES.map((s, i) => {
                  const mode: Mode = i < step ? "done" : i === step ? "active" : "pending";
                  const Body = BODIES[i];
                  return (
                    <li key={s.key} className="sys-station" data-mode={mode}>
                      <div className="flex h-[388px] flex-col overflow-hidden rounded-[1.4rem] bg-white text-ink">
                        {/* Se vuelve a montar al activarse: su secuencia arranca de cero */}
                        <Body key={mode} mode={mode} animated={animated} />
                      </div>
                      {i < STAGES.length - 1 && (
                        <span className="sys-link max-lg:hidden" data-on={i < step}>
                          <ArrowRight size={14} weight="bold" />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Pasos */}
          <div role="group" aria-label="Etapas del recorrido" className="mt-6 grid grid-cols-3 border-t border-white/10 md:mt-9">
            {STAGES.map((s, i) => {
              const on = i === step;
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => pick(i)}
                  className={`group relative flex min-h-16 flex-col justify-center gap-1 border-l border-white/10 px-4 py-4 text-left transition-colors duration-300 first:border-l-0 md:px-10 md:py-6 ${on ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}
                >
                  <span
                    className={`flex items-center gap-2.5 text-[15px] font-semibold transition-colors duration-300 md:text-[19px] ${on ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
                  >
                    <s.Glyph size={18} weight={on ? "fill" : "regular"} className="max-md:hidden" />
                    {s.title}
                  </span>
                  <span className="text-[13.5px] leading-snug text-white/50 max-md:hidden">{s.line}</span>
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]">
                    <span
                      key={`${step}-${running}`}
                      className="block h-full origin-left bg-[linear-gradient(to_right,var(--blue-500),var(--cyan))]"
                      style={{
                        transform: i < step || (on && !running) ? "scaleX(1)" : "scaleX(0)",
                        animation: on && running ? `sys-fill ${ms}ms linear forwards` : undefined,
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="px-6 pb-6 pt-4 text-[14px] leading-[1.5] text-white/60 md:hidden">{stage.detail}</p>
        </div>
      </div>
    </section>
  );
}
