import { appIcon } from "../art";

// Ícono de app de 512px para el manifest (pantalla de inicio de la app instalada)
export function GET() {
  return appIcon(512, "rounded");
}
