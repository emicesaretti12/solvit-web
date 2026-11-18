/*
  Preguntas frecuentes: un acordeón nativo (details/summary), que funciona sin JavaScript y con
  teclado. Las mismas preguntas van como datos estructurados (FAQPage) en la página que lo usa.
*/
import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Faq } from "@/content/services";
import { SplitText } from "./split-text";

export function Faqs({ faqs, title = "Preguntas frecuentes", id = "preguntas" }: { faqs: Faq[]; title?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative bg-paper py-20 md:py-[7vw]">
      <div className="mx-auto grid gap-10 px-5 md:px-[5.8vw] lg:grid-cols-[0.8fr_1.2fr] lg:gap-[6vw]">
        <h2 id={`${id}-titulo`} className="text-[clamp(2.1rem,4.4vw,3.8rem)] font-medium leading-[1] tracking-[-0.04em] text-ink">
          <SplitText text={title} />
        </h2>
        <ul className="border-t border-ink/12">
          {faqs.map((faq) => (
            <li key={faq.q} className="border-b border-ink/12">
              <details className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[19px] font-medium leading-snug text-ink [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink transition-[transform,background-color,color] duration-300 ease-[var(--ease-expo)] group-open:rotate-45 group-open:bg-ink group-open:text-white">
                    <Plus size={16} weight="bold" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-6 text-[16.5px] leading-[1.6] text-ink-muted">{faq.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
