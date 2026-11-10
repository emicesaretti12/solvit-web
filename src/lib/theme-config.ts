/*
  Configuración del documento compartida por el servidor (layout) y el cliente.
  Sin "use client": el layout (componente de servidor) importa los scripts como texto.
  El sitio usa un solo tema, claro: fondo blanco, tinta navy y el azul eléctrico como acento.
*/
export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "light";
export const THEME_COLOR: Record<Theme, string> = { light: "#ffffff", dark: "#0b1222" };

// Se ejecuta inline en <head>, antes del primer pintado: marca que hay JavaScript (las
// entradas animadas del CSS dependen de .js)
export const JS_FLAG_SCRIPT = `document.documentElement.classList.add("js")`;

// Sin zoom, como una app instalada. iOS Safari ignora user-scalable=no en el viewport: el
// pellizco se frena con sus eventos gesture* (solo existen con dos dedos, así que el scroll de
// un dedo sigue siendo pasivo y del compositor). En escritorio, el pellizco del trackpad y
// Ctrl + rueda llegan como wheel con ctrlKey (Lenis los ignora, así que no se mezclan con el
// scroll). El zoom de teclado (Ctrl + / Ctrl -) queda como salida de accesibilidad.
export const ZOOM_GUARD_SCRIPT = `(function(){var o={passive:false},p=function(e){e.preventDefault()};["gesturestart","gesturechange","gestureend"].forEach(function(t){document.addEventListener(t,p,o)});window.addEventListener("wheel",function(e){if(e.ctrlKey)e.preventDefault()},o)})()`;
