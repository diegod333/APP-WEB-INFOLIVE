import { google } from "googleapis";

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


export async function GET() {
  try {
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
    const body = await request.json();
    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Hoja 1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            Date.now().toString(),
            body.titulo,
            body.descripcion,
            body.precio,
            body.ubicacion,
            body.horario,
            body.stock,
            body.dueno_anuncio,
            new Date().toISOString(),
          ],
        ],
      },
    });

    return Response.json({
      ok: true,
      message: "Anuncio guardado correctamente",
    });
  } catch (error) {
    console.error("Error guardando anuncio:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const sheets = getSheetsClient();

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
          ],
        ],
      },
    });
    
    return Response.json({
      ok: true,
      message: "Anuncio actualizado correctamente",
    });
  } catch (error) {
    console.error("Error actualizando anuncio:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
