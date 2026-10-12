"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import "@/components/nav/native-nav.css"

/*
  Sheet de shadcn/ui sobre Radix Dialog (foco atrapado, Escape, devuelve el foco al disparador
  y bloquea el scroll de fondo). SEN:
  - ícono X de Phosphor y texto accesible en español ("Cerrar")
  - superficies y bordes con los tokens del tema y velo teñido (shade), sin desenfoque: un velo
    con blur de pantalla completa sobre el canvas 3D es caro en un teléfono
  - side="bottom" es una hoja inferior como la de iOS: sube con la curva de las hojas
    (cubic-bezier(0.32, 0.72, 0, 1)), tiene manija y se cierra arrastrándola hacia abajo, con un
    gesto rápido o pasando un umbral (useDragToDismiss). Las animaciones están en native-nav.css
  - los laterales entran con la curva ease-out del sistema (solo transform y opacidad)
  - showCloseButton para usar un botón de cierre propio
  - data-lenis-prevent: el contenido se desplaza con el scroll nativo aunque Lenis esté activo
*/

/*
  Radix no expone su estado, así que Sheet lo maneja (controlado o no) y lo comparte por
  contexto con la hoja inferior: `dismiss` la cierra desde adentro (el gesto de arrastre) y
  `register` le avisa antes de cada cambio, con la animación todavía en curso (cerrarla mientras
  entra tiene que arrancar desde donde se ve, no saltar)
*/
type BeforeChange = (open: boolean) => void
const SheetContext = React.createContext<{
  dismiss: () => void
  register: (fn: BeforeChange) => () => void
}>({ dismiss: () => {}, register: () => () => {} })

function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const beforeChange = React.useRef<BeforeChange | null>(null)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : uncontrolledOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      beforeChange.current?.(next)
      if (!controlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlled, onOpenChange],
  )
  const context = React.useMemo(
    () => ({
      dismiss: () => setOpen(false),
      register: (fn: BeforeChange) => {
        beforeChange.current = fn
        return () => {
          if (beforeChange.current === fn) beforeChange.current = null
        }
      },
    }),
    [setOpen],
  )
  return (
    <SheetContext.Provider value={context}>
      <SheetPrimitive.Root data-slot="sheet" open={open} onOpenChange={setOpen} {...props} />
    </SheetContext.Provider>
  )
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-shade/55 light:bg-shade/30", className)}
      {...props}
    />
  )
}

type SheetSide = "top" | "right" | "bottom" | "left"

const sideClasses: Record<Exclude<SheetSide, "bottom">, string> = {
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  top: "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
}

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide
  showCloseButton?: boolean
}

function CloseButton({ className }: { className?: string }) {
  return (
    <SheetPrimitive.Close
      className={cn(
        "absolute flex size-11 select-none items-center justify-center rounded-full text-ink-muted transition-[color,background-color,scale] duration-150 ease-[var(--ease-out)] active:scale-[0.97] active:bg-fg/5 disabled:pointer-events-none pointer-fine:hover:bg-fg/5 pointer-fine:hover:text-ink",
        className,
      )}
    >
      <X size={20} aria-hidden="true" />
      <span className="sr-only">Cerrar</span>
    </SheetPrimitive.Close>
  )
}

function SheetContent({ side = "right", ...props }: SheetContentProps) {
  if (side === "bottom") return <BottomSheetContent {...props} />
  const { className, children, showCloseButton = true, ...rest } = props
  return (
    <SheetPortal>
      <SheetOverlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-lenis-prevent
        className={cn(
          "fixed z-50 flex flex-col gap-4 border-line-strong bg-navy-900 text-ink shadow-[0_24px_80px_-24px_rgb(var(--shade-rgb)/0.6)] outline-none",
          "ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=open]:duration-[420ms]",
          "data-[state=closed]:animate-out data-[state=closed]:duration-[260ms]",
          sideClasses[side],
          className,
        )}
        {...rest}
      >
        {children}
        {showCloseButton && <CloseButton className="top-3 right-3" />}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/* ── Hoja inferior arrastrable ────────────────────────────────────────────────────────────── */

// Un gesto hacia abajo más rápido que esto (px/ms) cierra aunque recorra poco
const FLICK_VELOCITY = 0.11
// Sin gesto rápido, cierra si se la soltó más abajo que esta fracción de su alto
const CLOSE_FRACTION = 0.3
// Recorrido mínimo antes de decidir que es un arrastre vertical: un toque sigue siendo un clic
const DRAG_SLOP = 6
// Hacia arriba no hay lugar: cede con resistencia creciente y nunca más que esto
const PULL_LIMIT = 64
// Para la velocidad del gesto cuentan solo los últimos ~100 ms de movimiento
const VELOCITY_WINDOW = 100
const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"

/** Banda elástica de iOS: cuanto más se pasa del borde, menos sigue al dedo (tiende a `limit`). */
function rubberband(distance: number, limit: number) {
  const c = 0.55
  return (distance * limit * c) / (limit + c * distance)
}

/** Desplazamiento vertical que se ve ahora (con la animación que esté corriendo, si hay). */
function presentedY(el: HTMLElement) {
  const transform = getComputedStyle(el).transform
  return transform && transform !== "none" ? new DOMMatrixReadOnly(transform).m42 : 0
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

type DragState = {
  id: number
  startX: number
  startY: number
  dragging: boolean
  base: number
  offset: number
  height: number
  samples: { y: number; t: number }[]
}

/*
  Arrastrar para cerrar, con lo que separa un buen gesto de uno malo:
  - la hoja sigue al dedo 1:1 desde donde se la agarró (aunque esté entrando o volviendo: se
    toma la posición que se ve y se cancela la animación)
  - pointer capture recién cuando el gesto se confirma vertical: antes, un toque es un clic
  - protección multitouch: un segundo dedo no la toma ni la hace saltar
  - hacia arriba, banda elástica en lugar de una pared
  - al soltar decide la velocidad (sentido incluido) y, si no hubo gesto rápido, la distancia
  - si cierra, sale a una velocidad parecida a la del dedo; si no, vuelve con la curva de la
    hoja (WAAPI, en el compositor). El velo acompaña con su opacidad
  Todo escribe transform y opacity directo en los elementos: nada de re-renders por cuadro.
*/
function useDragToDismiss(
  panelRef: React.RefObject<HTMLDivElement | null>,
  overlayRef: React.RefObject<HTMLDivElement | null>,
  dismiss: () => void,
) {
  const drag = React.useRef<DragState | null>(null)
  const releasedAt = React.useRef(0)

  const settle = (panel: HTMLElement, overlay: HTMLElement | null, from: number) => {
    panel.style.transform = ""
    panel.animate([{ transform: `translate3d(0, ${from}px, 0)` }, { transform: "translate3d(0, 0, 0)" }], {
      duration: 420,
      easing: SHEET_EASE,
    })
    if (overlay?.style.opacity) {
      const opacity = overlay.style.opacity
      overlay.style.opacity = ""
      overlay.animate([{ opacity }, { opacity: 1 }], { duration: 420, easing: SHEET_EASE })
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Un solo dedo manda: con un gesto en curso, los demás se ignoran
    if (drag.current || !event.isPrimary) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    const target = event.target as HTMLElement
    if (target.closest("input, textarea, select, [contenteditable], [data-sheet-no-drag]")) return
    // Una lista que ya se scrolleó es del scroll, no de la hoja. Con el dedo, si desborda, toda
    // la lista es del scroll (el navegador se queda con el gesto): la hoja se toma de la manija
    const scroller = target.closest<HTMLElement>("[data-sheet-scroll]")
    if (
      scroller &&
      (scroller.scrollTop > 0 || (event.pointerType !== "mouse" && scroller.dataset.overflow === "true"))
    ) {
      return
    }
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      base: 0,
      offset: 0,
      height: 0,
      samples: [],
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    const panel = panelRef.current
    if (!state || !panel || event.pointerId !== state.id) return
    const overlay = overlayRef.current

    if (!state.dragging) {
      const dx = event.clientX - state.startX
      const dy = event.clientY - state.startY
      if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return
      // Gesto horizontal: no es de la hoja
      if (Math.abs(dx) > Math.abs(dy)) {
        drag.current = null
        return
      }
      state.dragging = true
      state.base = presentedY(panel)
      state.startY = event.clientY
      state.height = panel.offsetHeight
      panel.getAnimations().forEach((animation) => animation.cancel())
      overlay?.getAnimations().forEach((animation) => animation.cancel())
      panel.setPointerCapture(event.pointerId)
      panel.setAttribute("data-dragging", "")
    }

    let y = state.base + event.clientY - state.startY
    if (y < 0) y = -rubberband(-y, PULL_LIMIT)
    state.offset = y
    panel.style.transform = `translate3d(0, ${y}px, 0)`
    if (overlay) overlay.style.opacity = String(1 - clamp(y / state.height, 0, 1))

    state.samples.push({ y: event.clientY, t: event.timeStamp })
    while (state.samples.length > 2 && event.timeStamp - state.samples[0].t > VELOCITY_WINDOW) {
      state.samples.shift()
    }
  }

  const release = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const state = drag.current
    if (!state || event.pointerId !== state.id) return
    drag.current = null
    const panel = panelRef.current
    if (!state.dragging || !panel) return
    const overlay = overlayRef.current
    panel.removeAttribute("data-dragging")
    if (panel.hasPointerCapture(event.pointerId)) panel.releasePointerCapture(event.pointerId)
    releasedAt.current = event.timeStamp

    // Velocidad (px/ms, positiva hacia abajo) de los últimos ~100 ms hasta que se soltó: si el
    // dedo se quedó quieto antes de soltar no hay movimientos nuevos, así que las muestras
    // viejas de un gesto rápido no cuentan
    const recent = state.samples.filter((sample) => event.timeStamp - sample.t <= VELOCITY_WINDOW)
    recent.push({ y: event.clientY, t: event.timeStamp })
    const first = recent[0]
    const last = recent[recent.length - 1]
    const velocity = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0
    const close =
      !cancelled &&
      (velocity > FLICK_VELOCITY ||
        (velocity > -FLICK_VELOCITY && state.offset > state.height * CLOSE_FRACTION))

    if (!close) {
      settle(panel, overlay, state.offset)
      return
    }
    // La curva de la hoja arranca a ~2,25 veces su velocidad media: con esta duración, la salida
    // empieza a la velocidad del dedo (acotada para que nunca se arrastre ni sea un corte)
    const remaining = state.height - state.offset
    const duration = `${Math.round(clamp((2.25 * remaining) / Math.max(velocity, 0.1), 200, 360))}ms`
    panel.style.animationDuration = duration
    if (overlay) overlay.style.animationDuration = duration
    dismiss()
  }

  // El clic que llega al soltar un arrastre no es un toque: no sigue el enlace ni cierra
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (releasedAt.current && event.timeStamp - releasedAt.current < 400) {
      event.preventDefault()
      event.stopPropagation()
    }
    releasedAt.current = 0
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => release(event, false),
    onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => release(event, true),
    onClickCapture,
  }
}

// Une el manejador propio con el que haya pasado quien usa el componente
function compose<E>(own: (event: E) => void, theirs?: (event: E) => void) {
  return (event: E) => {
    theirs?.(event)
    own(event)
  }
}

function BottomSheetContent({
  className,
  children,
  showCloseButton = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClickCapture,
  ...props
}: Omit<SheetContentProps, "side">) {
  const { dismiss, register } = React.useContext(SheetContext)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const observer = React.useRef<ResizeObserver | null>(null)
  const handlers = useDragToDismiss(panelRef, overlayRef, dismiss)

  React.useEffect(
    () =>
      register((open) => {
        for (const el of [panelRef.current, overlayRef.current]) {
          if (!el) continue
          if (open) {
            // Reabierta mientras salía (Radix conserva el nodo): arranca limpia
            el.style.removeProperty("transform")
            el.style.removeProperty("opacity")
            el.style.removeProperty("animation-duration")
          } else if (el.getAnimations().length > 0) {
            // Se cierra mientras entraba o volvía a su lugar: se fija donde se ve y la salida
            // (keyframes con un solo extremo) arranca desde ahí
            const { transform, opacity } = getComputedStyle(el)
            el.getAnimations().forEach((animation) => animation.cancel())
            el.style.transform = transform === "none" ? "" : transform
            el.style.opacity = opacity
          }
        }
      }),
    [register],
  )

  // Al montarse, mira si la zona con scroll desborda (lista larga con el teléfono acostado):
  // ahí el dedo scrollea en lugar de arrastrar (data-overflow, ver native-nav.css)
  const setPanel = React.useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node
    observer.current?.disconnect()
    observer.current = null
    const scroller = node?.querySelector<HTMLElement>("[data-sheet-scroll]")
    if (!scroller) return
    const check = () => {
      scroller.dataset.overflow = String(scroller.scrollHeight > scroller.clientHeight + 1)
    }
    observer.current = new ResizeObserver(check)
    observer.current.observe(scroller)
    if (scroller.firstElementChild) observer.current.observe(scroller.firstElementChild)
  }, [])

  return (
    <SheetPortal>
      <SheetOverlay ref={overlayRef} className="sheet-overlay" />
      <SheetPrimitive.Content
        ref={setPanel}
        data-slot="sheet-content"
        data-side="bottom"
        data-lenis-prevent
        className={cn(
          "sheet-panel fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[calc(100dvh-env(safe-area-inset-top,0px)-0.75rem)] w-full max-w-lg flex-col",
          "rounded-t-[28px] border border-b-0 border-line-strong bg-navy-850 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink outline-none",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_-16px_48px_-20px_rgb(var(--shade-rgb)/0.45)]",
          // Relleno debajo del borde: al estirarla hacia arriba no se ve el hueco de abajo
          "after:pointer-events-none after:absolute after:inset-x-[-1px] after:top-full after:h-24 after:border-x after:border-line-strong after:bg-navy-850",
          className,
        )}
        {...props}
        onPointerDown={compose(handlers.onPointerDown, onPointerDown)}
        onPointerMove={compose(handlers.onPointerMove, onPointerMove)}
        onPointerUp={compose(handlers.onPointerUp, onPointerUp)}
        onPointerCancel={compose(handlers.onPointerCancel, onPointerCancel)}
        onClickCapture={compose(handlers.onClickCapture, onClickCapture)}
      >
        {/* Manija: muestra que la hoja se arrastra (el cierre accesible es el botón) */}
        <div aria-hidden="true" className="flex h-7 shrink-0 cursor-grab items-center justify-center">
          <span className="h-[5px] w-9 rounded-full bg-fg/20" />
        </div>
        {children}
        {showCloseButton && <CloseButton className="top-2.5 right-3" />}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-ink", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-ink-muted", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
