import type {
  RoutineRecord,
  InsertRoutineRecord,
  CustomRoutineWithSteps,
  InsertCustomRoutine,
  UpdateCustomRoutine,
} from "@shared/schema";

// ---------- Routine records (existing) ----------

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

// ---------- Custom routines (new) ----------

export async function getCustomRoutines(opts: { includeHidden?: boolean } = {}):
  Promise<CustomRoutineWithSteps[]> {
  const url = opts.includeHidden ? "/api/custom-routines?includeHidden=true" : "/api/custom-routines";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch custom routines");
  return response.json();
}

export async function getCustomRoutine(id: string): Promise<CustomRoutineWithSteps> {
  const response = await fetch(`/api/custom-routines/${id}`);
  if (!response.ok) throw new Error("Failed to fetch custom routine");
  return response.json();
}

export async function createCustomRoutine(
  data: InsertCustomRoutine
): Promise<CustomRoutineWithSteps> {
  const response = await fetch("/api/custom-routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to create custom routine: ${text}`);
  }
  return response.json();
}

export async function updateCustomRoutine(
  id: string,
  data: UpdateCustomRoutine
): Promise<CustomRoutineWithSteps> {
  const response = await fetch(`/api/custom-routines/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to update custom routine: ${text}`);
  }
  return response.json();
}

export async function deleteCustomRoutine(id: string): Promise<void> {
  const response = await fetch(`/api/custom-routines/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete custom routine");
  }
}
