/*
  Datos estructurados del sitio (schema.org). Solo hechos que la página también muestra: quién
  es SEN, dónde está, cómo contactarla, qué servicios ofrece y sus preguntas frecuentes.
*/
import { CONTACT } from "./contact-info";
import { SERVICES, type Faq, type Service } from "./services";
import { SITE_COUNTRY, SITE_DESCRIPTION, SITE_LOCALITY, SITE_NAME, SITE_URL } from "./site";

const ORG_ID = `${SITE_URL}/#organizacion`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "SEN Software · Ingeniería y desarrollo de software",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/any-512`,
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  telephone: CONTACT.tel.replace("tel:", ""),
  address: { "@type": "PostalAddress", addressLocality: SITE_LOCALITY, addressRegion: "Córdoba", addressCountry: SITE_COUNTRY },
  areaServed: [
    { "@type": "Place", name: "Sierras Chicas, Córdoba" },
    { "@type": "City", name: "Córdoba" },
    { "@type": "Country", name: "Argentina" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: CONTACT.tel.replace("tel:", ""),
    email: CONTACT.email,
    availableLanguage: "es",
    url: CONTACT.whatsapp,
  },
  knowsAbout: ["Desarrollo web", "Software a medida", "CRM", "Agentes de inteligencia artificial", "IoT", "ESP32", "Marketing digital"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.text, url: `${SITE_URL}/servicios/${s.slug}` },
    })),
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#sitio`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "es-AR",
  publisher: { "@id": ORG_ID },
};

export const faqSchema = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const serviceSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.heading,
  serviceType: s.title,
  description: s.seoDescription,
  url: `${SITE_URL}/servicios/${s.slug}`,
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "Argentina" },
});

export const breadcrumbSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/#servicios` },
    { "@type": "ListItem", position: 3, name: s.title, item: `${SITE_URL}/servicios/${s.slug}` },
  ],
});
