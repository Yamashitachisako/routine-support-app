import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoutineRecordSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all routine records
  app.get("/api/routine-records", async (_req, res) => {
    try {
      const records = await storage.getRoutineRecords();
      return res.json(records);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Create a new routine record
  app.post("/api/routine-records", async (req, res) => {
    try {
      const result = insertRoutineRecordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error });
      }
      
      const record = await storage.createRoutineRecord(result.data);
      return res.status(201).json(record);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
