import "dotenv/config";
import { fetchRoutineTasks } from "../server/googleSheets";
import {
  SERVICE_ACCOUNT_JSON_PATH,
  SHEET_RANGE,
  createGoogleSheetsAuth,
  getGoogleSheetsId,
  readServiceAccountJson,
} from "../server/googleCredentials";
import { existsSync } from "node:fs";

async function main() {
  console.log("=== Google Sheets diagnose ===");
  console.log("cwd:", process.cwd());
  console.log("range:", SHEET_RANGE);
  console.log("serviceAccountJsonPath:", SERVICE_ACCOUNT_JSON_PATH);
  console.log("serviceAccountJsonExists:", existsSync(SERVICE_ACCOUNT_JSON_PATH));

  getGoogleSheetsId();
  readServiceAccountJson();
  console.log("authReady:", Boolean(createGoogleSheetsAuth()));

  const result = await fetchRoutineTasks();
  console.log("result:", {
    source: result.source,
    taskCount: result.tasks.length,
    error: result.error ?? null,
    firstTaskTitle: result.tasks[0]?.title_en ?? null,
  });

  process.exit(result.source === "sheets" ? 0 : 1);
}

void main();
