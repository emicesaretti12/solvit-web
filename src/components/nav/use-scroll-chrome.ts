"use client";

import { useEffect, useRef, type RefObject } from "react";

/*
  El header como la barra de una app: escribe atributos en el <header> según el scroll, sin
  re-renderizar React (el scroll dispara un evento por cuadro).
  - data-scrolled: pasó el borde de arriba (la píldora gana opacidad y sombra)
  - data-hidden: en celulares, al bajar rápido la píldora sube y se va (solo transform, ver
    native-nav.css); vuelve apenas se sube un poco, cerca del principio de la página, con el
    menú abierto o con el foco de teclado adentro. Con reduced motion no se va.
  - progreso de lectura: donde no hay animation-timeline (iOS < 26) mueve la línea desde acá;
    con soporte la mueve el compositor y este hook no la toca.
*/

const MOBILE = "(max-width: 1023.98px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
// px/ms (promedio suavizado): por debajo es lectura y la píldora se queda
const HIDE_VELOCITY = 0.35;
// Subiendo, alcanza con este recorrido para que vuelva
const SHOW_TRAVEL = 10;
// Cerca del principio siempre se ve (el hero la necesita)
const TOP_ZONE = 80;

export function useScrollChrome(
  headerRef: RefObject<HTMLElement | null>,
  progressRef: RefObject<HTMLElement | null>,
  locked: boolean,
) {
  // El menú abierto la fija visible; el efecto lee el valor actual sin volver a suscribirse
  const lockedRef = useRef(locked);
  const showRef = useRef<() => void>(() => {});
  useEffect(() => {
    lockedRef.current = locked;
    if (locked) showRef.current();
  }, [locked]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const mobile = window.matchMedia(MOBILE);
    const reduce = window.matchMedia(REDUCE);
    const fallback = typeof CSS === "undefined" || !CSS.supports("animation-timeline: scroll()");

    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0;
    let travel = 0;
    let hidden = false;
    let scrolled: boolean | null = null;
    let maxScroll = 1;
    let keyboardFocus = false;

    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      header.dataset.hidden = String(next);
    };
    showRef.current = () => {
      travel = 0;
      setHidden(false);
    };

    const measure = () => {
      maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };

    const update = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      // Promedio móvil: un evento suelto no decide, la tendencia sí
      velocity = velocity * 0.6 + (dy / Math.max(t - lastT, 1)) * 0.4;
      lastY = y;
      lastT = t;

      const isScrolled = y > 12;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        header.dataset.scrolled = String(isScrolled);
      }

      const progress = progressRef.current;
      if (fallback && progress) {
        progress.style.transform = `scaleX(${Math.min(Math.max(y / maxScroll, 0), 1)})`;
      }

      if (
        !mobile.matches ||
        reduce.matches ||
        lockedRef.current ||
        y < TOP_ZONE ||
        keyboardFocus
      ) {
        travel = 0;
        setHidden(false);
        return;
      }
      // Recorrido acumulado en el sentido actual: un cambio de sentido lo reinicia
      if (dy !== 0 && Math.sign(dy) !== Math.sign(travel)) travel = 0;
      travel += dy;
      if (!hidden && dy > 0 && velocity > HIDE_VELOCITY) setHidden(true);
      else if (hidden && travel < -SHOW_TRAVEL) setHidden(false);
    };

    // Solo el foco de teclado la retiene: el que Radix devuelve al botón del menú después de un
    // toque no tiene que dejarla fija
    const onFocusIn = (event: FocusEvent) => {
      try {
        keyboardFocus = (event.target as Element).matches(":focus-visible");
      } catch {
        keyboardFocus = false;
      }
      if (keyboardFocus) showRef.current();
    };
    const onFocusOut = () => {
      keyboardFocus = false;
    };
    const onMediaChange = () => update();

    // El alto del documento cambia mientras cargan las secciones: solo importa sin soporte
    let resize: ResizeObserver | null = null;
    if (fallback) {
      measure();
      resize = new ResizeObserver(measure);
      resize.observe(document.body);
      window.addEventListener("resize", measure, { passive: true });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    header.addEventListener("focusin", onFocusIn);
    header.addEventListener("focusout", onFocusOut);
    mobile.addEventListener("change", onMediaChange);
    reduce.addEventListener("change", onMediaChange);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      header.removeEventListener("focusin", onFocusIn);
      header.removeEventListener("focusout", onFocusOut);
      mobile.removeEventListener("change", onMediaChange);
      reduce.removeEventListener("change", onMediaChange);
      resize?.disconnect();
      showRef.current = () => {};
    };
  }, [headerRef, progressRef]);
}
