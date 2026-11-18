"use client";

/*
  Globo de puntos del hero (canvas 2D, sin librerías): los continentes dibujados con puntos
  sobre una esfera navy, con su retícula, girando despacio. Arranca mirando a Sudamérica y marca
  Córdoba, de donde es SEN, con un punto azul que late. Se puede girar con el mouse o el dedo
  (solo en horizontal: el vertical es del scroll) y sigue con inercia. No dibuja fuera de
  pantalla; con reduced motion queda quieto.

  LAND es la máscara de tierra del mundo a 3° por celda (120 × 60 bits, base64), generada una
  vez a partir de Natural Earth 1:110m (dominio público).
*/
import { useEffect, useRef } from "react";

const LAND =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgH/wHwAAAAAAAAAAAAAA8Mf/PwALAAAYAAAAAACY9OP/HwAAAATAAQAAAAAYfQP+HwAAQID/LwgAwAPA0x/8BwAwAOz///8B4f///3X8AQD+8+//////wP///z04YAD3//////9/4P//HwwwAMD7//////86AMH/H1wAAETz/////wcCAAD/f/wAAAT5/////wEDAAD+//0BAPr//////w8BAAD4/z8AAPj//////w8AAAD4/z8AAPi/3v///wsAAAD4/x8AALof7v///wkAAAD4/wcAAA7O3///bwAAAAD4/wcAAA7p3///XwQAAADw/wMAAHwA////DwMAAADg/wEAAP4Z////nwAAAACADwEAAP9/7///HwAAAAAADwAAgP//H///DwAAAAAABgIAgP///vj7AwAAAAAAThAAgP//fPB4AQAAAAAAeAAAwP//PXD4EAAAAAAAwAAAwP//D2DgAAAAAAAAgLgAgP//H2CAAAAAAAAAAPwAAP//HwAAIAAAAAAAAPwHAML/DwAQDAAAAAAAAPwHAID/BwBgBwAAAAAAAP4fAID/AwBAFgEAAAAAAP5/AAD/AQBAAA4AAAAAAP7/AAD/AQAAAxwAAAAAAPz/AAD/AQAAAAAAAAAAAPh/AAD/EwAAgAkAAAAAAPB/AAD/GQAA4BsAAAAAAOB/AAD/CAAA8B8AAAAAAOA/AAD+DAAA/D8AAAAAAPAPAAB+AAAA/H8AAAAAAPAPAAB+AAAA/H8AAAAAAPAHAAA8AAAA+H8AAAAAAPADAAAEAAAACDwAAAAAAPgBAAAAAAAAADhAAAAAAHgAAAAAAAAAAABAAAAAADAAAAAAAAAAAAAgAAAAADgAAAAAAAAAAAAQAAAAABgAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAACAAAAAA8ID//x8AAAAAAHAAAED3//f///8DAAAI9PIAgP////////8PAPj//x8A+P////////8HQPz//wM4/P////////8DAP7////8//////////8H//v/////////////////////////////////////";
const COLS = 120;
const ROWS = 60;
const RAD = Math.PI / 180;
// Córdoba, Argentina
const HOME = { lat: -31.4 * RAD, lon: -64.2 * RAD };

type Dot = { sinLat: number; cosLat: number; sinLon: number; cosLon: number };

function landDots(): Dot[] {
  const bin = atob(LAND);
  const dots: Dot[] = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const k = j * COLS + i;
      if (!((bin.charCodeAt(k >> 3) >> (k & 7)) & 1)) continue;
      const lat = (90 - (j + 0.5) * 3) * RAD;
      const lon = (-180 + (i + 0.5) * 3) * RAD;
      dots.push({ sinLat: Math.sin(lat), cosLat: Math.cos(lat), sinLon: Math.sin(lon), cosLon: Math.cos(lon) });
    }
  }
  return dots;
}

export function Globe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = landDots();
    const buckets: number[][] = [[], [], [], []];
    const tilt = -16 * RAD;
    const sinT = Math.sin(tilt);
    const cosT = Math.cos(tilt);
    let size = 0;
    let dpr = 1;
    let rot = HOME.lon + 0.12; // longitud al centro
    let vel = 0;
    let dragging = false;
    let lastX = 0;
    let visible = true;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      size = canvas.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr);
    };

    const project = (sinLat: number, cosLat: number, lon: number) => {
      const d = lon - rot;
      const cosD = Math.cos(d);
      const z = sinT * sinLat + cosT * cosLat * cosD;
      return { x: cosLat * Math.sin(d), y: cosT * sinLat - sinT * cosLat * cosD, z };
    };

    const draw = (now: number) => {
      const R = (size / 2) * dpr;
      const c = R;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
      grad.addColorStop(0, "#1b2744");
      grad.addColorStop(1, "#0a1020");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      // Retícula: meridianos y paralelos cada 30°
      ctx.lineWidth = Math.max(1, dpr * 0.6);
      ctx.strokeStyle = "rgb(255 255 255 / 0.16)";
      const line = (points: (t: number) => [number, number]) => {
        ctx.beginPath();
        let pen = false;
        for (let s = 0; s <= 60; s++) {
          const [lat, lon] = points(s / 60);
          const p = project(Math.sin(lat), Math.cos(lat), lon);
          if (p.z < 0) {
            pen = false;
            continue;
          }
          const px = c + p.x * R * 0.985;
          const py = c - p.y * R * 0.985;
          if (pen) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
          pen = true;
        }
        ctx.stroke();
      };
      for (let lon = -180; lon < 180; lon += 30) line((t) => [(-90 + t * 180) * RAD, lon * RAD]);
      for (let lat = -60; lat <= 60; lat += 30) line((t) => [lat * RAD, (-180 + t * 360) * RAD]);

      // Tierra: un punto por celda, más tenue hacia el borde. Sin trigonometría por punto (el
      // giro se aplica con el seno y el coseno ya calculados) y en cuatro tandas de opacidad:
      // un solo relleno por tanda en vez de uno por punto
      const s = Math.max(1.1 * dpr, R * 0.021);
      const sinR = Math.sin(rot);
      const cosR = Math.cos(rot);
      const k = R * 0.985;
      for (const path of buckets) path.length = 0;
      for (const d of dots) {
        const cosD = d.cosLon * cosR + d.sinLon * sinR;
        const z = sinT * d.sinLat + cosT * d.cosLat * cosD;
        if (z <= 0.02) continue;
        const sinD = d.sinLon * cosR - d.cosLon * sinR;
        const x = c + d.cosLat * sinD * k - s / 2;
        const y = c - (cosT * d.sinLat - sinT * d.cosLat * cosD) * k - s / 2;
        buckets[Math.min(3, (z * 4) | 0)].push(x, y);
      }
      for (let b = 0; b < 4; b++) {
        const path = buckets[b];
        if (!path.length) continue;
        ctx.fillStyle = `rgb(255 255 255 / ${0.34 + b * 0.22})`;
        ctx.beginPath();
        for (let i = 0; i < path.length; i += 2) ctx.rect(path[i], path[i + 1], s, s);
        ctx.fill();
      }

      // Córdoba
      const h = project(Math.sin(HOME.lat), Math.cos(HOME.lat), HOME.lon);
      if (h.z > 0.05) {
        const hx = c + h.x * R * 0.985;
        const hy = c - h.y * R * 0.985;
        const pulse = reduce ? 0.4 : (now / 1600) % 1;
        ctx.strokeStyle = `rgb(31 220 255 / ${(1 - pulse) * 0.9 * h.z})`;
        ctx.lineWidth = dpr * 1.2;
        ctx.beginPath();
        ctx.arc(hx, hy, R * (0.05 + pulse * 0.16), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#1f6bff";
        ctx.beginPath();
        ctx.arc(hx, hy, R * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(hx, hy, R * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        rot += (0.16 + vel) * dt;
        vel *= Math.pow(0.08, dt);
      }
      draw(now);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      vel = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const d = (-dx / Math.max(1, size)) * 2.4;
      rot += d;
      vel = vel * 0.6 + d * 60 * 0.4;
      if (reduce) draw(performance.now());
    };
    const onUp = () => (dragging = false);

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduce) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    if (reduce) draw(performance.now());
    else frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Globo terráqueo girando, con Córdoba, Argentina, marcada"
      className={`aspect-square touch-pan-y rounded-full ${className}`}
    />
  );
}
