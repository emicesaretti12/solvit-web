/*
  Proyectos realizados por SEN. Las descripciones salen de lo que muestra cada sitio publicado
  (y de lo que contó el cliente, en la cervecería automática). Las portadas muestran cada sitio
  en una laptop y un celular, armadas con capturas reales (public/projects/*.webp); la
  cervecería usa una ilustración.
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
  /** La portada es una captura real del sitio (.webp); si no, una ilustración (.svg) */
  shot?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "motobox-cordoba",
    client: "Motobox Córdoba",
    name: "Motobox Córdoba",
    sector: "Concesionaria de motos",
    kind: "Sitio web + CRM",
    specialties: ["Desarrollo web", "Software a medida"],
    summary:
      "Sitio de una concesionaria de motos 0km con catálogo y usados, conectado a un CRM propio con usuarios por rol desde donde se administran las fotos.",
    highlights: [
      "Sitio público conectado a su base de datos",
      "CRM propio con alta de usuarios por rol",
      "Fotos del sitio administradas desde el CRM",
    ],
    url: "https://www.motoboxcordoba.com",
    featured: true,
    shot: true,
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
    shot: true,
  },
  {
    slug: "adami-industrial",
    client: "ADAMI Industrial",
    name: "ADAMI Industrial",
    sector: "Industria",
    kind: "Sitio institucional",
    specialties: ["Desarrollo web"],
    summary:
      "Sitio institucional de una empresa de soluciones industriales, con una sección de industrias ilustrada con pictogramas técnicos animados.",
    url: "https://www.adami.com.ar",
    shot: true,
  },
  {
    slug: "rental-cordoba",
    client: "Rental Córdoba",
    name: "Rental Córdoba",
    sector: "Stands y eventos",
    kind: "Sitio web",
    specialties: ["Desarrollo web", "SEO"],
    summary: "Sitio de una empresa de diseño y armado de stands para ferias y eventos: liviano y con SEO trabajado en cada página.",
    url: "https://www.rentalcordoba.com.ar",
    shot: true,
  },
  {
    slug: "non-sistemas-reservas",
    client: "NON Sistemas",
    name: "Noni · Reservas",
    sector: "Software",
    kind: "Sistema de reservas",
    specialties: ["Software a medida"],
    summary: "Sistema de reservas online y gestión de agenda para negocios con turnos, con catálogo público editable e inventario.",
    url: "https://non-sistemas-reservas.vercel.app",
    shot: true,
  },
  {
    slug: "renacer-hormonal",
    client: "Renacer Hormonal",
    name: "Renacer Hormonal",
    sector: "Salud",
    kind: "Sitio web",
    specialties: ["Desarrollo web"],
    summary: "Sitio de una clínica de salud hormonal femenina, con sus programas, su equipo y la agenda de consultas.",
    url: "https://renacerhormonal.com.ar",
    shot: true,
  },
  {
    slug: "plenomax",
    client: "Pleno Max",
    name: "Pleno Max",
    sector: "Pinturas",
    kind: "Sitio + catálogo",
    specialties: ["Desarrollo web"],
    summary: "Sitio y catálogo de una fábrica de pinturas, látex y revestimientos, con pedido de cotización.",
    url: "https://plenomax.com.ar",
    shot: true,
  },
  {
    slug: "eli-ceramica",
    client: "Eli Cerámica",
    name: "Eli Cerámica",
    sector: "Cerámica",
    kind: "Tienda y catálogo",
    specialties: ["Desarrollo web"],
    summary: "Tienda online y catálogo mayorista de cerámica artesanal hecha en las Sierras Chicas.",
    url: "https://eliceramica-catalogo.vercel.app",
    shot: true,
  },
  {
    slug: "club-de-previas",
    client: "Club de Previas",
    name: "Club de Previas",
    sector: "Bar",
    kind: "Página de enlaces",
    specialties: ["Desarrollo web"],
    summary: "Página de un bar de tragos con reservas, carta y ubicación, y contacto directo por WhatsApp.",
    url: "https://www.clubdeprevias.com.ar",
    shot: true,
  },
  {
    slug: "prode-mundial",
    name: "Prode Mundial 2026",
    sector: "Bar",
    kind: "Aplicación web",
    specialties: ["Software a medida"],
    summary: "Prode del Mundial 2026 para los clientes de Club de Previas: cada uno carga sus pronósticos y suma puntos.",
    url: "https://fixture-wheat.vercel.app",
    shot: true,
  },
  {
    slug: "boxpoint",
    client: "BoxPoint",
    name: "BoxPoint",
    sector: "Sorteos",
    kind: "Ruleta de sorteos",
    specialties: ["Software a medida"],
    summary: "Ruleta digital de sorteos, pensada para usar en pantalla completa en el local.",
    url: "https://www.boxpoint.com.ar",
    shot: true,
  },
  {
    slug: "grifos",
    client: "Grifo's",
    name: "Grifo's",
    sector: "Gastronomía",
    kind: "Carta digital",
    specialties: ["Desarrollo web"],
    summary: "Carta digital de una pizzería y bar, por categorías y con precios, para ver desde el celular.",
    url: "https://grifos-app.vercel.app",
    shot: true,
  },
  {
    slug: "crazy-monkey",
    client: "Crazy Monkey",
    name: "Crazy Monkey",
    sector: "Gastronomía",
    kind: "Carta de delivery",
    specialties: ["Desarrollo web"],
    summary: "Carta de delivery con promos y categorías para armar el pedido desde el celular.",
    url: "https://crazy-monkey-wine.vercel.app",
    shot: true,
  },
  {
    slug: "edunova",
    client: "EDUNOVA",
    name: "EDUNOVA",
    sector: "Educación",
    kind: "Sitio web",
    specialties: ["Desarrollo web"],
    summary: "Sitio de una consultora pedagógica, con sus servicios, su formación docente y el pedido de diagnóstico.",
    url: "https://consultora-pedagogica.vercel.app",
    shot: true,
  },
  {
    slug: "polar",
    client: "Polar",
    name: "Polar",
    sector: "Software",
    kind: "Landing",
    specialties: ["Desarrollo web"],
    summary: "Landing de un sistema de ventas con inteligencia artificial para WhatsApp.",
    url: "https://polar-nu-eight.vercel.app",
    shot: true,
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

// Proyectos entregados: la página dice "+15" (acá hay 16 publicados)
export const DELIVERED = 15;

/** Rubros distintos entre los proyectos publicados */
export const SECTORS = new Set(PROJECTS.map((p) => p.sector)).size;

export const coverOf = (p: Project) => `/projects/${p.slug}.${p.shot ? "webp" : "svg"}`;
