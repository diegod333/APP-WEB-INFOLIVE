import { google } from "googleapis";
import { registrarLog } from "@/lib/logs";

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// POST /api/auth — valida un código de acceso
// Body: { codigo: "AB12", nombre: "Juan" (opcional si ya está en el Sheet) }
export async function POST(request) {
  try {
    const body = await request.json();
    const codigoIngresado = (body.codigo || "").trim().toUpperCase();
    const nombreIngresado = (body.nombre || "").trim();

    if (!codigoIngresado) {
      return Response.json(
        { ok: false, message: "Ingresa tu código de acceso." },
        { status: 400 }
      );
    }

    const sheets = getSheetsClient();

    // Hoja "Usuarios": A=Codigo, B=Nombre, C=Activo
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Usuarios!A:C",
    });

    const rows = res.data.values || [];
    const dataRows = rows.slice(1); // saltar encabezado

    const filaIndex = dataRows.findIndex(
      (row) => (row[0] || "").trim().toUpperCase() === codigoIngresado
    );

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";

    if (filaIndex === -1) {
      
      
      await registrarLog(
        "Desconocido",
        "LOGIN_FALLIDO",
        `Código: ${codigoIngresado}`,
        ip
      );
      return Response.json(
        { ok: false, message: "Código no válido. Contáctanos para obtener el tuyo." },
        { status: 401 }
      );
    }

    const fila = dataRows[filaIndex];

    // Verificar si está activo (columna C)
    const activo = (fila[2] || "").toUpperCase();
    if (activo === "FALSE" || activo === "NO") {
      return Response.json(
        { ok: false, message: "Tu código fue desactivado. Contáctanos para más información." },
        { status: 403 }
      );
    }

    const nombreEnSheet = (fila[1] || "").trim();

    // Si el Sheet ya tiene nombre guardado, usarlo directo (no pedir de nuevo)
    if (nombreEnSheet) {
      console.log("Registrando login", nombreEnSheet, ip);

      await registrarLog(
        nombreEnSheet,
        "INICIO_SESION",
        "Inicio de sesión exitoso",
        ip
      );

      return Response.json({
        ok: true,
        usuario: {
          codigo: codigoIngresado,
          nombre: nombreEnSheet,
        },
      });
    }

    // Si el Sheet NO tiene nombre, el usuario debe haberlo ingresado
    if (!nombreIngresado) {
      return Response.json(
        { ok: false, message: "Es tu primera vez. Elige un nombre de usuario.", necesitaNombre: true },
        { status: 200 }
      );
    }

    // Guardar el nombre en la columna B del Sheet (fila real = filaIndex + 2 por encabezado)
    const filaReal = filaIndex + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Usuarios!B${filaReal}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nombreIngresado]],
      },
    });
    await registrarLog(
      nombreIngresado,
      "PRIMER_INICIO_SESION",
      "Registró su nombre e inició sesión",
      ip
    );

    return Response.json({
      ok: true,
      usuario: {
        codigo: codigoIngresado,
        nombre: nombreIngresado,
      },
    });
  } catch (error) {
    console.error("Error en autenticación:", error);
    return Response.json(
      { ok: false, message: "Error de servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
