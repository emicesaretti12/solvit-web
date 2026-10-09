# Design System: SEN Software · Ing. & Soluciones

Fuente: brand board de SEN. Isotipo S en tres cintas plegadas, wordmark SEN extendido con el
corte de la N en azul, versión oscura (navy medianoche), versión clara (blanco frío con el
wordmark navy), versión monocroma y app icon con la lista SOFTWARE / HARDWARE / IA /
MARKETING / CRECIMIENTO.

## 1. Visual Theme & Atmosphere

La web de una startup de ingeniería aplicada: precisa, silenciosa y con movimiento que explica.
El tema oscuro (por defecto) es un navy medianoche profundo donde el azul eléctrico del isotipo
aparece solo como señal: logo, acciones, líneas de datos y luz. El tema claro es la versión
clara del board: blanco frío, tipografía navy y el mismo azul. Etiquetas en mayúsculas con
tracking amplio como la bajada del logo, grano sutil y luces difusas.

- **Density:** 5 (equilibrada: mucha información, bien espaciada en capítulos)
- **Variance:** 7 (asimétrica en el contenido, centrada solo en el hero)
- **Motion:** 8 (cinemática: secciones fijadas al scroll, apilado, trazos que se dibujan, 3D)

## 2. Color Palette & Roles

Los roles son tokens (`--navy-*`, `--ink-*`, `--line*`) que cambian con `data-theme` en `<html>`.

| Rol | Oscuro | Claro |
| --- | --- | --- |
| Fondo de página (`navy-900`) | #031024 (navy del board) | #F6F8FB |
| Bandas profundas (`navy-950`) | #010A18 | #E9EDF4 |
| Superficie de tarjetas (`navy-850`) | #07162D | #FFFFFF |
| Paneles, chips, inputs (`navy-800`) | #0C1D38 | #EEF2F7 |
| Bordes fuertes y hover (`navy-700`) | #142849 | #E1E7F0 |
| Texto principal (`ink`) | #F4F6FA | #0B1222 |
| Texto secundario (`ink-muted`) | #A7B0C0 | #46526A |
| Metadatos (`ink-faint`) | #7B8597 | #616C80 |
| Líneas (`line` / `line-strong`) | gris azulado al 10 % / 18 % | navy al 9 % / 16 % |

- **SEN Electric** (#1F6BFF): ÚNICO acento. CTA, foco, líneas activas, el corte de la N
  (blanco sobre este azul: 4.6:1; el hover oscurece a #1556F0, nunca aclara).
- **Electric para texto** (`blue-400`/`blue-300`): #3D8BFF/#8DB8FF en oscuro; en claro se
  oscurecen a #1A5FE6/#1652C9 para leerse como texto.
- **Capas translúcidas:** color `fg` (blanco en oscuro, navy en claro): `bg-fg/5`,
  `border-fg/10`. Nunca `bg-white/x` para superficies.
- **Isotipo:** degradé #0052FF → #1FDCFF (azul a cian) solo en el logo; el cian no se usa fuera.

Prohibido: campos grandes de azul saturado, degradés violeta/azul "de IA", glows de neón,
negro puro, colores de serie fuera de marca (los gráficos usan azul y blanco o navy).

## 3. Typography Rules

- **Display:** Archivo semi-expandida (font-stretch 112.5%), SemiBold, tracking -0.035em.
  Eco del wordmark extendido sin cansar en titulares largos.
- **Brand:** Krona One: solo el wordmark SEN (en vectores) y la palabra SEN del portal.
- **Body:** Geist 400/500, interlineado relajado, máximo ~65 caracteres por línea.
- **Mono:** Geist Mono: datos, métricas, horarios, telemetría (números tabulares).
- **Labels:** Geist 11px, mayúsculas, tracking 0.32em, `ink-muted` (como la bajada del logo).
- **Prohibido:** Inter, serifas, gradientes fuertes en titulares, títulos de más de 3 líneas.

## 4. Component Stylings

- **Botones:** pill. Primario SEN Electric con texto blanco y flecha en círculo anidado;
  secundario con borde de línea. Feedback táctil scale(0.97) al presionar. 44px táctiles.
- **Tarjetas:** doble bisel: carcasa 2rem con borde de 1px y padding 6px, núcleo
  2rem - 6px en `navy-850`. Solo cuando la elevación ordena.
- **Vistas vivas:** mini interfaces reales (CRM con roles, chat del agente de IA, embudo y el
  nodo ESP32 del proyecto de la cervecería) rotuladas "Vista de ejemplo", con pausa.
  Cada vista muestra un solo sistema: nunca se mezclan datos de proyectos distintos.
- **Proyectos:** portadas de estudio con el dominio real; solo hechos confirmados.
- **Inputs:** etiqueta arriba, error abajo (token `destructive`), 16px mínimo, foco azul.
- **Toasts:** Sonner siguiendo el tema elegido, superficie `navy-850` y borde de línea.
- **Tema:** botón en el header; el script del layout aplica la preferencia guardada antes
  de pintar (sin parpadeo).
- **Carga:** esqueletos con la forma final. Sin spinners genéricos.

## 5. Layout Principles

- Contenedor máximo 1200px, gutter 16px en móvil y 24px en escritorio.
- Capítulos con aire (py-24 a py-36). Cada sección usa una familia de layout distinta.
- Grilla CSS, nunca cuentas de porcentaje con flex. Menos de 768px: una sola columna.
- Alturas completas con min-h-[100svh] y nunca h-screen.
- Sin scroll horizontal en ningún ancho.

## 6. Motion & Interaction

- **Motores:** GSAP + ScrollTrigger para fijar, apilar y dibujar con el scroll; Motion para
  springs, layout y entradas; CSS para loops perpetuos (marquesinas, pulsos).
  Lenis para inercia del scroll. Nunca GSAP y Motion sobre el mismo nodo.
- **Escritorio y móvil:** las mismas animaciones; en celulares con versiones compactas
  (variantes `stack:` y `stack-sm:`, consultas `STACK_QUERY` y `STACK_SM_QUERY`).
- **Curvas:** ease-out cubic-bezier(0.23, 1, 0.32, 1); movimiento en pantalla
  cubic-bezier(0.77, 0, 0.175, 1). Springs stiffness 100 / damping 20. Nunca ease-in.
- **Cada animación tiene un propósito:** explicar el flujo, mostrar estado, dar feedback.
- Solo transform y opacity. Las animaciones se pausan fuera de pantalla.
- **Reduced motion:** sin inercia, sin fijados, sin loops; el contenido queda visible y quieto.

## 7. Anti-Patterns (Banned)

- Sin emojis. Sin Inter. Sin negro puro. Sin glows de neón ni degradés violeta.
- Sin campos de azul saturado a pantalla completa (el azul es señal, no fondo).
- Sin tres tarjetas iguales en fila. Sin etiquetas tipo "SECCIÓN 01".
- Sin guiones largos en los textos. Sin "Scroll para explorar" ni flechas que rebotan.
- Sin nombres, testimonios, estrellas ni números inventados presentados como reales: los
  datos de ejemplo van rotulados y los casos por industria aclaran que no son citas.
- Sin clichés: "Elevar", "Sin fisuras", "Desatá", "Next-Gen", "Revolucionario".
