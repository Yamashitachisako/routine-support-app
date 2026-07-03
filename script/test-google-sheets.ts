import "dotenv/config";
import { fetchRoutineTasks } from "../server/googleSheets";
import {
  SERVICE_ACCOUNT_JSON_PATH,
  createGoogleSheetsAuth,
  getGoogleSheetsId,
  readServiceAccountJson,
} from "../server/googleCredentials";
import { existsSync } from "node:fs";

async function main() {
  const serviceAccount = readServiceAccountJson();
  console.log(
    JSON.stringify(
      {
        serviceAccountJsonExists: existsSync(SERVICE_ACCOUNT_JSON_PATH),
        serviceAccountJsonPath: SERVICE_ACCOUNT_JSON_PATH,
        serviceAccountEmail: serviceAccount?.client_email ?? null,
        googleSheetsIdSet: Boolean(getGoogleSheetsId()),
        googleSheetsId: getGoogleSheetsId(),
        authReady: Boolean(createGoogleSheetsAuth()),
      },
      null,
      2,
    ),
  );

  const result = await fetchRoutineTasks();
  console.log(
    JSON.stringify(
      {
        source: result.source,
        taskCount: result.tasks.length,
        error: result.error ?? null,
        firstTaskTitle: result.tasks[0]?.title_en ?? null,
      },
      null,
      2,
    ),
  );

  process.exit(result.source === "sheets" ? 0 : 1);
}

void main();
