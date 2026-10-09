"use client";

/*
  Isotipo de SEN en 3D: la S de tres cintas extruida con capas apiladas en profundidad
  (CSS 3D, transform-style: preserve-3d). Se mueve con el puntero (springs), oscila sola cuando
  no hay puntero fino, gira al hacer scroll y tiene un brillo que sigue la inclinación.
  Solo transform y opacity; con reduced motion queda quieto en su pose de reposo.
*/
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, type RefObject } from "react";

const FOLD = "0,399 280,273 515,391 232,515";
const TOP = "0,217 468,0 468,189 0,399";
const BOTTOM = "52,594 515,391 515,584 52,787";

const LAYERS = 20;
const DEPTH = 1.7; // px por capa: ~34px de espesor

// Laterales: del azul del isotipo al navy profundo, para que el canto se lea como volumen
const side = (i: number) => {
  const t = i / (LAYERS - 1);
  const r = Math.round(8 + (2 - 8) * t);
  const g = Math.round(70 + (22 - 70) * t);
  const b = Math.round(220 + (96 - 220) * t);
  return `rgb(${r} ${g} ${b})`;
};

export function Isotype3D({
  scrollTarget,
  className = "",
}: {
  /** Sección que, al salir de pantalla, hace girar y alejar el isotipo */
  scrollTarget?: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sway = useMotionValue(0);

  const spring = { stiffness: 100, damping: 20, mass: 0.6 };
  const tiltX = useSpring(useTransform(py, [-1, 1], [14, -14]), spring);
  const tiltY = useSpring(useTransform(px, [-1, 1], [-22, 22]), spring);

  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ["start start", "end start"] });
  const scrollTurn = useTransform(scrollYProgress, [0, 1], [0, 38]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, 90]);

  // Pose de reposo levemente girada, para que se vea el canto desde el primer cuadro
  const rotateX = useTransform([tiltX, sway] as MotionValue<number>[], ([a, s]: number[]) => 8 + a + s * 3);
  const rotateY = useTransform(
    [tiltY, sway, scrollTurn] as MotionValue<number>[],
    ([a, s, sc]: number[]) => -20 + a + s * 12 + sc,
  );

  // Brillo especular que se desplaza con la inclinación
  const glareX = useTransform(tiltY, [-22, 22], [80, 20]);
  const glareY = useTransform(tiltX, [-14, 14], [80, 20]);
  const glare = useMotionTemplate`radial-gradient(60% 45% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.32), transparent 70%)`;

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Oscilación lenta siempre presente; el puntero se suma encima
    const loop = animate(sway, [-1, 1], {
      duration: 7,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    if (!fine) return () => loop.stop();
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      loop.stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, px, py, sway]);

  return (
    <motion.div
      aria-hidden="true"
      className={`relative ${className}`}
      style={reduce ? undefined : { scale, y: lift }}
    >
      {/* Sombra en el piso que acompaña la flotación */}
      <div className="absolute bottom-[-10%] left-1/2 h-[9%] w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--shade-rgb)/0.55),transparent)] light:bg-[radial-gradient(closest-side,rgb(var(--shade-rgb)/0.28),transparent)]" />
      <div className="h-full animate-float [perspective:1100px]">
        <motion.div
          className="relative mx-auto aspect-[515/787] h-full [transform-style:preserve-3d]"
          initial={reduce ? false : { opacity: 0, rotateY: -75, rotateX: 18, scale: 0.86 }}
          animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={reduce ? { rotateX: 8, rotateY: -20 } : { rotateX, rotateY }}
          >
            {/* Canto: capas hacia atrás, cada una un poco más oscura */}
            {Array.from({ length: LAYERS }, (_, i) => (
              <svg
                key={i}
                viewBox="0 0 515 787"
                className="absolute inset-0 size-full"
                style={{ transform: `translateZ(${-(i + 1) * DEPTH}px)` }}
              >
                <polygon points={FOLD} fill={side(Math.min(LAYERS - 1, i + 4))} />
                <polygon points={TOP} fill={side(i)} />
                <polygon points={BOTTOM} fill={side(i)} />
              </svg>
            ))}
            {/* Cara frontal con el degradé del isotipo */}
            <svg
              viewBox="0 0 515 787"
              className="absolute inset-0 size-full drop-shadow-[0_0_40px_rgb(31_107_255/0.35)]"
            >
              <defs>
                <linearGradient id={`${id}-face`} x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#0052ff" />
                  <stop offset="0.55" stopColor="#0a8bff" />
                  <stop offset="1" stopColor="#1fdcff" />
                </linearGradient>
                <linearGradient id={`${id}-fold`} x1="0.3" y1="0" x2="0.7" y2="1">
                  <stop offset="0" stopColor="#002a9e" />
                  <stop offset="1" stopColor="#0064ff" />
                </linearGradient>
              </defs>
              <polygon points={FOLD} fill={`url(#${id}-fold)`} />
              <polygon points={TOP} fill={`url(#${id}-face)`} />
              <polygon points={BOTTOM} fill={`url(#${id}-face)`} />
            </svg>
            {/* Brillo: recortado con la forma de la S */}
            <motion.div
              className="absolute inset-0 mix-blend-screen"
              style={{
                background: glare,
                maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 515 787'%3E%3Cpolygon points='${TOP}'/%3E%3Cpolygon points='${BOTTOM}'/%3E%3C/svg%3E")`,
                maskSize: "100% 100%",
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 515 787'%3E%3Cpolygon points='${TOP}'/%3E%3Cpolygon points='${BOTTOM}'/%3E%3C/svg%3E")`,
                WebkitMaskSize: "100% 100%",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
