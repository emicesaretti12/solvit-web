import { appIcon } from "./icons/art";

/*
  Ícono para la pantalla de inicio de iOS (apple-touch-icon). Cuadrado completo: iOS recorta
  su propia forma y pinta de negro lo transparente. Mismo arte que los íconos del manifest.
*/
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return appIcon(size.width, "full");
}
