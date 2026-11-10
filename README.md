# SEN Software · Sitio web

Landing institucional de SEN Software · Ingeniería y desarrollo de software: desarrollo web,
software a medida, agentes de IA, hardware e IoT y marketing digital.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) para las animaciones ligadas al scroll y las transiciones; Lenis para
  el scroll suave
- three.js + React Three Fiber para el isotipo en 3D; canvas 2D para el globo y el valle de
  cintas; CSS 3D para los objetos de los servicios
- matter-js para las fichas que caen en el cierre (se carga recién al llegar)
- Sonner para avisos del formulario; Phosphor Icons y Simple Icons
- Fuentes: Manrope (todo) y Geist Mono (datos)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Estructura

- `src/app/page.tsx`: composición de la página (hero, trabajos, servicios, sistema, hechos,
  nosotros, cierre y pie)
- `src/app/globals.css`: tokens de marca (página blanca, tinta navy, azul eléctrico) y las
  clases de movimiento (texto letra por letra, entradas, botones pastilla, marquesinas)
- `src/app/native.css`: capa de app nativa (sin zoom ni rebote, áreas seguras); `manifest.ts`,
  `apple-icon.tsx` e `icons/`: app instalable
- `src/app/scenes.css`: objetos 3D en CSS de los servicios
- `src/components/three/`: escenario WebGL con el isotipo y sus partículas (poses del hero en
  `choreography.ts`)
- `src/components/site/`: las secciones y lo fijo de la página
  - `header.tsx` (logo, "Hablemos" y el menú en tarjetas), `section-nav.tsx` (puntos de
    sección), `contact-badge.tsx` (botón flotante a WhatsApp)
  - `hero.tsx`, con `globe.tsx` (globo de puntos) y `hills.tsx` (valle de cintas)
  - `demos/` (demostraciones paso a paso de web y de CRM, con su kit común), `magnetic.tsx`,
    `count-up.tsx` y `proximity-title.tsx` (piezas de movimiento)
  - `works.tsx` (últimos trabajos y vitrina de marcas), `services.tsx` (tarjetas que se apilan),
    `system.tsx` (el recorrido de una consulta por el sistema), `facts.tsx` (hechos en columnas que se mueven),
    `about.tsx` (manifiesto), `finale.tsx` y `tile-rain.tsx` (cierre con física y pie)
  - `lead-form.tsx` (correo y mensaje opcional), `split-text.tsx` y `page-observers.tsx`
    (entradas al entrar en pantalla y pausa de loops fuera de pantalla)
- `src/components/services-3d.tsx`: los objetos 3D de agentes de IA, proyectos híbridos y marketing
- `src/content/`: servicios, proyectos, contacto y navegación
- `src/app/api/contacto/route.ts`: endpoint del formulario (valida el correo y registra la consulta)

## Pendientes

- Reemplazar la recreación SVG del isotipo y del wordmark (`src/components/logo.tsx`) por los
  archivos originales.
- Reemplazar las portadas ilustradas de los proyectos (`public/projects/*.svg`) por capturas reales.
- Conectar el formulario de contacto con el destino real (email, CRM o WhatsApp).
- Sumar los logos reales de los clientes (hoy sus nombres van como marcas tipográficas en el
  hero y en la vitrina de marcas).
- Confirmar la ciudad que muestran el pie y el globo (Córdoba, Argentina).
- Las demostraciones y el recorrido del sistema usan datos de ejemplo (rotulados en pantalla).
