"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/lib/theme";

// El único <Toaster /> del sitio, siguiendo el tema elegido (no el del sistema)
export function Toaster(props: ComponentProps<typeof Sonner>) {
  const theme = useTheme();
  return <Sonner theme={theme} {...props} />;
}
