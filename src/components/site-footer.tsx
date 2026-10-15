import { FooterLockup, FooterWordmark } from "./footer-3d";
import { BRAND_FULL, Logo } from "./logo";

const COLUMNS = [
  {
    title: "Trabajos",
    links: [
      { href: "#servicio-web", label: "Desarrollo web" },
      { href: "#servicio-software", label: "Software a medida" },
      { href: "#servicio-ia", label: "Agentes de IA" },
      { href: "#servicio-hardware", label: "Proyectos híbridos" },
      { href: "#servicio-marketing", label: "Marketing y contenido" },
    ],
  },
  {
    title: "SEN",
    links: [
      { href: "#trabajos", label: "Trabajos" },
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
            Desarrollo web, software a medida, agentes de IA, proyectos de software con hardware y
            marketing con contenido, redes y pauta: un mismo equipo para que tu negocio venda más.
          </p>
          {/* Lockup del brand board: el ícono con espesor y los pilares, separados por una
              línea; entra en 3D (footer-3d.tsx) */}
          <FooterLockup pillars={PILLARS} />
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

      {/* Wordmark de cierre, como en el brand board (con el corte de la N en azul), con volumen:
          una extrusión de capas en profundidad que al llegar al final se para desde el piso
          (footer-3d.tsx y scenes.css). Sin animación queda apenas inclinado, mostrando el espesor */}
      <FooterWordmark />

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
