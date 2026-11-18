"use client";

/*
  Número que cuenta desde cero la primera vez que entra en pantalla. El servidor ya manda el
  valor final (se lee sin JavaScript); con reduced motion no cuenta.
*/
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({ to, prefix = "", className = "" }: { to: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${Math.round(v)}`),
    });
    return () => controls.stop();
  }, [inView, reduce, to, prefix]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {to}
    </span>
  );
}
