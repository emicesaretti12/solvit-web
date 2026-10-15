/*
  Tipos y pose de reposo del isotipo, sin dependencias de three.js: así el escenario puede
  importarlos sin arrastrar three al bundle inicial (la escena se carga aparte, en el cliente).
  También va acá el encuadre (cuánto mide la S en pantalla), que usa el escenario para ubicarla.
*/
export type IsoPose = {
  /** 0 = S armada, 1 = cintas separadas (más de 1: se dispersan, en la zambullida) */
  spread: number;
  /** Cómo se separan: 0 en diagonal (las etapas de la venta), 1 en capas que conservan la
   *  silueta de la S (vista explotada de celulares) */
  layers: number;
  /** Giro extra en Y (radianes), por ejemplo según el scroll */
  turn: number;
  /** Inclinación extra en X (radianes) */
  tilt: number;
  /** Posición horizontal en fracción de media pantalla (-1 izquierda, 1 derecha) */
  x: number;
  /** Posición vertical en fracción de media pantalla (-1 abajo, 1 arriba) */
  y: number;
  /** Profundidad en fracción de la distancia de la cámara (positivo = hacia la cámara) */
  z: number;
  scale: number;
  /** Cinta destacada: 0 arriba, 1 pliegue, 2 abajo; -1 ninguna */
  focus: number;
};

export const restPose = (): IsoPose => ({
  spread: 0,
  layers: 0,
  turn: 0,
  tilt: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  focus: -1,
});

/** Arrastre del isotipo (px y px/s); `taps` cuenta los toques cortos (la S responde con un pulso) */
export type DragState = { active: boolean; dx: number; dy: number; vx: number; vy: number; taps: number };

// Encuadre: la S mide 3,2 unidades de alto; la cámara se aleja hasta que entra con margen
export const FOV = 28;
const FIT_MARGIN = 1.35;
const S_HEIGHT = 3.2;
const S_WIDTH = 2.1;

/** Distancia de cámara que encaja la S según el aspecto (ancho / alto) del canvas */
export function fitDistance(aspect: number) {
  const vfov = (FOV * Math.PI) / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const h = S_HEIGHT * FIT_MARGIN;
  const w = S_WIDTH * FIT_MARGIN * 1.25;
  return Math.max(h / 2 / Math.tan(vfov / 2), w / 2 / Math.tan(hfov / 2));
}

/** Alto en px de la S (escala 1, armada) para una pantalla de w × h px */
export function isotypeHeightPx(w: number, h: number) {
  const halfH = fitDistance(w / Math.max(1, h)) * Math.tan((FOV * Math.PI) / 360);
  return (S_HEIGHT / (2 * halfH)) * h;
}

/** Para pedir un cuadro cuando el loop está en modo "demand" (reduced motion) */
export const stageSignal = { invalidate: () => {} };
