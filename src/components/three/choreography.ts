/*
  Coreografía del isotipo a lo largo de la página.
  Cada cinta de la S es una etapa de la venta: la de arriba atrae (marketing), el pliegue
  atiende (agente de IA) y la de abajo cierra (CRM y software a medida). Armada, la S es el
  crecimiento.

  - x / y: fracciones de media pantalla (1 = borde derecho / superior)
  - z: fracción de la distancia de la cámara (0,9 = casi contra la cámara), así la zambullida
    atraviesa la cámara igual en un celular que en un monitor
  - turn / tilt: radianes extra sobre la pose de reposo
  - En celulares, las poses con `slot` toman el lugar y el tamaño del hueco que la sección deja
    para el isotipo (un elemento con ese id), así nunca tapa texto aunque la pantalla sea baja
*/
export type StagePose = {
  x: number;
  y: number;
  z: number;
  scale: number;
  spread: number;
  turn: number;
  tilt: number;
  /** Cinta destacada: 0 atraer, 1 atender, 2 cerrar; -1 ninguna; -2 las tres (crecer) */
  focus: number;
  opacity: number;
};

export type PoseDef = {
  desktop: StagePose;
  mobile: StagePose;
  /** Con reduced motion: valores que reemplazan a los de la pose */
  reduced?: Partial<StagePose>;
  /** Con reduced motion: queda donde estaba en la marca anterior (solo cambia la opacidad) */
  reducedHold?: boolean;
};

const base: StagePose = { x: 0, y: 0, z: 0, scale: 1, spread: 0, turn: 0, tilt: 0, focus: -1, opacity: 1 };
const p = (o: Partial<StagePose>): StagePose => ({ ...base, ...o });

// Con reduced motion: sin zambullida, sin apertura ni giros; solo lugar, tamaño y luz
const STILL: Partial<StagePose> = { z: 0, spread: 0, turn: 0, tilt: 0 };

export const POSES = {
  // La S armada, grande, a la derecha del titular (arriba del texto en celulares)
  hero: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: p({ x: 0.12, scale: 0.95 }),
  },
  // Mitad del hero: la S se abre y avanza hacia la cámara, todavía entera a la vista
  // En celulares la S sube y avanza (no baja sobre el titular, que se desvanece debajo)
  plunge: {
    desktop: p({ x: 0.22, z: 0.42, scale: 1.1, spread: 1.1, turn: 0.7, tilt: 0.22 }),
    mobile: p({ x: 0.05, y: 0.55, z: 0.4, scale: 1.05, spread: 1.1, turn: 0.7, tilt: 0.3 }),
    reducedHold: true,
  },
  // Salida del hero: las cintas se abren hacia los bordes y pasan al lado de la cámara
  dive: {
    desktop: p({ x: 0.04, z: 0.9, scale: 1.25, spread: 2.6, turn: 1.15, tilt: 0.38, opacity: 0 }),
    mobile: p({ x: 0, y: 0.45, z: 0.9, scale: 1.25, spread: 2.6, turn: 1.15, tilt: 0.42, opacity: 0 }),
    reducedHold: true,
  },
  // Del otro lado: las cintas llegan desde el fondo, todavía abiertas
  arrive: {
    desktop: p({ x: 0.42, z: -0.7, scale: 0.9, spread: 0.9, turn: -0.9, tilt: 0.2, opacity: 0 }),
    mobile: p({ z: -0.7, scale: 0.6, spread: 0.8, turn: -0.9, tilt: 0.2, opacity: 0 }),
    reduced: STILL,
  },
  atraer: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.4, tilt: 0.08, focus: 0 }),
    mobile: p({ scale: 0.62, spread: 0.55, turn: -0.4, tilt: 0.08, focus: 0 }),
    reduced: STILL,
  },
  atender: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: 0.32, tilt: -0.04, focus: 1 }),
    mobile: p({ scale: 0.62, spread: 0.55, turn: 0.32, tilt: -0.04, focus: 1 }),
    reduced: STILL,
  },
  cerrar: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.12, tilt: -0.16, focus: 2 }),
    mobile: p({ scale: 0.62, spread: 0.55, turn: -0.12, tilt: -0.16, focus: 2 }),
    reduced: STILL,
  },
  // Crecer: las cintas encajan de abajo hacia arriba (como apilar), la S sube apenas y brilla
  // entera. Sin vuelta completa: de canto las cintas se ven como piezas sueltas
  crecer: {
    desktop: p({ x: 0.42, y: 0.02, scale: 0.98, turn: 0.38, tilt: 0.06, focus: -2 }),
    mobile: p({ scale: 0.74, turn: 0.38, tilt: 0.06, focus: -2 }),
    reduced: { ...STILL, focus: -2 },
  },
  // Se retira cuando el panel se suelta: sube al menos tan rápido como el contenido (si no,
  // quedaría atrás y cruzaría el titular y el tablero) y se apaga en el camino
  out: {
    desktop: p({ x: 0.42, y: 0.95, z: -0.3, scale: 0.72, turn: 0.7, tilt: 0.1, opacity: 0 }),
    mobile: p({ y: 1.3, z: -0.3, scale: 0.6, turn: 0.7, tilt: 0.1, opacity: 0 }),
    reduced: STILL,
  },
} satisfies Record<string, PoseDef>;

export type PoseKey = keyof typeof POSES;
