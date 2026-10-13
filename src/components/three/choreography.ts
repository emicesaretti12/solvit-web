/*
  Coreografía del isotipo a lo largo de la página.
  Cada cinta de la S es una etapa de la venta: la de arriba atrae (marketing), el pliegue
  atiende (agente de IA) y la de abajo cierra (CRM y software a medida). Armada, la S es el
  crecimiento.

  - x / y: fracciones de media pantalla (1 = borde derecho / superior)
  - z: fracción de la distancia de la cámara (0,9 = casi contra la cámara), así la zambullida
    atraviesa la cámara igual en un celular que en un monitor
  - turn / tilt: radianes extra sobre la pose de reposo
  - layers: cómo se abren las cintas. 0 en diagonal (escritorio: las etapas de la venta); 1 en
    capas, como una vista explotada que conserva la silueta de la S (celulares). Con spread
    mayor a 1 las capas se dispersan hacia los bordes y dejan pasar a la cámara
  - En celulares (vertical y con movimiento) el hero queda fijado y el resto de la página sube
    encima como una hoja (data-stage-cover). Las poses del recorrido se ubican solas:
    · con `slot`, en el centro y el tamaño del hueco que el hero deja para el isotipo
    · con `region`, en lo que queda a la vista por encima de la hoja cuando el scroll llega a la
      marca: y es un corrimiento en medias alturas de esa zona (positivo = hacia arriba) y la
      escala se achica si no entra. Así la S nunca queda detrás del contenido que sube
    Recorrido: la S gira en su hueco mientras se va el texto (rise), crece y se pone de frente
    sobre la hoja que empieza a subir (center), se abre en sus tres capas (explode), avanza hacia
    la cámara por encima de la hoja (plunge) y la atraviesa (dive)
  - Sin tramo fijado (reduced motion o un celular acostado) la S queda en su hueco, se va con el
    hero y se apaga al final (leave)
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
  layers: number;
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

const base: StagePose = { x: 0, y: 0, z: 0, scale: 1, spread: 0, layers: 0, turn: 0, tilt: 0, focus: -1, opacity: 1 };
const p = (o: Partial<StagePose>): StagePose => ({ ...base, ...o });

// En celulares, después del hero este escenario se apaga: "Cómo funciona" y el recorrido
// tienen su propia versión, con animaciones 3D en CSS y scroll común (sin panel fijo)
const OFF = p({ opacity: 0 });

// Con reduced motion: sin zambullida, sin apertura ni giros; solo lugar, tamaño y luz
const STILL: Partial<StagePose> = { z: 0, spread: 0, turn: 0, tilt: 0 };

// Celulares: siempre en capas (la S se abre sin perder la silueta; el toque también respira así)
const m = (o: Partial<StagePose>): StagePose => p({ layers: 1, ...o });

export const POSES = {
  // La S armada, grande, a la derecha del titular (en celulares, centrada en su hueco arriba del
  // texto: el x y el y salen del hueco)
  hero: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: m({ scale: 1 }),
  },
  // Escritorio: mientras el titular se va, la S gira hasta quedar casi de frente y se abre en
  // sus tres cintas (vista explotada: las tres etapas de la venta); después la zambullida sigue
  // el mismo giro. Se queda en su columna: el texto todavía se está yendo
  unfold: {
    desktop: p({ x: 0.54, y: -0.1, z: 0.04, scale: 0.86, spread: 0.42, turn: 0.22, tilt: 0.02 }),
    mobile: m({ scale: 1 }),
    reducedHold: true,
  },
  // Celulares: mientras se va el texto, la S gira en su hueco sin salir de él
  rise: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: m({ scale: 1.04, turn: 0.34, tilt: 0.05 }),
    reducedHold: true,
  },
  // Celulares: sin texto, la S crece y queda casi de frente en el centro de la zona libre (la
  // hoja recién empieza a subir), apenas abierta
  center: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: m({ y: 0.08, z: 0.04, scale: 0.95, spread: 0.25, turn: 0.42, tilt: 0.08 }),
    reducedHold: true,
  },
  // Celulares: vista explotada. Las tres capas separadas en altura y profundidad, giradas para
  // que se lea el espesor de cada una, pero con la silueta de la S entera
  explode: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98 }),
    mobile: m({ y: 0.1, z: 0.06, scale: 1.3, spread: 1, turn: -0.3, tilt: 0.26 }),
    reducedHold: true,
  },
  // Escritorio: mitad del hero, la S se abre y avanza hacia la cámara, todavía entera a la
  // vista. Celulares: la hoja ya tapa media pantalla; la S avanza por encima y se dispersa
  plunge: {
    desktop: p({ x: 0.22, z: 0.42, scale: 1.1, spread: 1.1, turn: 0.7, tilt: 0.22 }),
    mobile: m({ z: 0.42, scale: 0.75, spread: 1.5, turn: -0.62, tilt: 0.36 }),
    reducedHold: true,
  },
  // Salida del hero: las cintas se abren hacia los bordes y pasan al lado de la cámara
  dive: {
    desktop: p({ x: 0.04, z: 0.9, scale: 1.25, spread: 2.6, turn: 1.15, tilt: 0.38, opacity: 0 }),
    mobile: m({ z: 0.9, scale: 1.1, spread: 2.6, turn: -1.05, tilt: 0.46, opacity: 0 }),
    reducedHold: true,
  },
  // Celulares sin tramo fijado: la S se va con el hero (va en su hueco) y se apaga al final
  leave: {
    desktop: p({ x: 0.6, y: -0.02, scale: 0.98, opacity: 0 }),
    mobile: m({ scale: 1, opacity: 0 }),
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
