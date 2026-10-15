/*
  Los cinco trabajos de SEN, en el orden en que se presentan: desarrollo web, software a medida,
  agentes de IA, proyectos híbridos (software con hardware) y marketing (contenido, redes y
  pauta). Cada uno tiene su objeto 3D en CSS (services-3d.tsx), sus entregables y los proyectos
  reales donde lo hicimos (slugs de content/projects); los textos solo describen lo que el
  equipo hace.
*/
export type ServiceKey = "web" | "software" | "ia" | "hardware" | "marketing";

export type Service = {
  key: ServiceKey;
  title: string;
  /** Promesa corta, en una línea */
  lead: string;
  text: string;
  deliverables: string[];
  /** Proyectos entregados donde se ve este trabajo (slugs de content/projects) */
  work: string[];
};

export const SERVICES: Service[] = [
  {
    key: "web",
    title: "Desarrollo web",
    lead: "Webs que se convierten en consultas.",
    text: "Sitios, tiendas y landings rápidos en el celular, con SEO y medición desde el primer día.",
    deliverables: ["Sitios institucionales", "Tiendas y catálogos", "Landings para campañas", "SEO local"],
    work: ["baterias-cordoba", "adami-industrial", "rental-cordoba"],
  },
  {
    key: "software",
    title: "Software a medida",
    lead: "Sistemas hechos a la forma de tu equipo.",
    text: "CRM, reservas, inventario y paneles de gestión con usuarios por rol, pensados para cómo trabajás.",
    deliverables: ["CRM", "Reservas", "Inventario", "Paneles por rol"],
    work: ["motobox-cordoba", "non-sistemas-reservas"],
  },
  {
    key: "ia",
    title: "Agentes de IA",
    lead: "Atención al instante, a cualquier hora.",
    text: "Responden por WhatsApp, Instagram y tu web, resuelven dudas y le pasan a tu equipo a quien quiere comprar.",
    deliverables: ["WhatsApp", "Instagram", "Chat web", "Calificación de consultas"],
    work: [],
  },
  {
    key: "hardware",
    title: "Proyectos híbridos",
    lead: "Software y hardware, conectados.",
    text: "Cuando la solución también es física: placas ESP32, sensores y pantallas que hablan con tu sistema y te muestran todo en tiempo real.",
    deliverables: ["ESP32 y sensores", "Pantallas", "Telemetría", "Control a distancia"],
    work: ["cerveceria-automatica"],
  },
  {
    key: "marketing",
    title: "Marketing y contenido",
    lead: "Contenido, redes y pauta que traen clientes.",
    text: "Creamos el contenido, manejamos tus redes y pautamos en Meta y Google, conectado a tu CRM para saber qué campaña trae cada venta.",
    deliverables: ["Creación de contenido", "Community management", "Pauta en Meta y Google", "Atribución de ventas"],
    work: [],
  },
];
