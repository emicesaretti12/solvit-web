"use client";

/*
  Últimos trabajos: el título entra letra por letra, y debajo una grilla de dos columnas con las
  portadas grandes de los proyectos (se abren de abajo hacia arriba al entrar y la imagen se
  desplaza apenas con el scroll, dentro de su marco). Los que tienen sitio público se abren en
  otra pestaña. Cierra con la vitrina oscura de marcas: dos columnas de nombres que suben y
  bajan sin parar.
*/
import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { coverOf, DELIVERED, PROJECTS, type Project } from "@/content/projects";
import { tap } from "@/lib/haptics";
import { CountUp } from "./count-up";
import { SplitText } from "./split-text";

const FIRST = 6;

function Cover({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const body = (
    <>
      <div
        ref={ref}
        style={{ "--delay": `${(index % 2) * 120}ms` } as CSSProperties}
        className="cover relative aspect-[16/10] overflow-hidden rounded-3xl bg-mist"
      >
        <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-4.5%]">
          {/* Las portadas son ilustraciones SVG livianas: van como <img>, sin optimizador */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverOf(project)}
            alt={`Portada de ${project.name}`}
            loading="lazy"
            decoding="async"
            className="cover-img size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.045]"
          />
        </motion.div>
        {project.url && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 grid size-12 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 shadow-[0_10px_24px_-12px_rgb(4_8_20/0.6)] transition-[transform,opacity] duration-300 ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
          >
            <ArrowUpRight size={20} weight="bold" />
          </span>
        )}
      </div>
      <p className="mt-6 flex flex-wrap items-center gap-x-2 text-[12.5px] uppercase tracking-[0.01em] text-ink">
        {project.kind}
        <span aria-hidden="true" className="size-1 rounded-full bg-ink" />
        {project.sector}
      </p>
      <h3 className="mt-3 text-[clamp(2rem,3.3vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-ink">
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-expo)] group-hover:bg-[length:100%_2px]">
          {project.name}
        </span>
      </h3>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">{project.summary}</p>
    </>
  );

  return (
    <li className="rise rise-flat" data-reveal style={{ "--delay": `${(index % 2) * 120}ms` } as CSSProperties}>
      {project.url ? (
        <a href={project.url} target="_blank" rel="noreferrer" className="group block">
          {body}
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      ) : (
        <div className="group">{body}</div>
      )}
    </li>
  );
}

/* Nombres de clientes como marcas tipográficas, en celdas con borde */
const VOICES = [
  "font-extrabold tracking-[-0.04em] text-[1.9rem]",
  "font-light uppercase tracking-[0.22em] text-[1.2rem]",
  "font-bold italic tracking-[-0.03em] text-[1.8rem]",
  "font-black uppercase tracking-[0.04em] text-[1.45rem]",
  "font-medium tracking-[-0.02em] text-[1.7rem]",
];

function BrandColumn({ names, reverse }: { names: string[]; reverse?: boolean }) {
  return (
    <div className="relative h-full overflow-hidden border-l border-white/12 first:border-l-0 max-md:border-l-0 [--duration:26s] [--gap:0px]">
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1} className={reverse ? "animate-marquee-y-reverse" : "animate-marquee-y"}>
          {names.map((name, i) => (
            <li
              key={name}
              className={`grid h-28 place-items-center border-b border-white/12 px-6 text-center text-white/75 ${VOICES[(i + (reverse ? 2 : 0)) % VOICES.length]}`}
            >
              {name}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/* El título gigante se desliza hacia la izquierda mientras cruza la pantalla (ligado al scroll) */
function Drift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5vw", "-5vw"]);
  return (
    <motion.span ref={ref} style={reduce ? undefined : { x }} className="block">
      {children}
    </motion.span>
  );
}

/* La vitrina llega un poco más chica y termina de crecer al entrar (ligado al scroll) */
function GrowIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale }} className="mt-20 origin-top md:mt-[6vw]">
      {children}
    </motion.div>
  );
}

export function Works() {
  const [all, setAll] = useState(false);
  const shown = all ? PROJECTS : PROJECTS.slice(0, FIRST);
  const clients = PROJECTS.flatMap((p) => (p.client ? [p.client] : []));
  const half = Math.ceil(clients.length / 2);

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="relative bg-paper pb-20 pt-24 md:pb-[6vw] md:pt-[9vw]">
      <div className="mx-auto px-5 md:px-[5vw]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 id="trabajos-titulo" className="text-[clamp(3rem,8.4vw,8.6rem)] leading-[0.98] tracking-[-0.04em] text-ink">
            <Drift>
              <SplitText text="Últimos trabajos" />
            </Drift>
          </h2>
          <p data-reveal className="rise max-w-[38ch] pb-3 text-[16px] leading-[1.5] text-ink-muted [--delay:250ms]">
            Diseñamos y construimos productos digitales que ya son parte de la operación y de las ventas de cada cliente.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-7 gap-y-16 md:mt-[4.5vw] md:grid-cols-2 md:gap-y-[6vw]">
          {shown.map((project, i) => (
            <Cover key={project.slug} project={project} index={i} />
          ))}
        </ul>

        <button
          type="button"
          aria-expanded={all}
          onClick={() => {
            tap();
            setAll((v) => !v);
          }}
          className="pill mt-14 inline-flex h-16 items-center gap-6 rounded-full bg-white pl-9 pr-9 text-[17px] uppercase text-ink shadow-[0_18px_44px_-20px_rgb(var(--shade-rgb)/0.45),0_0_0_1px_rgb(var(--fg-rgb)/0.06)] [--pill-fill:var(--ink)] md:mt-[5vw]"
        >
          <span aria-hidden="true" className="size-2.5 rounded-full bg-current" />
          <span className="roll">
            <span>{all ? "Ver menos proyectos" : "Ver todos los proyectos"}</span>
            <span aria-hidden="true">{all ? "Ver menos proyectos" : "Ver todos los proyectos"}</span>
          </span>
        </button>

        {/* Vitrina de marcas */}
        <GrowIn>
          <div data-reveal className="rise marquee-hold overflow-hidden rounded-[2rem] bg-night px-6 pt-9 text-white md:px-8">
            <div className="flex items-end justify-between gap-8 border-b border-white/15 pb-5">
              <h3 className="max-w-[20ch] text-balance text-[clamp(1.7rem,3.5vw,3rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
                Marcas que ya construyen con nosotros.
              </h3>
              <p className="shrink-0 text-[clamp(2rem,4vw,3.4rem)] font-bold leading-none tracking-[-0.03em]">
                <CountUp to={DELIVERED} prefix="+" />
              </p>
            </div>
            <div className="grid h-[340px] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] md:grid-cols-2">
              <BrandColumn names={clients.slice(0, half)} />
              <div className="max-md:hidden">
                <BrandColumn names={clients.slice(half)} reverse />
              </div>
            </div>
          </div>
        </GrowIn>
      </div>
    </section>
  );
}
