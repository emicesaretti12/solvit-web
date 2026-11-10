import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { LogoMark, Wordmark } from "@/components/logo";
import { JsonLd } from "@/components/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { organizationSchema, websiteSchema } from "@/content/schema";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/content/site";
import { Toaster } from "@/components/toaster";
import { DEFAULT_THEME, INTRO_SCRIPT, JS_FLAG_SCRIPT, THEME_COLOR, ZOOM_GUARD_SCRIPT } from "@/lib/theme-config";
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
  // Dominio canónico: las URL relativas de los metadatos (canónica, imagen para compartir) salen de acá
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | SEN Software" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Verificación de Google Search Console: se completa con la variable de entorno al dar de alta el sitio
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
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
      lang="es-AR"
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
        {/* Carga: contador de 000 a 100 sobre navy y telón que se levanta (ver INTRO_SCRIPT y
            globals.css). El script lo mueve antes de que React hidrate: por eso el contador y el
            telón no avisan diferencias de hidratación */}
        <div id="intro" aria-hidden="true" className="intro" suppressHydrationWarning>
          <div className="intro-top flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-auto" />
              <Wordmark className="h-[0.95rem] w-auto text-white" />
            </span>
            <span className="text-[12px] uppercase tracking-[0.22em] text-white/55">Ingeniería y software</span>
          </div>
          <div className="intro-bottom">
            <p className="intro-count">
              <span data-n suppressHydrationWarning>
                000
              </span>
              <small>%</small>
            </p>
            <div className="intro-bar">
              <span data-bar suppressHydrationWarning />
            </div>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <SmoothScroll />
        {children}
        <Toaster />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </body>
    </html>
  );
}
