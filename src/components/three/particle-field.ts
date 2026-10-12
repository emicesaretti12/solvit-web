/*
  Partículas del isotipo, en la GPU: miles de puntos muestreados sobre la superficie de las tres
  cintas. Todo lo que hacen sale del vertex shader con uniforms; en JS no se toca ningún arreglo
  por cuadro (las posiciones se calculan una vez, al montar).

  - Armado: al cargar vienen desde una nube y se arman formando la S en ~1,4 s (ease-out), en
    el orden de la diagonal; la S sólida aparece sobre ellas con el mismo barrido.
  - Reposo: casi todas quedan apenas por dentro de la cara (la pieza sólida las tapa: la S se ve
    limpia) y derivan con ruido simplex suave; unas pocas, sueltas, flotan alrededor como polvo.
  - Puntero (escritorio): cerca del cursor se levantan de la superficie y se apartan mientras se
    mueve; quieto, vuelven solas.
  - Toque: una onda sale del centro de la S y las saca de la superficie, hacia afuera.
  - Zambullida: se estiran y pasan al costado de la cámara como un flujo de datos (warp). La
    estela se dibuja dentro del sprite del punto, orientada según su velocidad en pantalla.
  - Crecer: la mitad sube por la S en ciclos que nacen y se apagan.
  - Llegada desde el fondo (escritorio): se dispersan en la nube y se vuelven a juntar.

  Colores: en el tema claro, azules de marca con mezcla normal (la aditiva en blanco no se ve);
  en el oscuro, más luminosas y con un halo corto. Los colores van en sRGB, tal cual al canvas.
*/
import * as THREE from "three";
import { SIMPLEX_3D } from "./glsl";
import { diagonal } from "./ribbon-geometry";

type U<T> = { value: T };

export type ParticleUniforms = {
  /** Reloj (s); quieto con reduced motion */
  uTime: U<number>;
  /** Armado inicial: 0 nube → 1 S armada (lineal; cada partícula tiene su curva) */
  uIntro: U<number>;
  /** Dispersión hacia la nube (la S llega desde el fondo) */
  uScatter: U<number>;
  /** Zambullida: 0 quietas → 1 flujo completo hacia la cámara */
  uWarp: U<number>;
  /** Crecer: flujo hacia arriba */
  uRise: U<number>;
  /** Toque: (segundos desde el toque, fuerza 0..1) */
  uPulse: U<THREE.Vector2>;
  /** Centro de la S en espacio de cámara y su escala (para la onda del toque) */
  uCenter: U<THREE.Vector3>;
  uScale: U<number>;
  /** Puntero en NDC (x, y) y fuerza (z) */
  uPointer: U<THREE.Vector3>;
  /** 0 claro, 1 oscuro */
  uDark: U<number>;
  /** Tamaño base en px CSS, densidad de píxeles y tope del sprite en px del dispositivo */
  uSize: U<number>;
  uPixel: U<number>;
  uMaxSize: U<number>;
  /** Canvas en px del dispositivo */
  uViewport: U<THREE.Vector2>;
  /** Distancia de la cámara al plano de la S (referencia del tamaño) */
  uFocal: U<number>;
};

export function createParticleUniforms(): ParticleUniforms {
  return {
    uTime: { value: 0 },
    uIntro: { value: 1 },
    uScatter: { value: 0 },
    uWarp: { value: 0 },
    uRise: { value: 0 },
    uPulse: { value: new THREE.Vector2(0, 0) },
    uCenter: { value: new THREE.Vector3() },
    uScale: { value: 1 },
    uPointer: { value: new THREE.Vector3(0, 0, 0) },
    uDark: { value: 0 },
    uSize: { value: 2.4 },
    uPixel: { value: 1 },
    uMaxSize: { value: 48 },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uFocal: { value: 15 },
  };
}

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uScatter;
uniform float uWarp;
uniform float uRise;
uniform vec2 uPulse;
uniform vec3 uCenter;
uniform float uScale;
uniform vec3 uPointer;
uniform float uDark;
uniform float uSize;
uniform float uPixel;
uniform float uMaxSize;
uniform vec2 uViewport;
uniform float uFocal;
uniform float uLit;

attribute vec3 aCloud;
attribute vec4 aSeed;
attribute float aDiag;

varying vec3 vColor;
varying float vAlpha;
varying vec3 vStreak;
varying float vCore;

${SIMPLEX_3D}

void main() {
  // Armado: cada partícula sale de la nube con un retraso según su lugar en la diagonal (abajo a
  // la izquierda primero, como el barrido de la S sólida) y llega con ease-out cúbica, girando
  float delay = aDiag * 0.42 + aSeed.x * 0.14;
  float k = clamp((uIntro - delay) / 0.44, 0.0, 1.0);
  float form = (1.0 - pow(1.0 - k, 3.0)) * (1.0 - uScatter * (0.7 + 0.3 * aSeed.x));
  float swirl = (1.0 - form) * (0.8 + 0.9 * aSeed.y);
  float cs = cos(swirl);
  float sn = sin(swirl);
  vec3 p = mix(aCloud, position, form);
  p.xz = mat2(cs, -sn, sn, cs) * p.xz;

  // Reposo: deriva lenta con ruido simplex (las de la superficie apenas, sin asomar; el polvo más)
  vec3 q = position * 1.15 + vec3(0.0, uTime * 0.05, uTime * 0.13);
  float amp = mix(0.018, 0.085, aSeed.w);
  p += vec3(snoise(q), snoise(q + vec3(17.3, 0.0, 0.0)), snoise(q + vec3(0.0, 0.0, 31.7))) * amp * form;

  // Crecer: la mitad sube por la S en ciclos que nacen y se apagan
  float riser = uRise * step(0.5, aSeed.z);
  float lift = fract(aSeed.x * 3.71 + uTime * (0.08 + 0.1 * aSeed.y));
  p.y += riser * lift * 0.9;
  float alpha = mix(1.0, smoothstep(0.0, 0.15, lift) * (1.0 - smoothstep(0.6, 1.0, lift)), riser);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.05);
  float tanHalf = 1.0 / projectionMatrix[1][1];

  // Toque: una onda sale del centro de la S y saca las partículas de la superficie, hacia afuera
  // y hacia la cámara
  vec3 fromC = mv.xyz - uCenter;
  float dC = length(fromC) / max(uScale, 0.001);
  float wave = exp(-pow((dC - uPulse.x * 3.2) * 2.6, 2.0)) * uPulse.y;
  mv.xyz += (normalize(fromC + vec3(1e-4)) * 0.22 + vec3(0.0, 0.0, 0.3)) * wave * uScale;

  // Puntero: se apartan del cursor en la pantalla (el empujón se mide en NDC y se pasa a la vista)
  vec4 clip = projectionMatrix * mv;
  vec2 dd = clip.xy / clip.w - uPointer.xy;
  dd.x *= uViewport.x / uViewport.y;
  float push = uPointer.z * (1.0 - smoothstep(0.0, 0.32, length(dd)));
  mv.xy += normalize(dd + vec2(1e-4)) * push * 0.11 * depth * tanHalf;
  mv.z += push * 0.32 * uScale;

  // Zambullida: cada una viaja hacia la cámara y se abre hacia el costado (pasa al lado, nunca a
  // través), en ciclos; al reiniciar el ciclo está apagada, así no se ve el salto
  float lane = fract(aSeed.y * 5.31 + uTime * (0.3 + 0.45 * aSeed.z));
  vec2 radial = normalize(mv.xy + (aSeed.xz - 0.5) * 0.08);
  vec3 vel = vec3(radial * 0.62, 1.0);
  mv.xyz += vel * (uWarp * lane * depth * 0.85);
  float laneFade = smoothstep(0.0, 0.18, lane) * (1.0 - smoothstep(0.72, 1.0, lane));
  depth = max(-mv.z, 0.05);

  // Estela: dónde estaba hace un instante. En pantalla se alarga cuanto más cerca pasa
  vec3 tail = mv.xyz - vel * (uWarp * depth * 0.3);
  vec4 c0 = projectionMatrix * mv;
  vec4 c1 = projectionMatrix * vec4(tail, 1.0);
  vec2 px = (c0.xy / c0.w - c1.xy / c1.w) * 0.5 * uViewport;
  float len = length(px);

  // Tamaño en px del dispositivo: fijo en pantalla en el plano de la S, crece al acercarse
  float base = uSize * uPixel * mix(0.6, 1.4, aSeed.z) * (uFocal / depth);
  base *= mix(1.7, 1.0, form) * mix(1.0, 0.8, aSeed.w);
  float halo = 1.0 + 0.8 * uDark;
  float size = clamp(base * halo + len, 1.0, uMaxSize);
  float streak = max(0.0, size - base * halo);
  gl_PointSize = size;
  // El sprite va centrado entre la cabeza y la cola de la estela
  gl_Position = projectionMatrix * vec4(mix(mv.xyz, tail, 0.5 * min(1.0, streak / max(len, 1e-3))), 1.0);

  vec2 dir = len > 0.5 ? px / len : vec2(1.0, 0.0);
  vStreak = vec3(dir.x, -dir.y, 0.5 * streak / size);
  vCore = 0.5 * min(base, size) / size;

  // Color: azules de marca en la diagonal; en claro, algunas más profundas para dar volumen
  vec3 lightCol = mix(vec3(0.0, 0.3, 0.93), vec3(0.0, 0.58, 0.9), aDiag);
  lightCol = mix(lightCol, vec3(0.03, 0.1, 0.32), step(0.86, aSeed.y) * 0.65);
  vec3 darkCol = mix(vec3(0.3, 0.58, 1.0), vec3(0.52, 0.93, 1.0), aDiag);
  vColor = mix(lightCol, darkCol, uDark);

  // Opacidad: plenas en vuelo, discretas asentadas; el flujo y la onda las encienden
  float rest = mix(0.45, 0.62, uDark);
  float a = mix(0.95, rest, form) * alpha;
  a = mix(a, 0.95, uWarp * 0.7) * mix(1.0, laneFade, uWarp);
  a += wave * 0.35;
  a *= 0.3 + 0.7 * uLit;
  // Al empezar el armado aparecen de a poco, no todas en el mismo cuadro
  a *= clamp(uIntro * 5.0 - aSeed.x, 0.0, 1.0);
  vAlpha = clamp(a, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform float uDark;

varying vec3 vColor;
varying float vAlpha;
varying vec3 vStreak;
varying float vCore;

void main() {
  // Distancia al segmento de la estela (sin estela, al centro): un punto redondo o una raya
  vec2 c = gl_PointCoord - 0.5;
  float h = vStreak.z;
  float along = clamp(dot(c, vStreak.xy), -h, h);
  float d = length(c - vStreak.xy * along);
  float r = vCore;
  float core = 1.0 - smoothstep(r * 0.55, r, d);
  // Halo corto solo en oscuro (el sprite es más grande para que no se corte en el borde)
  float glow = 1.0 - smoothstep(r * 0.5, min(r * 1.8, 0.5), d);
  float a = max(core, glow * glow * 0.3 * uDark);
  // La cola de la estela se apaga
  if (h > 0.0) a *= mix(0.15, 1.0, along / h * 0.5 + 0.5);
  a *= vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

export function createParticleMaterial(shared: ParticleUniforms) {
  return new THREE.ShaderMaterial({
    uniforms: { ...shared, uLit: { value: 1 } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
  });
}

// Parte de las partículas que flota suelta alrededor de la S (el resto vive en la superficie)
const DUST = 0.16;

// Generador pseudoaleatorio con semilla (mulberry32): la misma nube en cada carga
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Muestrea `count` partículas sobre la superficie de una cinta (en el espacio local de la cinta,
 * el mismo de su geometría). Los triángulos se eligen según su área; la cara de atrás pesa menos
 * porque casi nunca se ve. `center` y `z` ubican la cinta dentro de la S (para la diagonal y la
 * nube de partida, que se arma en el espacio de la S). `cloud` escala la nube.
 */
export function sampleRibbonParticles(
  surface: THREE.BufferGeometry,
  center: THREE.Vector2,
  z: number,
  count: number,
  seed: number,
  cloud = 1,
) {
  const rand = random(seed);
  const pos = surface.attributes.position;
  const index = surface.index;
  const triCount = (index ? index.count : pos.count) / 3;
  const vert = (t: number, k: number) => (index ? index.getX(t * 3 + k) : t * 3 + k);

  // Áreas acumuladas de los triángulos (con su normal hacia afuera, como computeVertexNormals)
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const normals = new Float32Array(triCount * 3);
  const cdf = new Float32Array(triCount);
  let total = 0;
  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, vert(t, 0));
    b.fromBufferAttribute(pos, vert(t, 1));
    c.fromBufferAttribute(pos, vert(t, 2));
    cb.subVectors(c, b);
    ab.subVectors(a, b);
    cb.cross(ab);
    const area = cb.length() / 2;
    cb.normalize();
    normals.set([cb.x, cb.y, cb.z], t * 3);
    total += area * (cb.z < -0.5 ? 0.45 : 1);
    cdf[t] = total;
  }

  const position = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);
  const diag = new Float32Array(count);
  const n = new THREE.Vector3();
  const jitter = new THREE.Vector3();
  const p = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    // Triángulo según el área (búsqueda binaria en la acumulada)
    const r = rand() * total;
    let lo = 0;
    let hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    a.fromBufferAttribute(pos, vert(lo, 0));
    b.fromBufferAttribute(pos, vert(lo, 1));
    c.fromBufferAttribute(pos, vert(lo, 2));
    // Punto uniforme dentro del triángulo
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    p.copy(a).addScaledVector(b.sub(a), u).addScaledVector(c.sub(a), v);
    n.fromArray(normals, lo * 3);

    // Casi todas quedan apenas por dentro de la cara: arman la S y, cuando aparece la pieza
    // sólida, quedan tapadas por ella (salen a la vista solo si algo las saca: la onda, el
    // puntero, la zambullida). El resto es polvo suelto alrededor
    const dust = rand() < DUST;
    if (dust) {
      jitter.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).multiplyScalar(0.9);
      n.add(jitter).normalize();
      p.addScaledVector(n, 0.14 + 0.6 * Math.pow(rand(), 1.6));
    } else {
      p.addScaledVector(n, -0.03 - 0.025 * rand());
    }
    position.set([p.x, p.y, p.z], i * 3);
    diag[i] = diagonal(p.x + center.x, p.y + center.y);

    // Nube de partida, en el espacio de la S: un volumen achatado alrededor, cargado hacia la
    // cámara (vienen de adelante y se meten en la S)
    const th = rand() * Math.PI * 2;
    const ct = rand() * 2 - 1;
    const st = Math.sqrt(1 - ct * ct);
    const rr = (1.2 + 1.5 * Math.cbrt(rand())) * cloud;
    start.set(
      [st * Math.cos(th) * rr * 0.75 - center.x, st * Math.sin(th) * rr * 0.9 - center.y, ct * rr * 0.7 + 0.5 * cloud - z],
      i * 3,
    );

    seeds.set([rand(), rand(), rand(), dust ? 1 : 0], i * 4);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aCloud", new THREE.BufferAttribute(start, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  geometry.setAttribute("aDiag", new THREE.BufferAttribute(diag, 1));
  return geometry;
}
