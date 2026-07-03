import { google } from "googleapis";
import { FALLBACK_ROUTINE_TASKS } from "@shared/routineTasks";
import { routineTaskSchema, type RoutineTask } from "@shared/schema";
import {
  SHEET_RANGE,
  ROUTINE_LOGS_APPEND_RANGE,
  createGoogleSheetsAuth,
  createGoogleSheetsWriteAuth,
  formatGoogleApiError,
  formatTokyoTimestamp,
  getGoogleSheetsId,
  loadServiceAccountCredentials,
  logGoogleSheetsConfig,
} from "./googleCredentials";

export { FALLBACK_ROUTINE_TASKS };

const COLUMN_KEYS = [
  "step",
  "title_en",
  "title_ja",
  "description_en",
  "description_ja",
  "minutes",
  "youtubeUrl",
  "emoji",
] as const;

function parseRow(row: string[]): RoutineTask | null {
  const record: Record<string, string> = {};
  COLUMN_KEYS.forEach((key, i) => {
    record[key] = (row[i] ?? "").trim();
  });

  const step = parseInt(record.step, 10);
  const minutes = parseInt(record.minutes, 10);

  const parsed = routineTaskSchema.safeParse({
    step: Number.isFinite(step) ? step : 0,
    title_en: record.title_en,
    title_ja: record.title_ja,
    description_en: record.description_en,
    description_ja: record.description_ja,
    minutes: Number.isFinite(minutes) ? minutes : 0,
    youtubeUrl: record.youtubeUrl,
    emoji: record.emoji,
  });

  return parsed.success ? parsed.data : null;
}

export async function fetchRoutineTasks(): Promise<{
  tasks: RoutineTask[];
  source: "sheets" | "fallback";
  error?: string;
  apiErrorDetail?: string;
}> {
  const sheetId = getGoogleSheetsId();
  logGoogleSheetsConfig();
  const auth = createGoogleSheetsAuth();
  const serviceAccount = loadServiceAccountCredentials();

  if (!sheetId) {
    console.warn("[googleSheets] GOOGLE_SHEETS_ID is not set, using fallback routine tasks");
    return {
      tasks: FALLBACK_ROUTINE_TASKS,
      source: "fallback",
      error: "process.env.GOOGLE_SHEETS_ID is not set",
    };
  }

  if (!auth) {
    console.warn("[googleSheets] Missing service account JSON, using fallback routine tasks");
    return {
      tasks: FALLBACK_ROUTINE_TASKS,
      source: "fallback",
      error: "Google service account credentials not configured",
    };
  }

  const range = SHEET_RANGE;
  console.log("[googleSheets] request:", {
    spreadsheetId: sheetId,
    range,
  });

  try {
    const sheets = google.sheets({ version: "v4", auth });

    console.log("spreadsheetId (values.get param):", sheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    console.log("[googleSheets] values.get success:", {
      status: response.status,
      statusText: response.statusText,
      rowCount: response.data.values?.length ?? 0,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.warn("[googleSheets] No data rows found (header is row 3), using fallback routine tasks");
      return { tasks: FALLBACK_ROUTINE_TASKS, source: "fallback" };
    }

    // A3:H の先頭行 = 3 行目ヘッダー。4 行目以降がデータ。
    const dataRows = rows.slice(1);
    const tasks = dataRows
      .map((row) => parseRow(row))
      .filter((task): task is RoutineTask => task !== null)
      .sort((a, b) => a.step - b.step);

    if (tasks.length === 0) {
      console.warn("[googleSheets] No valid tasks parsed, using fallback routine tasks");
      return { tasks: FALLBACK_ROUTINE_TASKS, source: "fallback" };
    }

    return { tasks, source: "sheets" };
  } catch (error) {
    const apiError = formatGoogleApiError(error);
    const apiErrorDetail = JSON.stringify(apiError.responseData ?? apiError, null, 2);

    console.error("[googleSheets] Google API error (full):", apiErrorDetail);
    console.error("[googleSheets] status:", apiError.status, apiError.statusText);
    console.error("[googleSheets] message:", apiError.message);
    console.error("[googleSheets] errors:", JSON.stringify(apiError.errors, null, 2));
    console.error("[googleSheets] raw error:", error);

    if (apiError.status === 404) {
      console.error(
        "[googleSheets] 404 hint: service account cannot access this spreadsheet ID. " +
          `Share the spreadsheet with ${serviceAccount?.client_email ?? "the service account email"} ` +
          "and verify GOOGLE_SHEETS_ID matches the URL /d/{ID}/edit value exactly.",
      );
    }

    return {
      tasks: FALLBACK_ROUTINE_TASKS,
      source: "fallback",
      error: apiError.message,
      apiErrorDetail,
    };
  }
}

export async function appendRoutineLog(input: {
  userName: string;
  step: number;
  taskTitle: string;
  completed: true;
  durationSeconds: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const sheetId = getGoogleSheetsId();
  const auth = createGoogleSheetsWriteAuth();

  if (!sheetId) {
    return { ok: false, error: "process.env.GOOGLE_SHEETS_ID is not set" };
  }

  if (!auth) {
    return { ok: false, error: "Google service account credentials not configured" };
  }

  const timestamp = formatTokyoTimestamp();
  const sheetRow = {
    timestamp,
    user_name: input.userName,
    step: input.step,
    task_title: input.taskTitle,
    completed: input.completed,
    duration_seconds: input.durationSeconds,
  };
  console.log("[googleSheets] routine_logs append row:", sheetRow);

  const values = [
    [
      timestamp,
      input.userName,
      String(input.step),
      input.taskTitle,
      "TRUE",
      String(input.durationSeconds),
    ],
  ];

  try {
    const sheets = google.sheets({ version: "v4", auth });
    console.log("spreadsheetId =", sheetId);
    console.log("range =", ROUTINE_LOGS_APPEND_RANGE);
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: ROUTINE_LOGS_APPEND_RANGE,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    console.log("[googleSheets] routine_logs append success:", {
      spreadsheetId: sheetId,
      range: ROUTINE_LOGS_APPEND_RANGE,
      userName: input.userName,
      step: input.step,
      taskTitle: input.taskTitle,
      durationSeconds: input.durationSeconds,
      updatedRange: response.data.updates?.updatedRange ?? null,
      updatedRows: response.data.updates?.updatedRows ?? null,
    });

    return { ok: true };
  } catch (error) {
    const apiError = formatGoogleApiError(error);
    console.error("[googleSheets] routine_logs append failed:", apiError.message, apiError.responseData);
    if (apiError.status === 403) {
      return {
        ok: false,
        error:
          "The service account does not have write permission. Share the spreadsheet with Editor access.",
      };
    }
    return { ok: false, error: apiError.message };
  }
}
