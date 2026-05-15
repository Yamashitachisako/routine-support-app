import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { useStore } from "@/lib/store";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import { useUserRoutineRecords } from "@/hooks/useUserNames";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja, enUS, zhCN } from "date-fns/locale";

const ROUTINE_LABELS_KEY: Record<string, "wipeDownRoutine" | "eyeExercise" | "stretchingExercise"> = {
  morning: "wipeDownRoutine",
  eyeExercise: "eyeExercise",
  stretching: "stretchingExercise",
};

export default function AdminUserDetailPage() {
  const { t, language } = useStore();
  const params = useParams<{ userName?: string }>();
  const rawName = params?.userName ?? "";
  const userName = useMemo(() => {
    try {
      return decodeURIComponent(rawName);
    } catch {
      return rawName;
    }
  }, [rawName]);

  const summaryQuery = useWeeklySummary({ userName });
  const recordsQuery = useUserRoutineRecords(userName);
  const summary = summaryQuery.data;
  const records = recordsQuery.data ?? [];

  const dateLocale = language === "ja" ? ja : language === "zh" ? zhCN : enUS;

  const labelFor = (routineType: string): string => {
    if (routineType.startsWith("custom:")) return routineType.slice(7, 15) + "…";
    const key = ROUTINE_LABELS_KEY[routineType];
    return key ? t[key] : routineType;
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon" aria-label={t.backToUsers}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground truncate">
          {userName}
        </h2>
      </div>

      {summaryQuery.isLoading ? (
        <Card className="bg-white/60 border-none">
          <CardContent className="p-8 text-center text-muted-foreground">{t.loading}</CardContent>
        </Card>
      ) : summaryQuery.isError ? (
        <Card className="bg-destructive/10 border-destructive/40">
          <CardContent className="p-6 text-destructive">{t.adminLoadError}</CardContent>
        </Card>
      ) : summary ? (
        <>
          {/* 数値サマリー */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-rose-50 border border-rose-200">
              <CardContent className="p-4">
                <p className="text-xs text-rose-700 mb-1">{t.weeklyTotalCompletions}</p>
                <p className="text-3xl font-bold text-rose-800" data-testid="text-total-completions">
                  {summary.totalCompletions}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-violet-50 border border-violet-200">
              <CardContent className="p-4">
                <p className="text-xs text-violet-700 mb-1">{t.weeklyStreak}</p>
                <p className="text-3xl font-bold text-violet-800" data-testid="text-streak">
                  {summary.streakDays}
                  <span className="ml-1 text-base font-normal">{t.weeklyStreakDays}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border border-amber-200">
              <CardContent className="p-4">
                <p className="text-xs text-amber-800 mb-1">{t.weeklyGamePlays}</p>
                <p className="text-3xl font-bold text-amber-900" data-testid="text-game-plays">
                  {summary.gameScores.playCount}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-700 mb-1">{t.weeklyGameAverage}</p>
                <p className="text-3xl font-bold text-slate-800" data-testid="text-game-average">
                  {Math.round(summary.gameScores.averageRatio * 100)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 日別カウント */}
          <Card className="bg-white/70 border-none">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-base font-semibold">{t.weeklyByDay}</h3>
              <div className="flex items-end justify-between gap-1 h-24">
                {summary.byDay.map((d) => {
                  const max = Math.max(...summary.byDay.map((x) => x.count), 1);
                  const heightPct = (d.count / max) * 100;
                  const date = new Date(d.date);
                  const label = format(date, "E", { locale: dateLocale });
                  return (
                    <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full bg-primary/70 rounded-t-md min-h-[2px]"
                        style={{ height: `${Math.max(heightPct, d.count > 0 ? 8 : 2)}%` }}
                        title={`${d.date}: ${d.count}`}
                        data-testid={`bar-${d.date}`}
                      />
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ルーティン別 */}
          {Object.keys(summary.byRoutineType).length > 0 && (
            <Card className="bg-white/70 border-none">
              <CardContent className="p-5 space-y-2">
                <h3 className="text-base font-semibold">{t.weeklyByRoutine}</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(summary.byRoutineType).map(([type, count]) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-sm"
                    >
                      <span className="font-medium">{labelFor(type)}</span>
                      <span className="text-muted-foreground">×{count}</span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}

      {/* 直近の履歴 */}
      <Card className="bg-white/70 border-none">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-base font-semibold">{t.recentHistoryTitle}</h3>
          {recordsQuery.isLoading ? (
            <p className="text-muted-foreground text-sm">{t.loading}</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.noHistory}</p>
          ) : (
            <ul className="space-y-2">
              {records.slice(0, 20).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border"
                  data-testid={`record-${r.id}`}
                >
                  <Star className="h-4 w-4 shrink-0 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{labelFor(r.routineType)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(r.date), "PPP p", { locale: dateLocale })}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.feeling}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
