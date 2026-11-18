"use client";

/*
  Formulario corto de contacto: un correo y, si la persona quiere, un mensaje. Envía a
  /api/contacto y avisa con un toast (cargando, éxito o error). `compact` es la versión del
  menú; la del pie suma el mensaje opcional.
*/
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { tap } from "@/lib/haptics";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadForm({ compact = false, origin }: { compact?: boolean; origin: string }) {
  const id = useId();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setError(email ? "Revisá el formato del correo." : "Ingresá tu correo.");
      form.querySelector<HTMLInputElement>("input[name=email]")?.focus();
      return;
    }
    setError("");
    setSending(true);
    tap();
    const request = fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mensaje: String(data.get("mensaje") ?? "").trim(), origen: origin }),
    }).then((res) => {
      if (!res.ok) throw new Error(String(res.status));
    });
    toast.promise(request, {
      loading: "Enviando tu correo",
      success: "Listo. Te escribimos para coordinar el diagnóstico.",
      error: "No pudimos enviarlo. Probá de nuevo en unos minutos.",
    });
    try {
      await request;
      form.reset();
      setMore(false);
    } catch {
      // El toast ya avisó
    } finally {
      setSending(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full">
      <label htmlFor={`${id}-email`} className="sr-only">
        Correo electrónico
      </label>
      <div
        className={`flex items-center rounded-2xl bg-haze transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--blue-500)] ${compact ? "h-[60px] pl-5 pr-2" : "h-[64px] pl-6 pr-2.5"}`}
      >
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          aria-label="Enviar correo"
          className="group grid size-11 shrink-0 place-items-center rounded-full text-ink transition-[background-color,color,transform] duration-200 ease-out hover:bg-ink hover:text-white active:scale-95 disabled:opacity-60"
        >
          {sending ? (
            <CircleNotch size={20} className="animate-spin" />
          ) : (
            <ArrowRight size={22} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
      {!compact && (
        <div className="mt-3">
          {more ? (
            <>
              <label htmlFor={`${id}-msg`} className="sr-only">
                Mensaje (opcional)
              </label>
              <textarea
                id={`${id}-msg`}
                name="mensaje"
                rows={3}
                placeholder="Contanos qué querés resolver (opcional)"
                className="w-full resize-y rounded-2xl bg-haze px-6 py-4 text-[16px] text-ink placeholder:text-ink-faint focus:outline-none focus:shadow-[0_0_0_2px_var(--blue-500)]"
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMore(true)}
              className="inline-flex min-h-11 items-center text-sm text-ink-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              + Agregar un mensaje
            </button>
          )}
        </div>
      )}
      <p id={`${id}-error`} aria-live="polite" className="mt-2 min-h-5 text-sm text-red-600">
        {error}
      </p>
    </form>
  );
}
