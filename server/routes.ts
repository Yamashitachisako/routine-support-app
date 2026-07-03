import type { Express } from "express";
import { type Server } from "http";
import { sql } from "drizzle-orm";
import { storage, StorageFacade } from "./storage";
import { db } from "./db";
import {
  insertRoutineRecordSchema,
  insertCustomRoutineSchema,
  updateCustomRoutineSchema,
  insertGameScoreSchema,
  insertRoutineLogSchema,
} from "@shared/schema";
import { computeWeeklySummary } from "./summary";
import { appendRoutineLog, fetchRoutineTasks } from "./googleSheets";
import {
  SHEET_RANGE,
  createGoogleSheetsAuth,
  getGoogleSheetsId,
  readServiceAccountJson,
  formatTokyoTimestamp,
} from "./googleCredentials";

function send500(res: import("express").Response, where: string, error: unknown) {
  const err = error as any;
  console.error(`[routes] 500 at ${where}:`, err);
  if (err && err.stack) console.error(err.stack);
  const message =
    (err && (err.message || err.code || err.detail)) ||
    (typeof err === "string" ? err : "") ||
    "Internal Server Error";
  return res.status(500).json({ message, code: err?.code ?? null, where });
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/health", async (_req, res) => {
    const facadeMode = storage instanceof StorageFacade ? storage.getMode() : "db";
    const result: any = {
      ok: true,
      storageMode: facadeMode,
      databaseUrlPresent: Boolean(process.env.DATABASE_URL),
      databaseUrlPreview: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ":***@").slice(0, 80)
        : null,
      checks: {} as Record<string, any>,
    };
    try {
      const ping = await db.execute(sql`select 1 as one`);
      result.checks.ping = { ok: true, rows: ping.rows ?? ping };
    } catch (err: any) {
      result.ok = false;
      result.checks.ping = { ok: false, message: err.message, code: err.code };
    }
    for (const tbl of ["routine_records", "custom_routines", "custom_routine_steps", "game_scores"] as const) {
      try {
        const r = await db.execute(sql`select to_regclass(${"public." + tbl}) as exists`);
        result.checks[tbl] = { ok: true, exists: Boolean((r.rows ?? r)[0]?.exists) };
      } catch (err: any) {
        result.ok = false;
        result.checks[tbl] = { ok: false, message: err.message };
      }
    }
    return res.status(200).json(result);
  });

  app.get("/api/routine-tasks", async (_req, res) => {
    try {
      const range = SHEET_RANGE;
      const auth = createGoogleSheetsAuth();
      const serviceAccount = readServiceAccountJson();
      const spreadsheetId = getGoogleSheetsId();
      let clientEmail = serviceAccount?.client_email ?? null;
      if (auth) {
        const client = await auth.getClient();
        clientEmail = (client as { email?: string }).email ?? clientEmail;
      }

      console.log("Spreadsheet ID:", process.env.GOOGLE_SHEETS_ID);
      console.log("Range:", range);
      console.log("Client Email:", clientEmail);
      console.log("spreadsheetId (Google Sheets API):", spreadsheetId);

      const { tasks, source, error, apiErrorDetail } = await fetchRoutineTasks();
      res.setHeader("X-Routine-Tasks-Source", source);
      res.setHeader("X-Routine-Tasks-Range", "routine_tasks!A3:H");
      if (error) res.setHeader("X-Routine-Tasks-Error", error);
      if (apiErrorDetail) {
        res.setHeader(
          "X-Routine-Tasks-Error-Detail",
          apiErrorDetail.replace(/\r?\n/g, "").slice(0, 2000),
        );
      }
      return res.json(tasks);
    } catch (error) {
      console.error("[routes] GET /api/routine-tasks unexpected error:", error);
      const { FALLBACK_ROUTINE_TASKS } = await import("@shared/routineTasks");
      res.setHeader("X-Routine-Tasks-Source", "fallback");
      return res.json(FALLBACK_ROUTINE_TASKS);
    }
  });

  app.post("/api/routine-logs", async (req, res) => {
    try {
      const result = insertRoutineLogSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: result.error.flatten(),
        });
      }

      const body = result.data;
      const sheetRow = {
        timestamp: formatTokyoTimestamp(),
        user_name: body.userName,
        step: body.step,
        task_title: body.taskTitle,
        completed: body.completed,
        duration_seconds: body.durationSeconds,
      };
      console.log("[routine-logs] append request:", sheetRow);

      const appendResult = await appendRoutineLog(body);
      if (!appendResult.ok) {
        return res.status(502).json({ message: appendResult.error });
      }

      return res.status(201).json({ ok: true });
    } catch (error) {
      return send500(res, "POST /api/routine-logs", error);
    }
  });

  app.get("/api/routine-records", async (req, res) => {
    try {
      const userName =
        typeof req.query.userName === "string" && req.query.userName.trim()
          ? req.query.userName.trim()
          : null;
      const records = userName
        ? await storage.getRoutineRecordsByUserName(userName)
        : await storage.getRoutineRecords();
      return res.json(records);
    } catch (error) {
      return send500(res, "GET /api/routine-records", error);
    }
  });

  app.post("/api/routine-records", async (req, res) => {
    try {
      const result = insertRoutineRecordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const record = await storage.createRoutineRecord(result.data);
      return res.status(201).json(record);
    } catch (error) {
      return send500(res, "POST /api/routine-records", error);
    }
  });

  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.listUserNames();
      return res.json(users);
    } catch (error) {
      return send500(res, "GET /api/users", error);
    }
  });

  app.get("/api/custom-routines", async (req, res) => {
    try {
      const includeHidden = req.query.includeHidden === "true";
      const routines = await storage.listCustomRoutines({ includeHidden });
      return res.json(routines);
    } catch (error) {
      return send500(res, "GET /api/custom-routines", error);
    }
  });

  app.get("/api/custom-routines/:id", async (req, res) => {
    try {
      const routine = await storage.getCustomRoutineWithSteps(req.params.id);
      if (!routine) return res.status(404).json({ message: "Custom routine not found" });
      return res.json(routine);
    } catch (error) {
      return send500(res, `GET /api/custom-routines/${req.params.id}`, error);
    }
  });

  app.post("/api/custom-routines", async (req, res) => {
    try {
      const result = insertCustomRoutineSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const routine = await storage.createCustomRoutine(result.data);
      return res.status(201).json(routine);
    } catch (error) {
      return send500(res, "POST /api/custom-routines", error);
    }
  });

  app.patch("/api/custom-routines/:id", async (req, res) => {
    try {
      const result = updateCustomRoutineSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const routine = await storage.updateCustomRoutine(req.params.id, result.data);
      if (!routine) return res.status(404).json({ message: "Custom routine not found" });
      return res.json(routine);
    } catch (error) {
      return send500(res, `PATCH /api/custom-routines/${req.params.id}`, error);
    }
  });

  app.delete("/api/custom-routines/:id", async (req, res) => {
    try {
      const ok = await storage.deleteCustomRoutine(req.params.id);
      if (!ok) return res.status(404).json({ message: "Custom routine not found" });
      return res.status(204).send();
    } catch (error) {
      return send500(res, `DELETE /api/custom-routines/${req.params.id}`, error);
    }
  });

  app.get("/api/game-scores", async (req, res) => {
    try {
      const userName =
        typeof req.query.userName === "string" && req.query.userName.trim()
          ? req.query.userName.trim()
          : undefined;
      const limitRaw = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : NaN;
      const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
      const rows = await storage.listGameScores({ userName, limit });
      return res.json(rows);
    } catch (error) {
      return send500(res, "GET /api/game-scores", error);
    }
  });

  app.post("/api/game-scores", async (req, res) => {
    try {
      const result = insertGameScoreSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const row = await storage.createGameScore(result.data);
      return res.status(201).json(row);
    } catch (error) {
      return send500(res, "POST /api/game-scores", error);
    }
  });

  app.get("/api/summary/weekly", async (req, res) => {
    try {
      const userName = typeof req.query.userName === "string" ? req.query.userName.trim() : "";
      if (!userName) return res.status(400).json({ message: "userName is required" });
      const refRaw = typeof req.query.reference === "string" ? req.query.reference : null;
      const reference = refRaw ? new Date(refRaw) : new Date();
      if (Number.isNaN(reference.getTime())) {
        return res.status(400).json({ message: "Invalid reference date" });
      }
      const summary = await computeWeeklySummary(userName, reference);
      return res.json(summary);
    } catch (error) {
      return send500(res, "GET /api/summary/weekly", error);
    }
  });

  return httpServer;
}
