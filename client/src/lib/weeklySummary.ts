/**
 * 週間サマリー（管理者ダッシュボード等で再利用しやすい形）
 * - 週の区切り: 端末ローカル日付で「日曜 0:00」から
 * - starCount: 仕様上「トレーニング完了 1 回 = 星 1」と completionCount は同じ
 */
export type WeeklySummaryV1 = {
  schemaVersion: 1;
  /** 週の識別子（週開始日ベース）例: 2026-04-19_sun_week */
  weekKey: string;
  weekStartIso: string;
  weekEndInclusiveIso: string;
  completionCount: number;
  starCount: number;
};

export function startOfWeekSunday(reference: Date): Date {
  const d = new Date(reference);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function buildWeeklySummaryV1(
  records: { id: string; date: string | Date }[],
  referenceDate: Date = new Date()
): WeeklySummaryV1 {
  const weekStart = startOfWeekSunday(referenceDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const startTs = weekStart.getTime();
  const endTs = weekEnd.getTime();
  const inWeek = records.filter((r) => {
    const t = new Date(r.date).getTime();
    return t >= startTs && t <= endTs;
  });
  const n = inWeek.length;

  const y = weekStart.getFullYear();
  const m = String(weekStart.getMonth() + 1).padStart(2, "0");
  const d = String(weekStart.getDate()).padStart(2, "0");
  const weekKey = `${y}-${m}-${d}_sun_week`;

  return {
    schemaVersion: 1,
    weekKey,
    weekStartIso: weekStart.toISOString(),
    weekEndInclusiveIso: weekEnd.toISOString(),
    completionCount: n,
    starCount: n,
  };
}
