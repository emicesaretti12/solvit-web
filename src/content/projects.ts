/*
  Proyectos realizados por SEN.
  Datos tomados de los proyectos publicados en la cuenta de Vercel de SEN (dominios, tipo de
  proyecto y lo que dicen sus commits) y de lo que contó el cliente (la cervecería automática).
  CONFIRMAR los textos con cada cliente y reemplazar las portadas (public/projects/*.svg, armadas
  como ilustraciones) por capturas reales cuando estén.
*/

export type Specialty = "Desarrollo web" | "Software a medida" | "Hardware e IoT" | "SEO";

export type Project = {
  slug: string;
  name: string;
  /** Nombre del cliente tal como se muestra en "Clientes satisfechos" (si es público) */
  client?: string;
  /** Rubro del cliente */
  sector: string;
  /** Qué es, en pocas palabras (para la portada y la tarjeta) */
  kind: string;
  specialties: Specialty[];
  summary: string;
  /** Lo que se hizo, solo con hechos confirmados */
  highlights?: string[];
  url?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "motobox-cordoba",
    client: "Motobox Córdoba",
    name: "Motobox Córdoba",
    sector: "Motos",
    kind: "Sitio web + CRM",
    specialties: ["Desarrollo web", "Software a medida"],
    summary:
      "Sitio web con base de datos y un CRM propio con usuarios por rol, desde donde un administrador gestiona las fotos del sitio.",
    highlights: [
      "Sitio público conectado a su base de datos",
      "CRM propio con alta de usuarios por rol",
      "Fotos del sitio administradas desde el CRM",
    ],
    url: "https://motoboxcordoba.com",
    featured: true,
  },
  {
    slug: "baterias-cordoba",
    client: "Baterías Córdoba",
    name: "Baterías Córdoba",
    sector: "Baterías",
    kind: "Sitio + catálogo",
    specialties: ["Desarrollo web", "SEO"],
    summary:
      "Sitio prerenderizado con catálogo por marcas, vehículos y servicios, y 52 páginas de aterrizaje para búsquedas locales.",
    highlights: [
      "Catálogo por marcas, vehículos y servicios",
      "52 páginas de aterrizaje para búsquedas locales",
      "Sitio prerenderizado: carga rápida en el celular",
    ],
    url: "https://www.bateriascordoba.com.ar",
    featured: true,
  },
  {
    slug: "adami-industrial",
    client: "ADAMI Industrial",
    name: "ADAMI Industrial",
    sector: "Industria",
    kind: "Sitio institucional",
    specialties: ["Desarrollo web"],
    summary: "Sitio institucional con una sección de industrias: ocho sectores ilustrados con pictogramas técnicos animados.",
    url: "https://www.adami.com.ar",
  },
  {
    slug: "non-sistemas-reservas",
    client: "NON Sistemas",
    name: "NON Sistemas · Reservas",
    sector: "Servicios",
    kind: "Sistema de reservas",
    specialties: ["Software a medida"],
    summary: "Sistema de reservas con catálogo público editable e inventario.",
  },
  {
    slug: "renacer-hormonal",
    client: "Renacer Hormonal",
    name: "Renacer Hormonal",
    sector: "Salud",
    kind: "Sitio web",
    specialties: ["Desarrollo web"],
    summary: "Sitio web de una clínica.",
    url: "https://renacerhormonal.com.ar",
  },
  {
    slug: "club-de-previas",
    client: "Club de Previas",
    name: "Club de Previas",
    sector: "Gastronomía",
    kind: "Sitio web",
    specialties: ["Desarrollo web"],
    summary: "Sitio con contacto directo por WhatsApp.",
    url: "https://www.clubdeprevias.com.ar",
  },
  {
    slug: "rental-cordoba",
    client: "Rental Córdoba",
    name: "Rental Córdoba",
    sector: "Alquileres",
    kind: "Sitio web",
    specialties: ["Desarrollo web", "SEO"],
    summary: "Sitio estático liviano, con SEO trabajado en cada página.",
    url: "https://www.rentalcordoba.com.ar",
  },
  {
    slug: "plenomax",
    client: "Plenomax",
    name: "Plenomax",
    sector: "Empresa",
    kind: "Sitio web",
    specialties: ["Desarrollo web"],
    summary: "Sitio web institucional.",
    url: "https://plenomax.com.ar",
  },
  {
    slug: "eli-ceramica",
    client: "Eli Cerámica",
    name: "Eli Cerámica",
    sector: "Cerámica",
    kind: "Catálogo online",
    specialties: ["Desarrollo web"],
    summary: "Catálogo digital de piezas de cerámica.",
  },
  {
    slug: "cerveceria-automatica",
    name: "Cervecería automática",
    sector: "Gastronomía",
    kind: "Canilla automática",
    specialties: ["Hardware e IoT", "Software a medida"],
    summary:
      "Canilla de cerveza controlada por un ESP32, con una pantalla animada para el cliente y telemetría del barril.",
    highlights: [
      "Placa ESP32 que controla el servido desde la canilla",
      "Pantalla de canilla animada para quien se sirve",
      "Telemetría del barril: flujo, válvula y stock",
    ],
  },
];

// El cliente indicó que son "muchos más de 10" proyectos entregados: la página dice "Más de 10".
// CONFIRMAR el número real para mostrarlo.
export const DELIVERED = 10;

/** Rubros distintos entre los proyectos publicados */
export const SECTORS = new Set(PROJECTS.map((p) => p.sector)).size;

export const coverOf = (p: Project) => `/projects/${p.slug}.svg`;
