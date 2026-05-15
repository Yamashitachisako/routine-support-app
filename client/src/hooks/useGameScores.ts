import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGameScore, getGameScores } from "@/lib/api";
import type { GameScore, InsertGameScore } from "@shared/schema";

const KEYS = {
  all: ["game-scores"] as const,
  list: (userName?: string) =>
    ["game-scores", "list", userName ?? "ALL"] as const,
};

export function useGameScores(opts: { userName?: string; limit?: number } = {}) {
  return useQuery<GameScore[]>({
    queryKey: KEYS.list(opts.userName),
    queryFn: () => getGameScores(opts),
    retry: false,
    staleTime: 30_000,
  });
}

export function useCreateGameScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertGameScore) => createGameScore(data),
    // ネットワーク失敗時もユーザーには成功体験を維持するため例外を握りつぶさない
    // (mini-game 側で fire-and-forget する想定)
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}
