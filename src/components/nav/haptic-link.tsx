"use client";

import type { ComponentProps, MouseEvent } from "react";
import { tap } from "@/lib/haptics";

/*
  Enlace con respuesta háptica: un golpe corto al tocarlo (donde el teléfono lo permite) y
  después el onClick de quien lo usa. Va aparte para que los botones de cta.tsx sigan siendo
  componentes que se pueden usar también desde el servidor (este es el único pedazo de
  cliente). La vibración se pide dentro del clic: sin un gesto real el navegador la ignora.
*/
export function HapticLink({ onClick, ...props }: ComponentProps<"a">) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    tap();
    onClick?.(event);
  };
  return <a {...props} onClick={handleClick} />;
}
