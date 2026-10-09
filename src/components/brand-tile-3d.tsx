"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { LogoMark } from "./logo";

const DISCIPLINES = ["Software", "Hardware", "IA", "Marketing", "Crecimiento"];
const LAYERS = 14; // capas de extrusión: 14 x 1.5px de grosor
const SPRING = { stiffness: 100, damping: 20, mass: 0.6 };

/*
  El app icon del brand board en 3D: una losa con grosor real, la S flotando por delante
  y un brillo que sigue al puntero. Propósito: presentar la marca (pieza de bienvenida, se
  ve una vez por visita). Puntero fino: sigue al mouse con springs. Táctil: oscila sola.
  Reduced motion: inclinación fija, sin flotación.
*/
export function BrandTile3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.35);
  const py = useMotionValue(-0.25);
  const rxPointer = useSpring(useTransform(py, [-1, 1], [18, -18]), SPRING);
  const ryPointer = useSpring(useTransform(px, [-1, 1], [-24, 24]), SPRING);

  // Al bajar, la losa se recuesta hacia atrás y se achica un poco
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollTilt = useTransform(scrollYProgress, [0.45, 1], [0, 26]);
  const scrollScale = useTransform(scrollYProgress, [0.45, 1], [1, 0.9]);
  const rotateX = useTransform([rxPointer, scrollTilt], ([a, b]: number[]) => a + b);

  const glareX = useTransform(px, [-1, 1], [18, 82]);
  const glareY = useTransform(py, [-1, 1], [8, 72]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.16), transparent 58%)`;
  const shadowX = useTransform(px, [-1, 1], [-16, 16]);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) {
      // Táctil: oscilación lenta para que se lea el volumen
      const a = animate(px, [-0.5, 0.5], { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
      const b = animate(py, [-0.35, 0.25], { duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
      return () => {
        a.stop();
        b.stop();
      };
    }
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  return (
    <div ref={ref} className="relative mx-auto flex w-fit flex-col items-center gap-10 md:block">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Halo y sombra sobre el horizonte */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 rounded-[32%] bg-[radial-gradient(closest-side,rgb(31_107_255/0.22),transparent)] blur-2xl"
        />
        <motion.div
          aria-hidden="true"
          style={{ x: shadowX }}
          className="pointer-events-none absolute -bottom-10 left-1/2 h-6 w-40 -translate-x-1/2 rounded-full bg-black/60 blur-xl md:w-52"
        />

        <div className={reduce ? undefined : "animate-float"}>
          <div style={{ perspective: 1100 }}>
            <motion.div
              style={{
                rotateX,
                rotateY: ryPointer,
                scale: scrollScale,
                transformStyle: "preserve-3d",
              }}
              className="relative size-44 md:size-56"
              role="img"
              aria-label="Isotipo de SEN Software"
            >
              {/* Grosor: capas que se oscurecen hacia atrás */}
              {Array.from({ length: LAYERS }, (_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[23%]"
                  style={{
                    transform: `translateZ(${-(i + 1) * 1.5}px)`,
                    background: `rgb(${22 - i} ${30 - i} ${50 - i * 1.6})`,
                  }}
                />
              ))}

              {/* Cara del tile */}
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[23%] border border-white/10 bg-[linear-gradient(150deg,#1f2b47_0%,#131b2e_52%,#0c1220_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.16),inset_0_-1px_0_rgb(0_0_0/0.4)]"
              >
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
                <motion.div className="absolute inset-0" style={{ background: glare }} />
              </div>

              {/* La S, flotando por delante de la cara */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: "translateZ(42px)" }}
              >
                <LogoMark className="h-[54%] w-auto drop-shadow-[0_14px_22px_rgb(31_107_255/0.45)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Lista del brand board: SOFTWARE / HARDWARE / IA / MARKETING / CRECIMIENTO */}
      <motion.ul
        aria-label="Disciplinas"
        initial={reduce ? false : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:absolute md:left-full md:top-[40%] md:ml-14 md:-translate-y-1/2 md:flex-col md:gap-3.5 md:border-l md:border-line-strong md:py-1 md:pl-7 md:text-left"
      >
        {DISCIPLINES.map((d, i) => (
          <li
            key={d}
            className="discipline-item label-caps whitespace-nowrap"
            style={{ animationDelay: `${i * 1.4}s` }}
          >
            {d}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
