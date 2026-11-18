# Design System: SEN Software · Ing. & Soluciones

Marca: brand board de SEN (isotipo S en tres cintas plegadas con degradé azul a cian, wordmark
SEN con el corte de la N en azul, bajada "Ingeniería y desarrollo de software").
Dirección del sitio: una agencia de software viva y fluida. Página blanca, mucho aire,
tipografía grande y liviana, piezas navy redondeadas y movimiento en todas partes, siempre al
ritmo del scroll o del puntero.

## 1. Visual Theme & Atmosphere

Un solo tema, claro. La página es blanca; lo oscuro (botones, tarjetas de servicios, vitrina de
marcas, globo) es el navy de la marca, nunca negro puro. El azul eléctrico es señal: la palabra
en cursiva del hero, el punto de la sección activa, el foco, alguna ficha. El degradé azul a cian vive en el isotipo (3D en el hero) y en las cintas del valle.

- **Density:** 3 (pocas cosas por pantalla, cada una grande)
- **Variance:** 7 (titulares gigantes a la izquierda, piezas redondeadas a todo el ancho)
- **Motion:** 9 (todo entra, rueda, se apila o cae; nada se mueve sin motivo)

## 2. Color Palette & Roles

| Rol | Token | Valor |
| --- | --- | --- |
| Página | `paper` | #FFFFFF |
| Sección suave (nosotros) | `mist` | #F3F5F9 |
| Cierre e inputs | `haze` | #EEF1FB |
| Pastilla gris (menú) | `pill` | #E9ECF3 |
| Tinta, botones oscuros | `ink` | #0B1222 |
| Tarjetas y piezas oscuras | `night` | #0A1020 |
| Texto secundario | `ink-muted` | #46526A |
| Metadatos | `ink-faint` | #616C80 |
| Acento | `blue-500` | #1F6BFF |
| Cian del isotipo | `cyan` | #1FDCFF |

Los tokens `navy-*` siguen existiendo como roles de superficie para las vistas vivas y los
objetos 3D de los servicios.

Prohibido: negro puro, degradés violeta "de IA", glows, campos grandes de azul saturado.

## 3. Typography Rules

- **Todo:** Manrope. Titulares gigantes en peso 300 a 500 con tracking -0.04em a -0.055em;
  titulares de bloque en mayúsculas y peso 700 (vitrina de marcas, sistema, hechos).
- **Etiquetas:** mayúsculas de 11 a 13px; con tracking amplio (0.28em) solo las de sección.
- **Mono:** Geist Mono para números, índices y la barra de dirección de la ventana del sistema.
- **Wordmark SEN:** en vectores (Krona One trazada), solo en el logo.
- Cuerpo de 15 a 19px, interlineado 1.5, máximo ~46 caracteres por línea. Ningún texto de la
  interfaz baja de 11px; los párrafos nunca van enteros en mayúsculas.
- Enlaces y botones con al menos 44px de alto táctil.

## 4. Component Stylings

- **Encabezado:** fijo. Logo (sobre una pastilla esmerilada al bajar), "HABLEMOS •" navy y
  "MENÚ ••" gris. El menú son tres tarjetas en cascada: secciones (punto azul en la activa),
  "Dejanos tu correo" y WhatsApp. En celulares, solo el botón redondo.
- **Botones:** pastilla. Al pasar el mouse el relleno sube desde abajo y el texto rueda (sale
  por arriba y entra su copia). Feedback táctil scale(0.97).
- **Puntos de sección:** pastilla translúcida a la derecha, solo puntos; con el mouse, el
  nombre de cada sección aparece al lado de su punto.
- **Botón flotante:** el isotipo en un círculo blanco con "contacto" girando; va a WhatsApp.
- **Hero:** la S en 3D al centro (se gira con mouse o dedo), promesa a la izquierda con la
  palabra que rota, a quién le hablamos a la derecha, globo de puntos con Córdoba marcada,
  valle de cintas abajo y los clientes en marquesina.
- **Trabajos:** título gigante letra por letra; portadas grandes con radio 24px en dos columnas,
  etiqueta en mayúsculas y nombre enorme. Vitrina navy con las marcas en dos columnas que suben
  y bajan.
- **Servicios:** cinco tarjetas navy (radio 44px) que se apilan; a la derecha, un panel claro
  que muestra qué hace el servicio. Web y software a medida llevan una demostración paso a paso
  (un cliente busca, entra a la web y consulta; una consulta avanza por las etapas del CRM hasta
  la venta), con pasos que se pueden tocar. Los otros tres, su objeto 3D. En celulares las
  demos se reacomodan en vertical para que el texto se lea.
- **Sistema:** un panel navy que cuenta el recorrido de una sola consulta por tres estaciones en
  fila (el anuncio, el chat con el agente de IA y el CRM), unidas por una línea que se llena.
  Una pastilla "Consulta" viaja de estación en estación; la activa está al frente y corre su
  secuencia, las anteriores quedan resueltas y las siguientes, en espera. Arriba, una frase dice
  qué está pasando; abajo, tres pasos dejan elegir. En celulares se ve una estación por vez.
- **Hechos:** tres columnas de tarjetas en marquesina vertical. Solo hechos confirmados de cada
  proyecto: nunca reseñas ni números inventados.
- **Cierre:** pantalla fija color `haze` con "¡Hablemos!" gigante y fichas de herramientas que
  caen con física; el pie blanco sube y la tapa, con esquinas superiores redondeadas.
- **Inputs:** fondo `haze`, radio 16px, 16px mínimo de texto, anillo azul al enfocar.

## 5. Layout Principles

- A todo el ancho, con márgenes en vw (5 a 6vw en escritorio, 20px en celulares).
- Página: carga → hero → trabajos y marcas → servicios → sistema → hechos → nosotros → cierre y pie.
- Menos de 768px: una sola columna; las tarjetas de servicios van en fila, sin pila.
- Alturas completas con `svh`. Sin scroll horizontal en ningún ancho.

## 6. Motion & Interaction

- **Scroll suave:** Lenis con mouse y trackpad; en táctil, el scroll nativo.
- **Carga:** sobre navy, un contador grande sube de 000 a 100 con una barra azul a cian; llega a
  100 cuando la página terminó de cargar (mínimo 1,5 s) y el telón se levanta. Recién ahí entran
  el encabezado y el hero. Sin JavaScript o con reduced motion no hay telón.
- **Puntero:** los botones del encabezado y el de contacto son magnéticos (resorte); las letras
  de "¡Hablemos!" engordan cerca del mouse (Manrope variable).
- **Entradas:** `data-reveal` + un solo IntersectionObserver (`page-observers.tsx`). Los
  titulares entran letra por letra desde su máscara; los bloques suben; las portadas se abren de
  abajo hacia arriba con la imagen llegando desde un zoom.
- **Ligado al scroll:** la S se abre y atraviesa la cámara al dejar el hero; las portadas se
  desplazan dentro de su marco; las tarjetas de servicios se achican y se apagan al quedar
  debajo; las palabras del manifiesto se encienden.
- **Loops:** marquesinas (clientes, marcas, hechos), el globo, las cintas del valle, la palabra
  que rota, "contacto" girando. Todos se pausan fuera de pantalla; las marquesinas, además, con
  el mouse encima, y aceleran con la velocidad del scroll.
- **Números:** "+10" y los rubros cuentan desde cero al entrar en pantalla.
- **Física:** las fichas del cierre se pueden agarrar y tirar con el mouse; en táctil, un toque
  las hace saltar.
- **Curvas:** entradas con cubic-bezier(0.16, 1, 0.3, 1). Solo transform, opacity y clip-path.
- **Reduced motion:** sin scroll suave, sin telón de carga, sin loops; todo visible desde el
  primer cuadro; las fichas aparecen ya apiladas y el globo y el valle quedan quietos.
- **CSS:** las clases propias van en `@layer components` para que las utilidades puedan pisarlas.
- **Cursor:** el del sistema. No hay cursor propio.

### Presupuesto de cuadros

Reglas que salieron de medir la página (traza y perfil de CPU con el procesador frenado 4×):

- Solo `transform`, `opacity` y `clip-path`. Única excepción: el peso de las diez letras de
  "¡Hablemos!", solo con mouse y con `contain: layout`.
- Nada se mide durante el scroll: las posiciones de las secciones y las marcas del isotipo se
  miden al cargar y cuando cambia el tamaño; en el scroll solo se compara un número.
- Sin GSAP ni ScrollTrigger: Lenis corre con su propio `requestAnimationFrame`.
- Sin `will-change` permanente: cientos de letras promovidas a capas costaban más que el
  beneficio. El navegador promueve solo mientras algo se anima.
- Un loop que no se ve, no corre: canvas, WebGL, palabra que rota, marquesinas y demos se
  detienen fuera de pantalla. Las fichas del cierre se duermen cuando la pila queda quieta.
- Girar un SVG con texto sobre un trazo recalcula su layout en cada cuadro: se gira el
  contenedor HTML.
- Las marquesinas cambian de velocidad en escalones, no en cada cuadro (cada cambio reinicia la
  animación en el compositor).
- Las animaciones ligadas al scroll van en CSS (`animation-timeline`) cuando se puede: el
  manifiesto no usa JavaScript.

## 7. Anti-Patterns (Banned)

- Sin emojis. Sin negro puro. Sin glows ni manchas de luz.
- Sin testimonios, nombres ni números inventados presentados como reales.
- Sin fotos de stock: lo visual es la marca en 3D, las interfaces vivas y las portadas.
- Sin clichés: "Elevar", "Sin fisuras", "Desatá", "Next-Gen", "Revolucionario".
