import { google } from "googleapis";

export async function POST(request) {
  try {
    const body = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Hoja 1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            Date.now().toString(),
            body.titulo,
            body.descripcion,
            body.precio,
            body.ubicacion,
            body.dias,
            body.horario,
            body.stock,
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
      {
        ok: false,
        message: "Error al guardar el anuncio",
      },
      { status: 500 }
    );
  }
}