import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/json-ld";
import { ContactBadge } from "@/components/site/contact-badge";
import { Faqs } from "@/components/site/faqs";
import { Finale } from "@/components/site/finale";
import { Header } from "@/components/site/header";
import { PageObservers } from "@/components/site/page-observers";
import { SplitText } from "@/components/site/split-text";
import { coverOf, PROJECTS } from "@/content/projects";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/content/schema";
import { serviceBySlug, SERVICES } from "@/content/services";

/*
  Página de un servicio (/servicios/<slug>). Cada servicio tiene su carpeta en
  src/app/servicios, que solo elige el slug; el contenido sale de content/services. Cada
  una responde una búsqueda concreta con su propio título, descripción, texto, entregables,
  proyectos donde se hizo y preguntas frecuentes, más sus datos estructurados.
*/
export function serviceMetadata(slug: string): Metadata {
  const service = serviceBySlug(slug);
  if (!service) return {};
  const url = `/servicios/${service.slug}`;
  return {
    title: { absolute: service.seoTitle },
    description: service.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url,
      type: "website",
      locale: "es_AR",
      siteName: "SEN Software",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.seoDescription,
      images: ["/opengraph-image"],
    },
  };
}

const STEPS = [
  "Nos contás cómo trabajás y qué querés resolver.",
  "Te mostramos dónde se pierden clientes o tiempo.",
  "Te proponemos una solución por etapas que podés medir.",
];

export function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const work = PROJECTS.filter((p) => service.work.includes(p.slug));
  const others = SERVICES.filter((s) => s.key !== service.key);

  return (
    <>
      <Header base="/" />
      <ContactBadge />
      <main id="main" className="relative z-10 w-full max-w-full flex-1">
        <section className="bg-paper px-5 pb-16 pt-32 md:px-[5.8vw] md:pb-[6vw] md:pt-[11vw]">
          <nav aria-label="Ruta" className="hero-fade text-[13px] text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#servicios" className="underline-offset-4 hover:underline">
                  Servicios
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {service.title}
              </li>
            </ol>
          </nav>
          <h1 className="mt-8 max-w-[16ch] text-[clamp(2.6rem,7vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.04em] text-balance text-ink">
            <SplitText text={service.heading} />
          </h1>
          <p className="hero-fade mt-8 max-w-[52ch] text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.45] text-ink-muted [--d:200ms]">
            {service.lead} {service.text}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3 [--d:320ms]">
            <a
              href="#contacto"
              className="pill inline-flex h-14 items-center gap-3 rounded-full bg-ink px-8 text-[16px] font-medium text-white"
            >
              <span className="roll">
                <span>Pedí tu diagnóstico</span>
                <span aria-hidden="true">Pedí tu diagnóstico</span>
              </span>
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section aria-labelledby="que-hacemos" className="bg-mist px-5 py-20 md:px-[5.8vw] md:py-[7vw]">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-[7vw]">
            <div>
              <h2
                id="que-hacemos"
                className="text-[clamp(1.9rem,3.6vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
              >
                Qué hacemos
              </h2>
              <div className="mt-8 grid gap-5 text-[18px] leading-[1.6] text-ink-muted">
                {service.body.map((paragraph) => (
                  <p key={paragraph} data-reveal className="rise max-w-[62ch]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div data-reveal className="rise self-start rounded-[2rem] bg-night p-8 text-white md:p-10">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/60">Qué incluye</h2>
              <ul className="mt-6 grid gap-4 text-[19px]">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-500">
                      <Check size={14} weight="bold" aria-hidden="true" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {work.length > 0 && (
          <section aria-labelledby="proyectos" className="bg-paper px-5 py-20 md:px-[5.8vw] md:py-[7vw]">
            <h2
              id="proyectos"
              className="text-[clamp(1.9rem,3.6vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
            >
              Proyectos donde lo hicimos
            </h2>
            <ul className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {work.map((project) => {
                const body = (
                  <>
                    <div className="cover relative aspect-[16/10] overflow-hidden rounded-3xl bg-night">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverOf(project)}
                        alt={`Portada de ${project.name}`}
                        loading="lazy"
                        decoding="async"
                        width={1600}
                        height={900}
                        className="cover-img size-full object-cover"
                      />
                    </div>
                    <p className="mt-5 text-[12.5px] uppercase text-ink">
                      {project.kind} · {project.sector}
                    </p>
                    <h3 className="mt-2 flex items-center gap-2 text-[26px] leading-tight tracking-[-0.03em] text-ink">
                      {project.name}
                      {project.url && <ArrowUpRight size={18} aria-hidden="true" />}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{project.summary}</p>
                  </>
                );
                return (
                  <li key={project.slug} data-reveal className="rise rise-flat">
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noreferrer" className="block">
                        {body}
                        <span className="sr-only"> (se abre en otra pestaña)</span>
                      </a>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="como-trabajamos" className="bg-paper px-5 pb-20 md:px-[5.8vw] md:pb-[7vw]">
          <h2
            id="como-trabajamos"
            className="text-[clamp(1.9rem,3.6vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
          >
            Cómo trabajamos
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step} data-reveal className="rise border-t border-ink/15 pt-5">
                <span className="tabular text-[13px] font-semibold text-blue-400">Paso {i + 1}</span>
                <p className="mt-2 text-[19px] leading-[1.35] text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <Faqs faqs={service.faqs} title={`Preguntas sobre ${service.title.toLowerCase()}`} />

        <section aria-labelledby="otros" className="bg-mist px-5 py-16 md:px-[5.8vw] md:py-[5vw]">
          <h2 id="otros" className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Otros servicios
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <a
                  href={`/servicios/${s.slug}`}
                  className="pill inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] text-ink shadow-[0_0_0_1px_rgb(var(--fg-rgb)/0.08)] [--pill-fill:var(--ink)]"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Finale base="/" />
      </main>
      <JsonLd data={[serviceSchema(service), breadcrumbSchema(service), faqSchema(service.faqs)]} />
      <PageObservers />
    </>
  );
}
