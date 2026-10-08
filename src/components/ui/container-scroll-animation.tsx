"use client";

/*
  Container Scroll Animation (Aceternity UI), adaptado a Solvit:
  - importa de "motion/react" (framer-motion es el mismo motor, ya instalado como dependencia de motion)
  - respeta prefers-reduced-motion
  - detecta mobile con matchMedia (breakpoint md de Tailwind) en lugar de escuchar resize
  - offset de scroll propio para que la animación dure lo mismo en cualquier pantalla
  - tarjeta con el doble bisel del sitio (2rem afuera, 2rem - 6px adentro)
*/
import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

// Igual que el breakpoint md de Tailwind (768px ya es escritorio)
const MOBILE_QUERY = "(max-width: 767.98px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // De "el contenedor llega a la mitad de la pantalla" a "queda centrado": el recorrido
  // no depende de (alto del contenedor - alto de pantalla), que en celulares es de ~100px.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center center"],
  });
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();

  const scaleDimensions = () => {
    if (reduce) return [1, 1];
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -100]);

  return (
    <div
      className={cn(
        "relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20",
        className,
      )}
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0306124d, 0 9px 20px #0306124a, 0 37px 37px #03061242, 0 84px 50px #03061226, 0 149px 60px #0306120a, 0 233px 65px #03061203",
      }}
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[2rem] border border-line bg-white/[0.025] p-1.5 md:h-[40rem]"
    >
      <div className="h-full w-full overflow-hidden rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(255_255_255/0.06)]">
        {children}
      </div>
    </motion.div>
  );
};
