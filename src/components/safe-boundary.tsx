"use client";

import { Component, type ReactNode } from "react";

/*
  Si una pieza decorativa falla al cargar (el canvas de WebGL sin memoria en un teléfono, o una
  librería de gráficos que no reconoce el idioma del navegador), la página sigue: en su lugar
  queda el fallback (o lo que haya debajo). Sin esto, el error desmonta la página entera.
*/
export class SafeBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
