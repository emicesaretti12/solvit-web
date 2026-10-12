import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Krona_One } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/toaster";
import { DEFAULT_THEME, THEME_COLOR, THEME_SCRIPT, ZOOM_GUARD_SCRIPT } from "@/lib/theme-config";
import "./globals.css";
import "./scenes.css";
import "./native.css";

/*
  Documento raíz. El tema claro es el principal: el HTML sale con data-theme="light" y el
  script de <head> pasa a oscuro antes de pintar solo si quedó guardado (src/lib/theme.ts).
  Se comporta como una app: sin zoom (viewport + ZOOM_GUARD_SCRIPT), instalable (manifest.ts,
  apple-icon.tsx y appleWebApp) y con la barra del navegador del color del tema elegido.
  native.css lleva la capa de plataforma (toque, scroll, áreas seguras, cambio de tema).
*/

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titulares: Archivo con eje de ancho para usarla semi-expandida (eco del wordmark)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Logotipo y palabra del portal: extendida y pesada como el wordmark del brand board
const krona = Krona_One({
  variable: "--font-krona",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEN Software · Ingeniería y desarrollo de software",
  description:
    "Desarrollo web, software a medida, agentes de IA, hardware e IoT y marketing digital: un solo equipo de ingeniería para que tu negocio venda más.",
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
      "Desarrollo web, software a medida, agentes de IA, hardware e IoT y marketing, hechos por un mismo equipo para que vendas más.",
    siteName: "SEN Software",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Del tema claro; el script del layout y setTheme la cambian si el elegido es el oscuro
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
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${krona.variable} h-full antialiased`}
    >
      <head>
        {/* Antes del primer pintado: el tema guardado (sin parpadeo) y el bloqueo del pellizco */}
        <script dangerouslySetInnerHTML={{ __html: `${THEME_SCRIPT};${ZOOM_GUARD_SCRIPT}` }} />
      </head>
      <body className="grain flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
