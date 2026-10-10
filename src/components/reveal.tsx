"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    // El mismo estado inicial en servidor y cliente; con reduced motion aparece sin moverse
    <Comp
      className={className}
      initial={{ opacity: 0, transform: "translateY(24px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </Comp>
  );
}
