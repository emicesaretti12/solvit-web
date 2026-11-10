/*
  Hechos: tres columnas de tarjetas que suben y bajan sin parar (se frenan con el mouse encima).
  No son reseñas: cada tarjeta es algo que SEN hizo y entregó en un proyecto, tomado de
  content/projects (solo hechos confirmados).
*/
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DELIVERED, PROJECTS, SECTORS } from "@/content/projects";
import { SplitText } from "./split-text";

type Fact = { who: string; sector: string; text: string; tint: number };

// Intercalados: primero un hecho de cada proyecto, después el segundo de los que tienen, etc.
const PER_PROJECT = PROJECTS.map((p, tint) =>
  (p.highlights ?? [p.summary]).map((text) => ({ who: p.client ?? p.name, sector: p.sector, text, tint })),
);
const FACTS: Fact[] = Array.from({ length: Math.max(...PER_PROJECT.map((f) => f.length)) }).flatMap((_, round) =>
  PER_PROJECT.flatMap((facts) => (facts[round] ? [facts[round]] : [])),
);

const TINTS = ["bg-blue-500 text-white", "bg-ink text-white", "bg-haze text-ink", "bg-cyan text-ink"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function Column({ facts, reverse, duration, className = "" }: { facts: Fact[]; reverse?: boolean; duration: number; className?: string }) {
  return (
    <div className={`overflow-hidden [--gap:1.25rem] ${className}`} style={{ ["--duration" as string]: `${duration}s` }}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className={`flex flex-col gap-[var(--gap)] pb-[var(--gap)] ${reverse ? "animate-marquee-y-reverse" : "animate-marquee-y"}`}
        >
          {facts.map((fact, i) => (
            <li key={i} className="rounded-3xl border border-line bg-white p-5 shadow-[0_14px_34px_-26px_rgb(var(--shade-rgb)/0.5)]">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-bold ${TINTS[fact.tint % TINTS.length]}`}>
                  {initials(fact.who)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-ink">{fact.who}</span>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-faint">{fact.sector}</span>
                </span>
              </div>
              <p className="mt-4 text-[14.5px] leading-[1.55] text-ink-muted">{fact.text}</p>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function Facts() {
  // Reparto de a uno por columna: así un mismo cliente no queda dos veces seguidas
  const columns = [0, 1, 2].map((c) => FACTS.filter((_, i) => i % 3 === c));

  return (
    <section id="hechos" aria-labelledby="hechos-titulo" className="relative overflow-hidden bg-paper py-20 md:py-[7vw]">
      <div className="mx-auto px-5 text-center md:px-[5.8vw]">
        <p data-reveal className="rise text-[12.5px] uppercase text-ink-muted">
          Proyectos entregados
        </p>
        <h2 id="hechos-titulo" className="mt-3 text-[clamp(2.1rem,4.4vw,3.6rem)] font-bold uppercase leading-[1] tracking-[-0.035em] text-ink">
          <SplitText text="Hechos, no promesas" />
        </h2>
        <p data-reveal className="rise mt-4 text-[16px] text-ink-muted [--delay:200ms]">
          <span className="tabular font-bold text-ink">+{DELIVERED}</span> proyectos entregados ·{" "}
          <span className="tabular font-bold text-ink">{SECTORS}</span> rubros distintos
        </p>
      </div>

      <div
        data-reveal
        className="rise marquee-hold mx-auto mt-12 grid h-[560px] gap-5 px-5 [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_86%,transparent)] md:grid-cols-2 md:px-[5.8vw] lg:grid-cols-3"
      >
        <Column facts={columns[0]} duration={38} />
        <Column facts={columns[1]} duration={46} reverse className="max-md:hidden" />
        <Column facts={columns[2]} duration={42} className="max-lg:hidden" />
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="#trabajos"
          className="pill group inline-flex h-11 items-center gap-3 rounded-full border border-ink/20 px-6 text-[12.5px] uppercase text-ink [--pill-fill:var(--ink)]"
        >
          Ver los trabajos
          <ArrowRight size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
