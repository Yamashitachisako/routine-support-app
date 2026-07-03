import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = resolve(__dirname, "..");
export const SERVICE_ACCOUNT_JSON_PATH = resolve(
  PROJECT_ROOT,
  "credentials",
  "service-account.json",
);

const SHEETS_READONLY_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const SHEETS_WRITE_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
/** ヘッダーは 3 行目。データは 4 行目から。 */
export const SHEET_RANGE = "routine_tasks!A3:H";
/** routine_logs シートへ追記する列範囲 */
export const ROUTINE_LOGS_APPEND_RANGE = "routine_logs!A:F";

/** Asia/Tokyo (JST) のローカル時刻。例: 2026-07-03 21:35:24 */
export function formatTokyoTimestamp(date = new Date()): string {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
}

type ServiceAccountJson = {
  type?: string;
  project_id?: string;
  client_email: string;
  private_key: string;
};

export function getGoogleSheetsId(): string | null {
  return process.env.GOOGLE_SHEETS_ID?.trim() || null;
}

export function readServiceAccountJson(): ServiceAccountJson | null {
  if (!existsSync(SERVICE_ACCOUNT_JSON_PATH)) {
    return null;
  }

  try {
    const json = JSON.parse(readFileSync(SERVICE_ACCOUNT_JSON_PATH, "utf8")) as ServiceAccountJson;
    if (!json.client_email || !json.private_key) return null;
    return json;
  } catch {
    return null;
  }
}

export function logGoogleSheetsConfig(): void {
  const sheetId = getGoogleSheetsId();
  const serviceAccount = readServiceAccountJson();

  console.log("[googleCredentials] GOOGLE_SHEETS_ID loaded:", {
    value: sheetId,
    length: sheetId?.length ?? 0,
  });
  console.log("[googleCredentials] service-account.json path:", SERVICE_ACCOUNT_JSON_PATH);
  console.log("[googleCredentials] service-account.json exists:", existsSync(SERVICE_ACCOUNT_JSON_PATH));
  console.log("[googleCredentials] service-account.json loaded:", {
    type: serviceAccount?.type ?? null,
    project_id: serviceAccount?.project_id ?? null,
    client_email: serviceAccount?.client_email ?? null,
    private_key_present: Boolean(serviceAccount?.private_key),
    private_key_length: serviceAccount?.private_key?.length ?? 0,
    private_key_has_begin: serviceAccount?.private_key?.includes("BEGIN PRIVATE KEY") ?? false,
  });
  console.log("[googleSheets] range:", SHEET_RANGE);
}

export function createGoogleSheetsAuth(): InstanceType<typeof google.auth.GoogleAuth> | null {
  if (!existsSync(SERVICE_ACCOUNT_JSON_PATH)) {
    console.warn("[googleCredentials] Service account JSON not found");
    return null;
  }

  return new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_JSON_PATH,
    scopes: [SHEETS_READONLY_SCOPE],
  });
}

export function createGoogleSheetsWriteAuth(): InstanceType<typeof google.auth.GoogleAuth> | null {
  if (!existsSync(SERVICE_ACCOUNT_JSON_PATH)) {
    console.warn("[googleCredentials] Service account JSON not found");
    return null;
  }

  return new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_JSON_PATH,
    scopes: [SHEETS_WRITE_SCOPE],
  });
}

export function formatGoogleApiError(error: unknown): {
  message: string;
  status: number | null;
  statusText: string | null;
  code: string | number | null;
  errors: unknown;
  responseData: unknown;
} {
  const err = error as {
    message?: string;
    code?: string | number;
    status?: number;
    statusText?: string;
    errors?: unknown;
    response?: { status?: number; statusText?: string; data?: unknown };
  };

  const responseData = err.response?.data ?? null;
  const nestedErrors =
    responseData &&
    typeof responseData === "object" &&
    "error" in responseData &&
    responseData.error &&
    typeof responseData.error === "object" &&
    "errors" in responseData.error
      ? (responseData.error as { errors?: unknown }).errors
      : null;

  return {
    message: err.message ?? String(error),
    status: err.response?.status ?? err.status ?? null,
    statusText: err.response?.statusText ?? err.statusText ?? null,
    code: err.code ?? null,
    errors: nestedErrors ?? err.errors ?? null,
    responseData,
  };
}
