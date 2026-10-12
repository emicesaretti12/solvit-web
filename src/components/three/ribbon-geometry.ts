/*
  Geometría del isotipo, sin React: las tres cintas de la S como polígonos extruidos con bisel,
  con el degradé de marca en los vértices. Además de la forma, cada cinta guarda:

  - `reveal`: la posición de cada vértice en la diagonal de la S (0 abajo a la izquierda, 1 arriba
    a la derecha). Ordena el degradé, el barrido con que aparece la S sólida y el orden en que
    llegan las partículas, así las tres cosas cuentan el mismo recorrido.
  - `corners`: las cuatro esquinas de la cara (relativas al centro de la cinta), para proyectar
    su sombra sobre el fondo.

  La usan las cintas del escenario (ribbons.tsx) y las partículas, que se muestrean sobre su
  superficie (particle-field.ts).
*/
import * as THREE from "three";

export type RibbonDef = { key: string; points: number[][]; from: string; to: string; depth: number; z: number };

// Polígonos del isotipo (viewBox 515 x 787), los mismos de logo.tsx
export const RIBBONS: RibbonDef[] = [
  { key: "top", points: [[0, 217], [468, 0], [468, 189], [0, 399]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
  { key: "fold", points: [[0, 399], [280, 273], [515, 391], [232, 515]], from: "#002a9e", to: "#0064ff", depth: 0.26, z: -0.06 },
  { key: "bottom", points: [[52, 594], [515, 391], [515, 584], [52, 787]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
];

// La S mide 3,2 unidades de alto y 2,1 de ancho
export const S_UNITS = { width: 2.1, height: 3.2 };
const UNIT = 787 / S_UNITS.height;
const toScene = ([x, y]: number[]) => new THREE.Vector2((x - 257.5) / UNIT, -(y - 393.5) / UNIT);

/** Lugar de un punto (en unidades de la S) sobre la diagonal del isotipo: 0 abajo a la izquierda,
 *  1 arriba a la derecha */
export const diagonal = (x: number, y: number) =>
  THREE.MathUtils.clamp((x / S_UNITS.width + 0.5) * 0.45 + (y / S_UNITS.height + 0.5) * 0.55, 0, 1);

/** Parte de las partículas que le toca a cada cinta: según el área de su cara */
export const RIBBON_SHARES = (() => {
  const areas = RIBBONS.map(({ points }) =>
    Math.abs(points.reduce((sum, [x, y], i) => {
      const [nx, ny] = points[(i + 1) % points.length];
      return sum + x * ny - nx * y;
    }, 0)) / 2,
  );
  const total = areas.reduce((a, b) => a + b, 0);
  return areas.map((a) => a / total);
})();

export function buildRibbonGeometry(points: number[][], from: string, to: string, depth: number) {
  const pts = points.map(toScene);
  const center = pts.reduce((a, p) => a.add(p), new THREE.Vector2()).multiplyScalar(1 / pts.length);
  const corners = pts.map((p) => p.clone().sub(center));
  const shape = new THREE.Shape(corners);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.035,
    bevelSegments: 5,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();

  // Degradé de marca en diagonal (abajo a la izquierda → arriba a la derecha), en espacio de la S
  const a = new THREE.Color(from);
  const b = new THREE.Color(to);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const reveal = new Float32Array(pos.count);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = diagonal(pos.getX(i) + center.x, pos.getY(i) + center.y);
    c.copy(a).lerp(b, t);
    colors.set([c.r, c.g, c.b], i * 3);
    reveal[i] = t;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("reveal", new THREE.BufferAttribute(reveal, 1));
  return { geometry, center, corners };
}
