import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const routineRecords = pgTable("routine_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  feeling: text("feeling").notNull(),
  comment: text("comment"),
  routineType: text("routine_type").notNull().default('morning'),
});

export const insertRoutineRecordSchema = createInsertSchema(routineRecords).omit({
  id: true,
  date: true,
});

export type InsertRoutineRecord = z.infer<typeof insertRoutineRecordSchema>;
export type RoutineRecord = typeof routineRecords.$inferSelect;
