# Design System: SEN Software · Ing. & Soluciones

Fuente: brand board de SEN (isotipo S en tres cintas plegadas, wordmark SEN extendido con el
corte de la N en azul,
fondo medianoche, versión clara, versión monocroma y app icon con la lista
SOFTWARE / HARDWARE / IA / MARKETING / CRECIMIENTO).

## 1. Visual Theme & Atmosphere

Una interfaz de ingeniería nocturna: casi negra, precisa y silenciosa, donde el azul
eléctrico del isotipo aparece solo como señal (logo, acciones, líneas de datos, luz).
Se siente como un tablero de control premium visto en la oscuridad: tipografía blanca
con aire, etiquetas en mayúsculas con tracking amplio como la bajada del logo, grano
sutil y luces difusas grises como las del brand board.

- **Density:** 5 (equilibrada: mucha información, bien espaciada en capítulos)
- **Variance:** 7 (asimétrica en el contenido, centrada solo en el hero de marca)
- **Motion:** 8 (cinemática: secciones fijadas al scroll, apilado, trazos que se dibujan, 3D)

## 2. Color Palette & Roles

- **Midnight Canvas** (#0A0F1B) — Fondo de toda la página (el fondo del brand board)
- **Deep Midnight** (#060A12) — Bandas y pies más profundos
- **Raised Navy** (#0E1422) — Superficie de tarjetas y paneles
- **Panel Navy** (#131A2A) — Núcleos internos, chips, inputs
- **Edge Navy** (#1B2336) — Bordes fuertes, hover de superficies
- **Whisper Line** (rgba(160,178,210,0.10)) — Divisores y bordes de 1px
- **Paper White** (#F4F6FA) — Titulares y texto principal (el wordmark)
- **Cool Steel** (#A7B0C0) — Texto secundario, bajadas, etiquetas (contraste 8.8:1)
- **Faint Steel** (#7B8597) — Metadatos (contraste 5.1:1)
- **SEN Electric** (#1F6BFF) — ÚNICO acento: CTA, foco, líneas activas, el corte de la N
  (blanco sobre este azul: 4.6:1). Degradé del isotipo: #0052FF → #1FDCFF (azul a cian),
  solo en el logo; el cian nunca se usa fuera del isotipo.
- **Electric Light** (#3D8BFF) — Acento sobre fondo oscuro para texto e íconos (5.8:1)

Prohibido: campos grandes de azul saturado, degradés violeta/azul "de IA", glows de neón,
negro puro, colores de serie fuera de marca (los gráficos usan azul y blanco).

## 3. Typography Rules

- **Display:** Archivo semi-expandida (font-stretch 112.5%), SemiBold, tracking -0.03em.
  Eco del wordmark extendido sin cansar en titulares largos.
- **Brand:** Krona One — solo el wordmark SEN (en vectores) y la palabra SEN del portal.
- **Body:** Geist 400/500, interlineado relajado, máximo ~65 caracteres por línea.
- **Mono:** Geist Mono — datos, métricas, timestamps, telemetría (números tabulares).
- **Labels:** Geist 11px, mayúsculas, tracking 0.32em, Cool Steel (como la bajada del logo).
  Máximo una etiqueta-eyebrow cada tres secciones.
- **Prohibido:** Inter, serifas, gradientes fuertes en titulares, títulos de más de 3 líneas.

## 4. Component Stylings

- **Botones:** pill. Primario SEN Electric con texto blanco y flecha en círculo anidado;
  secundario con borde Whisper Line. Feedback táctil scale(0.97) al presionar.
- **Tarjetas:** doble bisel — carcasa 2rem con borde de 1px y padding 6px, núcleo
  2rem − 6px en Raised Navy con brillo interno de 1px. Solo cuando la elevación ordena.
- **Vistas vivas:** mini interfaces reales (CRM con roles, chat del agente de IA, panel
  ESP32, embudo) rotuladas "Vista de ejemplo". Nunca capturas falsas armadas con divs.
- **Inputs:** etiqueta arriba, error abajo, 16px mínimo, foco en SEN Electric.
- **Toasts:** Sonner con superficie Raised Navy y borde Whisper Line.
- **Carga:** esqueletos con la forma final. Sin spinners genéricos.

## 5. Layout Principles

- Contenedor máximo 1200px, gutter 16px en móvil y 24px en escritorio.
- Capítulos con aire (py-32 a py-48). Cada sección usa una familia de layout distinta.
- Grilla CSS, nunca cuentas de porcentaje con flex. Menos de 768px: una sola columna.
- Alturas completas con min-h-[100svh] (hero) y nunca h-screen.
- Sin scroll horizontal en ningún ancho.

## 6. Motion & Interaction

- **Motores:** GSAP + ScrollTrigger para fijar, apilar y dibujar con el scroll; Motion para
  springs, 3D con el puntero y entradas; CSS para loops perpetuos (corre fuera del hilo principal).
  Lenis para inercia del scroll. Nunca GSAP y Motion sobre el mismo nodo.
- **Curvas:** ease-out cubic-bezier(0.23, 1, 0.32, 1); movimiento en pantalla
  cubic-bezier(0.77, 0, 0.175, 1). Springs stiffness 100 / damping 20. Nunca ease-in.
- **Cada animación tiene un propósito:** explicar el flujo, mostrar estado, dar feedback.
- Solo transform y opacity. Las animaciones se pausan fuera de pantalla.
- **Reduced motion:** sin inercia, sin fijados, sin loops; el contenido queda visible y quieto.

## 7. Anti-Patterns (Banned)

- Sin emojis. Sin Inter. Sin negro puro. Sin glows de neón ni degradés violeta.
- Sin campos de azul saturado a pantalla completa (el azul es señal, no fondo).
- Sin tres tarjetas iguales en fila. Sin etiquetas tipo "SECCIÓN 01".
- Sin guiones largos (—) en ningún texto. Sin "Scroll para explorar" ni flechas que rebotan.
- Sin nombres genéricos ni números inventados presentados como reales: los datos de
  ejemplo van rotulados como tales; los testimonios de muestra dicen "Nombre Apellido".
- Sin clichés: "Elevar", "Sin fisuras", "Desatá", "Next-Gen", "Revolucionario".
