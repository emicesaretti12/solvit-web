"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChartLineUp, Code, Cpu, Sparkle, type Icon } from "@phosphor-icons/react";
import { useId, useRef, useState } from "react";
import { DominoGallery, type DominoItem } from "@/components/ui/domino-gallery";
import { Photo } from "./photo";
import { img } from "@/lib/images";

type Discipline = "Software" | "IA" | "Hardware" | "Marketing";

const DISCIPLINES: { key: Discipline; icon: Icon }[] = [
  { key: "Software", icon: Code },
  { key: "IA", icon: Sparkle },
  { key: "Hardware", icon: Cpu },
  { key: "Marketing", icon: ChartLineUp },
];

const sectors: {
  key: string;
  name: string;
  title: string;
  text: string;
  steps: string[];
  uses: Discipline[];
  photo: string;
  alt: string;
}[] = [
  {
    key: "autos",
    name: "Concesionarias",
    title: "Del anuncio del rodado al seguimiento por asesor.",
    text: "Automatización integral: la IA filtra al instante el modelo buscado y el interés crediticio, y cada asesor sigue sus oportunidades en el CRM.",
    steps: [
      "Pauta del rodado en Meta y Google",
      "Agente que filtra modelo y financiación",
      "Seguimiento comercial por asesor en el CRM",
    ],
    uses: ["Marketing", "IA", "Software"],
    photo: "photo-1503376780353-7e6692767b70",
    alt: "Auto deportivo en exhibición",
  },
  {
    key: "gastronomia",
    name: "Gastronomía",
    title: "Pedidos, reservas y barriles bajo control.",
    text: "Plataformas de pedidos y reservas combinadas con telemetría de barriles y dispensadores automáticos, para eliminar las mermas no registradas.",
    steps: [
      "Pedidos y reservas en una plataforma propia",
      "Telemetría de barriles y dispensadores",
      "Cada litro servido, registrado",
    ],
    uses: ["Software", "Hardware"],
    photo: "photo-1517248135467-4c7edcad34c4",
    alt: "Salón de restaurante con mesas preparadas",
  },
  {
    key: "industria",
    name: "Industria",
    title: "Una planta que se audita sola.",
    text: "Paneles de control para auditoría de planta, interfaces de control de insumos y mantenimiento predictivo en líneas productivas con sensores dedicados.",
    steps: [
      "Panel de auditoría de planta",
      "Control de insumos por línea",
      "Mantenimiento predictivo con sensores",
    ],
    uses: ["Software", "Hardware", "IA"],
    photo: "photo-1581091226825-a6a2a5aee158",
    alt: "Ingeniera trabajando junto a un brazo robótico industrial",
  },
  {
    key: "logistica",
    name: "Logística",
    title: "Trazabilidad de cada despacho.",
    text: "Lectores de inventario físico integrados, trazabilidad de despachos en bases de datos en la nube y monitoreo por visión artificial.",
    steps: [
      "Lectores de inventario físico",
      "Despachos trazados en la nube",
      "Monitoreo por visión artificial",
    ],
    uses: ["Hardware", "Software", "IA"],
    photo: "photo-1586528116311-ad8dd3c8310d",
    alt: "Centro de almacenamiento con estanterías y mercadería",
  },
  {
    key: "inmobiliario",
    name: "Inmobiliario",
    title: "Tus ejecutivos, solo con prospectos calificados.",
    text: "Filtrado algorítmico de perfiles inversores frente a compradores generales, para que los ejecutivos no pierdan horas con prospectos sin calificación financiera.",
    steps: [
      "Captación por desarrollo urbanístico",
      "Agente que separa inversores de compradores",
      "Agenda de ejecutivos solo con calificados",
    ],
    uses: ["Marketing", "IA", "Software"],
    photo: "photo-1486406146926-c627a92ad1ab",
    alt: "Edificios corporativos vistos desde abajo",
  },
];

// Cartas verticales para la galería dominó (solo escritorio)
const dominoItems: DominoItem[] = sectors.map((sec) => ({
  src: `${img(sec.photo, 440)}&h=1180`,
  alt: sec.alt,
  title: sec.name,
}));

export function Sectors() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const s = sectors[active];

  const selectFromCard = (index: number) => {
    setActive(index);
    panelRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + sectors.length) % sectors.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section id="sectores" className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 pt-24 md:px-6 md:pt-32">
        <h2 className="font-display max-w-[20ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.4rem]">
          Ingeniería aplicada a tu industria.
        </h2>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-muted">
          Cinco industrias donde conectamos software, IA, hardware y marketing. Elegí una para ver qué
          resolvemos y con qué disciplinas.
        </p>
      </div>

      <DominoGallery
        items={dominoItems}
        selectedIndex={active}
        onSelect={selectFromCard}
        scrollLength={1100}
        className="hidden md:block"
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-24 md:px-6 md:pb-32">
        <div
          role="tablist"
          aria-label="Sectores"
          onKeyDown={onKeyDown}
          className="-mx-4 mt-10 flex snap-x gap-2 md:mt-0 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
        >
          {sectors.map((sec, i) => (
            <button
              key={sec.key}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className="relative shrink-0 snap-start rounded-full px-5 py-2.5 text-sm transition-colors duration-200 active:scale-[0.97]"
            >
              {i === active && (
                <motion.span
                  layoutId={reduce ? undefined : "sector-pill"}
                  className="absolute inset-0 rounded-full bg-blue-500"
                  transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                />
              )}
              <span className={`relative ${i === active ? "text-white" : "text-ink-muted hover:text-ink"}`}>
                {sec.name}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={panelRef}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${active}`}
          className="mt-8 rounded-[2rem] border border-line bg-white/[0.025] p-1.5"
        >
          <div className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={s.key}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="grid w-full bg-navy-850"
              >
                <Photo
                  src={img(s.photo, 1200)}
                  alt={s.alt}
                  sizes="(min-width: 768px) 620px, 100vw"
                  className="aspect-[16/10] md:hidden"
                />
                <div className="grid gap-8 p-7 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-12">
                  <div className="flex flex-col">
                    <h3 className="font-display max-w-[24ch] text-2xl font-semibold leading-[1.1] tracking-[-0.025em] text-ink text-balance md:text-[2.1rem]">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-muted md:text-lg">{s.text}</p>
                    <ul
                      className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-8"
                      aria-label="Disciplinas que intervienen"
                    >
                      {DISCIPLINES.map((d) => {
                        const on = s.uses.includes(d.key);
                        return (
                          <li
                            key={d.key}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] ${
                              on ? "border-blue-400/40 bg-blue-500/10 text-ink" : "border-line text-ink-faint"
                            }`}
                          >
                            <d.icon
                              size={14}
                              weight="light"
                              aria-hidden="true"
                              className={on ? "text-blue-400" : ""}
                            />
                            {d.key}
                            {!on && <span className="sr-only">(no interviene)</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="rounded-[1.25rem] border border-line bg-navy-950/60 p-5 md:p-6">
                    <h4 className="text-sm font-medium text-ink-muted">Cómo lo resolvemos</h4>
                    <div className="relative mt-5">
                      <span
                        aria-hidden="true"
                        className="absolute bottom-3 left-[13px] top-3 w-px bg-line-strong"
                      />
                      <ol className="relative space-y-5">
                        {s.steps.map((step, i) => (
                          <motion.li
                            key={step}
                            initial={reduce ? false : { opacity: 0, transform: "translateX(-8px)" }}
                            animate={{ opacity: 1, transform: "translateX(0px)" }}
                            transition={{ duration: 0.35, delay: 0.08 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                            className="relative grid grid-cols-[28px_1fr] items-center gap-3"
                          >
                            <span className="relative flex size-7 items-center justify-center rounded-full border border-line-strong bg-navy-850 font-mono text-[11px] text-blue-300">
                              {i + 1}
                            </span>
                            <span className="text-[15px] leading-snug text-ink">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
