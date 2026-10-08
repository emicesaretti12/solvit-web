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
  MARCADORES DE POSICIÓN. Reemplazar por testimonios reales de clientes
  (con su permiso) antes de publicar. Los nombres quedan como "Nombre Apellido"
  a propósito, para que nadie los confunda con casos reales.
  Si hay foto del cliente, agregar `image`; si no, se muestra el ícono del sector.
*/
const icon = (Icon: typeof Car) => <Icon size={18} weight="light" />;

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "Las consultas de WhatsApp llegan calificadas y asignadas. Los asesores ya no pierden tiempo filtrando.",
    name: "Nombre Apellido",
    role: "Cargo · Concesionaria",
    avatar: icon(Car),
  },
  {
    text: "La telemetría de las canillas nos muestra cada litro servido. Se acabaron las mermas sin registrar.",
    name: "Nombre Apellido",
    role: "Cargo · Gastronomía",
    avatar: icon(ForkKnife),
  },
  {
    text: "Los sensores avisan antes de que la línea se detenga. Pasamos de reparar a prevenir.",
    name: "Nombre Apellido",
    role: "Cargo · Industria",
    avatar: icon(Factory),
  },
  {
    text: "Cada despacho queda registrado con su lectura RFID. Encontrar un pedido ya no lleva una mañana.",
    name: "Nombre Apellido",
    role: "Cargo · Logística",
    avatar: icon(Truck),
  },
  {
    text: "El agente separa inversores de curiosos. Los ejecutivos solo hablan con quien puede comprar.",
    name: "Nombre Apellido",
    role: "Cargo · Desarrollo inmobiliario",
    avatar: icon(Buildings),
  },
  {
    text: "Las campañas y el CRM hablan el mismo idioma. Sabemos qué anuncio trae cada venta.",
    name: "Nombre Apellido",
    role: "Cargo · Comercio",
    avatar: icon(Storefront),
  },
  {
    text: "Reemplazamos cinco planillas por una plataforma con permisos para cada área.",
    name: "Nombre Apellido",
    role: "Cargo · Servicios",
    avatar: icon(Briefcase),
  },
  {
    text: "El agente responde de noche y los fines de semana. A la mañana encontramos los leads ordenados.",
    name: "Nombre Apellido",
    role: "Cargo · Concesionaria",
    avatar: icon(ChatCircleDots),
  },
  {
    text: "El control de acceso registra cada ingreso en la misma base que usamos para todo lo demás.",
    name: "Nombre Apellido",
    role: "Cargo · Industria",
    avatar: icon(Fingerprint),
  },
];
