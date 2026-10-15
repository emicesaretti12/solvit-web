/*
  Objetos 3D de los servicios, hechos con CSS (sin WebGL: la página tiene un solo canvas, el del
  isotipo, y cada contexto WebGL cuesta memoria). Cada pieza es una placa con espesor (cara de
  arriba y los dos cantos que ve la cámara) dentro de un espacio isométrico, o capas en
  profundidad. Las caras llevan degradés de luz (arriba la más clara, los cantos más oscuros
  hacia la base) y cada objeto apoya sobre una sombra de contacto en su propio plano.
  - Web: el navegador se desarma en capas (portada, tarjetas y botón); un cursor llega, hace clic
    en el botón y nace una consulta
  - Software a medida: tres módulos (datos, reglas y pantallas) que caen y encajan, unidos por
    dos cables por los que suben los datos y bajan las acciones
  - Agentes de IA: el ícono de SEN con espesor, los mensajes de los clientes en órbita, la onda
    de que escucha y el aviso de que está respondiendo
  - Hardware e IoT: una placa con su chip que baja al zócalo; la señal corre por las pistas y
    sale por la antena
  - Marketing: un embudo de anillos por el que caen las consultas; en cada etapa se pierden
    algunas por el costado y pocas llegan a venta
  Todo es transform y opacidad. El armado (data-on), los loops (data-live) y la repetición del
  armado al tocar (data-replay) los decide la tarjeta (services.tsx); la mirada del objeto hacia
  el puntero (look) también. Los estilos y las curvas están en src/app/scenes.css.
*/
import { CheckCircle, InstagramLogo, Sparkle, WhatsappLogo, type Icon } from "@phosphor-icons/react";
import { motion, type MotionValue } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { LogoMark } from "@/components/logo";
import type { ServiceKey } from "@/content/services";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* Placa con espesor en el plano isométrico: la cara de arriba y los cantos de adelante y de la
   izquierda (los únicos que mira la cámara con el giro de la escena). `front` va dibujado en el
   canto de adelante; `sheen` suma el brillo especular que cruza la cara de arriba */
function Slab({
  t,
  top = "",
  tone = "",
  front,
  sheen = false,
  children,
}: {
  t: number;
  top?: string;
  tone?: string;
  front?: ReactNode;
  sheen?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`scn-slab ${tone}`}>
      <div className="scn-face scn-front" style={{ height: t }}>
        {front}
      </div>
      <div className="scn-face scn-left" style={{ width: t, left: -t }} />
      <div className={`scn-face scn-top ${top}`} style={{ transform: `translateZ(${t}px)` }}>
        {children}
        {sheen && <span className="scn-sheen" />}
      </div>
    </div>
  );
}

/* Pieza ubicada en el plano (x, y) y a una altura z. `from` es la altura desde la que llega al
   armarse; `loop` es la animación de reposo (corre solo con la tarjeta a la vista) */
function Part({
  x,
  y,
  w,
  d,
  z = 0,
  from,
  delay = 0,
  loop,
  phase = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z?: number;
  from?: number;
  delay?: number;
  loop?: string;
  phase?: number;
  children: ReactNode;
}) {
  const style: Vars = { left: x, top: y, width: w, height: d, "--z": `${z}px`, "--d": `${delay}s` };
  if (from !== undefined) style["--from"] = `${from}px`;
  return (
    <div className="scn-part" style={style}>
      <div className={loop ? `scn-loop scn-anim ${loop}` : "scn-loop"} style={phase ? { animationDelay: `${phase}s` } : undefined}>
        {children}
      </div>
    </div>
  );
}

/* Sombra de contacto en el plano de la mesa, con la huella de la base apenas corrida hacia atrás
   y a la izquierda (la luz viene de adelante y de la derecha). Gira con el objeto, así que
   siempre cae bien */
function Shadow({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  return <span className="scn-face scn-shadow" style={{ left: x, top: y, width: w, height: d }} />;
}

/* ---------- Desarrollo web: el navegador desarmado en capas ---------- */

function WebObject() {
  return (
    <div className="scn-iso" style={{ top: 34 }}>
      <div className="scn-obj" style={{ width: 180, height: 128, marginLeft: -90, marginTop: -64 }}>
        <Shadow x={-8} y={-6} w={180} d={128} />
        <Part x={0} y={0} w={180} d={128} from={-30}>
          <Slab t={6} top="web-window">
            <svg viewBox="0 0 180 128" aria-hidden="true">
              <rect width="180" height="16" className="fill-[var(--scn-bar)]" />
              <circle cx="9" cy="8" r="2.2" className="fill-[var(--scn-faint)]" />
              <circle cx="16.5" cy="8" r="2.2" className="fill-[var(--scn-faint)]" />
              <circle cx="24" cy="8" r="2.2" className="fill-[var(--scn-faint)]" />
              <rect x="40" y="4.5" width="100" height="7" rx="3.5" className="fill-[var(--scn-faint)]" />
              {/* Huecos de donde salen las capas */}
              <rect x="14" y="24" width="152" height="34" rx="3" className="fill-[var(--scn-ghost)]" />
              <rect x="14" y="66" width="44" height="30" rx="3" className="fill-[var(--scn-ghost)]" />
              <rect x="68" y="66" width="44" height="30" rx="3" className="fill-[var(--scn-ghost)]" />
              <rect x="122" y="66" width="44" height="30" rx="3" className="fill-[var(--scn-ghost)]" />
              <rect x="58" y="102" width="64" height="16" rx="8" className="fill-[var(--scn-ghost)]" />
            </svg>
          </Slab>
        </Part>
        <Part x={14} y={24} w={152} d={34} z={34} from={6} delay={0.14} loop="scn-bob">
          <Slab t={4} top="web-hero" tone="scn-slab-blue" sheen>
            <svg viewBox="0 0 152 34" aria-hidden="true">
              <rect x="10" y="8" width="74" height="5" rx="2.5" fill="#ffffff" />
              <rect x="10" y="17" width="50" height="4" rx="2" fill="#ffffff" fillOpacity="0.7" />
              <rect x="10" y="25" width="22" height="4" rx="2" fill="#ffffff" fillOpacity="0.9" />
            </svg>
          </Slab>
        </Part>
        {[14, 68, 122].map((x, i) => (
          <Part key={x} x={x} y={66} w={44} d={30} z={62} from={6} delay={0.26 + i * 0.07} loop="scn-bob" phase={-0.8 - i * 0.5}>
            <Slab t={4} top="web-card">
              <svg viewBox="0 0 44 30" aria-hidden="true">
                <rect x="4" y="4" width="36" height="12" rx="2" className="fill-blue-400/35" />
                <rect x="4" y="19" width="28" height="3" rx="1.5" className="fill-[var(--scn-line)]" />
                <rect x="4" y="24" width="18" height="3" rx="1.5" className="fill-[var(--scn-faint)]" />
              </svg>
            </Slab>
          </Part>
        ))}
        <Part x={58} y={102} w={64} d={16} z={90} from={6} delay={0.5} loop="web-press">
          <Slab t={4} top="web-cta" tone="scn-slab-blue" sheen>
            <span className="web-ripple scn-anim" />
            <svg viewBox="0 0 64 16" aria-hidden="true">
              <rect x="14" y="6.5" width="36" height="3" rx="1.5" fill="#ffffff" />
            </svg>
          </Slab>
        </Part>
        {/* El cursor llega al botón, hace clic (el botón se hunde en el mismo cuadro) y se va */}
        <div className="web-cursor scn-anim">
          <span className="scn-face scn-bill web-cursor-face">
            <svg viewBox="0 0 16 22" className="web-click scn-anim" aria-hidden="true">
              <path
                d="M1.2 1.2v16.6l4.3-4.1 2.9 6.8 2.9-1.2-2.8-6.6h6.1z"
                fill="#0b1222"
                stroke="#ffffff"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        {/* Y del clic nace una consulta */}
        <span className="scn-face scn-bill web-lead" style={{ left: 90, top: 106, "--bz": "112px", "--by": "-100%" } as Vars}>
          <span className="web-lead-chip scn-anim">
            <CheckCircle size={12} weight="fill" aria-hidden="true" />
            Nueva consulta
          </span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Software a medida: módulos que caen y encajan ---------- */

const MODULES = [
  { key: "data", z: 0, label: "Datos", led: 0 },
  { key: "logic", z: 32, label: "Reglas", led: -0.22 },
  { key: "ui", z: 64, label: "Pantallas", led: -0.46 },
] as const;

// Cables por delante de los módulos: por el de la izquierda suben los datos y por el de la
// derecha bajan las acciones de las pantallas
const RAILS = [
  { x: 16, down: false },
  { x: 134, down: true },
] as const;

function ModuleTop({ kind }: { kind: (typeof MODULES)[number]["key"] }) {
  if (kind === "data") {
    return (
      <svg viewBox="0 0 150 104" aria-hidden="true">
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x="16" y={20 + r * 18} width="8" height="8" rx="2" className="fill-blue-400/50" />
            <rect x="32" y={21.5 + r * 18} width={64 - r * 6} height="5" rx="2.5" className="fill-[var(--scn-line)]" />
            <rect x="104" y={21.5 + r * 18} width="30" height="5" rx="2.5" className="fill-[var(--scn-faint)]" />
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "logic") {
    return (
      <svg viewBox="0 0 150 104" aria-hidden="true">
        <path d="M34 52 H66 M84 52 H116 M75 43 V24 H116" className="fill-none stroke-blue-400/70" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="52" r="9" className="fill-none stroke-[var(--scn-line)]" strokeWidth="2" />
        <rect x="66" y="43" width="18" height="18" rx="3" transform="rotate(45 75 52)" className="fill-blue-500" />
        <circle cx="124" cy="52" r="9" className="fill-none stroke-[var(--scn-line)]" strokeWidth="2" />
        <circle cx="124" cy="24" r="6" className="fill-blue-400/45" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 150 104" aria-hidden="true">
      <rect x="10" y="10" width="130" height="9" rx="3" className="fill-[var(--scn-bar)]" />
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <rect x={12 + c * 44} y="26" width="38" height="68" rx="4" className="fill-[var(--scn-ghost)]" />
          <rect x={16 + c * 44} y={c === 1 ? 52 : 32} width="30" height="14" rx="3" className="fill-[var(--scn-faint)]" />
          {c !== 2 && <rect x={16 + c * 44} y="70" width="30" height="14" rx="3" className="fill-[var(--scn-faint)]" />}
        </g>
      ))}
    </svg>
  );
}

/* Canto de adelante de cada módulo, como un equipo en un rack: dos luces fijas y una que
   titila cuando pasa el dato por su altura */
function ModuleFront({ phase }: { phase: number }) {
  return (
    <>
      <span className="sw-led sw-led-on" style={{ right: 26 }} />
      <span className="sw-led" style={{ right: 18 }} />
      <span className="sw-led sw-led-on sw-blink scn-anim" style={{ right: 10, animationDelay: `${phase}s` }} />
    </>
  );
}

function SoftwareObject() {
  return (
    <div className="scn-iso" style={{ top: 30, left: -26 }}>
      <div className="scn-obj" style={{ width: 150, height: 104, marginLeft: -75, marginTop: -52 }}>
        <Shadow x={-8} y={-6} w={150} d={104} />
        {MODULES.map((m, i) => (
          <Part key={m.key} x={0} y={0} w={150} d={104} z={m.z} from={m.z + 130} delay={0.1 + i * 0.16}>
            <Slab t={14} top={`sw-top sw-${m.key}`} front={<ModuleFront phase={m.led} />}>
              <ModuleTop kind={m.key} />
              {/* La tarjeta que avanza de columna en el tablero */}
              {m.key === "ui" && <span className="sw-ticket scn-anim" />}
            </Slab>
            <span className="scn-face scn-tag sw-label">{m.label}</span>
          </Part>
        ))}
        {RAILS.map((r) => (
          <div key={r.x}>
            {/* El cable se para sobre la mesa y entra a cada módulo por una ficha */}
            <span className="scn-face sw-rail" style={{ left: r.x - 1 }} />
            {MODULES.map((m) => (
              <span key={m.key} className="scn-face sw-port" style={{ left: r.x - 3, "--pz": `${m.z + 7}px` } as Vars} />
            ))}
            {[0, -1.2].map((delay) => (
              <span
                key={delay}
                className={`sw-dot scn-anim ${r.down ? "sw-dot-down" : ""}`}
                style={{ left: r.x - 3, animationDelay: `${delay + (r.down ? -0.6 : 0)}s` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Agentes de IA: el ícono con espesor y los mensajes en órbita ---------- */

const BUBBLES: { angle: number; icon: Icon; text: string; agent?: boolean }[] = [
  { angle: -58, icon: WhatsappLogo, text: "¿Tienen cuotas?" },
  { angle: 62, icon: Sparkle, text: "Sí, hasta 60.", agent: true },
  { angle: 182, icon: InstagramLogo, text: "¿Hacen envíos?" },
];

// Capas del espesor del ícono, de atrás hacia adelante: más oscuras al fondo y un filo azul
// pegado al frente (el borde del ícono de app del brand board). Colores sólidos, iguales en los
// dos temas, como el ícono instalado
const CORE_LAYERS = ["#040e22", "#06122b", "#071634", "#091b3e", "#0b2048", "#0d2552", "#1f4fc4"];

function AgentObject() {
  return (
    <div className="ia-obj" style={{ top: 4 }}>
      <div className="ia-orbit">
        <span className="scn-face ia-path" />
        <div className="ia-spin scn-anim">
          {BUBBLES.map((b, i) => (
            <div key={b.text} className="ia-slot" style={{ transform: `rotateY(${b.angle}deg) translateZ(96px) rotateY(${-b.angle}deg)` }}>
              <div className="ia-counter scn-anim">
                <span
                  className={`scn-face ia-bubble ${b.agent ? "ia-bubble-agent" : ""}`}
                  style={{ "--d": `${0.45 + i * 0.12}s` } as Vars}
                >
                  <b.icon size={13} weight={b.agent ? "fill" : "regular"} aria-hidden="true" />
                  {b.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ia-core-pos">
        {/* Escucha: dos ondas que salen de atrás del ícono */}
        <span className="scn-face ia-pulses">
          <i className="ia-pulse scn-anim" />
          <i className="ia-pulse scn-anim" style={{ animationDelay: "-1.4s" }} />
        </span>
        <div className="ia-core scn-anim">
          {CORE_LAYERS.map((color, i) => (
            <span
              key={color}
              className="scn-face ia-layer"
              style={{ transform: `translateZ(${-(CORE_LAYERS.length - i) * 2.2}px)`, background: color }}
            />
          ))}
          <span className="scn-face ia-front">
            <LogoMark className="h-[42px] w-auto" />
            <span className="scn-sheen" />
          </span>
        </div>
        {/* Y responde: el aviso de que está escribiendo, pegado al ícono */}
        <span className="scn-face ia-typing" style={{ "--d": "0.7s" } as Vars}>
          {[0, 1, 2].map((n) => (
            <i key={n} className="ia-dot scn-anim" style={{ animationDelay: `${n * 0.16}s` }} />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ---------- Hardware e IoT: placa, chip y señal ---------- */

const TRACES = [
  "M64 48 H40 V18 H22",
  "M64 62 H30 V44 H12",
  "M64 76 H34 V98 H24",
  "M64 88 H48 V116 H38",
  "M120 50 H138 V26 H160",
  "M120 64 H170",
  "M120 78 H142 V104 H150",
  "M120 90 H128 V118 H148",
  "M80 38 V22 H96 V10",
  "M104 38 V26 H124 V12",
  "M88 94 V114",
  "M100 94 V122 H114",
];
const VIAS: [number, number][] = [
  [22, 18], [12, 44], [24, 98], [38, 116], [160, 26], [170, 64], [148, 118], [96, 10], [124, 12], [88, 114], [114, 122],
];
// Pulsos que salen del chip por cuatro pistas (cada uno con su recorrido en scenes.css)
const PULSES = [
  { name: "hw-p1", t: 1.6, delay: 0 },
  { name: "hw-p2", t: 2.2, delay: -0.7 },
  { name: "hw-p3", t: 1.9, delay: -1.3 },
  { name: "hw-p4", t: 2, delay: -0.4 },
];

function BoardTop() {
  return (
    <svg viewBox="0 0 184 132" aria-hidden="true">
      <rect x="3.5" y="3.5" width="177" height="125" rx="6" className="fill-none stroke-[var(--scn-faint)]" />
      {[[10, 10], [174, 10], [10, 122], [174, 122]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.4" className="fill-[var(--scn-hole)] stroke-[var(--scn-pin)]" strokeWidth="1" />
      ))}
      {TRACES.map((d) => (
        <path key={d} d={d} className="fill-none stroke-[var(--hw-trace)]" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {VIAS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.3" className="fill-[var(--hw-board)] stroke-[var(--hw-via)]" strokeWidth="1.4" />
      ))}
      {/* Patas del chip */}
      {[44, 52, 60, 68, 76, 84].map((y) => (
        <g key={y}>
          <rect x="59" y={y} width="5" height="3" className="fill-[var(--scn-pin)]" />
          <rect x="120" y={y} width="5" height="3" className="fill-[var(--scn-pin)]" />
        </g>
      ))}
      {[70, 78, 86, 94, 102, 110].map((x) => (
        <g key={x}>
          <rect x={x} y="33" width="3" height="5" className="fill-[var(--scn-pin)]" />
          <rect x={x} y="94" width="3" height="5" className="fill-[var(--scn-pin)]" />
        </g>
      ))}
      {/* Antena del módulo (meandro) */}
      <path d="M140 8 v9 h6 v-9 h6 v9 h6 v-9 h6 v9" className="fill-none stroke-[var(--scn-line)]" strokeWidth="1.4" />
    </svg>
  );
}

function HardwareObject() {
  return (
    <div className="scn-iso" style={{ top: 12 }}>
      <div className="scn-obj" style={{ width: 184, height: 132, marginLeft: -92, marginTop: -66 }}>
        <Shadow x={-8} y={-6} w={184} d={132} />
        <Part x={0} y={0} w={184} d={132} from={-36}>
          <Slab t={8} top="hw-board" tone="hw-slab">
            <BoardTop />
            {PULSES.map((p) => (
              <span
                key={p.name}
                className="hw-pulse scn-anim"
                style={{ animationName: p.name, animationDuration: `${p.t}s`, animationDelay: `${p.delay}s` }}
              />
            ))}
          </Slab>
        </Part>
        {/* Señal: anillos sobre la placa, alrededor del chip */}
        <div className="scn-face hw-rings" style={{ left: 92, top: 66 }}>
          {[0, -0.87, -1.74].map((delay) => (
            <span key={delay} className="hw-ring scn-anim" style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
        {/* Y sale por la antena: tres arcos que se encienden de adentro hacia afuera */}
        <span className="scn-face scn-bill hw-wave" style={{ left: 152, top: 12, "--bz": "14px", "--by": "-100%", "--d": "0.7s" } as Vars}>
          {[5, 10, 15].map((r, i) => (
            <i key={r} className="hw-arc scn-anim" style={{ "--r": `${r}px`, animationDelay: `${i * 0.22}s` } as Vars} />
          ))}
        </span>
        <Part x={64} y={38} w={56} d={56} z={8} from={140} delay={0.28} loop="hw-hover">
          <Slab t={12} top="hw-chip" tone="scn-slab-dark" sheen>
            <span className="hw-pin1" />
            <LogoMark className="h-7 w-auto" />
          </Slab>
        </Part>
        <Part x={14} y={104} w={16} d={9} z={8} from={80} delay={0.5}>
          <Slab t={7} top="hw-cap" tone="hw-cap-slab" />
        </Part>
        <Part x={160} y={34} w={9} d={16} z={8} from={80} delay={0.56}>
          <Slab t={7} top="hw-cap" tone="hw-cap-slab" />
        </Part>
        <Part x={156} y={96} w={10} d={10} z={8} from={80} delay={0.62}>
          <Slab t={5} top="hw-led" tone="scn-slab-dark">
            <span className="hw-led-on scn-anim" />
          </Slab>
        </Part>
      </div>
    </div>
  );
}

/* ---------- Marketing: el embudo, del anuncio a la venta ---------- */

const RINGS = [
  { d: 164, y: -50 },
  { d: 122, y: -16 },
  { d: 84, y: 18 },
  { d: 48, y: 52 },
];
// Leyenda de cada anillo, ubicada a la derecha (fuera del giro, para que se lea siempre)
const FUNNEL_LABELS = [
  { text: "Ven el anuncio", x: 96, y: -47 },
  { text: "Hacen clic", x: 75, y: -15 },
  { text: "Consultan", x: 56, y: 17 },
  { text: "Compran", x: 38, y: 49 },
];
// Seis aristas del embudo (del borde del anillo de arriba al de abajo)
const WALLS = [0, 60, 120, 180, 240, 300];
const SALE_Y = 86;
/* Consultas que caen. `end` es el anillo donde se pierden (se van por el costado) y SALE_Y la
   venta. Muchas arriba, menos en cada etapa y dos que llegan: la forma del embudo. Cada una tarda
   según lo que cae, así las dos ventas tocan la moneda cada 1,6 s, cuando late */
const DROPS = [
  { a: 110, end: -50, delay: -0.7, s: 0.8 },
  { a: 20, end: -50, delay: -1.6, s: 1 },
  { a: 235, end: -50, delay: -2.1, s: 0.7 },
  { a: 160, end: -16, delay: -0.3, s: 1.1 },
  { a: 330, end: -16, delay: -1.2, s: 0.8 },
  { a: 60, end: -16, delay: -2, s: 0.9 },
  { a: 275, end: -16, delay: -1.7, s: 0.75 },
  { a: 250, end: 18, delay: -0.9, s: 1 },
  { a: 85, end: 18, delay: -2.3, s: 0.8 },
  { a: 190, end: 18, delay: -1.5, s: 0.9 },
  { a: 300, end: 52, delay: -1.1, s: 1 },
  { a: 130, end: 52, delay: -2.6, s: 0.85 },
  { a: 200, end: SALE_Y, delay: -0.4, s: 1.25 },
  { a: 330, end: SALE_Y, delay: -2, s: 1.25 },
];
// Radio del embudo a cada altura (de 82 arriba a 24 abajo)
const radiusAt = (y: number) => 82 - ((y + 50) / 102) * 58;

function dropStyle(p: (typeof DROPS)[number]) {
  const rad = (p.a * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const win = p.end === SALE_Y;
  // Adentro del embudo hasta su etapa; después sale por la pared
  const r1 = win ? 0 : radiusAt(p.end) * 0.72;
  const r2 = win ? 0 : radiusAt(p.end) + 22;
  const px = (n: number) => `${n.toFixed(1)}px`;
  return {
    "--x0": px(cos * 58),
    "--z0": px(sin * 58),
    "--x1": px(cos * r1),
    "--y1": `${p.end}px`,
    "--z1": px(sin * r1),
    "--x2": px(cos * r2),
    "--y2": `${p.end + 14}px`,
    "--z2": px(sin * r2),
    "--s": p.s,
    animationDuration: `${(2.2 + (p.end + 50) / 136).toFixed(2)}s`,
    animationDelay: `${p.delay}s`,
  } as Vars;
}

function MarketingObject() {
  return (
    <div className="mk-obj">
      {RINGS.map((r, i) => (
        <span
          key={r.d}
          className={`scn-face mk-ring ${i === 0 ? "mk-ring-top" : ""}`}
          style={{ width: r.d, height: r.d, marginLeft: -r.d / 2, marginTop: -r.d / 2, "--y": `${r.y}px`, "--d": `${0.08 + i * 0.1}s` } as Vars}
        />
      ))}
      {WALLS.map((a) => (
        <span key={a} className="scn-face mk-wall" style={{ "--a": `${a}deg`, "--d": "0.5s" } as Vars} />
      ))}
      {/* Las consultas caen dentro del volumen del embudo; con la tarjeta sin armar se ocultan
          juntas (visibility: una opacidad en este grupo 3D lo aplanaría) */}
      <div className="mk-drops">
        {DROPS.map((p, i) => (
          <span key={i} className={`mk-drop scn-anim ${p.end === SALE_Y ? "mk-drop-win" : p.end >= 18 ? "mk-drop-warm" : ""}`} style={dropStyle(p)} />
        ))}
      </div>
      <span className="scn-face mk-sale" style={{ "--d": "0.55s" } as Vars}>
        <span className="mk-spark scn-anim" />
        <span className="mk-sale-coin scn-anim">
          <CheckCircle size={18} weight="fill" aria-hidden="true" />
          <span className="scn-sheen" />
        </span>
      </span>
    </div>
  );
}

function FunnelLabels() {
  return (
    <ol className="mk-labels" aria-hidden="true">
      {FUNNEL_LABELS.map((l, i) => (
        <li key={l.text} className="scn-face" style={{ left: l.x, top: l.y, "--d": `${0.5 + i * 0.08}s` } as Vars}>
          {l.text}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Escena ---------- */

const OBJECTS: Record<ServiceKey, () => ReactNode> = {
  web: WebObject,
  software: SoftwareObject,
  ia: AgentObject,
  hardware: HardwareObject,
  marketing: MarketingObject,
};

/* `look` es la mirada del objeto hacia el puntero (escritorio): un giro extra, en 3D de verdad
   dentro de la perspectiva de la escena, que se suma a la inclinación de la tarjeta */
export function ServiceScene({ kind, look }: { kind: ServiceKey; look?: MotionValue<string> }) {
  const Object3D = OBJECTS[kind];
  return (
    <div className={`scn scn-${kind}`} aria-hidden="true">
      {/* Los objetos isométricos llevan su sombra en el plano; los que flotan, una en el piso */}
      {(kind === "ia" || kind === "marketing") && <span className="scn-face scn-floor" />}
      <motion.div className="scn-look" style={look ? { transform: look } : undefined}>
        <div className="scn-rig">
          <Object3D />
        </div>
        {kind === "marketing" && (
          <div className="scn-overlay">
            <FunnelLabels />
          </div>
        )}
      </motion.div>
    </div>
  );
}
