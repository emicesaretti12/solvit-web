import { Logo, Wordmark } from "./logo";

const COLUMNS = [
  {
    title: "Servicios",
    links: [
      { href: "#servicios", label: "Software a medida" },
      { href: "#servicios", label: "Inteligencia artificial" },
      { href: "#servicios", label: "Hardware e IoT" },
      { href: "#servicios", label: "Marketing de performance" },
    ],
  },
  {
    title: "SEN",
    links: [
      { href: "#flujo", label: "Flujo de valor" },
      { href: "#plataforma", label: "Plataforma" },
      { href: "#sectores", label: "Sectores" },
      { href: "#nosotros", label: "Nosotros" },
      { href: "#contacto", label: "Contacto" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-950">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 pb-10 pt-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-6 md:pt-24">
        <div>
          <Logo withTagline />
          <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-ink-muted">
            Firma de tecnología integral y consultoría estratégica. Software, inteligencia
            artificial, hardware y marketing sobre una misma infraestructura técnica.
          </p>
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

      {/* Wordmark de cierre, como en el brand board: blanco apagado con el corte de la N en azul */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden px-4 pt-6 md:px-6">
        <Wordmark
          className="mx-auto block h-auto w-full max-w-[1200px] translate-y-[18%] text-white/[0.05]"
          accentClassName="opacity-30"
        />
      </div>

      <div className="relative border-t border-line bg-navy-950">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-6 text-xs text-ink-faint sm:flex-row sm:justify-between md:px-6">
          <p>© 2026 SEN Software · Ing. &amp; Soluciones.</p>
          <a href="#hero" className="self-start transition-colors duration-150 hover:text-ink">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
