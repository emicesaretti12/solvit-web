"use client";

import { useEffect, useState, type CSSProperties } from "react";
import GlyphPortal, { type GlyphPortalStyle } from "@/components/ui/glyph-portal";

const WORD = "SOLVIT";
const WEIGHT = 800;
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
  El portal congela la tipografía al montarse: si Geist todavía no cargó,
  queda en modo estático. Por eso esperamos la fuente antes de montarlo.
*/
function useFontReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    const timeout = window.setTimeout(finish, 1600);
    document.fonts.load(`${WEIGHT} 100px Geist`, WORD).then(finish, finish);
    return () => {
      done = true;
      window.clearTimeout(timeout);
    };
  }, []);
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
      <div
        className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:48px_48px]"
      />
    </div>
  );
}

function Front() {
  return (
    <p
      className="absolute inset-x-4 m-0 text-center text-base text-ink-muted md:text-lg"
      style={{ top: "calc(var(--gp-word-bottom, 60%) + 28px)" }}
    >
      Un socio tecnológico de punta a punta.
    </p>
  );
}

export function BrandPortal() {
  const fontReady = useFontReady();

  if (!fontReady) {
    return <div aria-hidden="true" className="min-h-[100svh] bg-navy-900" />;
  }

  return (
    <GlyphPortal
      word={WORD}
      fontFamily={FONT}
      fontWeight={WEIGHT}
      interactive={false}
      scrollLength={2.2}
      enterLabel="Conocé nuestro enfoque"
      background={<Field />}
      front={<Front />}
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
  );
}
