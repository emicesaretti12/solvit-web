import { AppIcon, BRAND_FULL, Logo, Wordmark } from "./logo";

const COLUMNS = [
  {
    title: "Servicios",
    links: [
      { href: "#servicios", label: "Desarrollo web" },
      { href: "#servicios", label: "Software a medida" },
      { href: "#servicios", label: "Agentes de IA" },
      { href: "#servicios", label: "Hardware e IoT" },
      { href: "#servicios", label: "Marketing digital" },
    ],
  },
  {
    title: "SEN",
    links: [
      { href: "#como-funciona", label: "Cómo funciona" },
      { href: "#proyectos", label: "Proyectos" },
      { href: "#nosotros", label: "Nosotros" },
      { href: "#contacto", label: "Contacto" },
    ],
  },
];

// Pilares del brand board, junto al ícono de la app
const PILLARS = ["Software", "Hardware", "IA", "Marketing", "Crecimiento"];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-950">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 pb-10 pt-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-6 md:pt-24">
        <div>
          <Logo withTagline />
          <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-ink-muted">
            Desarrollo web, software a medida, agentes de IA, hardware e IoT y marketing digital: un mismo
            equipo de ingeniería para que tu negocio venda más.
          </p>
          {/* Lockup del brand board: el ícono y los pilares, separados por una línea */}
          <div className="mt-9 flex items-center gap-5">
            <AppIcon className="w-16" />
            <span aria-hidden="true" className="h-[4.5rem] w-px bg-blue-500/60" />
            <ul aria-label="Lo que hace SEN" className="label-caps space-y-1 !text-[10px] !leading-[1.5] !text-ink">
              {PILLARS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-medium text-ink">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="inline-block py-0.5 transition-colors duration-150 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Wordmark de cierre, como en el brand board (blanco apagado con el corte de la N en azul),
          con volumen: capas en profundidad que al llegar al final se paran desde el piso
          (scenes.css). Sin scroll ligado queda apenas inclinado, mostrando el espesor */}
      <div aria-hidden="true" className="wm3d-stage pointer-events-none select-none overflow-hidden px-4 pt-10 md:px-6">
        <div className="wm3d mx-auto w-full max-w-[1200px]">
          {[7, 6, 5, 4, 3, 2, 1].map((k) => (
            <span key={k} className="wm3d-layer" style={{ transform: `translateZ(${-k * 6}px)` }}>
              <Wordmark className="block h-auto w-full" accentClassName="fill-current" />
            </span>
          ))}
          <span className="wm3d-layer wm3d-front">
            <Wordmark className="block h-auto w-full" accentClassName="opacity-50" />
          </span>
        </div>
      </div>

      <div className="relative border-t border-line bg-navy-950">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-xs text-ink-faint sm:flex-row sm:justify-between md:px-6">
          <p>© 2026 {BRAND_FULL}.</p>
          <a href="#hero" className="self-start transition-colors duration-150 hover:text-ink">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
