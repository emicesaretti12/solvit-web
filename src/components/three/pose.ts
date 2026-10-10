/*
  Tipos y pose de reposo del isotipo, sin dependencias de three.js: así el escenario puede
  importarlos sin arrastrar three al bundle inicial (la escena se carga aparte, en el cliente).
*/
export type IsoPose = {
  /** 0 = S armada, 1 = cintas separadas */
  spread: number;
  /** Giro extra en Y (radianes), por ejemplo según el scroll */
  turn: number;
  /** Inclinación extra en X (radianes) */
  tilt: number;
  /** Posición horizontal en fracción de media pantalla (-1 izquierda, 1 derecha) */
  x: number;
  /** Posición vertical en fracción de media pantalla (-1 abajo, 1 arriba) */
  y: number;
  /** Profundidad en unidades de escena (positivo = hacia la cámara) */
  z: number;
  scale: number;
  /** Cinta destacada: 0 arriba, 1 pliegue, 2 abajo; -1 ninguna */
  focus: number;
};

export const restPose = (): IsoPose => ({ spread: 0, turn: 0, tilt: 0, x: 0, y: 0, z: 0, scale: 1, focus: -1 });

export type DragState = { active: boolean; dx: number; dy: number; vx: number; vy: number };
