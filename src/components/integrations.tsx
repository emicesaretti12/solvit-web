import {
  siEspressif,
  siGoogleads,
  siGooglecloud,
  siInstagram,
  siMercadopago,
  siMeta,
  siMongodb,
  siPostgresql,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import { Reveal } from "./reveal";

/*
  Canales y herramientas que SEN integra según su propuesta (WhatsApp Business,
  Instagram Direct, Meta Ads, Google Ads, pasarelas de pago, bases de datos, nube, ESP32).
  Logos reales de Simple Icons, monocromos para respetar la paleta. Solo logos, sin rótulos.
*/
const LOGOS: SimpleIcon[] = [
  siWhatsapp,
  siInstagram,
  siMeta,
  siGoogleads,
  siMercadopago,
  siGooglecloud,
  siPostgresql,
  siMongodb,
  siEspressif,
];

export function Integrations() {
  return (
    <section aria-labelledby="integraciones-titulo" className="relative">
      <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 md:py-20">
        <Reveal>
          <p id="integraciones-titulo" className="text-center text-sm text-ink-muted">
            Conectamos tus canales, pagos, datos y dispositivos
          </p>
        </Reveal>
        <ul className="mt-8 grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-5 lg:grid-cols-9">
          {LOGOS.map((icon, i) => (
            <Reveal as="li" key={icon.slug} delay={i * 0.04}>
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="size-7 fill-ink-faint transition-[fill] duration-200 hover:fill-ink md:size-8"
              >
                <title>{icon.title}</title>
                <path d={icon.path} />
              </svg>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
