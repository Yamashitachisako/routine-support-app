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

const INVALID_GOOGLE_SHEETS_ID_VALUES = new Set(["your_spreadsheet_id"]);

export function getGoogleSheetsId(): string | null {
  // Always read the spreadsheet ID from process.env. Never fall back to .env.example.
  const value = process.env.GOOGLE_SHEETS_ID?.trim() ?? "";
  if (!value) return null;

  if (INVALID_GOOGLE_SHEETS_ID_VALUES.has(value.toLowerCase())) {
    console.warn(
      "[googleCredentials] Ignoring placeholder GOOGLE_SHEETS_ID from .env.example. " +
        "Set process.env.GOOGLE_SHEETS_ID to the real spreadsheet ID.",
    );
    return null;
  }

  return value;
}

export function formatGoogleSheetsIdPreview(sheetId: string | null): {
  first6: string | null;
  last6: string | null;
} {
  const value = sheetId?.trim() ?? "";
  if (!value) {
    return { first6: null, last6: null };
  }

  return {
    first6: value.slice(0, 6),
    last6: value.slice(-6),
  };
}

export function normalizeGooglePrivateKey(raw: string): string {
  const resolved = resolveGooglePrivateKey(raw);
  return resolved?.key ?? "";
}

function stripOuterQuotes(value: string): string {
  let result = value.replace(/^\uFEFF/, "").trim();
  let changed = true;
  while (changed) {
    changed = false;
    if (
      (result.startsWith('"') && result.endsWith('"')) ||
      (result.startsWith("'") && result.endsWith("'"))
    ) {
      result = result.slice(1, -1).trim();
      changed = true;
    }
  }
  return result;
}

function tryParseJsonQuotedString(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith('"')) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function unescapeNewlines(value: string): string {
  let result = value;
  for (let i = 0; i < 5; i++) {
    const next = result
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n");
    if (next === result) break;
    result = next;
  }
  return result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function formatPemBody(key: string): string {
  let normalized = key.trim();

  if (normalized.includes("-----BEGIN") && !normalized.includes("\n")) {
    normalized = normalized
      .replace(/-----BEGIN ([A-Z ]+)-----/g, "-----BEGIN $1-----\n")
      .replace(/-----END ([A-Z ]+)-----/g, "\n-----END $1-----\n");
  }

  const pemMatch = normalized.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END ([A-Z ]+)-----/);
  if (!pemMatch) {
    return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
  }

  const [, beginLabel, body, endLabel] = pemMatch;
  const cleanedBody = body.replace(/[^A-Za-z0-9+/=]/g, "");
  const wrappedBody = cleanedBody.match(/.{1,64}/g)?.join("\n") ?? cleanedBody;
  return `-----BEGIN ${beginLabel}-----\n${wrappedBody}\n-----END ${endLabel}-----\n`;
}

function wrapBase64AsPrivateKey(base64: string): string {
  const cleaned = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  const wrapped = cleaned.match(/.{1,64}/g)?.join("\n") ?? cleaned;
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
}

/** Render / .env 向けに複数パターンで private_key を解釈する */
export function resolveGooglePrivateKey(
  raw: string,
): { key: string; strategy: string } | null {
  const stripped = stripOuterQuotes(raw);
  const jsonParsed = tryParseJsonQuotedString(stripped);

  const candidates: Array<{ strategy: string; value: string }> = [
    { strategy: "json-quoted-string", value: jsonParsed ?? "" },
    { strategy: "json-quoted-string+unescape", value: jsonParsed ? unescapeNewlines(jsonParsed) : "" },
    { strategy: "strip-quotes", value: stripped },
    { strategy: "strip-quotes+unescape", value: unescapeNewlines(stripped) },
    { strategy: "strip-quotes+format-pem", value: formatPemBody(unescapeNewlines(stripped)) },
    {
      strategy: "collapsed-single-line+format-pem",
      value: formatPemBody(unescapeNewlines(stripped).replace(/\n/g, "")),
    },
    {
      strategy: "base64-only",
      value: stripped.includes("-----BEGIN") ? "" : wrapBase64AsPrivateKey(stripped),
    },
  ];

  for (const candidate of candidates) {
    const value = candidate.value.trim();
    if (!value || !value.includes("BEGIN")) continue;

    const formatted = formatPemBody(value);
    if (isValidGooglePrivateKey(formatted)) {
      return { key: formatted, strategy: candidate.strategy };
    }
  }

  return null;
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

  const resolved = resolveGooglePrivateKey(rawPrivateKey);
  if (!resolved) {
    console.warn("[googleCredentials] GOOGLE_PRIVATE_KEY could not be parsed", {
      length: rawPrivateKey.length,
      hasLiteralBackslashN: rawPrivateKey.includes("\\n"),
      hasNewlines: rawPrivateKey.includes("\n"),
      startsWithQuote: rawPrivateKey.trim().startsWith('"'),
      hasBeginMarker: rawPrivateKey.includes("BEGIN"),
    });
    return null;
  }

  console.log("[googleCredentials] GOOGLE_PRIVATE_KEY resolved via:", resolved.strategy);

  return {
    type: "service_account",
    client_email,
    private_key: resolved.key,
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
  const sheetIdPreview = formatGoogleSheetsIdPreview(sheetId);

  console.log("[googleCredentials] GOOGLE_SHEETS_ID loaded:", {
    source: "process.env.GOOGLE_SHEETS_ID",
    first6: sheetIdPreview.first6,
    last6: sheetIdPreview.last6,
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
