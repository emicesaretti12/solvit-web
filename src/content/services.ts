/*
  Los cinco servicios de SEN, en el orden en que se presentan: desarrollo web, software a medida,
  agentes de IA, hardware e IoT y marketing digital. Cada uno tiene su objeto 3D en CSS
  (services-3d.tsx) y sus entregables; los textos solo describen lo que el equipo hace.
*/
export type ServiceKey = "web" | "software" | "ia" | "hardware" | "marketing";

export type Service = {
  key: ServiceKey;
  title: string;
  /** Promesa corta, en una línea */
  lead: string;
  text: string;
  deliverables: string[];
};

export const SERVICES: Service[] = [
  {
    key: "web",
    title: "Desarrollo web",
    lead: "Webs que se convierten en consultas.",
    text: "Sitios, tiendas y landings rápidos en el celular, con SEO y medición desde el primer día.",
    deliverables: ["Sitios institucionales", "Tiendas y catálogos", "Landings", "SEO"],
  },
  {
    key: "software",
    title: "Software a medida",
    lead: "Sistemas hechos a la forma de tu equipo.",
    text: "CRM, reservas, inventario y paneles de gestión con usuarios por rol, pensados para cómo trabajás.",
    deliverables: ["CRM", "Reservas", "Inventario", "Paneles por rol"],
  },
  {
    key: "ia",
    title: "Agentes de IA",
    lead: "Atención al instante, a cualquier hora.",
    text: "Responden por WhatsApp, Instagram y tu web, resuelven dudas y le pasan a tu equipo a quien quiere comprar.",
    deliverables: ["WhatsApp", "Instagram", "Chat web", "Calificación de consultas"],
  },
  {
    key: "hardware",
    title: "Hardware e IoT",
    lead: "Placas y sensores conectados a tu software.",
    text: "Diseñamos y programamos equipos con ESP32: control de acceso, sensores y telemetría que llega a tu panel.",
    deliverables: ["ESP32", "Sensores", "Control de acceso", "Telemetría"],
  },
  {
    key: "marketing",
    title: "Marketing digital",
    lead: "Campañas medidas por ventas, no por clics.",
    text: "Anuncios en Meta y Google conectados a tu web y a tu CRM, para saber qué campaña trae cada venta.",
    deliverables: ["Meta Ads", "Google Ads", "Contenido", "Atribución de ventas"],
  },
];
