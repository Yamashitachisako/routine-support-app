import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomRoutines,
  getCustomRoutine,
  createCustomRoutine,
  updateCustomRoutine,
  deleteCustomRoutine,
} from "@/lib/api";
import type {
  CustomRoutineWithSteps,
  InsertCustomRoutine,
  UpdateCustomRoutine,
} from "@shared/schema";

const KEYS = {
  all: ["custom-routines"] as const,
  visible: ["custom-routines", "visible"] as const,
  full: ["custom-routines", "all"] as const,
  detail: (id: string) => ["custom-routines", "detail", id] as const,
};

/**
 * 利用者向け: 表示中の追加ルーティンのみ取得
 * (DB が空でも例外にならず空配列が返る)
 */
export function useVisibleCustomRoutines() {
  return useQuery<CustomRoutineWithSteps[]>({
    queryKey: KEYS.visible,
    queryFn: () => getCustomRoutines(),
    // ネットワーク不調・サーバなし環境でもクラッシュさせない
    retry: false,
    staleTime: 60_000,
  });
}

/**
 * 管理者向け: 非表示のものも含めて全件取得
 */
export function useAllCustomRoutines() {
  return useQuery<CustomRoutineWithSteps[]>({
    queryKey: KEYS.full,
    queryFn: () => getCustomRoutines({ includeHidden: true }),
    retry: false,
    staleTime: 60_000,
  });
}

export function useCustomRoutine(id: string | null | undefined) {
  return useQuery<CustomRoutineWithSteps>({
    queryKey: id ? KEYS.detail(id) : ["custom-routines", "detail", "none"],
    queryFn: () => getCustomRoutine(id as string),
    enabled: !!id,
    retry: false,
  });
}

export function useCreateCustomRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertCustomRoutine) => createCustomRoutine(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

export function useUpdateCustomRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomRoutine }) =>
      updateCustomRoutine(id, data),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      void qc.invalidateQueries({ queryKey: KEYS.detail(vars.id) });
    },
  });
}

export function useDeleteCustomRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomRoutine(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

// ---------- 表示用ヘルパ ----------

import type { I18nText, SupportedLanguage } from "@shared/schema";

export function pickI18nText(
  text: I18nText | null | undefined,
  lang: SupportedLanguage
): string {
  if (!text) return "";
  return text[lang] ?? text.ja ?? text.en ?? text.zh ?? "";
}
