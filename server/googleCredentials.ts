import { existsSync, readFileSync } from "node:fs";
import { createPrivateKey } from "node:crypto";
import { resolve } from "node:path";
import { google } from "googleapis";

export const PROJECT_ROOT = process.cwd();
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

export type ServiceAccountCredentials = {
  type?: string;
  project_id?: string;
  client_email: string;
  private_key: string;
  source: "env" | "json";
};

type ServiceAccountJson = Omit<ServiceAccountCredentials, "source">;

export function getGoogleSheetsId(): string | null {
  return process.env.GOOGLE_SHEETS_ID?.trim() || null;
}

export function normalizeGooglePrivateKey(raw: string): string {
  let key = raw.trim();

  // Render / .env で余分に付く引用符を除去
  while (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // 環境変数の改行エスケープを復元（\\n, \n, 実改行すべてに対応）
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 1行に潰れた PEM を改行付きに再構成
  if (key.includes("-----BEGIN") && !key.includes("\n")) {
    key = key
      .replace(/-----BEGIN ([A-Z ]+)-----/g, "-----BEGIN $1-----\n")
      .replace(/-----END ([A-Z ]+)-----/g, "\n-----END $1-----\n");
  }

  // PEM 本文の空白を除去して標準的な64文字折り返しに整形
  const pemMatch = key.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END ([A-Z ]+)-----/);
  if (pemMatch) {
    const [, beginLabel, body, endLabel] = pemMatch;
    const cleanedBody = body.replace(/\s+/g, "");
    const wrappedBody = cleanedBody.match(/.{1,64}/g)?.join("\n") ?? cleanedBody;
    key = `-----BEGIN ${beginLabel}-----\n${wrappedBody}\n-----END ${endLabel}-----\n`;
  } else if (!key.endsWith("\n")) {
    key += "\n";
  }

  return key;
}

export function isValidGooglePrivateKey(privateKey: string): boolean {
  try {
    createPrivateKey(privateKey);
    return true;
  } catch {
    return false;
  }
}

function readEnvServiceAccount(): ServiceAccountJson | null {
  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!client_email || !rawPrivateKey?.trim()) return null;

  const private_key = normalizeGooglePrivateKey(rawPrivateKey);
  if (!private_key.includes("BEGIN PRIVATE KEY") && !private_key.includes("BEGIN RSA PRIVATE KEY")) {
    console.warn("[googleCredentials] GOOGLE_PRIVATE_KEY is missing PEM headers");
    return null;
  }

  if (!isValidGooglePrivateKey(private_key)) {
    console.warn("[googleCredentials] GOOGLE_PRIVATE_KEY failed OpenSSL validation after normalization", {
      length: private_key.length,
      hasNewlines: private_key.includes("\n"),
      lineCount: private_key.split("\n").length,
    });
    return null;
  }

  return {
    type: "service_account",
    client_email,
    private_key,
  };
}

function readJsonServiceAccount(): ServiceAccountJson | null {
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

/** 環境変数を優先し、なければ credentials/service-account.json を読む */
export function loadServiceAccountCredentials(): ServiceAccountCredentials | null {
  const fromEnv = readEnvServiceAccount();
  if (fromEnv) {
    return { ...fromEnv, source: "env" };
  }

  const fromJson = readJsonServiceAccount();
  if (fromJson) {
    return { ...fromJson, source: "json" };
  }

  return null;
}

/** @deprecated loadServiceAccountCredentials を使用 */
export function readServiceAccountJson(): ServiceAccountJson | null {
  const creds = loadServiceAccountCredentials();
  if (!creds) return null;
  const { source: _source, ...json } = creds;
  return json;
}

export function logGoogleSheetsConfig(): void {
  const sheetId = getGoogleSheetsId();
  const serviceAccount = loadServiceAccountCredentials();

  console.log("[googleCredentials] GOOGLE_SHEETS_ID loaded:", {
    value: sheetId,
    length: sheetId?.length ?? 0,
  });
  console.log("[googleCredentials] credential source:", serviceAccount?.source ?? "none");
  if (serviceAccount?.source === "json") {
    console.log("[googleCredentials] service-account.json path:", SERVICE_ACCOUNT_JSON_PATH);
    console.log("[googleCredentials] service-account.json exists:", existsSync(SERVICE_ACCOUNT_JSON_PATH));
  }
  console.log("[googleCredentials] service account loaded:", {
    type: serviceAccount?.type ?? null,
    project_id: serviceAccount?.project_id ?? null,
    client_email: serviceAccount?.client_email ?? null,
    private_key_present: Boolean(serviceAccount?.private_key),
    private_key_length: serviceAccount?.private_key?.length ?? 0,
    private_key_has_begin: serviceAccount?.private_key?.includes("BEGIN PRIVATE KEY") ?? false,
    private_key_openssl_valid:
      serviceAccount?.private_key ? isValidGooglePrivateKey(serviceAccount.private_key) : false,
  });
  console.log("[googleSheets] range:", SHEET_RANGE);
}

function createGoogleAuth(
  scopes: string[],
): InstanceType<typeof google.auth.GoogleAuth> | null {
  const credentials = loadServiceAccountCredentials();
  if (!credentials) {
    console.warn(
      "[googleCredentials] No Google service account credentials. " +
        "Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY, " +
        "or place credentials/service-account.json for local development.",
    );
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes,
  });
}

export function createGoogleSheetsAuth(): InstanceType<typeof google.auth.GoogleAuth> | null {
  return createGoogleAuth([SHEETS_READONLY_SCOPE]);
}

export function createGoogleSheetsWriteAuth(): InstanceType<typeof google.auth.GoogleAuth> | null {
  return createGoogleAuth([SHEETS_WRITE_SCOPE]);
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
