import { Logo } from "./logo";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#sectores", label: "Sectores" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-navy-950">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <Logo withTagline />
          <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
            Software, inteligencia artificial, hardware y marketing para
            empresas que quieren crecer con tecnología propia.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-muted">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors duration-150 hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-[1200px] border-t border-line px-4 py-6 text-xs text-ink-faint md:px-6">
        © 2026 Solvit. Ingeniería y Desarrollo de Software.
      </div>
    </footer>
  );
}
