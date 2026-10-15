/*
  Sombra de la S sobre el fondo, sin shadow maps: un plano detrás de la pieza y un shader que
  dibuja, con distancias con signo (SDF), la proyección de la cara de cada cinta según una luz de
  arriba a la izquierda. La penumbra crece con la distancia entre la cinta y el plano, así la
  sombra se ve suave y "de contacto" donde la pieza está cerca y se abre donde está lejos; cuando
  las cintas se separan, cada una deja su propia sombra.

  En el tema claro (fondo blanco) es lo que hace que la S se vea apoyada en el espacio, como una
  foto de producto; en el oscuro es más sutil. Por cuadro, en JS: doce puntos proyectados y el
  rectángulo justo que cubre la sombra (el plano se achica a eso, así el shader corre en pocos
  píxeles).
*/
import * as THREE from "three";

const VERTEX = /* glsl */ `
varying vec2 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xy;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec2 uQuad[12];
uniform vec3 uBlur;
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vWorld;

// Un lado del polígono: distancia mínima y cruce para el signo (sdPolygon de Inigo Quilez)
void sdEdge(vec2 p, vec2 a, vec2 b, inout float d, inout float s) {
  vec2 e = b - a;
  vec2 w = p - a;
  vec2 q = w - e * clamp(dot(w, e) / max(dot(e, e), 1e-6), 0.0, 1.0);
  d = min(d, dot(q, q));
  bvec3 c = bvec3(p.y >= a.y, p.y < b.y, e.x * w.y > e.y * w.x);
  if (all(c) || all(not(c))) s = -s;
}

float sdQuad(vec2 p, vec2 v0, vec2 v1, vec2 v2, vec2 v3) {
  float d = dot(p - v0, p - v0);
  float s = 1.0;
  sdEdge(p, v0, v3, d, s);
  sdEdge(p, v1, v0, d, s);
  sdEdge(p, v2, v1, d, s);
  sdEdge(p, v3, v2, d, s);
  return s * sqrt(d);
}

// Cobertura suave: la sombra plena se achica un poco (umbra) y la penumbra sale hacia afuera
float cover(float d, float blur) {
  return 1.0 - smoothstep(-0.5 * blur, blur, d);
}

void main() {
  float s = cover(sdQuad(vWorld, uQuad[0], uQuad[1], uQuad[2], uQuad[3]), uBlur.x);
  s = max(s, cover(sdQuad(vWorld, uQuad[4], uQuad[5], uQuad[6], uQuad[7]), uBlur.y));
  s = max(s, cover(sdQuad(vWorld, uQuad[8], uQuad[9], uQuad[10], uQuad[11]), uBlur.z));
  float a = s * s * uOpacity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

export function createShadowMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uQuad: { value: Array.from({ length: 12 }, () => new THREE.Vector2()) },
      uBlur: { value: new THREE.Vector3(0.2, 0.2, 0.2) },
      uColor: { value: new THREE.Color(0.16, 0.22, 0.36) },
      uOpacity: { value: 0 },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
}

export type ShadowCaster = { object: THREE.Object3D; corners: THREE.Vector2[] };

const tmp = new THREE.Vector3();

/**
 * Proyecta las caras de las cintas sobre el plano z = `planeZ` siguiendo la dirección `light`
 * (de la pieza hacia la luz, con z > 0) y acomoda el plano para que cubra justo la sombra.
 * Las matrices de mundo de las cintas tienen que estar al día.
 */
export function projectShadow(
  mesh: THREE.Mesh,
  material: THREE.ShaderMaterial,
  casters: ShadowCaster[],
  light: THREE.Vector3,
  planeZ: number,
  blur: { base: number; perUnit: number },
) {
  const quad = material.uniforms.uQuad.value as THREE.Vector2[];
  const blurs = material.uniforms.uBlur.value as THREE.Vector3;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxBlur = 0;
  for (let r = 0; r < 3; r++) {
    const caster = casters[r];
    let dist = 0;
    for (let k = 0; k < 4; k++) {
      const corner = caster.corners[k];
      tmp.set(corner.x, corner.y, 0).applyMatrix4(caster.object.matrixWorld);
      const h = Math.max(0, tmp.z - planeZ);
      const x = tmp.x - (light.x / light.z) * h;
      const y = tmp.y - (light.y / light.z) * h;
      quad[r * 4 + k].set(x, y);
      dist += h / 4;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const b = blur.base + blur.perUnit * dist;
    blurs.setComponent(r, b);
    maxBlur = Math.max(maxBlur, b);
  }
  const pad = maxBlur * 1.1;
  mesh.position.set((minX + maxX) / 2, (minY + maxY) / 2, planeZ);
  mesh.scale.set(maxX - minX + pad * 2, maxY - minY + pad * 2, 1);
}
