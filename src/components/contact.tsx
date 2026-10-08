import { Reveal } from "./reveal";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[560px] w-[560px] rounded-full bg-blue-600/15 blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 py-24 md:px-6 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-blue-300">
            Diagnóstico inicial
          </p>
          <h2 className="max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Empecemos por tu cuello de botella.
          </h2>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-ink-muted">
            Contanos qué proceso te frena. Analizamos tu operación y te
            proponemos una solución concreta, sin compromiso.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[2rem] border border-line bg-white/[0.025] p-1.5">
          <div className="rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(255_255_255/0.06)]">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
