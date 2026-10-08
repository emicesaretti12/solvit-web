import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Photo } from "./photo";
import { img } from "@/lib/images";

export function PlatformShowcase() {
  return (
    <section className="overflow-hidden border-t border-line">
      <ContainerScroll
        titleComponent={
          <div className="px-2">
            <h2 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-ink md:text-6xl">
              Todo tu negocio, <span className="text-blue-400">en un solo tablero.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
              CRM, ventas, stock y sensores en una plataforma propia, con
              permisos para cada equipo.
            </p>
            <div className="h-16 md:h-20" />
          </div>
        }
      >
        <Photo
          src={img("photo-1551288049-bebda4e38f71", 2000)}
          alt="Tablero de control con métricas de ventas y operación en tiempo real"
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="h-full w-full rounded-xl"
        />
      </ContainerScroll>
    </section>
  );
}
