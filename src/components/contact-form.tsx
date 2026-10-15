"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"nombre" | "email" | "mensaje", string>>;

const areas = [
  "No sé todavía, quiero un diagnóstico",
  "Desarrollo web (sitio, tienda o landing)",
  "Software a medida (CRM, reservas, gestión)",
  "Agente de IA para WhatsApp, Instagram o web",
  "Hardware e IoT",
  "Marketing digital",
];

const field =
  "w-full rounded-xl border border-line-strong bg-navy-950/60 px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 aria-[invalid=true]:border-red-400";

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get("nombre") ?? "").trim()) errors.nombre = "Ingresá tu nombre.";
  const email = String(data.get("email") ?? "").trim();
  if (!email) errors.email = "Ingresá tu email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Revisá el formato del email.";
  if (String(data.get("mensaje") ?? "").trim().length < 10)
    errors.mensaje = "Contanos un poco más (mínimo 10 caracteres).";
  return errors;
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-faint">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-red-300">
          <WarningCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setStatus("sending");
    const request = fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data)),
    }).then((res) => {
      if (!res.ok) throw new Error(String(res.status));
    });
    // Aviso que acompaña el envío: cargando, y después éxito o error
    toast.promise(request, {
      loading: "Enviando tu consulta",
      success: "Consulta recibida. Te vamos a escribir para coordinar el diagnóstico.",
      error: "No pudimos enviar la consulta. Probá de nuevo en unos minutos.",
    });
    try {
      await request;
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inv = (k: keyof Errors) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          role="status"
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="flex min-h-[420px] flex-col items-start justify-center p-8 md:p-10"
        >
          <CheckCircle size={40} weight="light" className="text-blue-400" />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
            Recibimos tu consulta.
          </h3>
          <p className="mt-3 max-w-[40ch] leading-relaxed text-ink-muted">
            Un ingeniero del equipo te va a contactar para coordinar el
            diagnóstico.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-8 text-sm text-blue-300 underline-offset-4 hover:underline"
          >
            Enviar otra consulta
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-5 p-6 md:grid-cols-2 md:p-10"
        >
          <Field id="nombre" label="Nombre" error={errors.nombre}>
            <input id="nombre" name="nombre" autoComplete="name" className={field} {...inv("nombre")} />
          </Field>
          <Field id="empresa" label="Empresa" optional>
            <input id="empresa" name="empresa" autoComplete="organization" className={field} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={field} {...inv("email")} />
          </Field>
          <Field id="telefono" label="Teléfono" optional>
            <input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" className={field} />
          </Field>
          <div className="md:col-span-2">
            <Field id="area" label="¿Qué necesitás resolver?">
              <select id="area" name="area" defaultValue={areas[0]} className={`${field} appearance-none`}>
                {areas.map((a) => (
                  <option key={a} value={a} className="bg-navy-900">
                    {a}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field id="mensaje" label="Contanos el desafío" error={errors.mensaje}>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                placeholder="Por ejemplo: perdemos consultas de WhatsApp fuera de horario y no sabemos qué vendedor sigue cada una."
                className={`${field} resize-y`}
                {...inv("mensaje")}
              />
            </Field>
          </div>

          <div className="flex flex-col items-start gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <p aria-live="polite" className="text-sm text-red-300">
              {status === "error" &&
                "No pudimos enviar la consulta. Probá de nuevo en unos minutos."}
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] transition-[transform,background-color] duration-150 ease-out hover:bg-blue-400 active:scale-[0.97] disabled:opacity-70"
            >
              {status === "sending" && (
                <CircleNotch size={16} className="animate-spin" />
              )}
              {status === "sending" ? "Enviando" : "Enviar consulta"}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
