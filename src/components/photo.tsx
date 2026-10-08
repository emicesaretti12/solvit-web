"use client";

import Image from "next/image";
import { useState } from "react";

/*
  Foto con respaldo: si la imagen remota falla, queda el fondo de marca
  (gradiente marino + retícula) en lugar de un ícono roto.
*/
export function Photo({
  src,
  alt,
  sizes,
  preload = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(120%_80%_at_80%_0%,rgb(47_116_255/0.28),transparent_60%),linear-gradient(180deg,var(--navy-800),var(--navy-950))] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
      {/* Tinte de marca para unificar fotografías de distintas fuentes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-900/10 to-blue-600/10 mix-blend-normal"
      />
    </div>
  );
}
