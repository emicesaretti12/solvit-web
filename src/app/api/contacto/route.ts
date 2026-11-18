import { CONTACT } from "@/content/contact-info";

const isEmail = (v: unknown) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" }[c]};`);

const ORIGENES: Record<string, string> = { pie: "Formulario del pie", menu: "Formulario del menú" };

/* Recibe el correo (obligatorio) y un mensaje opcional del formulario del pie o del menú,
   y lo reenvía por email con Resend a la casilla de contacto */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!isEmail(body.email)) {
    return Response.json({ error: "Correo inválido" }, { status: 422 });
  }

  const email = text(body.email, 200);
  const mensaje = text(body.mensaje, 2000);
  const origen = text(body.origen, 40);
  const lead = { email, mensaje, origen };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contacto] Falta RESEND_API_KEY: la consulta no se pudo enviar", lead);
    return Response.json({ error: "Servicio no configurado" }, { status: 500 });
  }

  const desde = ORIGENES[origen] ?? (origen || "Web");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Web Solvit <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || CONTACT.email],
      reply_to: email,
      subject: `Nueva consulta de ${email}`,
      text: [`Email: ${email}`, `Desde: ${desde}`, "", "Mensaje:", mensaje || "(sin mensaje)"].join("\n"),
      html: `<h2>Nueva consulta desde la web</h2>
<p><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Desde:</strong> ${escapeHtml(desde)}</p>
<p><strong>Mensaje:</strong></p>
<p style="white-space:pre-wrap">${mensaje ? escapeHtml(mensaje) : "<em>(sin mensaje)</em>"}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contacto] Resend respondió", res.status, await res.text(), lead);
    return Response.json({ error: "No se pudo enviar" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
