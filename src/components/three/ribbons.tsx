"use client";

/*
  Piezas del isotipo en 3D para React Three Fiber: las tres cintas con su degradé de marca, cómo
  se abren y la iluminación de estudio. La geometría en sí (sin React) vive en ribbon-geometry.ts,
  que también usan las partículas.

  Dos maneras de abrirse (la pose las mezcla con `layers`):
  - en diagonal (SPREAD, escritorio): cada cinta sale hacia su lado, las tres etapas de la venta
  - en capas (LAYERS, celulares): una vista explotada que conserva la silueta de la S (las capas
    se separan en altura y en profundidad); pasada la apertura completa se dispersan hacia los
    bordes (SCATTER)
*/
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildRibbonGeometry } from "./ribbon-geometry";

export { RIBBONS } from "./ribbon-geometry";

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

// Capas (celulares), por unidad de apertura hasta 1: [posición, giro Z, giro Y]. La de arriba
// sube y se adelanta, el pliegue queda y la de abajo baja y se va hacia atrás: de frente sigue
// siendo una S, girada se ven las tres placas escalonadas
export const LAYERS: [THREE.Vector3, number, number][] = [
  [new THREE.Vector3(0.08, 0.34, 0.62), 0.04, -0.1],
  [new THREE.Vector3(0, 0, -0.04), 0, 0.1],
  [new THREE.Vector3(-0.08, -0.34, -0.52), 0.04, -0.1],
];
// ...y por cada unidad de apertura pasada la primera: se dispersan hacia los bordes (arriba, al
// costado y abajo) y dejan libre el centro, por donde pasa la cámara
export const SCATTER: [THREE.Vector3, number, number][] = [
  [new THREE.Vector3(0.5, 1.25, 0.5), 0.35, -0.55],
  [new THREE.Vector3(-1.5, 0.05, -0.15), -0.2, 0.75],
  [new THREE.Vector3(0.45, -1.25, 0.35), 0.35, -0.55],
];

/** Geometría de una cinta (se libera al desmontar quien la usa) */
export function useRibbonGeometry(points: number[][], from: string, to: string, depth: number) {
  return useMemo(() => buildRibbonGeometry(points, from, to, depth), [points, from, to, depth]);
}

// Iluminación de estudio sin descargar HDR (RoomEnvironment es procedural): las cajas de luz
// del cuarto son los reflejos largos que recorren la laca de las cintas al girar
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
