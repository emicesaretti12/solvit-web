"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const text =
  "No somos una agencia de publicidad ni una factoría de software aislada del negocio. Somos el socio técnico que resuelve los cuellos de botella operativos y la demanda comercial sobre una misma infraestructura.";

// Palabras que llevan el acento de marca
const accent = new Set(["socio", "técnico", "misma", "infraestructura."]);

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={accent.has(word) ? "text-blue-400" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-36">
        <p
          ref={ref}
          className="max-w-[28ch] text-3xl font-medium leading-[1.18] tracking-[-0.025em] text-ink sm:text-4xl lg:text-[3.25rem]"
        >
          {reduce
            ? text
            : words.map((w, i) => (
                <Word
                  key={i}
                  word={w}
                  progress={scrollYProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                />
              ))}
        </p>
      </div>
    </section>
  );
}
