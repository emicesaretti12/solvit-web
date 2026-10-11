"use client";

/*
  Proyectos realizados.
  1. Galería (PortfolioGallery): todas las portadas en abanico 3D (marquesina en celulares).
  2. Clientes satisfechos: marquesina tipográfica con los nombres de los clientes.
  3. Casos destacados: portada en un marco con relieve que se endereza al hacer scroll, con datos
     flotantes del proyecto, y lo que se hizo.
  4. Índice filtrable por especialidad: filas con portada; con mouse en escritorio la portada
     sigue al puntero. Al final, el total de proyectos entregados y el llamado a contacto.
  Elegir una portada en la galería lleva a su caso o fila (y quita el filtro si la ocultaba).
*/
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, CheckCircle, Pause, Play } from "@phosphor-icons/react";
import Image from "next/image";
import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import { LogoMark } from "@/components/logo";
import { getLenis } from "@/components/smooth-scroll";
import { CONTACT_LABEL, PrimaryCta } from "@/components/cta";
import { Reveal } from "@/components/reveal";
import { DELIVERED, PROJECTS, coverOf, type Project, type Specialty } from "@/content/projects";
import { cn } from "@/lib/utils";

type Filter = "Todos" | Specialty;
const FILTERS: Filter[] = ["Todos", "Desarrollo web", "Software a medida", "Hardware e IoT", "SEO"];

const EASE = [0.32, 0.72, 0, 1] as const;

// Portada que sigue al puntero en el índice (px)
const PREVIEW_W = 352;
const PREVIEW_GAP = 40;

const anchorOf = (p: Project) => `proyecto-${p.slug}`;
const altOf = (p: Project) => `Ilustración de ${p.name}: ${p.kind.toLowerCase()}`;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm font-medium text-blue-300">{children}</span>
  );
}

function Chips({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-navy-900/70 px-2.5 py-1 text-[12px] leading-none text-ink-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SiteLink({ url, name, compact = false }: { url: string; name: string; compact?: boolean }) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver sitio de ${name} (${host}), se abre en una pestaña nueva`}
        className="group/link relative z-10 inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition-[transform,border-color,background-color] duration-150 ease-out hover:border-blue-400/60 hover:bg-blue-500/10 active:scale-[0.95] md:size-auto md:gap-2 md:py-2 md:pl-4 md:pr-2"
      >
        <span className="hidden text-sm md:inline">Ver sitio</span>
        <ArrowUpRight
          size={16}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/link:-translate-y-px group-hover/link:translate-x-px"
        />
      </a>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-line-strong py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink transition-[transform,border-color] duration-150 ease-out hover:border-blue-400/60 active:scale-[0.97]"
    >
      Ver {host}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
      <span className="flex size-8 items-center justify-center rounded-full bg-fg/5 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-0.5">
        <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
      </span>
    </a>
  );
}

/* Clientes satisfechos: nombres en una marquesina tipográfica, con pausa */
function Clients() {
  const clients = PROJECTS.flatMap((p) => (p.client ? [p.client] : []));
  const [paused, setPaused] = useState(false);
  const row = (copy: number) => (
    <ul
      aria-hidden={copy > 0 || undefined}
      className={cn(
        "flex shrink-0 animate-marquee items-center gap-[var(--gap)] pr-[var(--gap)] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
        paused && "[animation-play-state:paused]",
        copy > 0 && "motion-reduce:hidden",
        // Con reduced motion la lista queda quieta y envuelve en varias líneas
        "motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0",
      )}
    >
      {clients.map((client) => (
        <li key={`${copy}-${client}`} className="flex items-center gap-[var(--gap)]">
          <span className="font-display whitespace-nowrap text-[1.6rem] font-semibold tracking-[-0.03em] text-ink/80 transition-colors duration-200 hover:text-ink md:text-[2.4rem]">
            {client}
          </span>
          <LogoMark className="h-5 w-auto opacity-70 md:h-7" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-16 md:mt-24">
      <Reveal className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">
          Clientes satisfechos
        </h3>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Reanudar la lista de clientes" : "Pausar la lista de clientes"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:text-ink motion-reduce:hidden"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-line-strong">
            {paused ? <Play size={12} weight="fill" aria-hidden="true" /> : <Pause size={12} weight="fill" aria-hidden="true" />}
          </span>
        </button>
      </Reveal>
      <div className="group mt-6 flex overflow-hidden border-y border-line py-6 [--duration:50s] [--gap:2rem] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] motion-reduce:[mask-image:none] md:py-8 md:[--gap:3rem]">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}

/* Caso destacado: portada con relieve que se endereza al llegar al centro de la pantalla */
function FeaturedCase({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 60%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <article
      ref={ref}
      id={anchorOf(project)}
      tabIndex={-1}
      aria-labelledby={`${anchorOf(project)}-titulo`}
      className="grid items-center gap-10 outline-none lg:grid-cols-[1.12fr_0.88fr] lg:gap-16"
    >
      <div className={cn("relative [perspective:1600px]", flip && "lg:order-2")}>
        {/* Mismo estilo en servidor y cliente; con reduced motion el CSS la deja derecha */}
        <motion.div
          style={{ rotateX, scale, y: lift }}
          className="relative origin-bottom overflow-hidden motion-reduce:!transform-none rounded-2xl border border-line-strong bg-navy-900 shadow-[0_50px_100px_-50px_rgb(var(--shade-rgb)/0.9)] light:shadow-[0_40px_80px_-50px_rgb(var(--shade-rgb)/0.4)]"
        >
          <div className="relative aspect-video">
            {/* sd-parallax: en celulares con scroll ligado, la imagen se desliza dentro del marco */}
            <div className="sd-parallax absolute inset-0">
              <Image src={coverOf(project)} alt={altOf(project)} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </div>
          </div>
        </motion.div>
      </div>

      <Reveal className={cn(flip && "lg:order-1")}>
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Caso destacado</Eyebrow>
          <span className="text-sm text-ink-faint">
            {project.sector} · {project.kind}
          </span>
        </div>
        <h3
          id={`${anchorOf(project)}-titulo`}
          className="font-display mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink text-balance md:text-[2.75rem]"
        >
          {project.name}
        </h3>
        <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-muted md:text-lg">{project.summary}</p>
        {project.highlights && (
          <ul className="mt-7 space-y-3 border-t border-line pt-6">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-snug text-ink">
                <CheckCircle size={20} weight="light" aria-hidden="true" className="mt-px shrink-0 text-blue-400" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <Chips items={project.specialties} className="mt-7" />
        <div className="mt-8 flex flex-wrap gap-3">
          {project.url ? (
            <SiteLink url={project.url} name={project.name} />
          ) : (
            <PrimaryCta label={CONTACT_LABEL} />
          )}
        </div>
      </Reveal>
    </article>
  );
}

/* Índice filtrable */
function ProjectIndex({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<Project | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 30, mass: 0.6 });

  const visible = filter === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.specialties.includes(filter));
  const countOf = (f: Filter) => (f === "Todos" ? PROJECTS.length : PROJECTS.filter((p) => p.specialties.includes(f)).length);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    // La portada va al costado del puntero, del lado donde entra entera
    const rect = listRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const right = cx + PREVIEW_GAP;
    mx.set(right + PREVIEW_W <= rect.width ? right : cx - PREVIEW_GAP - PREVIEW_W);
    my.set(e.clientY - rect.top - (PREVIEW_W * 9) / 32);
  };

  return (
    <div id="proyectos-lista" className="mt-24 md:mt-36">
      <Reveal className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h3 className="font-display text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-[2.6rem]">
            Proyectos por especialidad
          </h3>

        </div>
        <div
          role="group"
          aria-label="Filtrar proyectos por especialidad"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-end md:px-0"
        >
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative inline-flex min-h-11 shrink-0 select-none items-center gap-2 rounded-full border px-4 text-sm transition-[color,border-color,transform] duration-150 ease-out active:scale-[0.97] md:min-h-10",
                  active ? "border-transparent text-white" : "border-line-strong text-ink-muted hover:border-blue-400/50 hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-blue-500 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{f}</span>
                <span className={cn("relative font-mono text-[11px] tabular-nums", active ? "text-white/75" : "text-ink-faint")}>
                  {countOf(f)}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <p aria-live="polite" className="sr-only">
        {filter === "Todos" ? `Mostrando los ${visible.length} proyectos` : `${visible.length} proyectos de ${filter}`}
      </p>

      <div
        ref={listRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setPreview(null)}
        className="relative mt-10"
      >
        {/* Encabezados de columna (escritorio) */}
        <div
          aria-hidden="true"
          className="hidden grid-cols-[8rem_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_8.5rem] gap-6 border-b border-line pb-3 text-xs text-ink-faint lg:grid lg:pointer-fine:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_8.5rem]"
        >
          <span className="lg:pointer-fine:hidden" />
          <span>Proyecto</span>
          <span>Rubro</span>
          <span>Especialidades</span>
          <span className="text-right">Enlace</span>
        </div>

        <ul className="border-b border-line lg:border-b-0">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transform: "translateY(-8px)" }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative border-t border-line first:border-t-0 lg:first:border-t-0"
              >
                {/* Los destacados ya tienen su ancla arriba; acá su fila no repite el id */}
                <div
                  id={p.featured ? undefined : anchorOf(p)}
                  tabIndex={p.featured ? undefined : -1}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(p)}
                  className="group grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-5 outline-none transition-colors duration-200 sm:grid-cols-[8rem_minmax(0,1fr)_auto] lg:grid-cols-[8rem_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_8.5rem] lg:gap-x-6 lg:py-6 lg:pointer-fine:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_8.5rem] focus-visible:bg-fg/[0.03]"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-navy-900 ring-1 ring-fg/10 lg:pointer-fine:hidden">
                    <Image src={coverOf(p)} alt="" fill sizes="128px" className="object-cover object-left-top" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[17px] font-medium tracking-[-0.01em] text-ink transition-transform duration-300 ease-[var(--ease-out)] lg:text-[1.35rem] lg:group-hover:translate-x-1.5">
                      <span>{p.name}</span>
                      {p.featured && (
                        <span className="shrink-0 rounded-md bg-blue-500/12 px-1.5 py-0.5 text-[11px] font-medium text-blue-300">
                          Destacado
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[13px] text-ink-faint lg:hidden">
                      {p.sector} · {p.kind}
                    </p>
                    <p className="mt-1.5 line-clamp-2 max-w-[60ch] text-sm leading-relaxed text-ink-muted max-sm:hidden">
                      {p.summary}
                    </p>
                  </div>
                  <p className="hidden text-sm text-ink-muted lg:block">
                    {p.sector}
                    <span className="block text-ink-faint">{p.kind}</span>
                  </p>
                  <Chips items={p.specialties} className="hidden lg:flex" />
                  <div className="flex justify-end">
                    {p.url ? (
                      <SiteLink url={p.url} name={p.name} compact />
                    ) : (
                      <span className="hidden text-right text-xs text-ink-faint lg:block">Sin sitio público</span>
                    )}
                  </div>
                  <p className="col-span-full -mt-1 text-sm leading-relaxed text-ink-muted sm:hidden">{p.summary}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Portada que sigue al puntero (solo mouse, escritorio) */}
        <motion.div
          aria-hidden="true"
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:pointer-fine:block"
        >
          <AnimatePresence>
            {preview && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, transform: "scale(0.9) rotate(-3deg)" }}
                animate={{ opacity: 1, transform: "scale(1) rotate(-2deg)" }}
                exit={{ opacity: 0, transform: "scale(0.92) rotate(-3deg)" }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{ width: PREVIEW_W }}
                className="relative aspect-video overflow-hidden rounded-2xl bg-navy-900 shadow-[0_40px_80px_-30px_rgb(var(--shade-rgb)/0.9)] ring-1 ring-fg/10"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={preview.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image src={coverOf(preview)} alt="" fill sizes="352px" className="object-cover object-left-top" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cierre: el siguiente paso */}
      <Reveal className="mt-14 md:mt-16">
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-navy-850 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
          <div>
            <p className="font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[2.2rem]">
              ¿Tenés un proyecto en mente?
            </p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-muted md:text-base">
              Estos son algunos de los que entregamos. Contanos el tuyo y vemos por dónde empezar.
            </p>
          </div>
          <PrimaryCta label={CONTACT_LABEL} className="self-start md:self-center" />
        </div>
      </Reveal>
    </div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const featured = PROJECTS.filter((p) => p.featured);
  const images = PROJECTS.map((p) => ({
    src: coverOf(p),
    alt: altOf(p),
    title: p.name,
    subtitle: `${p.sector} · ${p.kind}`,
    href: `#${anchorOf(p)}`,
  }));

  // Lleva al caso o fila del proyecto; si el filtro lo ocultaba, primero lo quita
  const goTo = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    const project = PROJECTS[index];
    event.preventDefault();
    if (!project.featured && filter !== "Todos" && !project.specialties.includes(filter as Specialty)) {
      flushSync(() => setFilter("Todos"));
    }
    const target = document.getElementById(anchorOf(project));
    if (!target) return;
    target.focus({ preventScroll: true });
    const lenis = getLenis();
    if (lenis) {
      // Si el filtro cambió, la página creció: Lenis tiene que medir el nuevo alto antes
      lenis.resize();
      lenis.scrollTo(target); // el margen del header lo da scroll-padding-top
    } else target.scrollIntoView({ block: "start" });
  };

  return (
    <section id="proyectos" aria-label="Proyectos realizados" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-36">
        <Reveal>
          <PortfolioGallery
            title={`Más de ${DELIVERED} proyectos entregados.`}
            description="Webs que venden, CRM a medida, sistemas de reservas y catálogos para clientes de motos, baterías, industria, salud, gastronomía y más."
            archiveButton={{ text: "Ver la lista", href: "#proyectos-lista" }}
            images={images}
            onImageClick={goTo}
          />
        </Reveal>

        <Clients />

        <div className="mt-24 space-y-24 md:mt-36 md:space-y-36">
          {featured.map((p, i) => (
            <FeaturedCase key={p.slug} project={p} flip={i % 2 === 1} />
          ))}
        </div>

        <ProjectIndex filter={filter} setFilter={setFilter} />
      </div>
    </section>
  );
}
