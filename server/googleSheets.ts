import { FALLBACK_ROUTINE_TASKS } from "@shared/routineTasks";
import type { RoutineTask } from "@shared/schema";

export { FALLBACK_ROUTINE_TASKS };

export async function fetchRoutineTasks(): Promise<{
  tasks: RoutineTask[];
  source: "sheets" | "fallback";
  error?: string;
  apiErrorDetail?: string;
}> {
  return {
    tasks: FALLBACK_ROUTINE_TASKS,
    source: "fallback",
  };
}

export async function appendRoutineLog(input: {
  userName: string;
  step: number;
  taskTitle: string;
  completed: true;
  durationSeconds: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  void input;
  return { ok: true };
}
