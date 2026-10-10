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
import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { FOV, fitDistance, stageSignal, type DragState, type IsoPose } from "./pose";
import { RIBBONS, SPREAD, STAGGER, STEP_SPREAD, StudioEnvironment, smoothstep, useRibbonGeometry } from "./ribbons";


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
  const glow = useRef(0);
  const pop = useRef(pose.current.focus === index ? 1 : 0);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = pose.current;
    spread.current = reduce ? p.spread : THREE.MathUtils.damp(spread.current, p.spread, 6, dt);
    const raw = spread.current;
    const [lo, hi] = STAGGER[index];
    const s = raw >= STEP_SPREAD ? raw : STEP_SPREAD * smoothstep(lo, hi, raw / STEP_SPREAD);
    const [offset, rz, ry] = SPREAD[index];
    // La cinta del paso activo se adelanta hacia la cámara: en un celular, donde la S es chica,
    // se lee qué parte trabaja aunque el brillo no alcance
    pop.current = reduce ? (p.focus === index ? 1 : 0) : THREE.MathUtils.damp(pop.current, p.focus === index ? 1 : 0, 7, dt);
    g.position.set(center.x + offset.x * s, center.y + offset.y * s, ribbon.z + offset.z * s + pop.current * 0.45);
    g.rotation.set(0, ry * s, rz * s);
    g.scale.setScalar(1 + pop.current * 0.05);

    // Con una cinta destacada, las otras bajan la luz; con focus -2 (crecer) brillan las tres
    const target = p.focus < 0 || p.focus === index ? 1 : 0.32;
    lit.current = reduce ? target : THREE.MathUtils.damp(lit.current, target, 8, dt);
    const glowTarget = p.focus === index ? 0.18 : p.focus === -2 ? 0.16 * (1 - s / STEP_SPREAD) : 0;
    glow.current = reduce ? glowTarget : THREE.MathUtils.damp(glow.current, glowTarget, 6, dt);
    if (material.current) {
      material.current.color.setScalar(lit.current);
      material.current.emissiveIntensity = glow.current;
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
  const intro = useRef(0);
  // La entrada solo corre si la S está a la vista al cargar; si la página abrió más abajo,
  // el primer cuadro llega mucho después y la S aparece ya en su pose
  const mountedAt = useRef(0);
  const introChecked = useRef(false);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
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
    if (!introChecked.current) {
      introChecked.current = true;
      if (performance.now() - mountedAt.current > 1200) intro.current = 1;
    }
    intro.current = reduce ? 1 : Math.min(1, intro.current + dt / 1.5);
    const enter = 1 - Math.pow(1 - intro.current, 3); // ease-out cúbica
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

    // x/y llegan en fracción de pantalla: se pasan a unidades según el encuadre actual. Detrás
    // del plano de la pantalla (z < 0) se compensa la perspectiva, así la S queda en el lugar
    // pedido aunque venga desde el fondo (si no, se corre hacia el centro y pisa el texto)
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const halfW = halfH * (size.width / Math.max(1, size.height));
    const depth = k.z < 0 ? 1 - k.z : 1;

    // Pose de reposo levemente girada, para que se lea el canto desde el primer cuadro
    g.rotation.set(
      0.14 + k.tilt + pitch.current.value + look.current.y * 0.18,
      -0.42 + k.turn + yaw.current.value + sway + look.current.x * 0.3 - (1 - enter) * 1.25,
      0,
    );
    g.position.set(k.x * halfW * depth, k.y * halfH * depth + bob, k.z * cam.position.z);
    g.scale.setScalar(k.scale * (0.82 + 0.18 * enter));
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

// La escena solo existe en el cliente (se importa con ssr: false)
const MOBILE = typeof window !== "undefined" && window.matchMedia("(max-width: 1023.98px)").matches;

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
      dpr={[1, MOBILE ? 1.5 : 1.75]}
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
