import type { CSSProperties } from "react";

/*
  Texto que entra letra por letra: cada letra sube desde la máscara de su palabra, en cascada,
  cuando el bloque entra en pantalla (data-reveal → data-in, ver page-observers.tsx). Los
  lectores de pantalla leen el texto entero (aria-label); las letras sueltas quedan ocultas.
*/
export function SplitText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  /** ms antes de la primera letra */
  delay?: number;
}) {
  let i = 0;
  const words = text.split(" ");
  return (
    <span data-reveal className={`split ${className}`} aria-label={text} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true">
          <span className="split-word">
            {Array.from(word).map((char, c) => (
              <span key={c} className="split-char" style={{ "--i": i++ } as CSSProperties}>
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
