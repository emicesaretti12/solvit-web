/*
  Coreografía del isotipo a lo largo de la página.
  Cada cinta de la S es una etapa de la venta: la de arriba atrae (marketing), el pliegue
  atiende (agente de IA) y la de abajo cierra (CRM y software a medida). Armada, la S es el
  crecimiento. x/y son fracciones de media pantalla (1 = borde derecho / superior); z es
  profundidad hacia la cámara; turn y tilt, radianes extra sobre la pose de reposo.
*/
export type StagePose = {
  x: number;
  y: number;
  z: number;
  scale: number;
  spread: number;
  turn: number;
  tilt: number;
  /** Cinta destacada: 0 atraer, 1 atender, 2 cerrar; -1 ninguna */
  focus: number;
  opacity: number;
};

export type PoseDef = { desktop: StagePose; mobile: StagePose; reduced?: Partial<StagePose> };

const base: StagePose = { x: 0, y: 0, z: 0, scale: 1, spread: 0, turn: 0, tilt: 0, focus: -1, opacity: 1 };
const p = (o: Partial<StagePose>): StagePose => ({ ...base, ...o });

// Con reduced motion: sin zambullida, sin apertura ni giros; solo lugar, tamaño y luz
const STILL: Partial<StagePose> = { z: 0, spread: 0, turn: 0, tilt: 0 };

export const POSES = {
  // La S armada, grande, a la derecha del titular (arriba del texto en celulares)
  hero: {
    desktop: p({ x: 0.56, y: -0.02, scale: 1 }),
    mobile: p({ x: 0.16, y: 0.43, scale: 0.92 }),
  },
  // Salida del hero: la cámara se zambulle entre las cintas, que se abren y pasan de largo
  dive: {
    desktop: p({ x: 0.05, y: 0, z: 6.4, scale: 1.5, spread: 1, turn: 1.1, tilt: 0.35, opacity: 0 }),
    mobile: p({ x: 0, y: 0.1, z: 6.4, scale: 1.5, spread: 1, turn: 1.1, tilt: 0.35, opacity: 0 }),
    reduced: { ...STILL, x: 0.5, y: 0, scale: 1 },
  },
  // Del otro lado: las cintas llegan desde el fondo, todavía abiertas
  arrive: {
    desktop: p({ x: 0.42, z: -6, scale: 0.9, spread: 0.9, turn: -0.9, tilt: 0.2, opacity: 0 }),
    mobile: p({ x: 0, y: 0.39, z: -6, scale: 0.6, spread: 0.8, turn: -0.9, tilt: 0.2, opacity: 0 }),
    reduced: { ...STILL },
  },
  atraer: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.4, tilt: 0.08, focus: 0 }),
    mobile: p({ y: 0.39, scale: 0.6, spread: 0.55, turn: -0.4, tilt: 0.08, focus: 0 }),
    reduced: STILL,
  },
  atender: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: 0.32, tilt: -0.04, focus: 1 }),
    mobile: p({ y: 0.39, scale: 0.6, spread: 0.55, turn: 0.32, tilt: -0.04, focus: 1 }),
    reduced: STILL,
  },
  cerrar: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.12, tilt: -0.16, focus: 2 }),
    mobile: p({ y: 0.39, scale: 0.6, spread: 0.55, turn: -0.12, tilt: -0.16, focus: 2 }),
    reduced: STILL,
  },
  // Crecer: las tres cintas se vuelven a armar con una vuelta completa
  crecer: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.96, turn: Math.PI * 2 }),
    mobile: p({ y: 0.39, scale: 0.68, turn: Math.PI * 2 }),
    reduced: STILL,
  },
  // Se retira para dejar lugar a los proyectos
  out: {
    desktop: p({ x: 0.42, y: 0.35, z: -3, scale: 0.7, turn: Math.PI * 2.4, opacity: 0 }),
    mobile: p({ y: 0.7, z: -3, scale: 0.6, turn: Math.PI * 2.4, opacity: 0 }),
    reduced: STILL,
  },
} satisfies Record<string, PoseDef>;

export type PoseKey = keyof typeof POSES;
