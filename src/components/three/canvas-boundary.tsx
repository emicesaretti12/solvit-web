"use client";

import { Component, type ReactNode } from "react";

/* Si el canvas de WebGL falla al crearse (poca memoria, límite de contextos en el teléfono), la
   página sigue: en su lugar queda lo que haya debajo (el isotipo plano) */
export class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
