"use client";

import { useEffect, type RefObject } from "react";

/*
  Visibilidad sin re-render: un IntersectionObserver compartido marca los elementos con
  atributos data-* y el CSS hace el resto (entradas, loops que se pausan fuera de pantalla).
  - Un observer por configuración (umbral y margen), no uno por elemento: decenas de
    titulares y bloques comparten el mismo
  - Escribe atributos que el JSX no declara, así React no los pisa al re-renderizar y el HTML
    del servidor es el mismo que el del cliente (el atributo aparece recién después)
  - data-in se marca una vez y deja de observar; data-live va y viene con la pantalla
  - Sin .js en el html (sin JavaScript) el CSS muestra todo en su estado final
*/
type Callback = (entry: IntersectionObserverEntry) => void;
type Pool = { io: IntersectionObserver; callbacks: Map<Element, Callback> };

const pools = new Map<string, Pool>();

/** Observa un elemento con un observer compartido. Devuelve la función que lo suelta. */
export function observe(el: Element, callback: Callback, threshold = 0, rootMargin = "0px") {
  const key = `${threshold}|${rootMargin}`;
  let pool = pools.get(key);
  if (!pool) {
    const callbacks = new Map<Element, Callback>();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => callbacks.get(e.target)?.(e)), {
      threshold,
      rootMargin,
    });
    pool = { io, callbacks };
    pools.set(key, pool);
  }
  const { io, callbacks } = pool;
  callbacks.set(el, callback);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

/**
 * Marca data-in="true" la primera vez que el elemento entra en pantalla. `margin` corre el
 * borde de abajo hacia arriba (con "-12%", entra cuando su borde superior pasa el 88 % de la
 * pantalla): funciona igual con bloques más altos que la pantalla, que nunca llegarían a un
 * umbral de fracción visible.
 */
export function useRevealAttr(ref: RefObject<Element | null>, margin = "-12%") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = observe(
      el,
      (entry) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-in", "true");
        stop();
      },
      0,
      `0px 0px ${margin} 0px`,
    );
    return stop;
  }, [ref, margin]);
}

/**
 * data-live="true" mientras el elemento está a la vista (con un margen para arrancar apenas
 * antes de entrar). El CSS pausa los loops de adentro cuando no lo está.
 */
export function useLiveAttr(ref: RefObject<Element | null>, margin = "10%") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(
      el,
      (entry) => el.setAttribute("data-live", entry.isIntersecting ? "true" : "false"),
      0,
      `${margin} 0px ${margin} 0px`,
    );
  }, [ref, margin]);
}
