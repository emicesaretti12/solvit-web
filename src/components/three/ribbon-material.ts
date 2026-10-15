/*
  Material de las cintas: el físico de three (laca con clearcoat, degradé de marca en los
  vértices) con dos agregados inyectados en su shader (onBeforeCompile), sin pasadas extra:

  - Aparición: la S sólida se arma con un barrido en la diagonal (de abajo a la izquierda hacia
    arriba a la derecha, el mismo orden en que llegan las partículas) con un borde irregular de
    ruido y un filo de luz fino. Lo que todavía no apareció se descarta (sin transparencias que
    ordenar). Terminado el barrido, la rama no corre más.
  - Canto: un fresnel suave que aclara los bordes que miran de costado. En fondo blanco es lo que
    separa la pieza del fondo sin glow; en oscuro, el mismo filo en cian.

  Los uniforms son compartidos por las tres cintas: los mueve el Rig una vez por cuadro.
*/
import * as THREE from "three";
import { VALUE_NOISE_3D } from "./glsl";

export type RibbonUniforms = {
  uReveal: { value: number };
  uEdgeColor: { value: THREE.Color };
  uRim: { value: number };
  uRimColor: { value: THREE.Color };
};

export function createRibbonUniforms(): RibbonUniforms {
  return {
    uReveal: { value: 1 },
    uEdgeColor: { value: new THREE.Color("#5fd0ff") },
    uRim: { value: 0.14 },
    uRimColor: { value: new THREE.Color("#d8ecff") },
  };
}

const VERTEX_PARS = /* glsl */ `
attribute float reveal;
varying float vReveal;
varying vec3 vRevealPos;
`;

const FRAGMENT_PARS = /* glsl */ `
uniform float uReveal;
uniform vec3 uEdgeColor;
uniform float uRim;
uniform vec3 uRimColor;
varying float vReveal;
varying vec3 vRevealPos;
${VALUE_NOISE_3D}
`;

// Al principio del main: lo que el barrido todavía no alcanzó no se dibuja
const FRAGMENT_REVEAL = /* glsl */ `
  float revealEdge = 0.0;
  if (uReveal < 1.0) {
    float grain = vnoise(vRevealPos * 9.0) - 0.5;
    float ahead = uReveal * 1.3 - 0.15 - (vReveal + grain * 0.14);
    if (ahead < 0.0) discard;
    revealEdge = 1.0 - smoothstep(0.0, 0.05, ahead);
  }
`;

export function patchRibbonMaterial(material: THREE.MeshPhysicalMaterial, uniforms: RibbonUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${VERTEX_PARS}`)
      .replace("#include <begin_vertex>", "#include <begin_vertex>\n  vReveal = reveal;\n  vRevealPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${FRAGMENT_PARS}`)
      .replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>\n${FRAGMENT_REVEAL}`)
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\n  totalEmissiveRadiance += uEdgeColor * revealEdge * 1.6;",
      )
      .replace(
        "#include <opaque_fragment>",
        `outgoingLight += uRimColor * pow(1.0 - saturate(dot(normal, geometryViewDir)), 3.0) * uRim;
  #include <opaque_fragment>`,
      );
  };
  // Mismo programa para las tres cintas (el código inyectado es igual)
  material.customProgramCacheKey = () => "sen-ribbon";
}
