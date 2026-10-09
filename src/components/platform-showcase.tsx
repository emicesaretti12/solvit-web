import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { DashboardPreview } from "./dashboard-preview";

export function PlatformShowcase() {
  return (
    <section id="plataforma" aria-labelledby="plataforma-titulo" className="overflow-hidden border-t border-line">
      <ContainerScroll
        titleComponent={
          <div className="px-2">
            <h2
              id="plataforma-titulo"
              className="font-display mx-auto max-w-[20ch] text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-balance text-ink sm:text-5xl lg:text-[3.6rem]"
            >
              Tu operación, <span className="text-blue-400">medida en tiempo real.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-lg leading-relaxed text-ink-muted">
              Leads, ventas, stock y sensores en una plataforma propia, con permisos para cada
              equipo y cada evento registrado en el mismo lugar.
            </p>
            <div className="h-16 md:h-20" />
          </div>
        }
      >
        <DashboardPreview />
      </ContainerScroll>
    </section>
  );
}
