"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Globe, InstagramLogo, LockSimple, WhatsappLogo, type Icon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { tap } from "@/lib/haptics";
import { PreviewShell, usePreviewLoop } from "./preview-shell";

type Role = "Administrador" | "Supervisor" | "Ventas" | "Soporte";
const ROLES: Role[] = ["Administrador", "Supervisor", "Ventas", "Soporte"];

const PERMISSIONS: { label: string; roles: Role[] }[] = [
  { label: "Ver todo", roles: ["Administrador", "Supervisor"] },
  { label: "Reasignar", roles: ["Administrador", "Supervisor"] },
  { label: "Exportar", roles: ["Administrador"] },
  { label: "Configurar", roles: ["Administrador"] },
];

const CHANNEL: Record<string, Icon> = { whatsapp: WhatsappLogo, instagram: InstagramLogo, web: Globe };

const ROWS = [
  { id: 1, lead: "Moto 0km en cuotas", channel: "whatsapp", stage: "Calificado", owner: "Asesor 1" },
  { id: 2, lead: "Pedido mayorista de baterías", channel: "web", stage: "Propuesta", owner: "Asesor 2" },
  { id: 3, lead: "Turno de service, moto 110 cc", channel: "instagram", stage: "Calificado", owner: "Asesor 3" },
  { id: 4, lead: "Mantenimiento de línea 2", channel: "web", stage: "Nuevo", owner: "Asesor 1" },
  { id: 5, lead: "Reclamo de entrega", channel: "whatsapp", stage: "Postventa", owner: "Soporte" },
];

const visibleRows = (role: Role) => {
  if (role === "Ventas") return ROWS.filter((r) => r.owner === "Asesor 1");
  if (role === "Soporte") return ROWS.filter((r) => r.owner === "Soporte");
  return ROWS;
};

const STAGE_STYLE: Record<string, string> = {
  Nuevo: "border-line-strong text-ink-muted",
  Calificado: "border-blue-400/40 bg-blue-500/10 text-blue-300",
  Propuesta: "border-line-strong bg-fg/[0.04] text-ink",
  Postventa: "border-line-strong text-ink-muted",
};

export function CrmPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { running, paused, setPaused } = usePreviewLoop(ref);
  const [role, setRole] = useState<Role>("Administrador");

  // Recorre los roles solo; elegir uno a mano equivale a pausar
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRole((r) => ROLES[(ROLES.indexOf(r) + 1) % ROLES.length]);
    }, 2600);
    return () => window.clearInterval(id);
  }, [running]);

  const rows = visibleRows(role);

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col">
      <PreviewShell
        title="CRM a medida · niveles de acceso"
        paused={paused}
        onTogglePause={() => setPaused((p) => !p)}
      >
        <div
          role="group"
          aria-label="Rol"
          className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-navy-900 p-1 light:bg-navy-800 sm:grid-cols-4"
        >
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={r === role}
              onClick={() => {
                tap();
                setPaused(true);
                setRole(r);
              }}
              className={`relative flex-auto rounded-lg px-2 py-1.5 text-[12px] font-medium transition-[color,scale] duration-150 ease-[var(--ease-out)] active:scale-[0.95] pointer-coarse:min-h-11 ${
                r === role ? "text-white" : "text-ink-muted hover:text-ink"
              }`}
            >
              {r === role && (
                <motion.span
                  layoutId="crm-role"
                  className="absolute inset-0 rounded-lg bg-blue-500 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              {/* En pantallas angostas, dos por fila (cuatro en una fila se cortaban y "Soporte" quedaba sola) */}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5 max-lg:mt-2.5" aria-label="Permisos del rol">
          {PERMISSIONS.map((p) => {
            const on = p.roles.includes(role);
            return (
              <li
                key={p.label}
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-200 ${
                  on ? "border-blue-400/40 text-ink" : "border-line text-ink-faint"
                }`}
              >
                {on ? (
                  <Check size={11} weight="bold" className="text-blue-400" aria-hidden="true" />
                ) : (
                  <LockSimple size={11} aria-hidden="true" />
                )}
                <span className="sr-only">{on ? "Permitido:" : "Bloqueado:"}</span>
                {p.label}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 overflow-hidden rounded-xl border border-line max-lg:mt-2.5">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-line bg-navy-900 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-ink-faint light:bg-navy-800 sm:grid-cols-[1fr_auto_auto]">
            <span>Cliente</span>
            <span className="hidden sm:block">Asignado</span>
            <span>Etapa</span>
          </div>
          {/* Alto trabado: lugar para las cinco filas (tres en celulares, que se ven enteras); la
              tarjeta no cambia de alto al cambiar de rol */}
          <ul className="relative h-[210px] overflow-hidden max-lg:h-[114px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {rows.map((r) => {
                const ChannelIcon = CHANNEL[r.channel];
                return (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, transform: "translateY(8px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    exit={{ opacity: 0, transform: "translateY(-6px)" }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="grid h-[42px] grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto] max-lg:h-[38px]"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-ink">
                      <ChannelIcon size={15} className="shrink-0 text-ink-muted" aria-hidden="true" />
                      <span className="truncate">{r.lead}</span>
                    </span>
                    <span className="hidden text-[12px] text-ink-muted sm:block">
                      {role === "Ventas" ? "Vos" : r.owner}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STAGE_STYLE[r.stage]}`}>
                      {r.stage}
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </PreviewShell>
    </div>
  );
}
