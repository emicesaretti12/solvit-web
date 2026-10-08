import { Reveal } from "./reveal";

const blocks = [
  {
    label: "Misión",
    text: "Potenciar el crecimiento y la rentabilidad de los negocios transformando sus procesos internos con software a medida, automatización con hardware e inteligencia artificial, respaldados por una estrategia de captación integral.",
  },
  {
    label: "Visión",
    text: "Ser el socio estratégico de referencia en innovación e ingeniería aplicada para empresas que buscan optimizar sus recursos, eliminar ineficiencias operativas y escalar con tecnología propietaria.",
  },
];

export function About() {
  return (
    <section id="nosotros" className="border-t border-line bg-navy-950/50">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32">
        <Reveal>
          <h2 className="max-w-[22ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Sistemas estructurados en lugar de trabajo manual.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {blocks.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08} className="border-t border-line-strong pt-8">
              <h3 className="text-sm font-medium text-blue-300">{b.label}</h3>
              <p className="mt-4 text-xl leading-relaxed text-ink md:text-[1.35rem]">
                {b.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
