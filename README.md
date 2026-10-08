# Solvit · Sitio web

Landing institucional de Solvit, Ingeniería y Desarrollo de Software.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) para animaciones
- Phosphor Icons
- Estructura shadcn/ui (`components.json`, `src/components/ui`, `cn()` en `src/lib/utils.ts`)
- Fuentes: Geist, Geist Mono y Michroma (solo logotipo)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Estructura

- `src/app/page.tsx`: composición de la página
- `src/components/`: secciones de la página (hero, portal de marca, servicios, vitrina, método, sectores, nosotros, contacto)
- `src/components/ui/`: componentes base reutilizables, al estilo shadcn
  - `glyph-portal.tsx`: cámara que entra por una letra al hacer scroll (MIT, Christian Katzmann)
  - `container-scroll-animation.tsx`: tarjeta 3D que se endereza con el scroll (Aceternity UI, adaptada)
- `src/app/api/contacto/route.ts`: endpoint del formulario (valida y registra la consulta)
- `src/app/globals.css`: tokens de marca (azul marino + azul eléctrico)

## shadcn/ui

`components.json` sigue el formato del CLI de shadcn, así que `npx shadcn@latest add <componente>`
instala en `src/components/ui` y usa `cn()` de `src/lib/utils.ts`. La carpeta `ui/` separa los
componentes base (sin contenido de Solvit) de las secciones que arman la página.

## Pendientes

- Reemplazar la recreación SVG del logo (`src/components/logo.tsx`) por el archivo original.
- Reemplazar las fotos de referencia de Unsplash (`src/lib/images.ts`) por fotografía propia.
- Conectar el formulario de contacto con el destino real (email, CRM o WhatsApp).
