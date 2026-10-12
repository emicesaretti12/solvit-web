import { appIcon } from "../art";

// Ícono de app de 192px para el manifest (instalación en Android y escritorio)
export function GET() {
  return appIcon(192, "rounded");
}
