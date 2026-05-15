import type { WeeklySummary } from "@shared/schema";
import { storage } from "./storage";

/** UTC ではなくサーバのローカル日付で「日曜 0:00」を返す */
function startOfWeekSunday(reference: Date): Date {
  const d = new Date(reference);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 1 ユーザーの今週分の取り組みを集計する。
 * - DB / Memory どちらの storage でも同じロジックで動く
 * - 失敗時も部分結果は返す方針 (storage がエラーを投げたら呼び出し側で 500)
 */
export async function computeWeeklySummary(
  userName: string,
  reference: Date = new Date()
): Promise<WeeklySummary> {
  const weekStart = startOfWeekSunday(reference);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const startMs = weekStart.getTime();
  const endMs = weekEnd.getTime();

  // 1. routine_records から完了履歴を取得
  const allRecords = await storage.getRoutineRecordsByUserName(userName);
  const weekRecords = allRecords.filter((r) => {
    const t = new Date(r.date).getTime();
    return t >= startMs && t <= endMs;
  });

  const byRoutineType: Record<string, number> = {};
  for (const r of weekRecords) {
    byRoutineType[r.routineType] = (byRoutineType[r.routineType] ?? 0) + 1;
  }

  // 2. 日別カウント (7 日分、無い日も 0 で埋める)
  const dayMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    dayMap.set(ymd(d), 0);
  }
  for (const r of weekRecords) {
    const key = ymd(new Date(r.date));
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }
  const byDay = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));

  // 3. game_scores 集計
  const allScores = await storage.listGameScores({ userName, limit: 1000 });
  const weekScores = allScores.filter((s) => {
    const t = new Date(s.playedAt).getTime();
    return t >= startMs && t <= endMs;
  });
  const playCount = weekScores.length;
  const totalScore = weekScores.reduce((acc, s) => acc + s.score, 0);
  const totalMaxScore = weekScores.reduce((acc, s) => acc + s.maxScore, 0);
  const averageRatio =
    totalMaxScore > 0 ? totalScore / totalMaxScore : 0;

  // 4. streak: 週内で今日を含む連続実行日数
  const today = new Date(reference);
  today.setHours(0, 0, 0, 0);
  let streakDays = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (d.getTime() < startMs) break; // 週外
    const key = ymd(d);
    if ((dayMap.get(key) ?? 0) > 0) streakDays++;
    else break;
  }

  return {
    userName,
    weekStartIso: weekStart.toISOString(),
    weekEndIso: weekEnd.toISOString(),
    totalCompletions: weekRecords.length,
    byRoutineType,
    byDay,
    gameScores: {
      playCount,
      totalScore,
      totalMaxScore,
      averageRatio,
    },
    streakDays,
  };
}
