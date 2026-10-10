/*
  Datos del recorrido de una consulta (pauta, web y canales → agente de IA → CRM por área →
  venta → crecimiento): etapas, nodos, tramos y las dos composiciones del circuito. Los usan el
  diagrama de escritorio (sales-flow) y el de celulares (sales-flow-mobile).
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

// Bajo y ancho para que el diagrama crezca lo más posible: así los nombres se leen (≈ 10-13 px) aun en
// celulares bajos, donde el panel deja poco alto para el diagrama
export const MOBILE: Layout = {
  viewBox: "0 0 360 500",
  r: 19,
  iconSize: 17,
  labelSize: 13,
  labelGap: 35,
  nodes: {
    meta: { x: 36, y: 30 },
    google: { x: 108, y: 30 },
    web: { x: 180, y: 30 },
    whatsapp: { x: 252, y: 30 },
    instagram: { x: 324, y: 30 },
    ai: { x: 180, y: 145 },
    discard: { x: 306, y: 205 },
    crm: { x: 180, y: 250 },
    ventas: { x: 60, y: 350 },
    postventa: { x: 180, y: 350 },
    service: { x: 300, y: 350 },
    venta: { x: 60, y: 440 },
  },
  edges: {
    "meta-ai": "M36 71 C 36 106, 180 96, 180 126",
    "google-ai": "M108 71 C 108 106, 180 98, 180 126",
    "web-ai": "M180 71 L 180 126",
    "whatsapp-ai": "M252 71 C 252 106, 180 98, 180 126",
    "instagram-ai": "M324 71 C 324 106, 180 96, 180 126",
    "ai-crm": "M180 187 L 180 231",
    "ai-discard": "M199 147 C 246 154, 292 164, 304 186",
    "crm-ventas": "M180 292 C 180 318, 60 310, 60 331",
    "crm-postventa": "M180 292 L 180 331",
    "crm-service": "M180 292 C 180 318, 300 310, 300 331",
    "ventas-venta": "M60 391 L 60 421",
    "venta-chart": "M79 440 L 122 440",
  },
  chart: {
    line: "M128 484 C 170 480, 190 458, 228 454 S 290 426, 334 408",
    area: "M128 484 C 170 480, 190 458, 228 454 S 290 426, 334 408 L 334 494 L 128 494 Z",
  },
};
