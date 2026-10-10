"use client";

/*
  Isotipo de SEN en WebGL: las tres cintas de la S extruidas con bisel, material con laca
  (clearcoat) y el degradé de marca en los vértices. Cada cinta es una pieza aparte, así el
  scroll puede separarlas (atraer, atender, cerrar) y volver a armar la S.

  La pose llega en un objeto mutable (IsoPose) que se anima desde afuera (GSAP o Motion) sin
  re-renderizar React; acá cada cuadro se amortigua hacia esa pose. El arrastre (touch o mouse)
  gira la pieza con un resorte que hereda la velocidad del dedo y vuelve a la pose de reposo.
*/
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FOV, fitDistance, stageSignal, type DragState, type IsoPose } from "./pose";


// Polígonos del isotipo (viewBox 515 x 787), los mismos de logo.tsx
const RIBBONS: { key: string; points: number[][]; from: string; to: string; depth: number; z: number }[] = [
  { key: "top", points: [[0, 217], [468, 0], [468, 189], [0, 399]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
  { key: "fold", points: [[0, 399], [280, 273], [515, 391], [232, 515]], from: "#002a9e", to: "#0064ff", depth: 0.26, z: -0.06 },
  { key: "bottom", points: [[52, 594], [515, 391], [515, 584], [52, 787]], from: "#0052ff", to: "#1fdcff", depth: 0.34, z: 0 },
];

const UNIT = 787 / 3.2; // la S mide 3,2 unidades de alto
const toScene = ([x, y]: number[]) => new THREE.Vector2((x - 257.5) / UNIT, -(y - 393.5) / UNIT);

// Hacia dónde se abre cada cinta cuando spread = 1 (posición, giro Z, giro Y)
const SPREAD: [THREE.Vector3, number, number][] = [
  [new THREE.Vector3(0.55, 0.7, 0.55), 0.1, -0.35],
  [new THREE.Vector3(0, 0, -0.5), 0, 0.45],
  [new THREE.Vector3(-0.55, -0.7, 0.3), 0.1, -0.35],
];

function useRibbonGeometry(points: number[][], from: string, to: string, depth: number) {
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

function Ribbon({
  index,
  pose,
  ribbon,
  reduce,
}: {
  index: number;
  pose: MutableRefObject<IsoPose>;
  ribbon: (typeof RIBBONS)[number];
  reduce: boolean;
}) {
  const { geometry, center } = useRibbonGeometry(ribbon.points, ribbon.from, ribbon.to, ribbon.depth);
  const ref = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  // Arranca en la pose que ya calculó el escenario (sin viaje inicial desde el centro)
  const spread = useRef(pose.current.spread);
  const lit = useRef(pose.current.focus < 0 || pose.current.focus === index ? 1 : 0.32);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = pose.current;
    spread.current = reduce ? p.spread : THREE.MathUtils.damp(spread.current, p.spread, 6, dt);
    const s = spread.current;
    const [offset, rz, ry] = SPREAD[index];
    g.position.set(center.x + offset.x * s, center.y + offset.y * s, ribbon.z + offset.z * s);
    g.rotation.set(0, ry * s, rz * s);

    // Con una cinta destacada, las otras bajan la luz
    const target = p.focus < 0 || p.focus === index ? 1 : 0.32;
    lit.current = reduce ? target : THREE.MathUtils.damp(lit.current, target, 8, dt);
    if (material.current) {
      material.current.color.setScalar(lit.current);
      material.current.emissiveIntensity = p.focus === index ? 0.18 : 0;
    }
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={material}
          vertexColors
          roughness={0.34}
          metalness={0.1}
          clearcoat={0.85}
          clearcoatRoughness={0.12}
          envMapIntensity={0.3}
          emissive="#1f6bff"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

// Iluminación de estudio sin descargar HDR (RoomEnvironment es procedural)
function StudioEnvironment() {
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

function Rig({
  pose,
  drag,
  pointer,
  reduce,
}: {
  pose: MutableRefObject<IsoPose>;
  drag: MutableRefObject<DragState>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  reduce: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const yaw = useRef({ value: 0, vel: 0 });
  const pitch = useRef({ value: 0, vel: 0 });
  const look = useRef({ x: 0, y: 0 });
  const start = pose.current;
  const damped = useRef({ turn: start.turn, tilt: start.tilt, x: start.x, y: start.y, z: start.z, scale: start.scale });
  const clock = useRef(0);
  const lastZ = useRef(start.z);
  const { camera, size } = useThree();

  useFrame((_, rawDt) => {
    const g = root.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 30);
    clock.current += dt;
    const p = pose.current;
    const d = drag.current;

    // Arrastre 1:1; al soltar, resorte con la velocidad del dedo (amortiguación ~0,8: un leve rebote)
    const spring = (s: { value: number; vel: number }, held: number | null, releaseVel: number) => {
      if (held !== null) {
        s.vel = releaseVel;
        s.value = held;
        return;
      }
      const k = 26;
      const c = 2 * Math.sqrt(k) * 0.8;
      s.vel += (-k * s.value - c * s.vel) * dt;
      s.value += s.vel * dt;
    };
    spring(yaw.current, d.active ? THREE.MathUtils.clamp(d.dx * 0.009, -2.4, 2.4) : null, d.vx * 0.009);
    spring(pitch.current, d.active ? THREE.MathUtils.clamp(d.dy * 0.005, -0.6, 0.6) : null, d.vy * 0.005);

    // Paralaje con el mouse (puntero fino) y una oscilación lenta
    look.current.x = THREE.MathUtils.damp(look.current.x, pointer.current.x, 3, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, pointer.current.y, 3, dt);
    const sway = reduce ? 0 : Math.sin(clock.current * 0.45) * 0.12;
    const bob = reduce ? 0 : Math.sin(clock.current * 0.9) * 0.05;

    const k = damped.current;
    // Corte de cámara: si el objetivo salta lejos de un cuadro al otro (la zambullida termina
    // y las cintas reaparecen al fondo), se salta sin animar el regreso. Con reduced motion,
    // siempre: la pose se aplica directa, sin recorridos
    if (reduce || Math.abs(p.z - lastZ.current) > 0.5) {
      k.turn = p.turn;
      k.tilt = p.tilt;
      k.x = p.x;
      k.y = p.y;
      k.z = p.z;
      k.scale = p.scale;
    }
    lastZ.current = p.z;
    k.turn = THREE.MathUtils.damp(k.turn, p.turn, 5, dt);
    k.tilt = THREE.MathUtils.damp(k.tilt, p.tilt, 5, dt);
    k.x = THREE.MathUtils.damp(k.x, p.x, 5, dt);
    k.y = THREE.MathUtils.damp(k.y, p.y, 5, dt);
    k.z = THREE.MathUtils.damp(k.z, p.z, 4, dt);
    k.scale = THREE.MathUtils.damp(k.scale, p.scale, 5, dt);

    // x/y llegan en fracción de pantalla: se pasan a unidades según el encuadre actual
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const halfW = halfH * (size.width / Math.max(1, size.height));

    // Pose de reposo levemente girada, para que se lea el canto desde el primer cuadro
    g.rotation.set(
      0.14 + k.tilt + pitch.current.value + look.current.y * 0.18,
      -0.42 + k.turn + yaw.current.value + sway + look.current.x * 0.3,
      0,
    );
    g.position.set(k.x * halfW, k.y * halfH + bob, k.z * cam.position.z);
    g.scale.setScalar(k.scale);
  });

  return (
    <group ref={root}>
      {RIBBONS.map((r, i) => (
        <Ribbon key={r.key} index={i} pose={pose} ribbon={r} reduce={reduce} />
      ))}
    </group>
  );
}

// Encaja la S (con margen para cuando se abre) según el aspecto del canvas
function Fit() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0, fitDistance(size.width / Math.max(1, size.height)));
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

export default function IsotypeScene({
  pose,
  drag,
  pointer,
  reduce,
  active,
  onReady,
}: {
  pose: MutableRefObject<IsoPose>;
  drag: MutableRefObject<DragState>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  reduce: boolean;
  /** Fuera de pantalla el loop se detiene */
  active: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={!active ? "never" : reduce ? "demand" : "always"}
      camera={{ fov: FOV, position: [0, 0, 9.5], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, invalidate }) => {
        // Con reduced motion solo se dibuja cuando el scroll cambia la pose
        stageSignal.invalidate = () => invalidate();
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 0.92;
        onReady?.();
      }}
      style={{ background: "transparent" }}
    >
      <Fit />
      <StudioEnvironment />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-4, 5, 6]} intensity={0.7} />
      <directionalLight position={[5, -1, 2]} intensity={0.35} color="#7fb2ff" />
      <pointLight position={[3, -2, -3]} intensity={22} color="#1fdcff" distance={14} />
      <Rig pose={pose} drag={drag} pointer={pointer} reduce={reduce} />
    </Canvas>
  );
}
