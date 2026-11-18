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

// Contador de carga (va inline, justo después del telón: corre antes de que React hidrate).
// Sube con una curva suave hasta 88 y espera ahí si la página todavía no terminó de cargar;
// con la página lista llega a 100, levanta el telón (.is-done) y suelta las entradas del hero
// (html.intro-done). Dura como mínimo 1,5 s. Con reduced motion no hay telón. Si algo falla, el
// telón se levanta igual.
export const INTRO_SCRIPT = `(function(){var d=document.documentElement,i=document.getElementById("intro");function end(){d.classList.add("intro-done")}if(!i){end();return}if(matchMedia("(prefers-reduced-motion: reduce)").matches){i.classList.add("is-gone");end();return}var n=i.querySelector("[data-n]"),b=i.querySelector("[data-bar]"),t0=performance.now(),v=0,done=false;function fin(){if(done)return;done=true;i.classList.add("is-done");end();setTimeout(function(){i.classList.add("is-gone")},1200)}function f(now){try{var e=Math.min(1,(now-t0)/1500),cap=document.readyState==="complete"||now-t0>6000?100:88,t=Math.min(cap,100*(1-Math.pow(1-e,3)));v+=(t-v)*0.22;if(t-v<0.5)v=t;var r=Math.round(v);n.textContent=(r<10?"00":r<100?"0":"")+r;b.style.transform="scaleX("+v/100+")";if(r>=100){fin();return}requestAnimationFrame(f)}catch(x){fin()}}requestAnimationFrame(f)})()`;

// Sin zoom, como una app instalada. iOS Safari ignora user-scalable=no en el viewport: el
// pellizco se frena con sus eventos gesture* (solo existen con dos dedos, así que el scroll de
// un dedo sigue siendo pasivo y del compositor). En escritorio, el pellizco del trackpad y
// Ctrl + rueda llegan como wheel con ctrlKey (Lenis los ignora, así que no se mezclan con el
// scroll). El zoom de teclado (Ctrl + / Ctrl -) queda como salida de accesibilidad.
export const ZOOM_GUARD_SCRIPT = `(function(){var o={passive:false},p=function(e){e.preventDefault()};["gesturestart","gesturechange","gestureend"].forEach(function(t){document.addEventListener(t,p,o)});window.addEventListener("wheel",function(e){if(e.ctrlKey)e.preventDefault()},o)})()`;
