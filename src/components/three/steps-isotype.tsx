"use client";

/*
  La S de "Cómo funciona" en celulares: un canvas propio dentro del hueco del panel sticky.
  Viaja con el panel en el scroll nativo (lo mueve el compositor del navegador, como al texto),
  así nunca queda atrás ni "nada" detrás del contenido, cosa que un canvas fijo reposicionado
  con JavaScript no logra en un celular. El cambio de paso no está atado al dedo: cada paso
  dispara resortes con tiempo propio.
  - Atraer, atender, cerrar: la S gira para mostrar la cinta del paso, que se adelanta, se
    corre hacia afuera y brilla; las otras bajan la luz. El cambio llega con un latigazo de
    giro que rebota apenas (resorte con la velocidad del cambio)
  - Crecer: las cintas encajan de abajo hacia arriba y una luz recorre la S en el mismo orden
  - Una órbita fina rodea la S y una consulta (un punto de luz) da vueltas; se acelera en cada
    cambio de paso y en crecer la órbita se abre
  - Entrada: la primera vez que se ve, las cintas llegan abiertas y se arman
  - Se gira con el dedo en horizontal; el scroll vertical queda libre (touch-action: pan-y)
  - Fuera de pantalla no dibuja; con reduced motion, poses fijas sin giros ni órbita
*/
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { FOV } from "./pose";
import { RIBBONS, SPREAD, STAGGER, STEP_SPREAD, StudioEnvironment, smoothstep, useRibbonGeometry } from "./ribbons";

// focus: cinta del paso (0 arriba, 1 pliegue, 2 abajo); -2: las tres (crecer)
const POSES = [
  { turn: -0.55, tilt: 0.12, spread: 0.62, focus: 0 },
  { turn: 0.44, tilt: -0.04, spread: 0.62, focus: 1 },
  { turn: -0.16, tilt: -0.2, spread: 0.62, focus: 2 },
  { turn: 0.34, tilt: 0.08, spread: 0, focus: -2 },
];

// Orden en que la luz recorre la S al crecer: abajo, pliegue, arriba
const SWEEP_RANK = [1, 0.5, 0];

type Shared = {
  step: number;
  reduce: boolean;
  /** Momento (performance.now) del último cambio de paso */
  changedAt: number;
  /** Arrastre horizontal (solo cuando el gesto ya es claramente horizontal) */
  drag: { active: boolean; dx: number; vx: number };
};

type Spring = { value: number; vel: number };
// Resorte amortiguado (k rigidez, zeta < 1 rebota apenas)
function spring(s: Spring, target: number, k: number, zeta: number, dt: number) {
  const c = 2 * Math.sqrt(k) * zeta;
  s.vel += (-(s.value - target) * k - c * s.vel) * dt;
  s.value += s.vel * dt;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Ribbon({
  index,
  state,
  intro,
}: {
  index: number;
  state: MutableRefObject<Shared>;
  intro: MutableRefObject<number>;
}) {
  const ribbon = RIBBONS[index];
  const { geometry, center } = useRibbonGeometry(ribbon.points, ribbon.from, ribbon.to, ribbon.depth);
  const ref = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const start = POSES[state.current.step];
  const spread = useRef(start.spread);
  const pop = useRef(start.focus === index ? 1 : 0);
  const lit = useRef(start.focus < 0 || start.focus === index ? 1 : 0.34);
  const glow = useRef(0);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, rawDt) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 30);
    const st = state.current;
    const target = POSES[st.step];
    const focused = target.focus === index;
    const reduce = st.reduce;

    // Apertura con el armado escalonado (abajo encaja primero) + la entrada, que llega abierta
    spread.current = reduce ? target.spread : THREE.MathUtils.damp(spread.current, target.spread, 7, dt);
    const raw = spread.current + (1 - easeOut(intro.current)) * 2.4;
    const [lo, hi] = STAGGER[index];
    const s = raw >= STEP_SPREAD ? raw : STEP_SPREAD * smoothstep(lo, hi, raw / STEP_SPREAD);

    // La cinta del paso se adelanta y se corre un poco hacia afuera
    pop.current = reduce ? (focused ? 1 : 0) : THREE.MathUtils.damp(pop.current, focused ? 1 : 0, 8, dt);
    const [offset, rz, ry] = SPREAD[index];
    const out = s + pop.current * 0.22;
    g.position.set(center.x + offset.x * out, center.y + offset.y * out, ribbon.z + offset.z * out + pop.current * 0.55);
    g.rotation.set(0, ry * s, rz * s);
    g.scale.setScalar(1 + pop.current * 0.06);

    // Luz: con un paso activo, las otras cintas bajan; en crecer brillan las tres y una luz
    // las recorre de abajo hacia arriba
    const litTarget = target.focus < 0 || focused ? 1 : 0.34;
    lit.current = reduce ? litTarget : THREE.MathUtils.damp(lit.current, litTarget, 9, dt);
    let glowTarget = focused ? 0.24 : 0;
    if (target.focus === -2) {
      const p = (performance.now() - st.changedAt) / 1000 / 0.9 - 0.45;
      const d = p - SWEEP_RANK[index];
      glowTarget = 0.1 + (reduce ? 0 : 0.42 * Math.exp(-(d * d) / 0.03));
    }
    glow.current = reduce ? glowTarget : THREE.MathUtils.damp(glow.current, glowTarget, 10, dt);
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
          roughness={0.32}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          envMapIntensity={0.34}
          emissive="#1f6bff"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

// Órbita: un aro fino alrededor de la S y una consulta que da vueltas con su estela
function Orbit({ state, boost }: { state: MutableRefObject<Shared>; boost: MutableRefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const comet = useRef<THREE.Group>(null);
  const angle = useRef(0.6);
  const open = useRef(POSES[state.current.step].focus === -2 ? 1 : 0);
  const R = 2.25;

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const st = state.current;
    const growing = POSES[st.step].focus === -2;
    open.current = st.reduce ? (growing ? 1 : 0) : THREE.MathUtils.damp(open.current, growing ? 1 : 0, 3, dt);
    const scale = 1 + open.current * 0.14;
    if (ring.current) ring.current.scale.setScalar(scale);
    if (ringMat.current) ringMat.current.opacity = 0.22 + open.current * 0.16 + boost.current * 0.2;
    if (st.reduce) return;
    angle.current += dt * (0.8 + boost.current * 4.5);
    const c = comet.current;
    if (c) {
      c.children.forEach((dot, i) => {
        const a = angle.current - i * 0.075;
        dot.position.set(Math.cos(a) * R * scale, Math.sin(a) * R * scale, 0);
      });
    }
  });

  // Plano de la órbita: casi horizontal, visto apenas desde arriba (pasa delante y detrás de la S)
  return (
    <group rotation={[Math.PI / 2 - 0.32, 0, 0.12]}>
      <mesh ref={ring}>
        <torusGeometry args={[R, 0.008, 6, 160]} />
        <meshBasicMaterial ref={ringMat} color="#3d8bff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {!state.current.reduce && (
        <group ref={comet}>
          {[0.075, 0.058, 0.044, 0.032, 0.022].map((r, i) => (
            <mesh key={i}>
              <sphereGeometry args={[r, 12, 12]} />
              <meshBasicMaterial color="#9cc4ff" transparent opacity={1 - i * 0.19} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Rig({ state }: { state: MutableRefObject<Shared> }) {
  const root = useRef<THREE.Group>(null);
  const start = POSES[state.current.step];
  const turn = useRef<Spring>({ value: start.turn, vel: 0 });
  const tilt = useRef<Spring>({ value: start.tilt, vel: 0 });
  const yaw = useRef<Spring>({ value: 0, vel: 0 });
  const intro = useRef(state.current.reduce ? 1 : 0);
  const boost = useRef(0);
  const clock = useRef(0);
  const lastStep = useRef(state.current.step);
  // Al tomar el arrastre, parte del giro que tenía (sin saltos ni cortar el latigazo)
  const dragBase = useRef<number | null>(null);

  useFrame((_, rawDt) => {
    const g = root.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 30);
    const st = state.current;
    const target = POSES[st.step];

    if (st.step !== lastStep.current) {
      // Latigazo: el cambio de paso empuja el giro en el mismo sentido en que gira la S (y en
      // proporción), con tope: varios pasos seguidos no se acumulan en una vuelta de más
      if (!st.reduce) {
        const kick = 4.5 * (target.turn - POSES[lastStep.current].turn);
        yaw.current.vel = THREE.MathUtils.clamp(yaw.current.vel + kick, -4, 4);
        boost.current = 1;
      }
      lastStep.current = st.step;
    }

    if (st.reduce) {
      turn.current.value = target.turn;
      tilt.current.value = target.tilt;
      yaw.current.value = 0;
      intro.current = 1;
    } else {
      spring(turn.current, target.turn, 30, 0.6, dt);
      spring(tilt.current, target.tilt, 30, 0.7, dt);
      if (st.drag.active) {
        if (dragBase.current === null) dragBase.current = yaw.current.value - st.drag.dx * 0.012;
        yaw.current.value = THREE.MathUtils.clamp(dragBase.current + st.drag.dx * 0.012, -2.6, 2.6);
        yaw.current.vel = st.drag.vx * 0.012;
      } else {
        dragBase.current = null;
        spring(yaw.current, 0, 20, 0.5, dt);
      }
      intro.current = Math.min(1, intro.current + dt / 1.5);
    }
    boost.current = Math.max(0, boost.current - dt * 1.6);
    clock.current += dt;

    const e = easeOut(intro.current);
    const sway = st.reduce ? 0 : Math.sin(clock.current * 0.5) * 0.08;
    g.rotation.set(0.12 + tilt.current.value, -0.42 + turn.current.value + yaw.current.value + sway - (1 - e) * 1.5, 0);
    g.position.y = st.reduce ? 0 : Math.sin(clock.current * 0.9) * 0.04;
    g.scale.setScalar(0.84 + 0.16 * e);
  });

  return (
    <>
      <group ref={root}>
        {RIBBONS.map((r, i) => (
          <Ribbon key={r.key} index={i} state={state} intro={intro} />
        ))}
      </group>
      <Orbit state={state} boost={boost} />
    </>
  );
}

// Antes de mostrarse, compila los materiales sin trabar (compileAsync usa la compilación en
// paralelo del navegador cuando existe) y dibuja un cuadro: así el primer cuadro visible, en
// pleno scroll, no paga la compilación
function Warmup({ onReady }: { onReady: MutableRefObject<(() => void) | undefined> }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (cancelled) return;
      gl.render(scene, camera);
      onReady.current?.();
    };
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onReady]);
  return null;
}

// Encuadre: entra la S abierta (alto) y la órbita (ancho), con margen
function Fit() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const t = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    const aspect = size.width / Math.max(1, size.height);
    const byHeight = (3.2 * 1.48) / 2 / t;
    const byWidth = (2.25 * 2 * 1.2) / 2 / (t * aspect);
    cam.position.set(0, 0, Math.max(byHeight, byWidth));
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

export default function StepsIsotype({
  step,
  reduce,
  onReady,
}: {
  step: number;
  reduce: boolean;
  onReady?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef<Shared>({ step, reduce, changedAt: 0, drag: { active: false, dx: 0, vx: 0 } });
  const ready = useRef(onReady);
  useEffect(() => {
    ready.current = onReady;
  }, [onReady]);
  const invalidate = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(false);
  const drag = useRef({ id: -1, x: 0, y: 0, lastX: 0, lastT: 0 });

  useEffect(() => {
    state.current.step = step;
    state.current.changedAt = performance.now();
    invalidate.current();
  }, [step]);

  useEffect(() => {
    state.current.reduce = reduce;
    invalidate.current();
  }, [reduce]);

  // Solo dibuja con el panel a la vista
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Girar con el dedo en horizontal; al soltar, el resorte hereda la velocidad. Tocar la S o
  // deslizar en vertical (scroll) no la toca: el arrastre recién toma el control cuando el gesto
  // ya es claramente horizontal, y parte del giro que tenía (sin saltos ni cortar el latigazo)
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (state.current.drag.active || reduce) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, lastX: e.clientX, lastT: e.timeStamp };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== drag.current.id) return;
    const d = state.current.drag;
    if (!d.active) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        drag.current.id = -1; // es scroll
        return;
      }
      if (Math.abs(dx) < 8) return;
      state.current.drag = { active: true, dx: 0, vx: 0 };
      drag.current.x = e.clientX;
      drag.current.lastX = e.clientX;
      drag.current.lastT = e.timeStamp;
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    const dt = Math.max(1, e.timeStamp - drag.current.lastT) / 1000;
    d.vx = d.vx * 0.6 + ((e.clientX - drag.current.lastX) / dt) * 0.4;
    d.dx = e.clientX - drag.current.x;
    drag.current.lastX = e.clientX;
    drag.current.lastT = e.timeStamp;
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== drag.current.id) return;
    drag.current.id = -1;
    if (!state.current.drag.active) return;
    if (e.timeStamp - drag.current.lastT > 80) state.current.drag.vx = 0;
    state.current.drag.active = false;
  };

  return (
    <div
      ref={wrap}
      className="absolute inset-0 touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={!visible ? "never" : reduce ? "demand" : "always"}
        camera={{ fov: FOV, position: [0, 0, 10], near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, invalidate: inv }) => {
          invalidate.current = () => inv();
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 0.95;
        }}
        style={{ background: "transparent" }}
      >
        <Fit />
        <StudioEnvironment />
        <ambientLight intensity={0.14} />
        <directionalLight position={[-4, 5, 6]} intensity={0.75} />
        <directionalLight position={[5, -1, 2]} intensity={0.38} color="#7fb2ff" />
        <pointLight position={[3, -2, -3]} intensity={22} color="#1fdcff" distance={14} />
        <Rig state={state} />
        <Warmup onReady={ready} />
      </Canvas>
    </div>
  );
}
