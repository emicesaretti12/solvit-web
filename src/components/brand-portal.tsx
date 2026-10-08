"use client";

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import GlyphPortal, { type GlyphPortalStyle } from "@/components/ui/glyph-portal";

const WORD = "SOLVIT";
const WEIGHT = 800;
// 1.6 pantallas: con 2.2 quedaban ~500px de scroll sobre el campo azul vacío
const SCROLL_LENGTH = 1.6;
// Solo la familia real: "Geist Fallback" de next/font nunca se carga cuando Geist
// está disponible, y el portal lo tomaría como fuente pendiente (modo estático).
const FONT = "Geist, sans-serif";

const portalStyle: GlyphPortalStyle = {
  "--gp-paper": "var(--navy-900)",
  "--gp-ink": "var(--ink-muted)",
  "--gp-field": "#1446d8",
  "--gp-foreground": "#ffffff",
  fontFamily: "var(--font-geist-sans)",
};

/*
  El portal congela la tipografía al montarse: si Geist todavía no cargó, arranca
  en modo estático (que igual se renderiza en el servidor, con el manifiesto en el HTML).
  Cuando la fuente está lista lo volvemos a montar con otra `key` para activar la animación,
  salvo que el visitante ya esté dentro de la sección (evita un salto a mitad del recorrido).
*/
function useFontReady(frame: React.RefObject<HTMLDivElement | null>) {
  // Si la fuente ya está (lo habitual, next/font la precarga) se monta animado de una vez.
  // La key no llega al DOM, así que esto no genera diferencias de hidratación.
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.fonts.check(`${WEIGHT} 100px Geist`, WORD),
  );
  useEffect(() => {
    let cancelled = false;
    document.fonts.load(`${WEIGHT} 100px Geist`, WORD).then(
      () => {
        if (cancelled) return;
        const rect = frame.current?.getBoundingClientRect();
        if (!rect || rect.top > 0 || rect.bottom <= 0) setReady(true);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [frame]);
  return ready;
}

const fieldStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  transform: "scale(var(--gp-field-scale, 1))",
  background:
    "radial-gradient(circle at 82% 14%, rgb(79 147 255 / 0.5), transparent 38%), radial-gradient(circle at 12% 88%, rgb(26 86 240 / 0.45), transparent 46%), linear-gradient(135deg, #0c2672 0%, #1446d8 52%, #0a1f5c 100%)",
};

function Field() {
  return (
    <div style={fieldStyle}>
      <div className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}

export function BrandPortal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const fontReady = useFontReady(frameRef);

  // Con teclado, el enlace de la portada se muestra en su cuadro inicial (sin capas encima).
  // Se espera un frame para no pelear con el scroll que hace el navegador al enfocar.
  const onFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.matches("[data-gp-enter]:focus-visible")) return;
    requestAnimationFrame(() => {
      if (document.activeElement === target) {
        frameRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
  };

  return (
    // Reserva la altura final, (SCROLL_LENGTH + 1) pantallas = 260svh, para que montar
    // o activar la animación no mueva lo que viene después (anclas, CLS).
    <div
      ref={frameRef}
      onFocusCapture={onFocusCapture}
      className="solvit-portal-frame min-h-[260svh] motion-reduce:min-h-0"
    >
      <noscript>
        <style>{".solvit-portal-frame{min-height:0!important}"}</style>
      </noscript>
      <GlyphPortal
        key={fontReady ? "ready" : "pending"}
        word={WORD}
        fontFamily={FONT}
        fontWeight={WEIGHT}
        interactive={false}
        scrollLength={SCROLL_LENGTH}
        enterLabel="Conocé nuestro enfoque"
        enterIcon={<ArrowDown size={16} weight="bold" />}
        background={<Field />}
        style={portalStyle}
        className="solvit-portal"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-balance sm:text-4xl lg:text-[3.4rem]">
            No somos una agencia ni una factoría de software aislada del negocio.
          </h2>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed md:text-xl">
            Somos el socio técnico que resuelve los cuellos de botella operativos
            y la demanda comercial, sobre una misma infraestructura.
          </p>
        </div>
      </GlyphPortal>
    </div>
  );
}
