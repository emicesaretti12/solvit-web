import { appIcon } from "../art";

// Ícono enmascarable de 512px: Android le aplica su propia forma (círculo, squircle)
export function GET() {
  return appIcon(512, "maskable");
}
