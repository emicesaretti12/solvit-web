# SEN Software · Sitio web

Landing institucional de SEN Software · Ing. & Soluciones.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`), GSAP + ScrollTrigger (secciones fijadas y apiladas) y Lenis (scroll suave)
- Sonner para avisos del formulario
- Phosphor Icons
- Estructura shadcn/ui (`components.json`, `src/components/ui`, `cn()` en `src/lib/utils.ts`)
- Fuentes: Geist, Geist Mono, Archivo (titulares) y Krona One (wordmark y portal)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Estructura

- `src/app/page.tsx`: composición de la página
- `src/components/`: secciones de la página (hero, portal de marca, servicios apilados, flujo de valor, vitrina, sectores, casos, nosotros, contacto)
- `src/components/previews/`: vistas vivas de cada servicio (CRM, agente de IA, nodo ESP32, embudo)
- `src/components/ui/`: componentes base reutilizables, al estilo shadcn
  - `glyph-portal.tsx`: cámara que entra por una letra al hacer scroll (MIT, Christian Katzmann)
  - `container-scroll-animation.tsx`: tarjeta 3D que se endereza con el scroll (Aceternity UI, adaptada)
  - `hero-1.tsx`: hero centrado con horizonte de luz
  - `area-chart-1.tsx`: tarjeta con gráfico de áreas (reaviz) y métricas, por props
  - `domino-gallery.tsx`: cartas que caen como dominó al hacer scroll (sectores, en escritorio)
  - `testimonials-columns-1.tsx`: columnas de testimonios en loop, pausables
  - `button.tsx`: botón de shadcn/ui con la forma del sitio
- `src/content/testimonials.tsx`: casos por industria que muestran las columnas de testimonios
- `src/app/api/contacto/route.ts`: endpoint del formulario (valida y registra la consulta)
- `src/app/globals.css`: tokens de marca (azul marino + azul eléctrico)

## shadcn/ui

`components.json` sigue el formato del CLI de shadcn, así que `npx shadcn@latest add <componente>`
instala en `src/components/ui` y usa `cn()` de `src/lib/utils.ts`. La carpeta `ui/` separa los
componentes base (sin contenido de SEN) de las secciones que arman la página.

## Pendientes

- Reemplazar la recreación SVG del isotipo y del wordmark (`src/components/logo.tsx`) por los
  archivos originales.
- Reemplazar las fotos de referencia de Unsplash (`src/lib/images.ts`) por fotografía propia.
- Conectar el formulario de contacto con el destino real (email, CRM o WhatsApp).
- **Testimonios:** hoy las columnas muestran situaciones típicas por industria (no son citas de
  clientes). Cuando haya testimonios reales, con permiso de cada cliente, cargarlos en
  `src/content/testimonials.tsx` con nombre, cargo y foto.
- El tablero de la vitrina usa datos de ejemplo (rotulados en pantalla); se pueden cambiar en
  `src/components/dashboard-chart.tsx`.
