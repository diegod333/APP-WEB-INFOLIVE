import { registrarLog } from "@/lib/logs";

export async function POST(request) {
  const body = await request.json();

  const forwarded = request.headers.get("x-forwarded-for");

  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";

  await registrarLog(
    body.usuario,
    body.accion,
    body.detalle,
    ip
  );

  return Response.json({ ok: true });
}
