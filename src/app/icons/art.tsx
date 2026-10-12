import { ImageResponse } from "next/og";

/*
  Ícono de app del brand board: el isotipo (la S en tres cintas) sobre un cuadrado navy con
  borde azul. Una sola fuente para los PNG que pide la instalación (manifest.ts y
  apple-icon.tsx), generados con ImageResponse en el build. El isotipo es el mismo de
  src/components/logo.tsx (viewBox 515 × 787) con su degradé azul a cian.

  Tres cortes:
  - "rounded": el ícono como se ve en el board (esquinas redondeadas, borde azul y fondo
    transparente afuera). Para la instalación en escritorio y Android sin máscara
  - "full": cuadrado completo sin borde. iOS recorta su propia forma (y pinta de negro lo
    transparente), así que el fondo tiene que llegar a los bordes
  - "maskable": como "full", con el isotipo más chico para que entre en la zona segura de las
    máscaras de Android (un círculo de radio 40% del ancho)
*/
export type IconCut = "rounded" | "full" | "maskable";

const ISOTYPE = `<polygon points="0,399 280,273 515,391 232,515" fill="url(#fold)"/><polygon points="0,217 468,0 468,189 0,399" fill="url(#face)"/><polygon points="52,594 515,391 515,584 52,787" fill="url(#face)"/>`;

// Alto del isotipo respecto del lado del ícono (en el board, la mitad)
const MARK_HEIGHT: Record<IconCut, number> = { rounded: 0.5, full: 0.5, maskable: 0.42 };

function iconSvg(cut: IconCut) {
  const side = 512;
  const k = (side * MARK_HEIGHT[cut]) / 787;
  const x = (side - 515 * k) / 2;
  const y = (side - 787 * k) / 2;
  // Radio del board (28% del lado en el AppIcon de la página, un poco menos acá para que el
  // borde se lea en 192px) y borde azul al 50% dibujado hacia adentro
  const radius = cut === "rounded" ? 124 : 0;
  const border =
    cut === "rounded"
      ? `<rect x="5" y="5" width="502" height="502" rx="119" fill="none" stroke="#1f6bff" stroke-opacity="0.5" stroke-width="10"/>`
      : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"><defs><linearGradient id="bg" x1="0.32" y1="0" x2="0.68" y2="1"><stop offset="0" stop-color="#10264d"/><stop offset="1" stop-color="#031024"/></linearGradient><linearGradient id="face" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0052ff"/><stop offset="0.55" stop-color="#0a8bff"/><stop offset="1" stop-color="#1fdcff"/></linearGradient><linearGradient id="fold" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#002a9e"/><stop offset="1" stop-color="#0064ff"/></linearGradient></defs><rect width="${side}" height="${side}" rx="${radius}" fill="url(#bg)"/>${border}<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${k.toFixed(5)})">${ISOTYPE}</g></svg>`;
}

/** PNG cuadrado del ícono de app, del lado pedido. */
export function appIcon(size: number, cut: IconCut) {
  const src = `data:image/svg+xml;base64,${btoa(iconSvg(cut))}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse dibuja con Satori, no con next/image */}
        <img src={src} width={size} height={size} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
