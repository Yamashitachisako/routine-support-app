import { type RoutineRecord, type InsertRoutineRecord, routineRecords } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord>;
  getRoutineRecords(): Promise<RoutineRecord[]>;
  getRoutineRecordsByUserName(userName: string): Promise<RoutineRecord[]>;
}

export class DatabaseStorage implements IStorage {
  async createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord> {
    const [newRecord] = await db.insert(routineRecords).values(record).returning();
    return newRecord;
  }

  async getRoutineRecords(): Promise<RoutineRecord[]> {
    return await db.select().from(routineRecords).orderBy(desc(routineRecords.date));
  }

  async getRoutineRecordsByUserName(userName: string): Promise<RoutineRecord[]> {
    return await db.select().from(routineRecords).where(eq(routineRecords.userName, userName)).orderBy(desc(routineRecords.date));
  }
}

export const storage = new DatabaseStorage();
