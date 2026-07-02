import { google } from "googleapis";
import { registrarLog } from "@/lib/logs";

export const dynamic = "force-dynamic";

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

export async function DELETE(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";
    const body = await request.json();
    const sheets = getSheetsClient();

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: body.rowNumber - 1,
                endIndex: body.rowNumber,
              },
            },
          },
        ],
      },
    });
    await registrarLog(
      body.dueno_anuncio || "Desconocido",
      "ELIMINAR_ANUNCIO",
      `Row: ${body.rowNumber} | ID: ${body.id || "N/A"}`,
      ip
    );

    return Response.json({
      ok: true,
      message: "Anuncio eliminado correctamente",
    });
  } catch (error) {
    console.error("Error eliminando anuncio:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";
    const sheets = getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Hoja 1!A:J",
    });

    const rows = res.data.values || [];
    const dataRows = rows.slice(1);

    const anuncios = dataRows.map((row, index) => ({
      rowNumber: index + 2,
      id: row[0] || "",
      categoria: "comida",
      titulo: row[1] || "",
      descripcion: row[2] || "",
      precio: row[3] || "",
      ubicacion: row[4] || "",
      horario: row[5] || "",
      stock: row[6] || "",
      dueno_anuncio: row[7] || "",
      createdAt: row[8] || "",
      imagen: row[9] || "", 
    }));

    return Response.json({ ok: true, anuncios });
  } catch (error) {
    console.error("Error leyendo anuncios:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";
    const { token } = await request.json();
    const tokenLimpio = token.trim().toUpperCase();

    const sheets = getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Usuarios!A:C",
    });

    const rows = res.data.values || [];
    const dataRows = rows.slice(1); 

    const filaUsuario = dataRows.find(
      (row) => row[0] && row[0].trim().toUpperCase() === tokenLimpio && row[2] && row[2].trim().toUpperCase() === "TRUE"
    );

    if (filaUsuario) {
      await registrarLog(
        filaUsuario[1] || "Desconocido",
        "LOGIN_API_ANUNCIOS",
        `Token: ${tokenLimpio}`,
        ip
      );
      return Response.json({
        ok: true,
        usuario: {
          codigo: filaUsuario[0].trim(),
          nombre: filaUsuario[1] || "Usuario Nuevo",
        },
      });
    }

    return Response.json({ ok: false, message: "Token inválido o inactivo." }, { status: 401 });

  } catch (error) {
    console.error("Error en la validación de usuarios:", error);
    return Response.json({ ok: false, message: "Error interno del servidor al validar token." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "Desconocida";
    
    const body = await request.json();
    const sheets = getSheetsClient();
  
    if (body.rowNumber) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Hoja 1!A${body.rowNumber}:J${body.rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              body.id,
              body.titulo,
              body.descripcion,
              body.precio,
              body.ubicacion,
              body.horario,
              body.stock,
              body.dueno_anuncio,
              body.createdAt,
              body.imagen || "", 
            ],
          ],
        },
      });
      await registrarLog(
        body.dueno_anuncio,
        "EDITAR_ANUNCIO",
        `ID: ${body.id} | Título: ${body.titulo}`,
        ip
      );

      return Response.json({
        ok: true,
        message: "Anuncio actualizado correctamente",
      });
    } 
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Hoja 1!A:J",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            body.id,
            body.titulo,
            body.descripcion,
            body.precio,
            body.ubicacion,
            body.horario,
            body.stock,
            body.dueno_anuncio,
            body.createdAt,
            body.imagen || "", 
          ],
        ],
      },
    });
    await registrarLog(
      body.dueno_anuncio,
      "CREAR_ANUNCIO",
      `ID: ${body.id} | Título: ${body.titulo}`,
      ip
    );

    return Response.json({
      ok: true,
      message: "Anuncio creado e insertado correctamente en Google Sheets",
    });

  } catch (error) {
    console.error("Error procesando anuncio en el Spreadsheet:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
