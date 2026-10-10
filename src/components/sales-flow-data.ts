/*
  Datos del recorrido de una consulta (pauta, web y canales → agente de IA → CRM por área →
  venta → crecimiento): etapas, nodos, tramos y la composición del circuito de escritorio
  (sales-flow). Las etapas también las usa la versión de celulares (journey-mobile).
*/
import { ChatsCircle, CheckCircle, Globe, Handshake, Kanban, Sparkle, Wrench, type Icon } from "@phosphor-icons/react";
import { siGoogleads, siInstagram, siMeta, siWhatsapp } from "simple-icons";

export const STAGES = [
  {
    title: "Pauta, web y canales",
    text: "Las consultas llegan de tus anuncios, tu web, WhatsApp e Instagram.",
  },
  {
    title: "El agente de IA filtra",
    text: "Responde al instante y separa a quien quiere comprar de quien solo consulta.",
  },
  {
    title: "El CRM las ordena por área",
    text: "Cada consulta calificada llega al área que corresponde: ventas, postventa o service.",
  },
  {
    title: "Venta cerrada",
    text: "El vendedor recibe la conversación completa y cierra.",
  },
  {
    title: "Crecimiento",
    text: "Ves qué anuncio trae ventas y repetís lo que funciona.",
  },
];

export type Glyph = { icon: Icon } | { path: string };
export type NodeDef = {
  id: string;
  label: string;
  glyph: Glyph;
  /** Momento (en etapas, 0 a 5) en que se enciende */
  at: number;
  tone?: "muted";
};
export type EdgeDef = { id: string; stage: number; particles: number; tone?: "muted" };
export type Point = { x: number; y: number };
export type Layout = {
  viewBox: string;
  r: number;
  iconSize: number;
  labelSize: number;
  labelGap: number;
  nodes: Record<string, Point>;
  /** Trazos; los que salen hacia abajo arrancan debajo del nombre del nodo, no lo cruzan */
  edges: Record<string, string>;
  chart: { line: string; area: string };
};

export const SOURCES = [
  { id: "meta", label: "Meta Ads", glyph: { path: siMeta.path } },
  { id: "google", label: "Google Ads", glyph: { path: siGoogleads.path } },
  { id: "web", label: "Tu web", glyph: { icon: Globe } },
  { id: "whatsapp", label: "WhatsApp", glyph: { path: siWhatsapp.path } },
  { id: "instagram", label: "Instagram", glyph: { path: siInstagram.path } },
] as const;

export const NODES: NodeDef[] = [
  ...SOURCES.map((s) => ({ ...s, glyph: s.glyph as Glyph, at: 0.15 })),
  { id: "ai", label: "Agente de IA", glyph: { icon: Sparkle }, at: 0.9 },
  { id: "discard", label: "Solo consultaban", glyph: { icon: ChatsCircle }, at: 1.75, tone: "muted" },
  { id: "crm", label: "CRM", glyph: { icon: Kanban }, at: 1.9 },
  { id: "ventas", label: "Ventas", glyph: { icon: Handshake }, at: 2.75 },
  { id: "postventa", label: "Postventa", glyph: { icon: ChatsCircle }, at: 2.75 },
  { id: "service", label: "Service", glyph: { icon: Wrench }, at: 2.75 },
  { id: "venta", label: "Venta cerrada", glyph: { icon: CheckCircle }, at: 3.8 },
];

export const EDGES: EdgeDef[] = [
  ...SOURCES.map((s) => ({ id: `${s.id}-ai`, stage: 0, particles: 1 })),
  { id: "ai-crm", stage: 1, particles: 2 },
  { id: "ai-discard", stage: 1, particles: 1, tone: "muted" },
  { id: "crm-ventas", stage: 2, particles: 1 },
  { id: "crm-postventa", stage: 2, particles: 1 },
  { id: "crm-service", stage: 2, particles: 1 },
  { id: "ventas-venta", stage: 3, particles: 1 },
  { id: "venta-chart", stage: 4, particles: 1 },
];

export const DESKTOP: Layout = {
  viewBox: "0 0 1160 460",
  r: 26,
  iconSize: 22,
  labelSize: 13,
  labelGap: 46,
  nodes: {
    meta: { x: 80, y: 50 },
    google: { x: 80, y: 135 },
    web: { x: 80, y: 220 },
    whatsapp: { x: 80, y: 305 },
    instagram: { x: 80, y: 390 },
    ai: { x: 360, y: 220 },
    discard: { x: 360, y: 390 },
    crm: { x: 620, y: 220 },
    ventas: { x: 860, y: 100 },
    postventa: { x: 860, y: 220 },
    service: { x: 860, y: 340 },
    venta: { x: 1060, y: 100 },
  },
  edges: {
    "meta-ai": "M106 50 C 230 50, 220 220, 334 220",
    "google-ai": "M106 135 C 230 135, 220 220, 334 220",
    "web-ai": "M106 220 L 334 220",
    "whatsapp-ai": "M106 305 C 230 305, 220 220, 334 220",
    "instagram-ai": "M106 390 C 230 390, 220 220, 334 220",
    "ai-crm": "M386 220 L 594 220",
    "ai-discard": "M360 280 L 360 364",
    "crm-ventas": "M646 220 C 760 220, 750 100, 834 100",
    "crm-postventa": "M646 220 L 834 220",
    "crm-service": "M646 220 C 760 220, 750 340, 834 340",
    "ventas-venta": "M886 100 L 1034 100",
    "venta-chart": "M1060 160 L 1060 262",
  },
  chart: {
    line: "M990 372 C 1020 366, 1032 344, 1056 340 S 1096 304, 1130 276",
    area: "M990 372 C 1020 366, 1032 344, 1056 340 S 1096 304, 1130 276 L 1130 392 L 990 392 Z",
  },
};
