"use client";

/*
  HeroSection del hero-01 (Agency Hero Section de ShadcnSpace), recreado para SEN.
  Composición editorial: titular grande a la izquierda y, a la derecha, el isotipo en 3D con
  notificaciones del recorrido de una venta en cascada (Z-axis). En celulares el isotipo va arriba.
  Animaciones: titular que entra palabra por palabra desde una máscara, trazo que subraya
  "ventas", palabra que rota, cifras que cuentan, tarjetas que se encienden en secuencia,
  fondo con luces que derivan lento. Todo transform/opacity; reduced motion: todo quieto y visible.
*/
import {
  ArrowRight,
  ArrowUpRight,
  ChatCircleDots,
  CheckCircle,
  Sparkle,
  UserSwitch,
  type Icon,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT_LABEL } from "@/components/cta";
import { Isotype3D } from "@/components/isotype-3d";
import { getLenis } from "@/components/smooth-scroll";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AvatarList {
  image: string;
  /** Sin foto: un ícono (por ejemplo, el rubro del proyecto) */
  icon?: Icon;
  label?: string;
}

export interface HeroStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const EASE = [0.32, 0.72, 0, 1] as const;
const WORDS = ["software a medida", "agentes de IA", "marketing digital", "CRM propio", "hardware e IoT"];

/* ---------- Titular: palabras que suben desde una máscara ---------- */
function MaskedWords({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("block", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom [margin-right:0.24em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { transform: "translateY(105%)" }}
            animate={{ transform: "translateY(0%)" }}
            transition={{ duration: 1.05, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Trazo a mano bajo "ventas": se dibuja después del titular
function Underline() {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.28em] w-full overflow-visible text-blue-500"
    >
      <motion.path
        d="M4 16 C 70 6, 150 4, 296 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
      />
    </svg>
  );
}

function RotatingWord() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2400);
    return () => window.clearInterval(id);
  }, [reduce]);
  return (
    <span className="relative inline-grid h-8 min-w-[10.5em] items-center overflow-hidden rounded-full border border-line bg-navy-850/70 px-3 align-middle text-left">
      <span className="sr-only">{WORDS.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap font-medium leading-8 text-ink"
          initial={{ transform: "translateY(110%)", opacity: 0 }}
          animate={{ transform: "translateY(0%)", opacity: 1 }}
          exit={{ transform: "translateY(-110%)", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- Acción principal: el email pasa al formulario de contacto ---------- */
function EmailStart() {
  const [error, setError] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("hero-email") as HTMLInputElement;
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Revisá el email para seguir.");
      input.focus();
      return;
    }
    setError("");
    const target = document.getElementById("contacto");
    const field = document.getElementById("email") as HTMLInputElement | null;
    if (field) field.value = email;
    const focusName = () => document.getElementById("nombre")?.focus({ preventScroll: true });
    const lenis = getLenis();
    if (lenis && target) lenis.scrollTo(target, { onComplete: focusName });
    else {
      target?.scrollIntoView({ block: "start" });
      focusName();
    }
  };
  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[540px]">
      {/* Doble bisel: carcasa translúcida y núcleo con brillo interno */}
      <div className="rounded-[1.6rem] border border-line bg-fg/[0.03] p-1.5 sm:rounded-full">
        <div className="flex flex-col gap-1.5 rounded-[calc(1.6rem-6px)] bg-navy-850/90 p-1.5 shadow-[inset_0_1px_1px_rgb(var(--fg-rgb)/0.08)] sm:flex-row sm:items-center sm:rounded-full">
          <Label htmlFor="hero-email" className="sr-only">
            Tu email
          </Label>
          <Input
            id="hero-email"
            name="hero-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@empresa.com"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "hero-email-error" : undefined}
            className="h-12 flex-1 rounded-full border-transparent bg-transparent px-5 focus-visible:border-transparent focus-visible:ring-0"
          />
          <button
            type="submit"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-blue-500 pl-6 pr-1.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_12px_30px_-12px_rgb(31_107_255/0.7)] transition-[transform,background-color] duration-200 ease-[var(--ease-out)] hover:bg-blue-600 active:scale-[0.98]"
          >
            {CONTACT_LABEL}
            <span className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
      <p id="hero-email-error" aria-live="polite" className="mt-2 min-h-5 pl-4 text-sm text-destructive">
        {error}
      </p>
    </form>
  );
}

/* ---------- Cifras que cuentan al entrar ---------- */
function CountUp({ stat }: { stat: HeroStat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = String(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.6,
      delay: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, stat.value]);
  return (
    <span className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink tabular sm:text-4xl">
      {stat.prefix}
      <span ref={ref}>{stat.value}</span>
      {stat.suffix}
    </span>
  );
}

/* ---------- Escenario: isotipo 3D + recorrido de una venta ---------- */
const STEPS: { icon: Icon; title: string; text: string; pos: string; depth: number }[] = [
  { icon: ChatCircleDots, title: "Nueva consulta", text: "WhatsApp · SUV 0km", pos: "left-0 top-[8%] -rotate-2", depth: 1 },
  { icon: Sparkle, title: "Agente de IA", text: "Calificada: prioridad alta", pos: "right-0 top-[30%] rotate-2", depth: 1.6 },
  { icon: UserSwitch, title: "CRM", text: "Asignada a un asesor", pos: "left-[2%] bottom-[22%] rotate-1", depth: 1.3 },
  { icon: CheckCircle, title: "Venta cerrada", text: "Atribuida a su campaña", pos: "right-[4%] bottom-[2%] -rotate-1", depth: 1.9 },
];

function StepCard({ step, on }: { step: (typeof STEPS)[number]; on: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[1.1rem] border p-1 transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-out)]",
        on ? "-translate-y-1 border-blue-400/50 bg-blue-500/10" : "border-line bg-fg/[0.03]",
      )}
    >
      <div className="flex items-center gap-2.5 rounded-[calc(1.1rem-4px)] bg-navy-850/95 px-3 py-2.5 shadow-[0_18px_40px_-24px_rgb(var(--shade-rgb)/0.9),inset_0_1px_1px_rgb(var(--fg-rgb)/0.06)]">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-500",
            on ? "bg-blue-500 text-white" : "bg-navy-800 text-blue-400",
          )}
        >
          <step.icon size={16} weight={on ? "fill" : "light"} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] font-medium leading-tight text-ink">{step.title}</span>
          <span className="block truncate text-[11.5px] leading-tight text-ink-muted">{step.text}</span>
        </span>
      </div>
    </div>
  );
}

function SalesStage({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1900);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[360px] sm:h-[420px] sm:max-w-[460px] lg:h-[560px] lg:max-w-none">
      {/* Halo y anillos detrás del isotipo */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_107_255/0.32),rgb(31_107_255/0.08)_55%,transparent)] light:bg-[radial-gradient(closest-side,rgb(31_107_255/0.2),rgb(31_107_255/0.05)_55%,transparent)]" />
        <div className="absolute left-1/2 top-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
        <div className="hero-orbit absolute left-1/2 top-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 [--orbit-duration:26s]">
          <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_0_5px_rgb(31_107_255/0.18)]" />
        </div>
        <div className="absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line-strong" />
        <div className="hero-orbit absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 [--orbit-duration:18s] [animation-direction:reverse]">
          <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink-muted" />
        </div>
      </div>

      <Isotype3D
        scrollTarget={sectionRef}
        className="absolute left-1/2 top-1/2 h-[62%] -translate-x-1/2 -translate-y-1/2"
      />

      {/* Recorrido de una venta: se enciende una tarjeta por vez, en orden (en cascada desde sm) */}
      <ol aria-label="Recorrido de una venta, ejemplo" className="absolute inset-0 max-sm:hidden">
        {STEPS.map((step, i) => (
          <motion.li
            key={step.title}
            className={cn("absolute w-[min(62%,230px)]", step.pos)}
            initial={reduce ? false : { opacity: 0, transform: "translateY(18px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            transition={{ duration: 0.9, delay: 0.9 + i * 0.15, ease: EASE }}
          >
            <StepCard step={step} on={i === active} />
          </motion.li>
        ))}
      </ol>
      {/* En celulares: una notificación por vez, debajo del isotipo, como un aviso del sistema */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex justify-center sm:hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={STEPS[active].title}
            className="w-[min(86%,300px)]"
            initial={reduce ? false : { opacity: 0, transform: "translateY(14px) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(-10px) scale(0.97)" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <StepCard step={STEPS[active]} on />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        Ejemplo del recorrido de una venta
      </p>
    </div>
  );
}

export default function HeroSection({
  avatarList,
  stats,
}: {
  avatarList: AvatarList[];
  stats: HeroStat[];
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const fade = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, transform: "translateY(22px)" },
          animate: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration: 0.9, delay: 0.55 + i * 0.09, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden px-4 pb-20 pt-28 md:px-6 md:pb-28 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-16 lg:pt-28"
    >
      {/* Fondo: luces que derivan lento, grilla técnica con máscara */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-drift absolute -left-[20%] -top-[30%] size-[80vmax] rounded-full bg-[radial-gradient(closest-side,rgb(31_107_255/0.22),transparent)] light:bg-[radial-gradient(closest-side,rgb(31_107_255/0.13),transparent)]" />
        <div className="hero-drift absolute -bottom-[40%] -right-[25%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(167_176_192/0.12),transparent)] [animation-delay:-9s] [animation-direction:reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_75%_65%_at_60%_45%,#000_25%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        {/* En celulares el isotipo va primero: es lo que impacta en la primera pantalla */}
        <div className="lg:order-2">
          <SalesStage sectionRef={sectionRef} />
        </div>

        <div className="flex flex-col items-start lg:order-1">
          <motion.a
            {...fade(-3)}
            href="#servicios"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-navy-850/60 py-1 pl-1.5 pr-3.5 transition-colors duration-200 hover:border-line-strong"
          >
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
              SEN
            </span>
            <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-ink-muted min-[390px]:text-[9.5px] sm:text-[11px] sm:tracking-[0.2em]">
              Ingeniería y Desarrollo de Software
            </span>
            <ArrowUpRight size={13} className="text-ink-faint" aria-hidden="true" />
          </motion.a>

          <h1
            id="hero-titulo"
            className="font-display mt-6 text-[2.15rem] font-semibold leading-[1.02] tracking-[-0.045em] text-ink min-[390px]:text-[2.3rem] sm:text-[4rem] lg:text-[4rem] xl:text-[4.5rem]"
          >
            <MaskedWords text="Especialistas en" delay={0.15} />
            <MaskedWords text="solucionar" delay={0.3} />
            <span className="relative inline-block text-blue-400">
              <MaskedWords text="tus ventas." delay={0.4} />
              <Underline />
            </span>
          </h1>

          <motion.p {...fade(0)} className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            Hacemos que cada consulta termine en una venta: atraemos clientes con marketing, los
            atendemos con agentes de IA las 24 horas y los seguimos en un CRM propio, hasta el cierre.
          </motion.p>

          <motion.p {...fade(1)} className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            Lo resolvemos con <RotatingWord />
          </motion.p>

          <motion.div {...fade(2)} className="mt-7 w-full">
            <EmailStart />
            <a
              href="#proyectos"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              Ver proyectos realizados
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Cifras y clientes */}
          <motion.div {...fade(3)} className="mt-5 w-full border-t border-line pt-6">
            <dl className="grid grid-cols-3 gap-4 sm:max-w-[520px]">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <CountUp stat={s} />
                    <span className="mt-1 block text-[12px] leading-snug text-ink-muted sm:text-[13px]">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex items-center gap-3">
              <ul className="flex -space-x-2" aria-label="Rubros de clientes">
                {avatarList.map((avatar, i) => (
                  <li
                    key={avatar.label ?? i}
                    title={avatar.label}
                    className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-navy-900 bg-navy-800 text-blue-400"
                  >
                    {avatar.icon ? (
                      <avatar.icon size={16} weight="light" aria-hidden="true" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element -- avatares chicos opcionales
                      <img src={avatar.image} alt="" width={36} height={36} className="size-full object-cover" />
                    )}
                    {avatar.label && <span className="sr-only">{avatar.label}</span>}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] leading-snug text-ink-muted">
                <span className="font-medium text-ink">Clientes satisfechos</span> en motos, industria,
                salud, gastronomía y comercio
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
