# SEN Software · Sitio web

Landing institucional de SEN Software · Ingeniería y desarrollo de software: desarrollo web,
software a medida, agentes de IA, hardware e IoT y marketing digital.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`), GSAP + ScrollTrigger y Lenis (scroll suave)
- three.js + React Three Fiber para el isotipo en 3D; CSS 3D para los objetos de los servicios
- Sonner para avisos del formulario
- Phosphor Icons
- Estructura shadcn/ui (`components.json`, `src/components/ui`, `cn()` en `src/lib/utils.ts`)
- Fuentes: Geist, Geist Mono, Archivo (titulares) y Krona One (wordmark)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Estructura

- `src/app/page.tsx`: composición de la página (hero, servicios, cómo funciona, recorrido,
  proyectos, nosotros, contacto)
- `src/app/globals.css`: tokens de marca (navy medianoche + azul eléctrico), temas (claro por
  defecto) y animaciones ligadas al scroll
- `src/app/native.css`: capa de app nativa (sin zoom ni rebote, áreas seguras, cambio de tema
  con View Transition); `manifest.ts`, `apple-icon.tsx` e `icons/`: app instalable
- `src/app/scenes.css`: escenas 3D en CSS (objetos de los servicios, mazo de celulares y la
  moneda del recorrido)
- `src/components/three/`: escenario WebGL con el isotipo y sus partículas (poses por sección en
  `choreography.ts`; en celulares la S vive solo en el hero)
- `src/components/ui/hero-01-utils/`: hero, header (menú como hoja inferior) y "Trabajamos con"
- `src/components/services.tsx` y `services-3d.tsx`: los cinco servicios con sus objetos 3D
- `src/components/how-it-works*.tsx`: los cuatro pasos de la venta (panel fijo en escritorio,
  tarjetas en celulares)
- `src/components/sales-flow*.tsx` y `journey-mobile.tsx`: el recorrido de una consulta
- `src/components/previews/`: vistas vivas de ejemplo (embudo, agente de IA, CRM)
- `src/components/projects.tsx` y `projects/`: proyectos (vitrina con el +10 en 3D, anillo de
  portadas en celulares, abanico en escritorio y laptops 3D de los casos destacados)
- `src/components/ui/`: componentes base al estilo shadcn (hero-01, portfolio-gallery,
  area-chart-1, sheet, navigation-menu, button)
- `src/content/`: servicios y proyectos
- `src/app/api/contacto/route.ts`: endpoint del formulario (valida y registra la consulta)

## shadcn/ui

`components.json` sigue el formato del CLI de shadcn, así que `npx shadcn@latest add <componente>`
instala en `src/components/ui` y usa `cn()` de `src/lib/utils.ts`. La carpeta `ui/` separa los
componentes base (sin contenido de SEN) de las secciones que arman la página.

## Pendientes

- Reemplazar la recreación SVG del isotipo y del wordmark (`src/components/logo.tsx`) por los
  archivos originales.
- Reemplazar las portadas ilustradas de los proyectos (`public/projects/*.svg`) por capturas reales.
- Conectar el formulario de contacto con el destino real (email, CRM o WhatsApp).
- Las vistas vivas y el tablero usan datos de ejemplo (rotulados en pantalla).
