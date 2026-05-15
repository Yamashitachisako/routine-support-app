import type { RoutineCategory } from "@shared/schema";

/**
 * カテゴリごとの色とラベルを一元管理。
 * Tailwind class を直接持つことで、ホーム / 管理画面 / バッジで同じ表現が使える。
 * 色を変えたい場合はこのファイルだけ修正すれば OK。
 */

export type CategoryStyle = {
  /** カード本体の背景 + 枠 */
  card: string;
  /** 選択中（ハイライト）の追加 class */
  cardSelected: string;
  /** バッジ用の文字+背景 */
  badge: string;
  /** プレビュー帯の文字色 */
  text: string;
  /** リング(枠線) */
  ring: string;
  /** ホームの非選択ボタン用 (薄い背景 + ボーダー) */
  buttonIdle: string;
  /** ホームの選択ボタン用 (濃い背景 + 白文字) */
  buttonActive: string;
  /** 翻訳キー (t[labelKey] で表示) */
  labelKey:
    | "adminCategoryMorning"
    | "adminCategoryNoon"
    | "adminCategoryEvening"
    | "adminCategoryCustom";
};

export const CATEGORY_STYLES: Record<RoutineCategory, CategoryStyle> = {
  morning: {
    card: "bg-rose-50 border-rose-200",
    cardSelected: "ring-2 ring-rose-400 shadow-md",
    badge: "bg-rose-100 text-rose-700 border border-rose-200",
    text: "text-rose-700",
    ring: "ring-rose-300",
    buttonIdle: "bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100",
    buttonActive: "bg-rose-500 text-white shadow-lg scale-105",
    labelKey: "adminCategoryMorning",
  },
  noon: {
    card: "bg-amber-50 border-amber-200",
    cardSelected: "ring-2 ring-amber-400 shadow-md",
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    text: "text-amber-800",
    ring: "ring-amber-300",
    buttonIdle: "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100",
    buttonActive: "bg-amber-500 text-white shadow-lg scale-105",
    labelKey: "adminCategoryNoon",
  },
  evening: {
    card: "bg-violet-50 border-violet-200",
    cardSelected: "ring-2 ring-violet-400 shadow-md",
    badge: "bg-violet-100 text-violet-700 border border-violet-200",
    text: "text-violet-700",
    ring: "ring-violet-300",
    buttonIdle: "bg-violet-50 text-violet-900 border border-violet-200 hover:bg-violet-100",
    buttonActive: "bg-violet-500 text-white shadow-lg scale-105",
    labelKey: "adminCategoryEvening",
  },
  custom: {
    card: "bg-slate-50 border-slate-200",
    cardSelected: "ring-2 ring-slate-400 shadow-md",
    badge: "bg-slate-100 text-slate-700 border border-slate-200",
    text: "text-slate-700",
    ring: "ring-slate-300",
    buttonIdle: "bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100",
    buttonActive: "bg-slate-600 text-white shadow-lg scale-105",
    labelKey: "adminCategoryCustom",
  },
};

export function getCategoryStyle(category: string | undefined | null): CategoryStyle {
  if (category && category in CATEGORY_STYLES) {
    return CATEGORY_STYLES[category as RoutineCategory];
  }
  return CATEGORY_STYLES.custom;
}
