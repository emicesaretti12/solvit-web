import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/toaster";
import { DEFAULT_THEME, JS_FLAG_SCRIPT, THEME_COLOR, ZOOM_GUARD_SCRIPT } from "@/lib/theme-config";
import "./globals.css";
import "./scenes.css";
import "./native.css";

/*
  Documento raíz. Un solo tema (claro): página blanca, tinta navy y azul eléctrico como acento.
  Se comporta como una app: sin zoom (viewport + ZOOM_GUARD_SCRIPT), instalable (manifest.ts,
  apple-icon.tsx y appleWebApp). native.css lleva la capa de plataforma (toque, scroll, áreas
  seguras). Tipografía: Manrope para todo y Geist Mono para datos.
*/

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEN Software · Ingeniería y desarrollo de software",
  description:
    "Desarrollo web, software a medida, agentes de IA, proyectos de software con hardware y marketing con contenido, redes y pauta: un solo equipo para que tu negocio venda más.",
  applicationName: "SEN Software",
  // App en la pantalla de inicio de iOS: ventana propia, barra de estado clara (el tema
  // principal) y nombre corto bajo el ícono
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SEN",
  },
  // Sin enlaces automáticos en números o direcciones: los que se tocan son los que pusimos
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: "SEN Software · Ingeniería y desarrollo de software",
    description:
      "Desarrollo web, software a medida, agentes de IA, proyectos de software con hardware y marketing, hechos por un mismo equipo para que vendas más.",
    siteName: "SEN Software",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR[DEFAULT_THEME],
  colorScheme: DEFAULT_THEME,
  width: "device-width",
  initialScale: 1,
  // Sin zoom, como una app (iOS Safari lo ignora para el pellizco: ver ZOOM_GUARD_SCRIPT)
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme={DEFAULT_THEME}
      // Next pone el scroll instantáneo al navegar entre páginas aunque el html tenga
      // scroll-behavior: smooth (las anclas se deslizan sin Lenis, ver native.css)
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Antes del primer pintado: la marca de JavaScript y el bloqueo del pellizco */}
        <script dangerouslySetInnerHTML={{ __html: `${JS_FLAG_SCRIPT};${ZOOM_GUARD_SCRIPT}` }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <SmoothScroll />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
