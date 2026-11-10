/*
  Los cinco trabajos de SEN, en el orden en que se presentan: desarrollo web, software a medida,
  agentes de IA, proyectos híbridos (software con hardware) y marketing (contenido, redes y
  pauta). Cada uno tiene su objeto 3D en CSS (services-3d.tsx), sus entregables y los proyectos
  reales donde lo hicimos (slugs de content/projects); los textos solo describen lo que el
  equipo hace.
*/
export type ServiceKey = "web" | "software" | "ia" | "hardware" | "marketing";

export type Faq = { q: string; a: string };

export type Service = {
  key: ServiceKey;
  /** Dirección de su página: /servicios/<slug> */
  slug: string;
  /** Título y descripción de su página para buscadores */
  seoTitle: string;
  seoDescription: string;
  /** Título visible de su página (con la búsqueda que responde) */
  heading: string;
  /** Explicación larga de su página: qué es, para quién y cómo lo hacemos */
  body: string[];
  /** Preguntas frecuentes de su página (solo lo que SEN realmente hace) */
  faqs: Faq[];
  title: string;
  /** Promesa corta, en una línea */
  lead: string;
  text: string;
  deliverables: string[];
  /** Proyectos entregados donde se ve este trabajo (slugs de content/projects) */
  work: string[];
};

export const SERVICES: Service[] = [
  {
    key: "web",
    slug: "desarrollo-web",
    seoTitle: "Desarrollo web en Córdoba: sitios, tiendas y landings",
    seoDescription:
      "Diseño y desarrollo de sitios web, tiendas online y landings en Córdoba, Argentina. Rápidos en el celular, con SEO local y medición desde el primer día.",
    heading: "Desarrollo web en Córdoba",
    body: [
      "Diseñamos y desarrollamos sitios web, tiendas online, catálogos y landings para negocios de Córdoba y de toda Argentina. Cada sitio se piensa para un objetivo: que la persona que te busca te encuentre, entienda qué ofrecés y te consulte.",
      "Trabajamos con Next.js y sitios prerenderizados, que cargan rápido en el celular aunque la conexión sea mala. Dejamos el SEO técnico resuelto desde el inicio (títulos, datos estructurados, sitemap, páginas por servicio y por zona) y conectamos la medición para saber de dónde llega cada consulta.",
      "El sitio queda conectado a WhatsApp, a tus formularios y, si lo necesitás, a un CRM o a un catálogo que podés editar vos.",
    ],
    faqs: [
      { q: "¿Qué tipo de sitios web desarrollan?", a: "Sitios institucionales, tiendas y catálogos online, y landings para campañas. También sitios conectados a una base de datos o a un CRM propio." },
      { q: "¿El sitio queda optimizado para Google?", a: "Sí. Entregamos el SEO técnico resuelto: carga rápida en el celular, títulos y descripciones por página, datos estructurados, sitemap y páginas de aterrizaje para búsquedas locales." },
      { q: "¿Trabajan solo en Córdoba?", a: "Estamos en Córdoba y trabajamos con negocios de toda Argentina. Las reuniones pueden ser presenciales o por videollamada." },
    ],
    title: "Desarrollo web",
    lead: "Webs que se convierten en consultas.",
    text: "Sitios, tiendas y landings rápidos en el celular, con SEO y medición desde el primer día.",
    deliverables: ["Sitios institucionales", "Tiendas y catálogos", "Landings para campañas", "SEO local"],
    work: ["baterias-cordoba", "adami-industrial", "rental-cordoba"],
  },
  {
    key: "software",
    slug: "software-a-medida",
    seoTitle: "Software a medida en Córdoba: CRM, reservas e inventario",
    seoDescription:
      "Software a medida en Córdoba, Argentina: CRM, sistemas de reservas, inventario y paneles de gestión con usuarios por rol, a la forma de tu equipo.",
    heading: "Software a medida y CRM",
    body: [
      "Desarrollamos sistemas de gestión a medida: CRM para ordenar consultas y ventas, sistemas de reservas, control de inventario y paneles con usuarios por rol. En lugar de adaptar tu negocio a un programa genérico, el sistema se arma según cómo trabaja tu equipo.",
      "Un CRM a medida te muestra cada consulta con su vendedor y su etapa, desde que entra hasta que se cierra la venta. Cada rol (administrador, supervisor, ventas, soporte) ve y hace solo lo que le corresponde.",
      "Los sistemas se conectan con tu sitio web, con WhatsApp y con tus campañas, para que la información no se cargue dos veces y puedas saber qué canal trae cada venta.",
    ],
    faqs: [
      { q: "¿Qué es un CRM a medida?", a: "Es un sistema para gestionar consultas y clientes hecho para tu forma de vender: tus etapas, tus roles y tus reportes, sin funciones que no usás." },
      { q: "¿Qué sistemas desarrollan además de CRM?", a: "Sistemas de reservas, control de inventario, catálogos editables y paneles de gestión con usuarios por rol." },
      { q: "¿El sistema se puede conectar con mi web y WhatsApp?", a: "Sí. Conectamos el sistema con tu sitio, tus formularios y WhatsApp para que cada consulta entre sola al CRM." },
    ],
    title: "Software a medida",
    lead: "Sistemas hechos a la forma de tu equipo.",
    text: "CRM, reservas, inventario y paneles de gestión con usuarios por rol, pensados para cómo trabajás.",
    deliverables: ["CRM", "Reservas", "Inventario", "Paneles por rol"],
    work: ["motobox-cordoba", "non-sistemas-reservas"],
  },
  {
    key: "ia",
    slug: "agentes-de-ia",
    seoTitle: "Agentes de IA para WhatsApp e Instagram | SEN Software",
    seoDescription:
      "Agentes de inteligencia artificial que atienden por WhatsApp, Instagram y tu web a cualquier hora, responden dudas y derivan a ventas a quien quiere comprar.",
    heading: "Agentes de IA para WhatsApp, Instagram y tu web",
    body: [
      "Implementamos agentes de inteligencia artificial que atienden a tus clientes por WhatsApp, Instagram y el chat de tu web. Responden al instante, a cualquier hora, con la información de tu negocio.",
      "El agente resuelve las dudas frecuentes, califica cada consulta (qué busca la persona y qué tan cerca está de comprar) y le pasa a tu equipo solo a quien quiere avanzar, con el contexto de la conversación.",
      "Las consultas que atiende el agente quedan registradas en tu CRM, para que ninguna se pierda fuera de horario.",
    ],
    faqs: [
      { q: "¿Qué hace un agente de IA para WhatsApp?", a: "Atiende las consultas que llegan por WhatsApp de forma automática: responde dudas, pide los datos necesarios y deriva a un vendedor cuando la persona quiere comprar." },
      { q: "¿El agente reemplaza a mi equipo de ventas?", a: "No. Se ocupa de la primera respuesta y de las dudas repetidas, y le pasa a tu equipo las consultas listas para cerrar." },
      { q: "¿En qué canales funciona?", a: "En WhatsApp, Instagram y el chat de tu sitio web." },
    ],
    title: "Agentes de IA",
    lead: "Atención al instante, a cualquier hora.",
    text: "Responden por WhatsApp, Instagram y tu web, resuelven dudas y le pasan a tu equipo a quien quiere comprar.",
    deliverables: ["WhatsApp", "Instagram", "Chat web", "Calificación de consultas"],
    work: [],
  },
  {
    key: "hardware",
    slug: "hardware-iot",
    seoTitle: "Hardware e IoT con ESP32 a medida | SEN Software",
    seoDescription:
      "Proyectos de hardware e IoT en Córdoba, Argentina: placas ESP32, sensores y pantallas conectados a tu sistema, con telemetría y control a distancia.",
    heading: "Hardware e IoT: software y hardware conectados",
    body: [
      "Cuando la solución también es física, diseñamos el hardware y el software juntos: placas ESP32, sensores y pantallas que hablan con tu sistema y te muestran lo que pasa en tiempo real.",
      "Hicimos, por ejemplo, una canilla de cerveza automática controlada por un ESP32, con una pantalla animada para quien se sirve y telemetría del barril (flujo, válvula y stock).",
      "El mismo equipo desarrolla el firmware, la conexión y el panel de control, así que no dependés de coordinar varios proveedores.",
    ],
    faqs: [
      { q: "¿Qué tipo de proyectos de hardware hacen?", a: "Proyectos con placas ESP32, sensores y pantallas conectados a un sistema: telemetría, control a distancia y equipos automáticos." },
      { q: "¿También desarrollan el software del equipo?", a: "Sí. Hacemos el firmware, la conexión y el panel desde donde ves los datos y controlás el equipo." },
    ],
    title: "Proyectos híbridos",
    lead: "Software y hardware, conectados.",
    text: "Cuando la solución también es física: placas ESP32, sensores y pantallas que hablan con tu sistema y te muestran todo en tiempo real.",
    deliverables: ["ESP32 y sensores", "Pantallas", "Telemetría", "Control a distancia"],
    work: ["cerveceria-automatica"],
  },
  {
    key: "marketing",
    slug: "marketing-digital",
    seoTitle: "Marketing digital en Córdoba: contenido, redes y pauta",
    seoDescription:
      "Marketing digital en Córdoba, Argentina: creación de contenido, manejo de redes y pauta en Meta y Google, conectada a tu CRM para saber qué campaña trae cada venta.",
    heading: "Marketing digital: contenido, redes y pauta",
    body: [
      "Creamos el contenido, manejamos tus redes y pautamos en Meta (Instagram y Facebook) y en Google para traer consultas a tu negocio.",
      "La diferencia es la medición: conectamos las campañas con tu CRM, así sabés cuánta gente vio el anuncio, cuántos consultaron y cuántos compraron. Con ese dato se decide en qué campaña invertir.",
      "Como el mismo equipo hace tu web, tu agente de IA y tu CRM, la consulta que trae la campaña se atiende al instante y llega ordenada a tu vendedor.",
    ],
    faqs: [
      { q: "¿En qué plataformas pautan?", a: "En Meta (Instagram y Facebook) y en Google." },
      { q: "¿Cómo sé si la publicidad funciona?", a: "Conectamos las campañas con tu CRM para atribuir cada venta al anuncio que la trajo, y no medir solo clics." },
    ],
    title: "Marketing y contenido",
    lead: "Contenido, redes y pauta que traen clientes.",
    text: "Creamos el contenido, manejamos tus redes y pautamos en Meta y Google, conectado a tu CRM para saber qué campaña trae cada venta.",
    deliverables: ["Creación de contenido", "Community management", "Pauta en Meta y Google", "Atribución de ventas"],
    work: [],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

/* Preguntas frecuentes de la página principal (solo lo que SEN hace y ofrece) */
export const HOME_FAQS: Faq[] = [
  {
    q: "¿Qué hace SEN Software?",
    a: "Somos un equipo de ingenieros y desarrolladores de Córdoba, Argentina. Hacemos desarrollo web, software a medida (CRM, reservas, inventario), agentes de IA para WhatsApp e Instagram, proyectos de hardware e IoT y marketing digital.",
  },
  {
    q: "¿Con qué tipo de empresas trabajan?",
    a: "Con negocios y empresas que quieren vender más y ordenar su operación. Entregamos proyectos para rubros como motos, baterías, industria, salud, gastronomía y alquileres.",
  },
  {
    q: "¿Trabajan solo en Córdoba?",
    a: "Estamos en Córdoba y trabajamos con clientes de toda Argentina, de forma presencial o remota.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Con un diagnóstico sin compromiso: nos contás cómo vendés hoy, te mostramos dónde se pierden clientes y te proponemos una solución por etapas.",
  },
  {
    q: "¿Pueden hacer la web, el CRM y la publicidad juntos?",
    a: "Sí. Un mismo equipo hace el sitio, el agente de IA, el CRM y las campañas, y los deja conectados para que sepas qué campaña trajo cada venta.",
  },
];
