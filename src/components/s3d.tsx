"use client";

/*
  La S de SEN en 3D hecha con CSS (sin WebGL): cada cinta es una pila de capas SVG separadas en
  profundidad (translateZ), así tiene espesor y se ve el canto al girar. Todo es transform y
  opacidad: lo mueve el compositor del teléfono, no traba el scroll y no depende de WebGL.
  - focus 0, 1, 2: la cinta del paso se adelanta hacia la pantalla y se ilumina; las otras se
    apagan. focus -2 (crecer): la S armada, las tres encendidas
  - Al entrar en pantalla (play) las cintas llegan desde el fondo, giradas, y encajan en su
    lugar de a una; después la S se balancea despacio
  - Con reduced motion queda quieta en su pose final
*/
import { useId, type CSSProperties } from "react";

// Polígonos del isotipo (viewBox 515 x 787), los mismos de logo.tsx
const RIBBONS = [
  { points: "0,217 468,0 468,189 0,399", from: "#0052ff", to: "#1fdcff", z: 0 },
  { points: "0,399 280,273 515,391 232,515", from: "#002a9e", to: "#0064ff", z: -10 },
  { points: "52,594 515,391 515,584 52,787", from: "#0052ff", to: "#1fdcff", z: 0 },
];
// Cintas abiertas (pasos): hacia dónde se corre cada una, en % del ancho/alto y px de fondo
const OPEN = ["5%, -5%, 8px", "0%, 0%, -10px", "-5%, 5%, 4px"];
// Desde dónde llegan al entrar
const FROM = [
  "translate3d(40%, -45%, -260px) rotateY(-70deg) rotateZ(-18deg)",
  "translate3d(-55%, 0%, -320px) rotateY(80deg)",
  "translate3d(-40%, 45%, -260px) rotateY(-70deg) rotateZ(18deg)",
];
const LAYERS = 5; // capas por cinta: el espesor (pocas: cada una es una capa del compositor)
const GAP = 2.8; // px entre capas

export function S3D({ focus, play, className = "" }: { focus: number; play: boolean; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const assembled = focus === -2;
  return (
    <div aria-hidden="true" className={`relative aspect-[515/787] [perspective:700px] ${className}`}>
      <div className={`s3d-sway absolute inset-0 [transform-style:preserve-3d] ${play ? "" : "[animation-play-state:paused]"}`}>
        {RIBBONS.map((r, i) => {
          const focused = focus === i;
          const dim = focus >= 0 && !focused;
          // Pose: abierta con la cinta del paso adelante, o armada (crecer)
          const rest = assembled
            ? `translate3d(0, 0, ${r.z}px)`
            : `translate3d(${OPEN[i]}) translateZ(${focused ? 46 : r.z}px) scale(${focused ? 1.06 : 1})`;
          const style = {
            "--rest": rest,
            transform: play ? rest : FROM[i],
            opacity: play ? 1 : 0,
            transitionDelay: play ? `${(assembled ? 2 - i : i) * 0.14 + 0.1}s` : "0s",
          } as CSSProperties;
          return (
            <div
              key={i}
              className="s3d-ribbon absolute inset-0 [transform-style:preserve-3d] motion-reduce:![transform:var(--rest)] motion-reduce:!opacity-100 motion-reduce:!transition-none"
              style={style}
            >
              {Array.from({ length: LAYERS }, (_, k) => {
                const front = k === 0;
                return (
                  <svg
                    key={k}
                    viewBox="0 0 515 787"
                    className="absolute inset-0 size-full overflow-visible"
                    style={{ transform: `translateZ(${-k * GAP}px)`, opacity: dim ? 0.38 : 1 }}
                  >
                    {front && (
                      <defs>
                        <linearGradient id={`${id}-${i}`} x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0" stopColor={focused ? "#2d7bff" : r.from} />
                          <stop offset="1" stopColor={focused ? "#8fe6ff" : r.to} />
                        </linearGradient>
                      </defs>
                    )}
                    <polygon
                      points={r.points}
                      fill={front ? `url(#${id}-${i})` : k === LAYERS - 1 ? "#061a52" : "#0a2f8a"}
                      stroke={front ? "rgba(255,255,255,0.35)" : "none"}
                      strokeWidth={front ? 2 : 0}
                    />
                  </svg>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
