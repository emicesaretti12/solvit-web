import type { MetadataRoute } from "next";
import { THEME_COLOR } from "@/lib/theme-config";

/*
  Manifest de la app instalable (PWA): se abre en su propia ventana, sin la barra del
  navegador, con los colores del tema claro (el principal) en la pantalla de carga y la barra
  de estado. Íconos generados desde el arte del brand board (src/app/icons/art.tsx).
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SEN Software",
    short_name: "SEN",
    description:
      "Desarrollo web, software a medida, agentes de IA, hardware e IoT y marketing digital: un solo equipo de ingeniería para que tu negocio venda más.",
    lang: "es-AR",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: THEME_COLOR.light,
    theme_color: THEME_COLOR.light,
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/any-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/any-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
