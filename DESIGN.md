# Design System: SEN Software · Ing. & Soluciones

Fuente: brand board de SEN. Isotipo S en tres cintas plegadas, wordmark SEN extendido con el
corte de la N en azul y la bajada "Ingeniería y desarrollo de software", versión oscura (navy
medianoche), versión clara (blanco frío con el wordmark navy) y versión monocroma. El board
cierra con el ícono de app (la S sobre un cuadrado navy con borde azul) y los pilares Software,
Hardware, IA, Marketing y Crecimiento.

## 1. Visual Theme & Atmosphere

La web de un equipo de ingeniería que soluciona ventas con cinco servicios: desarrollo web,
software a medida, agentes de IA, hardware e IoT y marketing digital. El isotipo de SEN, en 3D
real (WebGL), abre el hero; en escritorio recorre la página (se abre en las tres etapas de una
venta, cada cinta es una etapa, y se vuelve a armar como crecimiento). Cada servicio tiene su
propio objeto 3D en CSS. El tema claro (por defecto) es la versión clara del board: blanco
frío, tipografía navy y el azul eléctrico solo como señal (el isotipo, el corte de la N, la
acción principal y el estado activo). El oscuro, un toque en el header, es un navy medianoche
plano con el mismo azul. La vitrina de proyectos es navy en los dos temas.

- **Density:** 3 (pocas cosas por pantalla, cada una con aire)
- **Variance:** 7 (titular a la izquierda y objeto a la derecha; en celulares, objeto arriba)
- **Motion:** 8 (cinemática y con sentido: el objeto cuenta el recorrido de la venta)

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

- **SEN Electric** (#1F6BFF): ÚNICO acento. CTA, foco, estado activo, el corte de la N.
- **Electric para texto** (`blue-400`/`blue-300`): #3D8BFF/#8DB8FF en oscuro; en claro se
  oscurecen a #1A5FE6/#1652C9 para leerse como texto.
- **Capas translúcidas:** color `fg` (blanco en oscuro, navy en claro): `bg-fg/5`,
  `border-fg/10`. Nunca `bg-white/x` para superficies.
- **Isotipo:** degradé #0052FF → #1FDCFF (azul a cian), también en el objeto 3D.

Prohibido: manchas de luz y retículas de fondo, glows, degradés violeta/azul "de IA", negro
puro, campos grandes de azul saturado. La única luz de la página es la del objeto 3D.

## 3. Typography Rules

- **Display:** Archivo semi-expandida (font-stretch 112.5%), Bold, tracking -0.04em, interlineado
  0.95. Titular del hero en 3 líneas como máximo.
- **Brand:** Krona One: solo el wordmark SEN (en vectores).
- **Bajada de marca:** "Ingeniería y desarrollo de software", en mayúsculas con tracking amplio
  solo en el lockup del logo y en los pilares del footer (como en el board). En el hero va como
  etiqueta normal, en minúscula de oración.
- **Body:** Geist 400/500, interlineado relajado, máximo ~65 caracteres por línea.
- **Mono:** Geist Mono: datos, métricas e índices de pasos (números tabulares).
- **Etiquetas:** en minúscula de oración (`text-sm`, `blue-300` o `ink-faint`). Sin pastillas con
  punto ni mayúsculas con tracking amplio.
- **Prohibido:** Inter, serifas, gradientes en titulares.

## 4. Component Stylings

- **Botones:** pill. Primario SEN Electric con texto blanco y flecha en círculo anidado;
  secundario como enlace de texto con flecha. Feedback táctil scale(0.97). 44px táctiles.
  Un solo texto para el contacto en todo el sitio: "Pedí tu diagnóstico".
- **Tarjetas:** un solo borde de 1px y radio 16 a 28px, solo cuando la elevación ordena. Nada
  de carcasas dobles.
- **Vistas vivas:** mini interfaces reales (embudo de campañas, chat del agente de IA, CRM con
  roles, tablero de la semana) con un ejemplo único y coherente (una moto 0km en cuotas). Una
  sola nota por sección aclara que son de ejemplo. Se pausan fuera de pantalla.
- **Servicios:** cinco tarjetas, una por servicio (desarrollo web, software a medida, agentes de
  IA, hardware e IoT, marketing digital), cada una con su objeto 3D en CSS, su promesa en una
  línea y sus entregables. En celulares son un mazo; en escritorio, una grilla con la de web
  grande (dos filas).
- **Proyectos:** solo hechos confirmados; la cervecería automática aparece solo como proyecto.
  Abren con una vitrina navy (igual en los dos temas: las portadas son oscuras y resaltan) con
  el "+10" en 3D (capas en profundidad, como el wordmark del pie); en celulares, un anillo 3D de
  portadas con scroll nativo y snap, con "3 / 10" y puntos; en escritorio, el abanico entero.
  Los casos destacados van en una laptop 3D en CSS que se abre con el scroll.
- **Hero:** el titular, el contacto, la prueba (más de 10 proyectos, con tres portadas) y los
  cinco servicios como íconos de app que llevan a su tarjeta (en el mazo de celulares, scroll
  calculado: la tarjeta llega entera arriba del mazo). En escritorio, a la izquierda de la S; en
  celulares, la S arriba, entera y centrada en su hueco, y en celulares bajos la frase cede su
  lugar a la S.
- **Inputs:** etiqueta arriba, error abajo, 16px mínimo, foco azul.
- **Tema:** claro por defecto; botón en el header y en el menú. El cambio es un círculo que
  crece desde el botón (View Transition). El script del layout aplica la preferencia guardada
  antes de pintar (sin parpadeo).
- **App nativa:** sin zoom (viewport y pellizco de iOS frenado), sin rebote ni pull-to-refresh,
  instalable (manifest e íconos), menú como hoja inferior que se cierra arrastrando, golpe
  háptico en los toques donde el teléfono lo permite.
- **Carga:** esqueletos con la forma final; el isotipo en SVG mientras carga WebGL.

## 5. Layout Principles

- Contenedor máximo 1200px, gutter 16px en móvil y 24px en escritorio.
- Página: hero → plataformas → servicios → Cómo funciona (atraer, atender, cerrar, crecer) →
  recorrido de una consulta → proyectos → nosotros → contacto. Cada bloque tiene un solo trabajo.
- Grilla CSS, nunca cuentas de porcentaje con flex. Menos de 768px: una sola columna.
- Alturas completas con min-h-[100svh] y nunca h-screen.
- Sin scroll horizontal en ningún ancho.

## 6. Motion & Interaction

- **Escenario 3D:** un solo canvas detrás del contenido (`src/components/three`). Las
  secciones dejan marcas `<StageMark pose="..."/>` y el director interpola la pose del isotipo
  entre la marca anterior y la siguiente según el scroll (poses en `choreography.ts`). El
  render se detiene cuando el objeto no se ve. three.js se carga solo en el cliente.
  En escritorio la S recorre la página y el texto del hero sube con ella siempre nítido (nada
  de fundidos ni escalas ligadas al scroll sobre el texto: lo dejaban lavado al lado de la S).
  En celulares nada se fija: con el scroll común la S se abre en capas (una vista explotada que
  conserva la silueta), avanza y atraviesa la cámara con las partículas como un flujo de datos,
  y se apaga, mientras el texto sube por encima. La S queda en su lugar de la pantalla (apenas
  sube): nunca persigue al texto con JS, porque con el scroll del dedo iría un cuadro atrás y se
  vería temblar. El canvas no dibuja mientras la S no se ve. Con reduced motion no hay
  transición: el escenario va al principio de la página y la S sube con el hero como una imagen.
- **Render liviano en celulares:** densidad de píxeles hasta 1,35 (baja sola si el equipo no
  llega a ~48 cuadros), ~1600 partículas y la laca sin clearcoat (la parte más cara del shader).
  Cualquier efecto nuevo del escenario se mide en un celular antes de sumarlo.
- **Titulares (celulares):** cada palabra se para en 3D sobre su base, de a una, al ritmo del
  dedo (MaskWords). Tarjetas grandes (galería, formulario, principios, cierre de proyectos) se
  paran desde inclinadas; los logos giran de canto a frente.
- **Cierre:** el wordmark del pie tiene volumen (capas en profundidad) y se para desde el piso
  al llegar al final.
- **Objetos 3D en CSS (servicios):** placas con espesor (cara de arriba y los dos cantos que ve
  la cámara) en un espacio isométrico, o capas en profundidad (`services-3d.tsx`,
  `scenes.css`). Se arman cuando llega su tarjeta (data-on) y corren su loop solo a la vista
  (data-live). Nunca opacidad sobre un elemento con preserve-3d (lo aplana): los fundidos van en
  las caras y los grupos 3D se ocultan con visibility.
- **Mazo de servicios (celulares):** cada tarjeta queda pegada debajo del header y la siguiente
  la tapa; la de abajo se inclina hacia atrás, se achica y se apaga, y el objeto de arriba gira
  con el scroll. Todo con animaciones ligadas al scroll en el compositor (sin soporte, el mazo
  se apila igual). Solo con 640px de alto o más; si no, lista común.
- **Capítulos:** contenedor alto con panel `sticky` (sin pin de GSAP) y cambio de paso con un
  barrido diagonal a 24,5°, la inclinación de las cintas del isotipo.
- **Gestos:** el isotipo se gira con el dedo o el mouse; resorte con la velocidad del gesto
  (amortiguación ~0,8). En touch solo el eje horizontal: el vertical es del scroll.
- **Curvas:** entradas cubic-bezier(0.16, 1, 0.3, 1); springs para gestos. Nunca ease-in.
- **Cada animación tiene un propósito:** contar el recorrido de la venta, mostrar estado o dar
  feedback. Solo transform, opacity y clip-path.
- **Reduced motion:** sin zambullida, sin apertura ni giros del isotipo; barridos como fundidos;
  el titular visible desde el primer cuadro; objetos de servicios armados y quietos, sin loops
  y sin mazo inclinado.
- **Moneda de venta:** en el recorrido de celulares, "Venta cerrada" gira una moneda con espesor
  (el check adelante, el isotipo atrás).
- **Loops pausados fuera de pantalla:** las secciones, las tarjetas de los pasos y la fila de la
  marquesina llevan `data-offscreen` mientras no se ven (`offscreen-pause.tsx`) y sus
  animaciones infinitas se pausan; el canvas WebGL deja de dibujar cuando la S no se ve.
- **Grano:** solo en escritorio (en un teléfono casi no se ve y es otra capa de pantalla
  completa para el compositor).

## 7. Anti-Patterns (Banned)

- Sin emojis. Sin Inter. Sin negro puro. Sin glows ni manchas de luz.
- Sin pastillas con punto ni etiquetas en mayúsculas sobre cada título.
- Sin tres tarjetas iguales en fila. Sin etiquetas tipo "SECCIÓN 01". Una sola marquesina.
- Sin guiones largos en los textos. Sin "Scroll para explorar" ni flechas que rebotan.
- Sin testimonios, nombres ni números inventados presentados como reales.
- Sin clichés: "Elevar", "Sin fisuras", "Desatá", "Next-Gen", "Revolucionario", "No somos X".
