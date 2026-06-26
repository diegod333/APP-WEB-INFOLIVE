import { google } from "googleapis";

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Logs!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          body.usuario || "Desconocido",
          body.accion || "UNKNOWN",
          body.detalle || "",
        ]],
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("LOG ERROR:", error);
    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}