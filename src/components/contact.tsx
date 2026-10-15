import { MaskWords } from "./mask-words";
import { Reveal } from "./reveal";
import { ContactForm } from "./contact-form";

const NEXT_STEPS = [
  "Nos contás cómo vendés hoy.",
  "Te mostramos dónde se pierden clientes.",
  "Te proponemos una solución por etapas, con números.",
];

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="relative overflow-hidden border-t border-line">
      {/* La perspectiva es para la tarjeta del formulario, que en celulares se para en 3D al entrar */}
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 py-24 [perspective:1400px] md:px-6 md:py-36 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <h2
            id="contacto-titulo"
            className="font-display max-w-[14ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-5xl lg:text-[3.2rem]"
          >
            <MaskWords text="Contanos dónde se te escapan las ventas." />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-ink-muted">
              Diagnóstico sin compromiso, con el mismo equipo que después implementa la solución.
            </p>
            <div className="relative mt-10 max-w-[44ch]">
              <span aria-hidden="true" className="absolute bottom-3 left-[13px] top-3 w-px bg-line-strong" />
              <ol className="relative space-y-6">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="grid grid-cols-[28px_1fr] items-start gap-4">
                    <span className="relative flex size-7 items-center justify-center rounded-full border border-line-strong bg-navy-900 font-mono text-[11px] text-blue-300">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed text-ink">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="sd-3d self-start rounded-[2rem] border border-line bg-navy-800 p-1.5">
          <div className="rounded-[calc(2rem-6px)] bg-navy-850 shadow-[inset_0_1px_1px_rgb(var(--fg-rgb)/0.06)]">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
