import type { Express } from "express";
import { type Server } from "http";
import { sql } from "drizzle-orm";
import { storage, StorageFacade } from "./storage";
import { db } from "./db";
import {
  insertRoutineRecordSchema,
  insertCustomRoutineSchema,
  updateCustomRoutineSchema,
} from "@shared/schema";

function send500(res: import("express").Response, where: string, error: unknown) {
  const err = error as any;
  console.error(`[routes] 500 at ${where}:`, err);
  if (err && err.stack) console.error(err.stack);

  const message =
    (err && (err.message || err.code || err.detail)) ||
    (typeof err === "string" ? err : "") ||
    "Internal Server Error";

  return res.status(500).json({
    message,
    code: err?.code ?? null,
    where,
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ---------------- Diagnostic ----------------

  app.get("/api/health", async (_req, res) => {
    const facadeMode =
      storage instanceof StorageFacade ? storage.getMode() : "db";

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

    for (const tbl of ["routine_records", "custom_routines", "custom_routine_steps"] as const) {
      try {
        const r = await db.execute(
          sql`select to_regclass(${"public." + tbl}) as exists`
        );
        result.checks[tbl] = {
          ok: true,
          exists: Boolean((r.rows ?? r)[0]?.exists),
        };
      } catch (err: any) {
        result.ok = false;
        result.checks[tbl] = { ok: false, message: err.message };
      }
    }

    return res.status(200).json(result);
  });

  // ---------------- routine_records ----------------

  app.get("/api/routine-records", async (_req, res) => {
    try {
      const records = await storage.getRoutineRecords();
      return res.json(records);
    } catch (error) {
      return send500(res, "GET /api/routine-records", error);
    }
  });

  app.post("/api/routine-records", async (req, res) => {
    try {
      const result = insertRoutineRecordSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const record = await storage.createRoutineRecord(result.data);
      return res.status(201).json(record);
    } catch (error) {
      return send500(res, "POST /api/routine-records", error);
    }
  });

  // ---------------- custom routines ----------------

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
      if (!routine) {
        return res.status(404).json({ message: "Custom routine not found" });
      }
      return res.json(routine);
    } catch (error) {
      return send500(res, `GET /api/custom-routines/${req.params.id}`, error);
    }
  });

  app.post("/api/custom-routines", async (req, res) => {
    try {
      const result = insertCustomRoutineSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ message: "Invalid request body", errors: result.error.flatten() });
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
        return res
          .status(400)
          .json({ message: "Invalid request body", errors: result.error.flatten() });
      }
      const routine = await storage.updateCustomRoutine(req.params.id, result.data);
      if (!routine) {
        return res.status(404).json({ message: "Custom routine not found" });
      }
      return res.json(routine);
    } catch (error) {
      return send500(res, `PATCH /api/custom-routines/${req.params.id}`, error);
    }
  });

  app.delete("/api/custom-routines/:id", async (req, res) => {
    try {
      const ok = await storage.deleteCustomRoutine(req.params.id);
      if (!ok) {
        return res.status(404).json({ message: "Custom routine not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return send500(res, `DELETE /api/custom-routines/${req.params.id}`, error);
    }
  });

  return httpServer;
}
