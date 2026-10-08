const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const mensaje = String(body.mensaje ?? "").trim();
  if (!nombre || !isEmail(body.email) || mensaje.length < 10) {
    return Response.json({ error: "Datos incompletos" }, { status: 422 });
  }

  // TODO: conectar con el destino real (email transaccional, CRM o WhatsApp).
  console.info("[contacto]", {
    nombre,
    empresa: body.empresa,
    email: body.email,
    telefono: body.telefono,
    area: body.area,
    mensaje,
  });

  return Response.json({ ok: true });
}
