"use client";

/*
  Piezas del isotipo en 3D que comparten el escenario de la página (isotype-scene) y la S de
  los pasos en celulares (steps-isotype): las tres cintas con su degradé de marca, cómo se abren
  y la iluminación de estudio. Mismo modelo en los dos lugares.
*/
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Polígonos del isotipo (viewBox 515 x 787), los mismos de logo.tsx
export const RIBBONS: { key: string; points: number[][]; from: string; to: string; depth: number; z: number }[] = [
  { key: "top", points: [[0, 217], [468, 0], [468, 189], [0, 399]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
  { key: "fold", points: [[0, 399], [280, 273], [515, 391], [232, 515]], from: "#002a9e", to: "#0064ff", depth: 0.26, z: -0.06 },
  { key: "bottom", points: [[52, 594], [515, 391], [515, 584], [52, 787]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
];

const UNIT = 787 / 3.2; // la S mide 3,2 unidades de alto
const toScene = ([x, y]: number[]) => new THREE.Vector2((x - 257.5) / UNIT, -(y - 393.5) / UNIT);

// Escalonado del armado (cinta: [desde, hasta] sobre spread / STEP_SPREAD): abajo encaja primero
export const STEP_SPREAD = 0.6;
export const STAGGER: [number, number][] = [
  [0, 0.7],
  [0.22, 0.86],
  [0.45, 1],
];
export const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Hacia dónde se abre cada cinta cuando spread = 1 (posición, giro Z, giro Y)
export const SPREAD: [THREE.Vector3, number, number][] = [
  [new THREE.Vector3(0.55, 0.7, 0.55), 0.1, -0.35],
  [new THREE.Vector3(0, 0, -0.5), 0, 0.45],
  [new THREE.Vector3(-0.55, -0.7, 0.3), 0.1, -0.35],
];

export function useRibbonGeometry(points: number[][], from: string, to: string, depth: number) {
  return useMemo(() => {
    const pts = points.map(toScene);
    const center = pts.reduce((a, p) => a.add(p), new THREE.Vector2()).multiplyScalar(1 / pts.length);
    const shape = new THREE.Shape(pts.map((p) => p.clone().sub(center)));
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
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + center.x;
      const y = pos.getY(i) + center.y;
      const t = THREE.MathUtils.clamp((x / 2.1 + 0.5) * 0.45 + (y / 3.2 + 0.5) * 0.55, 0, 1);
      c.copy(a).lerp(b, t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry, center };
  }, [points, from, to, depth]);
}

// Iluminación de estudio sin descargar HDR (RoomEnvironment es procedural)
export function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const target = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const rt = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    return rt;
  }, [gl]);
  useEffect(() => () => target.dispose(), [target]);
  return <primitive object={target.texture} attach="environment" />;
}
