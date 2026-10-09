/*
  Configuración del tema compartida por el servidor (script del layout) y el cliente.
  Sin "use client": el layout (componente de servidor) importa el script como texto.
*/
export type Theme = "dark" | "light";

export const THEME_KEY = "sen-theme";
export const THEME_COLOR: Record<Theme, string> = { dark: "#031024", light: "#f6f8fb" };

// Se ejecuta inline en <head>, antes del primer pintado
// (la meta theme-color puede llegar después del script: se corrige también al terminar de parsear)
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")return;document.documentElement.setAttribute("data-theme",t);var c=t==="light"?"${THEME_COLOR.light}":"${THEME_COLOR.dark}";var f=function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c)};f();document.addEventListener("DOMContentLoaded",f)}catch(e){}})()`;

