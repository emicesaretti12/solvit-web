const isEmail = (v: unknown) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/* Recibe el correo (obligatorio) y un mensaje opcional del formulario del pie o del menú */
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

  // TODO: conectar con el destino real (email transaccional, CRM o WhatsApp).
  console.info("[contacto]", {
    email: text(body.email, 200),
    mensaje: text(body.mensaje, 2000),
    origen: text(body.origen, 40),
  });

  return Response.json({ ok: true });
}
