"use client";

/*
  Imán: lo que envuelve se acerca al puntero cuando el mouse le pasa por encima y vuelve a su
  lugar con un resorte al salir. Es decorativo: solo con mouse y sin reduced motion.
*/
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

const SPRING = { stiffness: 220, damping: 16, mass: 0.5 };

export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span onPointerMove={onMove} onPointerLeave={onLeave} style={{ x, y }} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  );
}
