"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { DominoGallery, type DominoItem } from "@/components/ui/domino-gallery";
import { Photo } from "./photo";
import { img } from "@/lib/images";

const sectors = [
  {
    key: "autos",
    name: "Concesionarias",
    title: "Del anuncio del rodado al seguimiento por asesor.",
    text: "La IA filtra al instante el modelo buscado y el interés crediticio. Cada asesor sigue sus oportunidades en el CRM.",
    photo: "photo-1503376780353-7e6692767b70",
    alt: "Auto deportivo en exhibición",
  },
  {
    key: "gastronomia",
    name: "Gastronomía",
    title: "Pedidos, reservas y barriles bajo control.",
    text: "Plataformas de pedidos y reservas combinadas con telemetría de dispensadores para eliminar mermas no registradas.",
    photo: "photo-1517248135467-4c7edcad34c4",
    alt: "Salón de restaurante con mesas preparadas",
  },
  {
    key: "industria",
    name: "Industria",
    title: "Una planta que se audita sola.",
    text: "Paneles de control de insumos y mantenimiento predictivo en líneas productivas mediante sensores dedicados.",
    photo: "photo-1581091226825-a6a2a5aee158",
    alt: "Ingeniera trabajando junto a un brazo robótico industrial",
  },
  {
    key: "logistica",
    name: "Logística",
    title: "Trazabilidad de cada despacho.",
    text: "Lectores de inventario físico, registro de despachos en la nube y monitoreo por visión artificial.",
    photo: "photo-1586528116311-ad8dd3c8310d",
    alt: "Centro de almacenamiento con estanterías y mercadería",
  },
  {
    key: "inmobiliario",
    name: "Inmobiliario",
    title: "Tus ejecutivos, solo con prospectos calificados.",
    text: "Filtrado algorítmico de perfiles inversores frente a compradores generales en desarrollos urbanísticos.",
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
    const next =
      (active + (e.key === "ArrowRight" ? 1 : -1) + sectors.length) %
      sectors.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section id="sectores" className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 pt-24 md:px-6 md:pt-32">
        <h2 className="max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
          Ingeniería aplicada a tu industria.
        </h2>
        <p className="mt-5 hidden max-w-[56ch] text-lg leading-relaxed text-ink-muted md:block">
          Cinco industrias donde conectamos software, IA y hardware. Elegí una
          para ver qué resolvemos.
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
              <span
                className={`relative ${i === active ? "text-white" : "text-ink-muted hover:text-ink"}`}
              >
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
                initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="grid w-full bg-navy-850"
              >
                <Photo
                  src={img(s.photo, 1200)}
                  alt={s.alt}
                  sizes="(min-width: 768px) 620px, 100vw"
                  className="aspect-[16/10] md:hidden"
                />
                <div className="flex flex-col justify-end p-7 md:min-h-[220px] md:p-12">
                  <h3 className="max-w-[26ch] text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[56ch] leading-relaxed text-ink-muted md:text-lg">
                    {s.text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
