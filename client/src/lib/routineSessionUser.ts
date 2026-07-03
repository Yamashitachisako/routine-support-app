/** Start Routine 押下時に確定した利用者名（routine_logs 専用。localStorage と分離） */
const SESSION_KEY = "routine-active-user-name";

export function setRoutineSessionUserName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  sessionStorage.setItem(SESSION_KEY, trimmed);
}

export function getRoutineSessionUserName(): string {
  return sessionStorage.getItem(SESSION_KEY)?.trim() ?? "";
}

export function clearRoutineSessionUserName(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
