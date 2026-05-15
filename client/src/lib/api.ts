import type {
  RoutineRecord,
  InsertRoutineRecord,
  CustomRoutineWithSteps,
  InsertCustomRoutine,
  UpdateCustomRoutine,
  GameScore,
  InsertGameScore,
  WeeklySummary,
} from "@shared/schema";

// ---------- Routine records ----------

export async function createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord> {
  const response = await fetch("/api/routine-records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!response.ok) throw new Error("Failed to create routine record");
  return response.json();
}

export async function getRoutineRecords(opts: { userName?: string } = {}):
  Promise<RoutineRecord[]> {
  const url = opts.userName
    ? `/api/routine-records?userName=${encodeURIComponent(opts.userName)}`
    : "/api/routine-records";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch routine records");
  return response.json();
}

// ---------- Custom routines ----------

export async function getCustomRoutines(opts: { includeHidden?: boolean } = {}):
  Promise<CustomRoutineWithSteps[]> {
  const url = opts.includeHidden
    ? "/api/custom-routines?includeHidden=true"
    : "/api/custom-routines";
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
  if (!response.ok) throw new Error("Failed to delete custom routine");
}

// ---------- Game scores ----------

export async function createGameScore(data: InsertGameScore): Promise<GameScore> {
  const response = await fetch("/api/game-scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to create game score: ${text}`);
  }
  return response.json();
}

export async function getGameScores(opts: { userName?: string; limit?: number } = {}):
  Promise<GameScore[]> {
  const params = new URLSearchParams();
  if (opts.userName) params.set("userName", opts.userName);
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const url = qs ? `/api/game-scores?${qs}` : "/api/game-scores";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch game scores");
  return response.json();
}

// ---------- Weekly summary ----------

export async function getWeeklySummary(opts: {
  userName: string;
  reference?: string;
}): Promise<WeeklySummary> {
  const params = new URLSearchParams();
  params.set("userName", opts.userName);
  if (opts.reference) params.set("reference", opts.reference);
  const response = await fetch(`/api/summary/weekly?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch weekly summary");
  return response.json();
}

// ---------- Users ----------

export async function getUserNames(): Promise<string[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}
