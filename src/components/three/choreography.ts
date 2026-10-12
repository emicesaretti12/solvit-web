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
    para el isotipo (un elemento con ese id), así nunca tapa texto aunque la pantalla sea baja.
    El hero queda fijado mientras dura su recorrido (rise, center, plunge y dive solo existen
    ahí): la S sale de su hueco recién cuando el texto ya se fue
  - unfold solo existe en escritorio (su marca está oculta en celulares)
  - La profundidad también mueve las partículas: z > 0 las vuelve un flujo hacia la cámara
    (zambullida) y z < 0 las dispersa (la S llega desde el fondo y se vuelve a juntar)
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

// En celulares, después del hero este escenario se apaga: "Cómo funciona" y el recorrido
// tienen su propia versión, con animaciones 3D en CSS y scroll común (sin panel fijo)
const OFF = p({ opacity: 0 });

// Con reduced motion: sin zambullida, sin apertura ni giros; solo lugar, tamaño y luz
const STILL: Partial<StagePose> = { z: 0, spread: 0, turn: 0, tilt: 0 };

export const POSES = {
  // La S armada, grande, a la derecha del titular (arriba del texto en celulares)
  hero: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: p({ x: 0.12, scale: 0.95 }),
  },
  // Escritorio: mientras el titular se va, la S gira hasta quedar casi de frente y se abre en
  // sus tres cintas (vista explotada: las tres etapas de la venta); después la zambullida sigue
  // el mismo giro. Se queda en su columna: el texto todavía se está yendo
  unfold: {
    desktop: p({ x: 0.54, y: -0.1, z: 0.04, scale: 0.86, spread: 0.42, turn: 0.22, tilt: 0.02 }),
    mobile: p({ x: 0.12, scale: 0.95 }),
    reducedHold: true,
  },
  // Celulares (hero fijado): la S gira y se abre un poco en su hueco mientras se va el texto
  rise: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: p({ x: 0.1, scale: 1, spread: 0.35, turn: 0.75, tilt: 0.14 }),
    reducedHold: true,
  },
  // Celulares: ya sin texto, la S llega al centro de la pantalla, más grande y abierta
  center: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: p({ x: 0, y: 0.06, z: 0.1, scale: 1.25, spread: 0.95, turn: 1.3, tilt: 0.3 }),
    reducedHold: true,
  },
  // Mitad del hero: la S se abre y avanza hacia la cámara, todavía entera a la vista
  plunge: {
    desktop: p({ x: 0.22, z: 0.42, scale: 1.1, spread: 1.1, turn: 0.7, tilt: 0.22 }),
    mobile: p({ x: 0, y: 0.02, z: 0.5, scale: 1.3, spread: 1.7, turn: 1.6, tilt: 0.4 }),
    reducedHold: true,
  },
  // Salida del hero: las cintas se abren hacia los bordes y pasan al lado de la cámara
  dive: {
    desktop: p({ x: 0.04, z: 0.9, scale: 1.25, spread: 2.6, turn: 1.15, tilt: 0.38, opacity: 0 }),
    mobile: p({ x: 0, y: 0, z: 0.92, scale: 1.35, spread: 2.9, turn: 1.9, tilt: 0.46, opacity: 0 }),
    reducedHold: true,
  },
  // Del otro lado: las cintas llegan desde el fondo, todavía abiertas
  arrive: {
    desktop: p({ x: 0.42, z: -0.7, scale: 0.9, spread: 0.9, turn: -0.9, tilt: 0.2, opacity: 0 }),
    mobile: OFF,
    reduced: STILL,
  },
  atraer: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.4, tilt: 0.08, focus: 0 }),
    mobile: OFF,
    reduced: STILL,
  },
  atender: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: 0.32, tilt: -0.04, focus: 1 }),
    mobile: OFF,
    reduced: STILL,
  },
  cerrar: {
    desktop: p({ x: 0.42, y: -0.04, scale: 0.84, spread: 0.6, turn: -0.12, tilt: -0.16, focus: 2 }),
    mobile: OFF,
    reduced: STILL,
  },
  // Crecer: las cintas encajan de abajo hacia arriba (como apilar), la S sube apenas y brilla
  // entera. Sin vuelta completa: de canto las cintas se ven como piezas sueltas
  crecer: {
    desktop: p({ x: 0.42, y: 0.02, scale: 0.98, turn: 0.38, tilt: 0.06, focus: -2 }),
    mobile: OFF,
    reduced: { ...STILL, focus: -2 },
  },
  // Se retira cuando el panel se suelta: sube al menos tan rápido como el contenido (si no,
  // quedaría atrás y cruzaría el titular y el tablero) y se apaga en el camino
  out: {
    desktop: p({ x: 0.42, y: 0.95, z: -0.3, scale: 0.72, turn: 0.7, tilt: 0.1, opacity: 0 }),
    mobile: OFF,
    reduced: STILL,
  },
} satisfies Record<string, PoseDef>;

export type PoseKey = keyof typeof POSES;
