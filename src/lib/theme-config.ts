/*
  Configuración del tema compartida por el servidor (layout) y el cliente.
  Sin "use client": el layout (componente de servidor) importa los scripts como texto.

  El claro (versión clara del brand board) es el tema principal: el HTML del servidor sale con
  data-theme="light" y solo una preferencia guardada ("dark") lo cambia antes de pintar.
  THEME_COLOR es el fondo de página de cada tema (navy-900): la barra del navegador y la de
  estado de la app instalada toman ese color.
*/
export type Theme = "dark" | "light";

export const THEME_KEY = "sen-theme";
export const DEFAULT_THEME: Theme = "light";
export const THEME_COLOR: Record<Theme, string> = { light: "#f6f8fb", dark: "#031024" };

// Se ejecuta inline en <head>, antes del primer pintado: marca que hay JavaScript (las
// entradas animadas del CSS dependen de .js) y aplica el oscuro si quedó guardado. Las metas
// de color pueden llegar después del script: se corrigen también al terminar de parsear.
export const THEME_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(localStorage.getItem("${THEME_KEY}")!=="dark")return;d.setAttribute("data-theme","dark");var f=function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content","${THEME_COLOR.dark}")});var s=document.querySelector('meta[name="color-scheme"]');if(s)s.setAttribute("content","dark")};f();document.addEventListener("DOMContentLoaded",f)}catch(e){}})()`;

// Sin zoom, como una app instalada. iOS Safari ignora user-scalable=no en el viewport: el
// pellizco se frena con sus eventos gesture* (solo existen con dos dedos, así que el scroll de
// un dedo sigue siendo pasivo y del compositor). En escritorio, el pellizco del trackpad y
// Ctrl + rueda llegan como wheel con ctrlKey (Lenis los ignora, así que no se mezclan con el
// scroll). El zoom de teclado (Ctrl + / Ctrl -) queda como salida de accesibilidad.
export const ZOOM_GUARD_SCRIPT = `(function(){var o={passive:false},p=function(e){e.preventDefault()};["gesturestart","gesturechange","gestureend"].forEach(function(t){document.addEventListener(t,p,o)});window.addEventListener("wheel",function(e){if(e.ctrlKey)e.preventDefault()},o)})()`;
