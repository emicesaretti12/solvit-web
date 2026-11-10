"use client";

/*
  Lluvia de fichas del cierre: las herramientas con las que trabaja SEN caen con física real
  (matter-js, cargado recién cuando la sección asoma) y se apilan en el piso de la pantalla.
  Con mouse se pueden agarrar y tirar; en pantallas táctiles, un toque las hace saltar (el
  arrastre es del scroll). La simulación corre solo con la sección a la vista y las fichas se
  mueven con transform, fuera de React. Cuando la pila queda quieta, la simulación se duerme y
  no gasta nada hasta que alguien toca una ficha. Con reduced motion aparecen ya apiladas, quietas.
*/
import { useEffect, useRef } from "react";
import type Matter from "matter-js";
import {
  siCss,
  siEspressif,
  siGit,
  siGithub,
  siGoogleads,
  siHtml5,
  siInstagram,
  siJavascript,
  siMeta,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siWhatsapp,
} from "simple-icons";

const ICONS = [
  siNextdotjs,
  siReact,
  siTypescript,
  siTailwindcss,
  siSupabase,
  siWhatsapp,
  siVercel,
  siNodedotjs,
  siInstagram,
  siThreedotjs,
  siMeta,
  siPostgresql,
  siEspressif,
  siGoogleads,
  siJavascript,
  siGithub,
  siHtml5,
  siGit,
  siCss,
];

// Fondo y tinta de cada ficha: blancas, navy, grises y, cada tanto, una azul
const SKINS = [
  "bg-white text-ink",
  "bg-night text-white",
  "bg-[#dfe3ee] text-ink",
  "bg-white text-ink",
  "bg-[#565d70] text-white",
  "bg-night text-white",
  "bg-blue-500 text-white",
];

const MAX = 32;
const TILES = Array.from({ length: MAX }, (_, i) => ({
  icon: ICONS[i % ICONS.length],
  skin: SKINS[(i * 3 + (i >> 2)) % SKINS.length],
}));

export function TileRain() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-tile]"));
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const M = (await import("matter-js")).default;
      if (disposed) return;
      let w = el.clientWidth;
      let h = el.clientHeight;
      const count = Math.min(MAX, Math.max(14, Math.round(w / 44)));
      const base = Math.max(46, Math.min(86, w / 15));
      // Con las fichas ya apoyadas, matter las duerme: ahí la simulación (y el loop) se detiene
      const engine = M.Engine.create({ gravity: { x: 0, y: 1.15 }, enableSleeping: true });
      const wall = (x: number, y: number, ww: number, hh: number) => M.Bodies.rectangle(x, y, ww, hh, { isStatic: true });
      const T = 200;
      const floor = wall(w / 2, h + T / 2, w * 3, T);
      const left = wall(-T / 2, h / 2, T, h * 6);
      const right = wall(w + T / 2, h / 2, T, h * 6);
      M.Composite.add(engine.world, [floor, left, right]);

      const bodies: { body: Matter.Body; node: HTMLElement; size: number }[] = [];
      nodes.forEach((node, i) => {
        if (i >= count) {
          node.style.display = "none";
          return;
        }
        const size = Math.round(base * (0.82 + ((i * 37) % 10) / 22));
        const x = size + ((i * 0.618034) % 1) * (w - size * 2);
        const body = M.Bodies.rectangle(x, -size - i * (size * 0.9), size, size, {
          chamfer: { radius: size * 0.22 },
          restitution: 0.32,
          friction: 0.5,
          frictionAir: 0.012,
          angle: (((i * 53) % 40) - 20) * 0.02,
        });
        node.style.width = node.style.height = `${size}px`;
        bodies.push({ body, node, size });
      });
      M.Composite.add(
        engine.world,
        bodies.map((b) => b.body),
      );

      const paint = (all = false) => {
        for (const { body, node, size } of bodies) {
          // Una ficha dormida no se movió: no hace falta tocar su estilo
          if (body.isSleeping && !all) continue;
          node.style.transform = `translate3d(${body.position.x - size / 2}px, ${body.position.y - size / 2}px, 0) rotate(${body.angle}rad)`;
        }
      };

      let frame = 0;
      let visible = false;
      let last = 0;
      const loop = (now: number) => {
        const dt = Math.min(32, now - (last || now));
        last = now;
        M.Engine.update(engine, dt || 16.6);
        paint();
        // Sigue mientras se vea y quede alguna ficha en movimiento (o agarrada)
        const moving = held || bodies.some((b) => !b.body.isSleeping);
        frame = visible && moving ? requestAnimationFrame(loop) : 0;
      };
      let held = false;
      const wake = () => {
        if (visible && !frame) {
          last = 0;
          frame = requestAnimationFrame(loop);
        }
      };

      if (reduce) {
        // Sin animación: se simula la caída de una vez y se pintan ya apiladas
        for (let i = 0; i < 900; i++) M.Engine.update(engine, 16.6);
        paint(true);
        el.dataset.ready = "true";
      } else {
        const io = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible) el.dataset.ready = "true";
            wake();
          },
          { threshold: 0.35 },
        );
        io.observe(el);

        // Agarrar y tirar (mouse) o hacer saltar (toque)
        let grab: { constraint: Matter.Constraint; id: number } | null = null;
        const local = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const onDown = (e: PointerEvent) => {
          const node = (e.target as Element).closest<HTMLElement>("[data-tile]");
          const hit = bodies.find((b) => b.node === node);
          if (!hit) return;
          M.Sleeping.set(hit.body, false);
          if (!fine || e.pointerType !== "mouse") {
            wake();
            M.Body.setVelocity(hit.body, { x: (Math.random() - 0.5) * 8, y: -13 });
            M.Body.setAngularVelocity(hit.body, (Math.random() - 0.5) * 0.4);
            return;
          }
          e.preventDefault();
          const p = local(e);
          const constraint = M.Constraint.create({
            pointA: p,
            bodyB: hit.body,
            pointB: { x: p.x - hit.body.position.x, y: p.y - hit.body.position.y },
            stiffness: 0.12,
            damping: 0.1,
            length: 0,
          });
          M.Composite.add(engine.world, constraint);
          grab = { constraint, id: e.pointerId };
          held = true;
          wake();
          hit.node.style.zIndex = "3";
        };
        const onMove = (e: PointerEvent) => {
          if (!grab || e.pointerId !== grab.id) return;
          const p = local(e);
          grab.constraint.pointA = { x: p.x, y: Math.min(p.y, h) };
          if (grab.constraint.bodyB) M.Sleeping.set(grab.constraint.bodyB, false);
        };
        const onUp = (e: PointerEvent) => {
          if (!grab || e.pointerId !== grab.id) return;
          M.Composite.remove(engine.world, grab.constraint);
          grab = null;
          held = false;
        };
        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        const ro = new ResizeObserver(() => {
          w = el.clientWidth;
          h = el.clientHeight;
          M.Body.setPosition(floor, { x: w / 2, y: h + T / 2 });
          M.Body.setPosition(left, { x: -T / 2, y: h / 2 });
          M.Body.setPosition(right, { x: w + T / 2, y: h / 2 });
          // Lo que quedó afuera vuelve a caer desde arriba (y todas se despiertan: el piso cambió)
          for (const { body } of bodies) M.Sleeping.set(body, false);
          wake();
          for (const { body, size } of bodies) {
            if (body.position.x > w - size / 2 || body.position.y > h) {
              M.Body.setPosition(body, { x: size + Math.random() * Math.max(1, w - size * 2), y: -size });
              M.Body.setVelocity(body, { x: 0, y: 0 });
            }
          }
        });
        ro.observe(el);

        cleanup = () => {
          cancelAnimationFrame(frame);
          io.disconnect();
          ro.disconnect();
          el.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onUp);
          M.Engine.clear(engine);
        };
      }
    };

    // matter-js se pide recién cuando el cierre está por llegar
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        void start();
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(el);

    return () => {
      disposed = true;
      near.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="group/rain pointer-events-none absolute inset-0 overflow-hidden">
      {TILES.map((tile, i) => (
        <span
          key={i}
          data-tile
          title={tile.icon.title}
          className={`pointer-events-auto absolute left-0 top-0 grid size-16 touch-pan-y place-items-center rounded-[22%] opacity-0 shadow-[0_10px_24px_-14px_rgb(var(--shade-rgb)/0.6)] group-data-[ready=true]/rain:opacity-100 md:cursor-grab md:active:cursor-grabbing ${tile.skin}`}
          style={{ transform: "translate3d(0,-200px,0)" }}
        >
          <svg viewBox="0 0 24 24" className="size-[52%]" fill="currentColor">
            <path d={tile.icon.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}
