"use client";

/*
  Isotipo de SEN en WebGL: las tres cintas de la S extruidas con bisel, material con laca
  (clearcoat) y el degradé de marca en los vértices. Cada cinta es una pieza aparte, así el
  scroll puede separarlas (atraer, atender, cerrar) y volver a armar la S.

  Sobre las cintas viven miles de partículas (particle-field.ts) que se mueven solo en la GPU:
  al cargar llegan desde una nube y arman la S, y la pieza sólida aparece sobre ellas con un
  barrido; en reposo quedan bajo su piel (salen con un toque, el puntero o la zambullida) y unas
  pocas flotan alrededor; en la zambullida se estiran y pasan al costado de la cámara como un
  flujo de datos. Detrás, la sombra suave de la pieza sobre el fondo (backdrop-shadow.ts), que en
  el tema claro es la que la apoya en el espacio.

  La pose llega en un objeto mutable (IsoPose) que se anima desde afuera sin re-renderizar React;
  acá cada cuadro se amortigua hacia esa pose. Las cintas se abren de dos maneras (la pose las
  mezcla con `layers`): en diagonal, las tres etapas de la venta (escritorio), o en capas, una
  vista explotada que conserva la silueta de la S y después se dispersa (celulares). El arrastre (touch o mouse) gira la pieza con un
  resorte que hereda la velocidad del dedo y vuelve a la pose de reposo; un toque corto la hace
  respirar (las cintas se abren y vuelven con un rebote) y lanza una onda por las partículas.

  Orden de cada cuadro (prioridades de useFrame, negativas para no tomar el render): el Rig
  (-2) resuelve la pose, el armado y los uniforms; las cintas y las luces (-1) se acomodan a eso;
  la sombra (0) se proyecta con las cintas ya ubicadas.
*/
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";
import { FOV, fitDistance, stageSignal, type DragState, type IsoPose } from "./pose";
import {
  LAYERS,
  RIBBONS,
  SCATTER,
  SPREAD,
  STAGGER,
  STEP_SPREAD,
  StudioEnvironment,
  smoothstep,
  useRibbonGeometry,
} from "./ribbons";
import { RIBBON_SHARES } from "./ribbon-geometry";
import { createRibbonUniforms, patchRibbonMaterial } from "./ribbon-material";
import { createParticleMaterial, createParticleUniforms, sampleRibbonParticles } from "./particle-field";
import { createShadowMaterial, projectShadow, type ShadowCaster } from "./backdrop-shadow";

// La escena solo existe en el cliente (se importa con ssr: false). En celulares la S del hero se
// comporta como en su primera versión: sin giro de entrada y con las cintas abriéndose juntas
const MOBILE = typeof window !== "undefined" && window.matchMedia("(max-width: 1023.98px)").matches;

// Presupuesto de partículas: ~2400 en celulares y ~7000 en escritorio; con pocos núcleos o poca
// memoria, menos (el vertex shader corre una vez por partícula y por cuadro)
const PARTICLES = (() => {
  if (typeof navigator === "undefined") return 0;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const modest = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return Math.round((MOBILE ? 2400 : 7000) * (modest ? 0.6 : 1));
})();

// Armado (segundos desde el primer cuadro): las partículas llegan en INTRO y la S sólida aparece
// sobre ellas desde REVEAL_FROM, con un barrido de REVEAL que va apenas detrás de las que
// llegan (las de abajo a la izquierda primero)
const INTRO = 1.4;
const REVEAL_FROM = 0.72;
const REVEAL = 0.8;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const { lerp, damp, clamp } = THREE.MathUtils;

// Canto y filo del barrido: claro (fondo blanco) y oscuro. En espacio lineal (van a la luz)
const RIM = { light: new THREE.Color("#d8ecff"), dark: new THREE.Color("#1fdcff") };
const EDGE = { light: new THREE.Color("#3cbcff"), dark: new THREE.Color("#1fdcff") };
// Sombra: el navy de las sombras del tema claro y el del fondo oscuro (sRGB, salen tal cual)
const SHADOW_COLOR = { light: new THREE.Color(0.16, 0.22, 0.36), dark: new THREE.Color(0, 0.016, 0.05) };

// Luz de la sombra (de la pieza hacia la luz, arriba a la izquierda, como la luz principal) y
// distancia del fondo. En celulares, más frontal: la sombra no baja hasta el texto
const SHADOW = MOBILE
  ? { light: new THREE.Vector3(-0.14, 0.3, 1), back: 0.8, blur: { base: 0.07, perUnit: 0.2 } }
  : { light: new THREE.Vector3(-0.26, 0.5, 1), back: 0.95, blur: { base: 0.06, perUnit: 0.22 } };

/*
  Estado del cuadro (fuera de React, como la pose del escenario): el Rig lo resuelve y lo leen
  las cintas, las luces y la sombra. Hay un solo escenario por página, así que vive en el módulo.
*/
const fx = {
  /** 0 claro, 1 oscuro */
  dark: 0,
  /** Aparición de la S sólida (0..1) */
  reveal: 1,
  /** Profundidad y escala amortiguadas de la pieza */
  z: 0,
  scale: 1,
  /** Rebote de las cintas después de un toque (se suma a la apertura) */
  kick: { value: 0, vel: 0 },
};
// Uniforms compartidos: los de las partículas (las tres cintas usan los mismos) y los de la laca
const particleUniforms = createParticleUniforms();
const ribbonUniforms = createRibbonUniforms();
// Caras que proyectan sombra (cada cinta registra la suya al montar)
const casters: (ShadowCaster | null)[] = [null, null, null];

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
  const { geometry, center, corners } = useRibbonGeometry(ribbon.points, ribbon.from, ribbon.to, ribbon.depth);
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.3,
      metalness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.36,
      emissive: new THREE.Color("#1f6bff"),
      emissiveIntensity: 0,
    });
    patchRibbonMaterial(m, ribbonUniforms);
    return m;
  }, []);
  // Partículas de esta cinta, en su espacio local: la acompañan cuando se abre o se adelanta
  const dots = useMemo(() => {
    const count = Math.round(PARTICLES * RIBBON_SHARES[index]);
    if (!count) return null;
    return {
      geometry: sampleRibbonParticles(geometry, center, ribbon.z, count, 101 + index * 7919, MOBILE ? 0.8 : 1),
      material: createParticleMaterial(particleUniforms),
    };
  }, [geometry, center, ribbon.z, index]);
  const ref = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const cloud = useRef<THREE.Points>(null);
  // Arranca en la pose que ya calculó el escenario (sin viaje inicial desde el centro)
  const spread = useRef(pose.current.spread);
  const lit = useRef(pose.current.focus < 0 || pose.current.focus === index ? 1 : 0);
  const glow = useRef(0);
  const pop = useRef(pose.current.focus === index ? 1 : 0);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(
    () => () => {
      dots?.geometry.dispose();
      dots?.material.dispose();
    },
    [dots],
  );
  // La sombra proyecta la cara de esta cinta con su matriz de mundo
  useEffect(() => {
    if (ref.current) casters[index] = { object: ref.current, corners };
    return () => {
      casters[index] = null;
    };
  }, [corners, index]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = pose.current;
    spread.current = reduce ? p.spread : damp(spread.current, p.spread, 6, dt);
    const raw = spread.current;
    const [lo, hi] = STAGGER[index];
    const staged = MOBILE || raw >= STEP_SPREAD ? raw : STEP_SPREAD * smoothstep(lo, hi, raw / STEP_SPREAD);
    // El rebote del toque abre las tres por igual (sin el escalonado)
    const s = Math.max(0, staged + fx.kick.value);
    // En diagonal (escritorio) la apertura sigue derecho; en capas (celulares) hasta 1 se separan
    // conservando la silueta y, pasado 1, se dispersan hacia los bordes (la zambullida)
    const L = p.layers;
    const s1 = Math.min(1, s);
    const s2 = s - s1;
    const [offset, rz, ry] = SPREAD[index];
    const [layer, lrz, lry] = LAYERS[index];
    const [scatter, crz, cry] = SCATTER[index];
    const along = (d: number, l: number, c: number) => lerp(d * s, l * s1 + c * s2, L);
    // La cinta del paso activo se adelanta hacia la cámara: en un celular, donde la S es chica,
    // se lee qué parte trabaja aunque el brillo no alcance
    pop.current = reduce ? (p.focus === index ? 1 : 0) : damp(pop.current, p.focus === index ? 1 : 0, 7, dt);
    g.position.set(
      center.x + along(offset.x, layer.x, scatter.x),
      center.y + along(offset.y, layer.y, scatter.y),
      ribbon.z + along(offset.z, layer.z, scatter.z) + pop.current * 0.45,
    );
    g.rotation.set(0, along(ry, lry, cry), along(rz, lrz, crz));
    g.scale.setScalar(1 + pop.current * 0.05);

    // Con una cinta destacada, las otras bajan la luz; con focus -2 (crecer) brillan las tres. En
    // fondo blanco bajan menos (muy oscuras pesan); sus partículas se apagan igual
    const on = p.focus < 0 || p.focus === index ? 1 : 0;
    lit.current = reduce ? on : damp(lit.current, on, 8, dt);
    const glowTarget = p.focus === index ? 0.18 : p.focus === -2 ? 0.16 * (1 - s / STEP_SPREAD) : 0;
    glow.current = reduce ? glowTarget : damp(glow.current, glowTarget, 6, dt);
    const laca = body.current?.material as THREE.MeshPhysicalMaterial | undefined;
    if (laca) {
      laca.color.setScalar(lerp(lerp(0.62, 0.32, fx.dark), 1, lit.current));
      laca.emissiveIntensity = glow.current;
      // Más reflejo de estudio en claro: la laca se lee por sus brillos sobre el blanco
      laca.envMapIntensity = lerp(0.36, 0.3, fx.dark);
    }
    const dotsMaterial = cloud.current?.material as THREE.ShaderMaterial | undefined;
    if (dotsMaterial) dotsMaterial.uniforms.uLit.value = lit.current;
  }, -1);

  return (
    <group ref={ref}>
      <mesh ref={body} geometry={geometry} material={material} />
      {/* Los puntos se desplazan en el shader: el volumen de la geometría no sirve para recortar */}
      {dots && (
        <points ref={cloud} geometry={dots.geometry} material={dots.material} frustumCulled={false} renderOrder={1} />
      )}
    </group>
  );
}

function Rig({
  pose,
  drag,
  pointer,
  reduce,
  dark,
}: {
  pose: MutableRefObject<IsoPose>;
  drag: MutableRefObject<DragState>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  reduce: boolean;
  dark: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const yaw = useRef({ value: 0, vel: 0 });
  const pitch = useRef({ value: 0, vel: 0 });
  const look = useRef({ x: 0, y: 0 });
  const start = pose.current;
  const damped = useRef({ turn: start.turn, tilt: start.tilt, x: start.x, y: start.y, z: start.z, scale: start.scale });
  const clock = useRef(0);
  const lastZ = useRef(start.z);
  // Armado: segundos desde el primer cuadro. Si la página abrió más abajo, el primer cuadro llega
  // tarde y la S aparece ya armada (sin nube ni barrido)
  const intro = useRef(0);
  const mountedAt = useRef(0);
  const introChecked = useRef(false);
  // Toques ya atendidos y tiempo desde el último (la onda de las partículas)
  const touch = useRef({ taps: drag.current.taps, since: 10 });
  // Puntero: última posición y fuerza del empujón (sube al moverse, se apaga quieto)
  const aim = useRef({ x: 0, y: 0, on: 0 });
  const rise = useRef(0);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
  const camera = useThree((state) => state.camera);

  useFrame((state, rawDt) => {
    const g = root.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 30);
    if (!reduce) clock.current += dt;
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
    spring(yaw.current, d.active ? clamp(d.dx * 0.009, -2.4, 2.4) : null, d.vx * 0.009);
    spring(pitch.current, d.active ? clamp(d.dy * 0.005, -0.6, 0.6) : null, d.vy * 0.005);

    // Toque corto: las cintas respiran (resorte más vivo, amortiguación ~0,4) y sale una onda
    const tc = touch.current;
    if (d.taps !== tc.taps) {
      tc.taps = d.taps;
      if (!reduce) {
        fx.kick.vel += 2.6;
        tc.since = 0;
      }
    }
    tc.since += dt;
    const kick = fx.kick;
    kick.vel += (-70 * kick.value - 2 * Math.sqrt(70) * 0.42 * kick.vel) * dt;
    kick.value += kick.vel * dt;

    // Paralaje con el mouse (puntero fino) y una oscilación lenta
    const pc = pointer.current;
    look.current.x = damp(look.current.x, pc.x, 3, dt);
    look.current.y = damp(look.current.y, pc.y, 3, dt);
    const sway = reduce ? 0 : Math.sin(clock.current * 0.45) * 0.12;
    const bob = reduce ? 0 : Math.sin(clock.current * 0.9) * 0.05;
    const a = aim.current;
    const speed = Math.hypot(pc.x - a.x, pc.y - a.y) / Math.max(dt, 1e-3);
    a.x = pc.x;
    a.y = pc.y;
    const want = Math.min(1, speed * 0.5);
    a.on = damp(a.on, want, want > a.on ? 10 : 1.8, dt);

    // Armado: nube → S en INTRO; la pieza sólida aparece con el barrido. El giro de entrada es
    // solo de escritorio
    if (!introChecked.current) {
      introChecked.current = true;
      if (reduce || performance.now() - mountedAt.current > 1200) intro.current = 10;
    }
    if (!reduce) intro.current += dt;
    const t = intro.current;
    const enter = MOBILE ? 1 : easeOut(Math.min(1, t / 1.5));
    fx.reveal = clamp((t - REVEAL_FROM) / REVEAL, 0, 1);

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
    k.turn = damp(k.turn, p.turn, 5, dt);
    k.tilt = damp(k.tilt, p.tilt, 5, dt);
    k.x = damp(k.x, p.x, 5, dt);
    k.y = damp(k.y, p.y, 5, dt);
    k.z = damp(k.z, p.z, 4, dt);
    k.scale = damp(k.scale, p.scale, 5, dt);

    // x/y llegan en fracción de pantalla: se pasan a unidades según el encuadre actual. Detrás
    // del plano de la pantalla (z < 0) se compensa la perspectiva, así la S queda en el lugar
    // pedido aunque venga desde el fondo (si no, se corre hacia el centro y pisa el texto)
    const cam = camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const halfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const halfW = halfH * (width / Math.max(1, height));
    const depth = k.z < 0 ? 1 - k.z : 1;

    // Pose de reposo levemente girada, para que se lea el canto desde el primer cuadro
    g.rotation.set(
      0.14 + k.tilt + pitch.current.value + look.current.y * 0.18,
      -0.42 + k.turn + yaw.current.value + sway + look.current.x * 0.3 - (1 - enter) * 1.1,
      0,
    );
    g.position.set(k.x * halfW * depth, k.y * halfH * depth + bob, k.z * cam.position.z);
    fx.z = k.z;
    fx.scale = k.scale * (0.82 + 0.18 * enter);
    g.scale.setScalar(fx.scale);

    // Tema: cambia en el mismo cuadro que la página (el cambio de tema ya tiene su transición)
    fx.dark = dark ? 1 : 0;
    state.gl.toneMappingExposure = lerp(0.94, 0.92, fx.dark);

    // Uniforms de las partículas
    const dpr = state.viewport.dpr;
    const u = particleUniforms;
    const warp = reduce ? 0 : smoothstep(0.14, 0.78, k.z);
    rise.current = reduce ? 0 : damp(rise.current, p.focus === -2 ? 1 : 0, 2.5, dt);
    u.uTime.value = clock.current;
    u.uIntro.value = Math.min(1, t / INTRO);
    u.uScatter.value = reduce ? 0 : smoothstep(-0.12, -0.55, k.z);
    u.uWarp.value = warp;
    u.uRise.value = rise.current;
    u.uPulse.value.set(tc.since, Math.max(0, 1 - tc.since / 1.3));
    u.uCenter.value.set(g.position.x - cam.position.x, g.position.y - cam.position.y, g.position.z - cam.position.z);
    u.uScale.value = fx.scale;
    u.uPointer.value.set(pc.x, -pc.y, MOBILE || reduce ? 0 : a.on * (1 - warp));
    u.uDark.value = fx.dark;
    u.uSize.value = 2.6;
    u.uPixel.value = dpr;
    u.uMaxSize.value = (MOBILE ? 22 : 40) * dpr;
    u.uViewport.value.set(width * dpr, height * dpr);
    u.uFocal.value = cam.position.z;

    // Uniforms de las cintas
    ribbonUniforms.uReveal.value = fx.reveal;
    ribbonUniforms.uRim.value = lerp(0.14, 0.24, fx.dark);
    ribbonUniforms.uRimColor.value.copy(RIM.light).lerp(RIM.dark, fx.dark);
    ribbonUniforms.uEdgeColor.value.copy(EDGE.light).lerp(EDGE.dark, fx.dark);
  }, -2);

  return (
    <>
      <group ref={root}>
        {RIBBONS.map((r, i) => (
          <Ribbon key={r.key} index={i} pose={pose} ribbon={r} reduce={reduce} />
        ))}
      </group>
      <BackdropShadow root={root} />
    </>
  );
}

// Sombra de la pieza sobre el fondo, proyectada con las cintas ya ubicadas en este cuadro
function BackdropShadow({ root }: { root: MutableRefObject<THREE.Group | null> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createShadowMaterial(), []);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const m = mesh.current;
    const g = root.current;
    if (!m || !g) return;
    const shade = m.material as THREE.ShaderMaterial;
    // Se apaga cuando la pieza se acerca a la cámara (zambullida) o se va al fondo. En el armado
    // llega cuando la pieza sólida ya casi está (una sombra sin objeto se lee como un error)
    const fade = (1 - smoothstep(0.06, 0.42, fx.z)) * (1 - smoothstep(-0.1, -0.5, fx.z));
    const opacity = lerp(0.3, 0.5, fx.dark) * smoothstep(0.35, 1, fx.reveal) * fade;
    m.visible = opacity > 0.003 && casters.every(Boolean);
    if (!m.visible) return;
    g.updateMatrixWorld(true);
    projectShadow(m, shade, casters as ShadowCaster[], SHADOW.light, g.position.z - SHADOW.back * fx.scale, SHADOW.blur);
    shade.uniforms.uOpacity.value = opacity;
    (shade.uniforms.uColor.value as THREE.Color).copy(SHADOW_COLOR.light).lerp(SHADOW_COLOR.dark, fx.dark);
  });

  return (
    <mesh ref={mesh} material={material} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

// Luces de estudio: una principal arriba a la izquierda (la misma de la sombra), un relleno frío,
// un contraluz desde arriba que dibuja los biseles y el cian de marca por detrás. En claro, más
// luz y menos cian (sobre blanco el contraluz cian se lee como glow); en oscuro, al revés. En
// celulares no va el contraluz de arriba: la S es chica y cada luz encarece la laca
function Lights() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const top = useRef<THREE.DirectionalLight>(null);
  const back = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const d = fx.dark;
    if (ambient.current) ambient.current.intensity = lerp(0.15, 0.12, d);
    if (key.current) key.current.intensity = lerp(0.82, 0.72, d);
    if (fill.current) fill.current.intensity = lerp(0.3, 0.35, d);
    if (top.current) top.current.intensity = lerp(0.8, 0.45, d);
    if (back.current) back.current.intensity = lerp(12, 22, d);
  }, -1);
  return (
    <>
      <ambientLight ref={ambient} intensity={0.15} />
      <directionalLight ref={key} position={[-3, 5, 8]} intensity={0.82} />
      <directionalLight ref={fill} position={[5, -1, 2]} intensity={0.3} color="#7fb2ff" />
      {!MOBILE && <directionalLight ref={top} position={[1.5, 6, -5]} intensity={0.8} />}
      <pointLight ref={back} position={[3, -2, -3]} intensity={12} color="#1fdcff" distance={14} />
    </>
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

// Si el equipo no llega (dos segundos seguidos por debajo de ~48 cuadros), baja la densidad de
// píxeles de a un cuarto hasta 1. Nunca la vuelve a subir: así no oscila
function AdaptiveDpr({ enabled }: { enabled: boolean }) {
  const setDpr = useThree((state) => state.setDpr);
  const meter = useRef({ time: 0, frames: 0, slow: 0, dpr: 0 });
  useFrame((state, dt) => {
    if (!enabled) return;
    const m = meter.current;
    if (!m.dpr) m.dpr = state.viewport.dpr;
    // Un salto largo es una pausa (pestaña oculta, loop detenido), no un cuadro lento
    if (dt > 0.25) return;
    m.time += dt;
    m.frames += 1;
    if (m.time < 1) return;
    const slow = m.time / m.frames > 1 / 48;
    m.time = 0;
    m.frames = 0;
    m.slow = slow ? m.slow + 1 : 0;
    if (m.slow >= 2 && m.dpr > 1) {
      m.dpr = Math.max(1, m.dpr - 0.25);
      m.slow = 0;
      setDpr(m.dpr);
    }
  });
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
  const dark = useTheme() === "dark";

  // Con reduced motion el loop es "demand": el cambio de tema también pide un cuadro
  useEffect(() => {
    stageSignal.invalidate();
  }, [dark]);

  return (
    <Canvas
      dpr={[1, MOBILE ? 1.5 : 1.75]}
      frameloop={!active ? "never" : reduce ? "demand" : "always"}
      camera={{ fov: FOV, position: [0, 0, 9.5], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
      onCreated={({ gl, invalidate }) => {
        // Con reduced motion solo se dibuja cuando el scroll cambia la pose
        stageSignal.invalidate = () => invalidate();
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 0.94;
        onReady?.();
      }}
      style={{ background: "transparent" }}
    >
      <Fit />
      <AdaptiveDpr enabled={!reduce} />
      <StudioEnvironment />
      <Lights />
      <Rig pose={pose} drag={drag} pointer={pointer} reduce={reduce} dark={dark} />
    </Canvas>
  );
}
