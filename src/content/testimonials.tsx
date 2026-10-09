import {
  Car,
  ForkKnife,
  Factory,
  Truck,
  Buildings,
  Storefront,
  Briefcase,
  ChatCircleDots,
  Fingerprint,
} from "@phosphor-icons/react/dist/ssr";
import type { Testimonial } from "@/components/ui/testimonials-columns-1";

/*
  Situaciones típicas por industria y cómo se ven resueltas (no son citas de clientes).
  Cuando haya testimonios reales, con permiso de cada cliente, reemplazar `name` por la
  persona, `role` por "Cargo · Empresa" y sumar `image` si hay foto.
*/
const icon = (Icon: typeof Car) => <Icon size={18} weight="light" />;

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "Las consultas de WhatsApp llegan calificadas y asignadas. Los asesores dejan de filtrar a mano.",
    name: "Concesionaria",
    role: "Agente de IA · CRM",
    avatar: icon(Car),
  },
  {
    text: "La telemetría de las canillas registra cada litro servido. Las mermas sin registrar desaparecen.",
    name: "Gastronomía",
    role: "Telemetría · Pedidos",
    avatar: icon(ForkKnife),
  },
  {
    text: "Los sensores avisan antes de que la línea se detenga. El mantenimiento pasa de reparar a prevenir.",
    name: "Industria",
    role: "Sensores · Tableros",
    avatar: icon(Factory),
  },
  {
    text: "Cada despacho queda registrado con su lectura RFID. Encontrar un pedido deja de llevar una mañana.",
    name: "Logística",
    role: "RFID · Nube",
    avatar: icon(Truck),
  },
  {
    text: "El agente separa inversores de curiosos. Los ejecutivos solo hablan con quien puede comprar.",
    name: "Desarrollo inmobiliario",
    role: "Agente de IA · CRM",
    avatar: icon(Buildings),
  },
  {
    text: "Campañas y CRM comparten los mismos datos. Cada venta queda atribuida al anuncio que la trajo.",
    name: "Comercio",
    role: "Performance · CRM",
    avatar: icon(Storefront),
  },
  {
    text: "Cinco planillas se reemplazan por una plataforma con permisos para cada área.",
    name: "Servicios",
    role: "Software a medida",
    avatar: icon(Briefcase),
  },
  {
    text: "El agente responde de noche y los fines de semana. A la mañana, los leads esperan ordenados por prioridad.",
    name: "Concesionaria",
    role: "Agente de IA",
    avatar: icon(ChatCircleDots),
  },
  {
    text: "Cada ingreso queda registrado en la misma base de datos que usa el resto de la empresa.",
    name: "Industria",
    role: "Control de acceso",
    avatar: icon(Fingerprint),
  },
];
