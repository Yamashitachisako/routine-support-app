import { useQuery } from "@tanstack/react-query";
import { getWeeklySummary } from "@/lib/api";
import type { WeeklySummary } from "@shared/schema";

const KEY = (userName: string, reference?: string) =>
  ["summary", "weekly", userName, reference ?? "today"] as const;

/**
 * 指定ユーザーの今週分サマリーを取得。
 * userName が空文字なら fetch しない。
 */
export function useWeeklySummary(opts: { userName: string; reference?: string }) {
  return useQuery<WeeklySummary>({
    queryKey: KEY(opts.userName, opts.reference),
    queryFn: () =>
      getWeeklySummary({ userName: opts.userName, reference: opts.reference }),
    enabled: !!opts.userName.trim(),
    retry: false,
    staleTime: 30_000,
  });
}
