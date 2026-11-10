import { ImageResponse } from "next/og";

/*
  Imagen para compartir (WhatsApp, redes, buscadores): el isotipo y la promesa sobre el navy de
  la marca. Se genera en el build.
*/
export const alt = "SEN Software: desarrollo web, software a medida y agentes de IA en Córdoba";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 515 787"><defs><linearGradient id="face" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0052ff"/><stop offset="0.55" stop-color="#0a8bff"/><stop offset="1" stop-color="#1fdcff"/></linearGradient><linearGradient id="fold" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#002a9e"/><stop offset="1" stop-color="#0064ff"/></linearGradient></defs><polygon points="0,399 280,273 515,391 232,515" fill="url(#fold)"/><polygon points="0,217 468,0 468,189 0,399" fill="url(#face)"/><polygon points="52,594 515,391 515,584 52,787" fill="url(#face)"/></svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "linear-gradient(140deg, #0a1020, #0b2a66)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#8db8ff" }}>SEN SOFTWARE</div>
          <div style={{ marginTop: 28, fontSize: 68, fontWeight: 700, lineHeight: 1.06, letterSpacing: -2 }}>
            Tecnología que hace crecer tu negocio.
          </div>
          <div style={{ marginTop: 30, fontSize: 30, lineHeight: 1.35, color: "rgba(255,255,255,0.75)" }}>
            Desarrollo web · Software a medida · Agentes de IA · IoT · Marketing
          </div>
          <div style={{ marginTop: 26, fontSize: 26, color: "#1fdcff" }}>Córdoba, Argentina · sensoftware.com.ar</div>
        </div>
        <img alt="" width={236} height={360} src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`} />
      </div>
    ),
    size,
  );
}
