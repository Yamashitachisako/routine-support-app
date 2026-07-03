import "dotenv/config";
import { google } from "googleapis";
import { createGoogleSheetsAuth, getGoogleSheetsId } from "../server/googleCredentials";

async function main() {
  const auth = createGoogleSheetsAuth();
  const spreadsheetId = getGoogleSheetsId();
  if (!auth || !spreadsheetId) {
    console.error("Missing auth or GOOGLE_SHEETS_ID");
    process.exit(1);
  }

  const sheets = google.sheets({ version: "v4", auth });
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    console.log(
      JSON.stringify(
        {
          spreadsheetId,
          title: meta.data.properties?.title ?? null,
          sheetNames: meta.data.sheets?.map((sheet) => sheet.properties?.title ?? null) ?? [],
        },
        null,
        2,
      ),
    );
  } catch (error) {
    const err = error as { message?: string; code?: number };
    console.error(JSON.stringify({ error: err.message, code: err.code }, null, 2));
    process.exit(1);
  }
}

void main();
