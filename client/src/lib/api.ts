import type { RoutineRecord, InsertRoutineRecord } from "@shared/schema";

export async function createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord> {
  const response = await fetch("/api/routine-records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to create routine record");
  }

  return response.json();
}

export async function getRoutineRecords(): Promise<RoutineRecord[]> {
  const response = await fetch("/api/routine-records");

  if (!response.ok) {
    throw new Error("Failed to fetch routine records");
  }

  return response.json();
}
