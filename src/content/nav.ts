/* Secciones de la página, en orden: las usan el menú, los puntos del costado y el pie */
export const NAV = [
  { id: "inicio", label: "Inicio" },
  { id: "trabajos", label: "Trabajos" },
  { id: "servicios", label: "Servicios" },
  { id: "sistema", label: "Sistema" },
  { id: "hechos", label: "Hechos" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof NAV)[number]["id"];
