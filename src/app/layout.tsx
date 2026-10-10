import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Krona_One } from "next/font/google";
import type { CSSProperties } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/toaster";
import { THEME_SCRIPT } from "@/lib/theme-config";
import "./globals.css";

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
  title: "SEN Software · Especialistas en solucionar tus ventas",
  description:
    "Marketing digital, agentes de IA que atienden por WhatsApp e Instagram y un CRM a tu medida: un solo equipo para que más consultas terminen en ventas.",
  openGraph: {
    title: "SEN Software · Especialistas en solucionar tus ventas",
    description:
      "Marketing, agentes de IA y CRM a medida, hechos por un mismo equipo para que más consultas terminen en ventas.",
    siteName: "SEN Software",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#031024",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

// Toasts con los colores de marca (variables propias de Sonner)
const toasterStyle = {
  "--normal-bg": "var(--navy-850)",
  "--normal-border": "var(--line-strong)",
  "--normal-text": "var(--ink)",
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${krona.variable} h-full antialiased`}
    >
      <head>
        {/* Fija el tema guardado antes del primer pintado (sin parpadeo); ver src/lib/theme.ts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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
        <Toaster position="bottom-right" containerAriaLabel="Notificaciones" style={toasterStyle} />
      </body>
    </html>
  );
}
