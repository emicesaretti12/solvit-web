"use client";

/*
  Escenario 3D de la página: un solo canvas fijo detrás del contenido con el isotipo de SEN.
  El director lee las marcas <StageMark pose="..."/> que cada sección deja en el documento y,
  según el scroll, interpola la pose del isotipo entre la marca anterior y la siguiente. Así el
  mismo objeto recorre la página (se arma en el hero, se abre en las etapas de la venta y se
  vuelve a armar) sin re-renderizar React: la escena amortigua cada cuadro hacia esa pose.

  - three.js se carga recién en el cliente (next/dynamic, ssr: false)
  - al cargar, las partículas llegan desde una nube y arman la S; en la zambullida pasan al
    costado de la cámara como un flujo de datos (todo en la GPU, ver particle-field.ts)
  - en celulares la S vive en el hero: queda en su lugar de la pantalla y, con el scroll común,
    se abre en capas, avanza y atraviesa la cámara mientras el texto sube (nada se fija ni se
    oculta, y la S no persigue al texto: eso la hacía temblar con el scroll del dedo)
  - fuera de las zonas donde se ve, el render se detiene
  - sin WebGL queda el isotipo en SVG, ubicado con la misma pose
  - con reduced motion no hay zambullida ni apertura: solo cambios de lugar y de luz
*/
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { LogoMark } from "@/components/logo";
import { tap as haptic } from "@/lib/haptics";
import { SafeBoundary } from "@/components/safe-boundary";
import { isotypeHeightPx, restPose, stageSignal, type DragState, type IsoPose } from "./pose";
import { POSES, type PoseDef, type PoseKey, type StagePose } from "./choreography";

const Scene = dynamic(() => import("./isotype-scene"), { ssr: false });

// Estado compartido (fuera de React): la pose objetivo, el arrastre y el puntero
const pose = { current: restPose() as IsoPose };
const drag = { current: { active: false, dx: 0, dy: 0, vx: 0, vy: 0, taps: 0 } as DragState };
const pointer = { current: { x: 0, y: 0 } };

const DESKTOP = "(min-width: 1024px)";

/** Marca de pose: cuando su borde superior llega al borde superior de la pantalla, el isotipo
 *  está en esa pose. Entre dos marcas, la pose se interpola. `slot` es el id del hueco que la
 *  sección deja para el isotipo en celulares: la pose toma su centro y su alto. */
export function StageMark({
  pose: key,
  slot,
  className = "",
  style,
}: {
  pose: PoseKey;
  slot?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-stage={key}
      data-slot={slot}
      aria-hidden="true"
      style={style}
      className={`pointer-events-none h-px w-px ${className}`}
    />
  );
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Superficie para girar el isotipo con el dedo o el mouse (el canvas no recibe eventos). Un
 *  toque corto (sin arrastre) hace respirar a la S, con un golpe háptico donde hay vibración */
export function useStageDrag() {
  const start = useRef({ id: -1, x: 0, y: 0, lastX: 0, lastY: 0, lastT: 0, t0: 0 });
  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (drag.current.active) return; // un solo dedo: los demás se ignoran
    start.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: e.timeStamp,
      t0: e.timeStamp,
    };
    drag.current = { ...drag.current, active: true, dx: 0, dy: 0, vx: 0, vy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== start.current.id) return;
    const s = start.current;
    const dt = Math.max(1, e.timeStamp - s.lastT) / 1000;
    // Velocidad suavizada (px/s) para que el resorte siga al soltar con la misma inercia
    d.vx = d.vx * 0.6 + ((e.clientX - s.lastX) / dt) * 0.4;
    d.vy = d.vy * 0.6 + ((e.clientY - s.lastY) / dt) * 0.4;
    d.dx = e.clientX - s.x;
    d.dy = e.pointerType === "touch" ? 0 : e.clientY - s.y; // en touch, el eje vertical es del scroll
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = e.timeStamp;
  };
  const end = (e: ReactPointerEvent<HTMLElement>, released: boolean) => {
    const s = start.current;
    if (e.pointerId !== s.id) return;
    // Si el dedo estuvo quieto antes de soltar, no hay inercia que heredar
    if (e.timeStamp - s.lastT > 80) {
      drag.current.vx = 0;
      drag.current.vy = 0;
    }
    // Toque: soltó rápido y casi sin moverse (un scroll cancela el puntero y no cuenta)
    if (released && e.timeStamp - s.t0 < 320 && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 8) {
      drag.current.taps += 1;
      haptic();
    }
    drag.current.active = false;
    s.id = -1;
  };
  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => end(e, true),
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => end(e, false),
    onLostPointerCapture: (e: ReactPointerEvent<HTMLElement>) => end(e, false),
  };
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Stage() {
  const reduce = Boolean(useReducedMotion());
  const layer = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // WebGL solo se puede detectar en el navegador, después de montar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGl(hasWebGL());
  }, []);

  // Paralaje con mouse (solo puntero fino y sin reduced motion)
  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  // Director: marcas del documento → pose interpolada según el scroll
  useEffect(() => {
    let marks: { at: number; pose: StagePose }[] = [];
    let shown = false;
    let vh = window.innerHeight;
    const desktop = window.matchMedia(DESKTOP);

    // Hueco que la sección deja para el isotipo en celulares (el hero): la pose toma su centro y
    // su alto con la página arriba del todo. La S se queda ahí en la pantalla mientras el texto
    // sube (no lo persigue) y el y de la pose se suma como un corrimiento. Si la S se acerca a la
    // cámara (z > 0), la perspectiva la agranda y la aleja del centro: se compensa, así crece
    // desde su lugar. En los pasos, los celulares tienen su propia S (steps-isotype)
    const slotPose = (pose: StagePose, slotId: string): StagePose => {
      const el = document.getElementById(slotId);
      if (!el || !el.offsetHeight) return pose;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      // La S abierta ocupa más alto: ~0,47 unidades extra por cada punto de apertura en diagonal
      // y ~0,22 en capas
      const extent = 1 + (0.47 - 0.25 * pose.layers) * Math.min(1, pose.spread);
      const fit = (0.92 * rect.height) / (isotypeHeightPx(window.innerWidth, vh) * extent);
      const near = 1 - Math.max(0, pose.z);
      const y = 1 - (2 * (top + rect.height / 2)) / vh + pose.y;
      return { ...pose, y: y * near, scale: Math.min(pose.scale, fit) };
    };

    const measure = () => {
      // Alto del canvas (100lvh), que es la referencia de las fracciones de pantalla. El póster
      // toma el alto de la S 3D en reposo
      vh = layer.current?.offsetHeight || window.innerHeight;
      if (poster.current) poster.current.style.height = `${isotypeHeightPx(window.innerWidth, vh)}px`;
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"))
        // Una marca dentro de algo oculto (la versión de escritorio de una sección, en celulares)
        // no cuenta: si no, mediría 0 y se metería entre las del hero
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => ({ el, at: el.getBoundingClientRect().top + window.scrollY }))
        .sort((a, b) => a.at - b.at);
      const next: typeof marks = [];
      for (const { el, at } of els) {
        const def: PoseDef = POSES[el.dataset.stage as PoseKey];
        let pose = { ...(desktop.matches ? def.desktop : def.mobile) };
        if (!desktop.matches && el.dataset.slot) pose = slotPose(pose, el.dataset.slot);
        if (reduce) {
          const prev = next[next.length - 1];
          // Sin zambullida: se queda en el lugar de la marca anterior y solo se desvanece
          pose = def.reducedHold && prev ? { ...prev.pose, opacity: pose.opacity } : { ...pose, ...def.reduced };
        }
        next.push({ at, pose });
      }
      marks = next;
      update(window.scrollY);
    };

    const update = (y: number) => {
      if (!marks.length) return;
      let a = marks[0];
      let b = marks[0];
      for (let i = 0; i < marks.length; i++) {
        if (marks[i].at <= y) a = marks[i];
        if (marks[i].at > y) {
          b = marks[i];
          break;
        }
        b = marks[i];
      }
      const span = b.at - a.at;
      const t = span > 0 ? smooth(Math.min(1, Math.max(0, (y - a.at) / span))) : 0;
      const p = pose.current;
      const A = a.pose;
      const B = b.pose;
      p.x = lerp(A.x, B.x, t);
      p.y = lerp(A.y, B.y, t);
      p.z = lerp(A.z, B.z, t);
      p.scale = lerp(A.scale, B.scale, t);
      p.spread = lerp(A.spread, B.spread, t);
      p.layers = lerp(A.layers, B.layers, t);
      p.turn = lerp(A.turn, B.turn, t);
      p.tilt = lerp(A.tilt, B.tilt, t);
      p.focus = t < 0.5 ? A.focus : B.focus;
      const opacity = lerp(A.opacity, B.opacity, t);
      if (layer.current) layer.current.style.opacity = String(opacity);
      if (poster.current) {
        poster.current.style.transform = `translate(${p.x * 50}vw, ${(-p.y * vh) / 2}px) scale(${p.scale})`;
      }
      const visible = opacity > 0.01;
      if (visible !== shown) {
        shown = visible;
        setActive(visible);
      }
      // Con reduced motion el loop es "demand": cada cambio de pose pide un cuadro
      if (reduce && visible) stageSignal.invalidate();
    };

    // El scroll llega por su evento (pasivo) y la pose se calcula una vez por cuadro. Las marcas
    // se vuelven a medir cuando cambia el alto del documento (fuentes, imágenes, "ver todos")
    // o el ancho de la ventana: nunca se mide dentro del scroll
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update(window.scrollY);
      });
    };
    let remeasure = 0;
    const schedule = () => {
      window.clearTimeout(remeasure);
      remeasure = window.setTimeout(measure, 120);
    };
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(remeasure);
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", measure);
    };
  }, [reduce]);

  return (
    // Escenario fijo detrás del contenido, con alto estable (100lvh): al aparecer o esconderse la
    // barra del navegador el canvas no se redimensiona y la S no salta. En escritorio la S recorre
    // la página; en celulares solo vive en el hero y no sigue al texto con JS (con el scroll del
    // dedo siempre iría un cuadro atrás y se vería temblar): queda en su lugar mientras se abre y
    // atraviesa la cámara, y el texto pasa por encima con el scroll común. Con reduced motion no
    // hay transición: en celulares el escenario va al principio de la página y la S sube con el
    // hero como una imagen
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] max-lg:motion-reduce:absolute"
      style={{ opacity: 0 }}
    >
      {/* Póster: el isotipo plano mientras carga WebGL (o si no hay). Con movimiento se va rápido:
          la S 3D se arma con partículas en su lugar, como si el logo se deshiciera y se rearmara */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity ease-[var(--ease-out)] ${ready ? "opacity-0 duration-300 motion-reduce:duration-700" : "opacity-100 duration-700"}`}
      >
        <div ref={poster} className="h-[62svh] max-h-[680px] max-lg:max-h-none">
          <LogoMark className="h-full w-auto" />
        </div>
      </div>
      {gl && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-[var(--ease-out)] motion-reduce:duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          {/* Si el canvas falla al crearse (poca memoria, límite de contextos), queda el póster */}
          <SafeBoundary>
            <Scene pose={pose} drag={drag} pointer={pointer} reduce={reduce} active={active} onReady={() => setReady(true)} />
          </SafeBoundary>
        </div>
      )}
    </div>
  );
}
