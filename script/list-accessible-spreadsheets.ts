import "dotenv/config";
import { google } from "googleapis";
import { createGoogleSheetsAuth, getGoogleSheetsId } from "../server/googleCredentials";

async function main() {
  const auth = createGoogleSheetsAuth();
  if (!auth) {
    console.error("No auth");
    process.exit(1);
  }

  const drive = google.drive({ version: "v3", auth });
  const configuredId = getGoogleSheetsId();

  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: "files(id, name, owners, shared)",
    pageSize: 50,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = response.data.files ?? [];
  console.log(
    JSON.stringify(
      {
        configuredSpreadsheetId: configuredId,
        accessibleSpreadsheetCount: files.length,
        spreadsheets: files.map((file) => ({
          id: file.id,
          name: file.name,
          matchesConfiguredId: file.id === configuredId,
          nameMatchesRoutineSupport: file.name?.includes("RoutineSupport") ?? false,
        })),
      },
      null,
      2,
    ),
  );
}

void main().catch((error) => {
  console.error("drive list error:", error);
  process.exit(1);
});
