"use client";

/*
  Hero: el isotipo de SEN en 3D (WebGL, ver three/stage.tsx) al centro, entre dos frases cortas.
  A la izquierda, la promesa con una palabra que rota; a la derecha, a quién le hablamos. Arriba
  a la derecha gira el globo de puntos con Córdoba marcada; abajo, el valle de cintas y los
  clientes que ya confían en SEN.

  La S se gira con el mouse o el dedo. Al bajar, se abre en sus tres cintas y atraviesa la
  cámara (las marcas StageMark le dicen al escenario qué pose va en cada punto del scroll). En
  celulares la S vive en el hueco #hero-slot y las frases van debajo.
*/
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { StageMark, useStageDrag } from "@/components/three/stage";
import { PROJECTS } from "@/content/projects";
import { Globe } from "./globe";
import { Hills } from "./hills";

const WORDS = ["negocio", "tienda", "empresa", "equipo", "marca"];

// Los clientes, como marcas tipográficas (no hay logos cargados todavía): cada una con su voz
const VOICES = [
  "font-extrabold tracking-[-0.04em]",
  "font-light tracking-[0.18em] uppercase text-[0.82em]",
  "font-bold italic tracking-[-0.02em]",
  "font-medium tracking-[0.02em]",
  "font-black uppercase tracking-[0.06em] text-[0.8em]",
];
const CLIENTS = PROJECTS.flatMap((p) => (p.client ? [p.client] : []));

function RotatingWord() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  // Solo rota mientras se ve: fuera de pantalla no hay nada que animar
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % WORDS.length), 2400);
    return () => window.clearInterval(id);
  }, [reduce, inView]);
  return (
    <span ref={ref} className="-my-[0.2em] inline-grid overflow-hidden py-[0.2em] align-bottom">
      <AnimatePresence initial={false}>
        <motion.span
          key={WORDS[i]}
          initial={{ y: "125%" }}
          animate={{ y: 0 }}
          exit={{ y: "-125%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="[grid-area:1/1]"
        >
          {WORDS[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const drag = useStageDrag();
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Escritorio: al bajar, las dos frases se abren hacia los costados y se apagan, dejándole el
  // centro a la S que se despliega
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const left = useTransform(scrollYProgress, [0, 0.4], ["0vw", "-9vw"]);
  const right = useTransform(scrollYProgress, [0, 0.4], ["0vw", "9vw"]);
  const fade = useTransform(scrollYProgress, [0.05, 0.36], [1, 0]);
  const part = wide && !reduce;

  return (
    <section ref={section} id="inicio" aria-labelledby="hero-titulo" className="relative min-h-[118svh] lg:min-h-[128svh]">
      <StageMark pose="hero" slot="hero-slot" className="absolute left-0 top-0" />
      <StageMark pose="unfold" className="absolute left-0 top-[22%] max-lg:hidden" />
      <StageMark pose="plunge" className="absolute left-0 top-[44%] max-lg:hidden" />
      <StageMark pose="dive" className="absolute left-0 top-[70%] max-lg:hidden" />
      <StageMark pose="plunge" className="absolute left-0 top-[42%] lg:hidden" />
      <StageMark pose="dive" className="absolute left-0 top-[78%] lg:hidden" />

      {/* Primera pantalla */}
      <div className="relative mx-auto flex h-[100svh] min-h-[620px] flex-col px-5 md:px-[4.2vw] lg:block">
        {/* Globo */}
        <div className="hero-fade absolute right-5 top-[11svh] [--d:500ms] md:right-[2.6vw] lg:top-[21%]">
          <Globe className="w-[52px] cursor-grab active:cursor-grabbing md:w-[92px] lg:w-[132px]" />
        </div>

        {/* Hueco de la S en celulares y superficie para girarla */}
        <div
          id="hero-slot"
          {...drag}
          className="mx-auto mt-[15svh] h-[40svh] w-[min(72vw,360px)] shrink-0 touch-pan-y lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:h-[56svh] lg:w-[30vw] lg:-translate-x-1/2 lg:-translate-y-[48%] lg:cursor-grab lg:active:cursor-grabbing"
        />

        <h1
          id="hero-titulo"
          className="hero-fade mt-6 max-w-[15ch] text-[2rem] leading-[1.08] tracking-[-0.035em] text-ink [--d:250ms] lg:absolute lg:left-[4.2vw] lg:top-[47.5%] lg:mt-0 lg:max-w-none lg:-translate-y-1/2 lg:text-[clamp(1.3rem,1.72vw,1.9rem)] lg:leading-[1.22]"
        >
          <motion.span className="block" style={part ? { x: left, opacity: fade } : undefined}>
            Tecnología que hace <em className="font-normal italic text-blue-500">crecer</em>
            <br className="max-lg:hidden" /> tu <RotatingWord />
          </motion.span>
        </h1>

        <p className="hero-fade mt-4 max-w-[30ch] text-[17px] leading-[1.45] text-ink-muted [--d:400ms] lg:absolute lg:right-[7.5vw] lg:top-[47.5%] lg:mt-0 lg:max-w-none lg:-translate-y-1/2 lg:text-right lg:text-[clamp(1rem,1.18vw,1.25rem)] lg:leading-[1.5]">
          <motion.span className="block" style={part ? { x: right, opacity: fade } : undefined}>
            Desarrollo web, software a medida y agentes de IA
            <br className="max-lg:hidden" /> para empresas que <span className="text-ink">quieren vender más.</span>
          </motion.span>
        </p>

        {/* Clientes */}
        <div className="hero-fade marquee-hold absolute inset-x-0 bottom-[3.2svh] z-[2] flex items-center gap-8 px-5 [--d:700ms] md:px-0 lg:left-1/2 lg:w-[52vw] lg:-translate-x-1/2">
          <p className="label-caps shrink-0 max-md:hidden">Confían en SEN</p>
          <div className="relative flex min-w-0 flex-1 overflow-hidden [--duration:34s] [--gap:3.5rem] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 animate-marquee items-center gap-[var(--gap)] pr-[var(--gap)] text-[19px] text-ink/60"
              >
                {CLIENTS.map((name, i) => (
                  <li key={name} className={`whitespace-nowrap ${VOICES[i % VOICES.length]}`}>
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Valle de cintas: asoma en las esquinas de la primera pantalla y se ve entero al bajar */}
      <Hills className="pointer-events-none absolute inset-x-0 top-[80svh] z-[1] h-[calc(100%-80svh)] w-full [mask-image:linear-gradient(to_bottom,#000_35%,transparent_96%)] lg:top-[74svh] lg:h-[calc(100%-74svh)]" />
    </section>
  );
}
