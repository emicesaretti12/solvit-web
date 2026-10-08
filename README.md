# Solvit · Sitio web

Landing institucional de Solvit, Ingeniería y Desarrollo de Software.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) para animaciones
- Phosphor Icons
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
- `src/components/`: secciones (hero, manifiesto, servicios, método, sectores, nosotros, contacto)
- `src/app/api/contacto/route.ts`: endpoint del formulario (valida y registra la consulta)
- `src/app/globals.css`: tokens de marca (azul marino + azul eléctrico)

## Pendientes

- Reemplazar la recreación SVG del logo (`src/components/logo.tsx`) por el archivo original.
- Reemplazar las fotos de referencia de Unsplash (`src/lib/images.ts`) por fotografía propia.
- Conectar el formulario de contacto con el destino real (email, CRM o WhatsApp).
