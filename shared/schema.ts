import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =====================================================================
// Existing: routine_records (実行履歴)
// 既存テーブルは触らない。標準ルーティン (morning / eyeExercise / stretching)
// もカスタムルーティンも、完了履歴はここに残す。
//   - 標準: routineType に 'morning' / 'eyeExercise' / 'stretching'
//   - 追加: routineType に 'custom:<uuid>' を入れる
// =====================================================================

export const routineRecords = pgTable("routine_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  feeling: text("feeling").notNull(),
  comment: text("comment"),
  routineType: text("routine_type").notNull().default("morning"),
});

export const insertRoutineRecordSchema = createInsertSchema(routineRecords).omit({
  id: true,
  date: true,
});

export type InsertRoutineRecord = z.infer<typeof insertRoutineRecordSchema>;
export type RoutineRecord = typeof routineRecords.$inferSelect;

// =====================================================================
// i18n テキスト（ja / en / zh）
// 少なくとも 1 言語が入っていれば良い。表示時は
//   user.language の値 → 'ja' → 'en' → 'zh' の順でフォールバック。
// =====================================================================

export const SUPPORTED_LANGUAGES = ["ja", "en", "zh"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const i18nTextSchema = z
  .object({
    ja: z.string().trim().min(1).optional(),
    en: z.string().trim().min(1).optional(),
    zh: z.string().trim().min(1).optional(),
  })
  .refine((v) => Boolean(v.ja || v.en || v.zh), {
    message: "At least one language must be provided",
  });

export type I18nText = z.infer<typeof i18nTextSchema>;

/**
 * 表示時のフォールバック解決。
 * 優先言語 → ja → en → zh の順で見つかった最初の文字列を返す。
 * すべて空なら空文字。
 */
export function pickI18n(text: I18nText | null | undefined, lang: SupportedLanguage): string {
  if (!text) return "";
  return (
    text[lang] ?? text.ja ?? text.en ?? text.zh ?? ""
  );
}

// =====================================================================
// Custom Routines (管理者が施設用に追加するルーティン)
//   - 標準ルーティンは translations.ts に固定
//   - DB が空でも標準ルーティンは表示される
//   - DB に追加されたものだけが「追加ルーティン」として標準と並ぶ
// =====================================================================

export const customRoutines = pgTable("custom_routines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull().default("custom"),
  titleI18n: jsonb("title_i18n").$type<I18nText>().notNull(),
  iconKey: text("icon_key").notNull().default("Sparkles"),
  rewardGameType: text("reward_game_type").notNull().default("star"),
  order: integer("order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customRoutineSteps = pgTable("custom_routine_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routineId: varchar("routine_id")
    .notNull()
    .references(() => customRoutines.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  titleI18n: jsonb("title_i18n").$type<I18nText>().notNull(),
  descriptionI18n: jsonb("description_i18n").$type<I18nText>().notNull(),
  imageUrl: text("image_url"),
});

// ------- Zod スキーマ (API 層で使う) -------

export const ROUTINE_CATEGORIES = ["morning", "noon", "evening", "custom"] as const;
export const REWARD_GAME_TYPES = ["star", "balloon", "chest"] as const;

export const insertCustomRoutineStepSchema = z.object({
  order: z.number().int().min(0),
  titleI18n: i18nTextSchema,
  descriptionI18n: i18nTextSchema,
  imageUrl: z.string().trim().min(1).max(2048).nullable().optional(),
});

export const insertCustomRoutineSchema = z.object({
  category: z.enum(ROUTINE_CATEGORIES).default("custom"),
  titleI18n: i18nTextSchema,
  iconKey: z.string().trim().min(1).max(40).default("Sparkles"),
  rewardGameType: z.enum(REWARD_GAME_TYPES).default("star"),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  steps: z.array(insertCustomRoutineStepSchema).min(1).max(30),
});

export const updateCustomRoutineSchema = z
  .object({
    category: z.enum(ROUTINE_CATEGORIES),
    titleI18n: i18nTextSchema,
    iconKey: z.string().trim().min(1).max(40),
    rewardGameType: z.enum(REWARD_GAME_TYPES),
    order: z.number().int().min(0),
    isVisible: z.boolean(),
    steps: z.array(insertCustomRoutineStepSchema).min(1).max(30),
  })
  .partial();

export type InsertCustomRoutine = z.infer<typeof insertCustomRoutineSchema>;
export type UpdateCustomRoutine = z.infer<typeof updateCustomRoutineSchema>;
export type InsertCustomRoutineStep = z.infer<typeof insertCustomRoutineStepSchema>;
export type CustomRoutine = typeof customRoutines.$inferSelect;
export type CustomRoutineStep = typeof customRoutineSteps.$inferSelect;
export type CustomRoutineWithSteps = CustomRoutine & { steps: CustomRoutineStep[] };

export type RoutineCategory = (typeof ROUTINE_CATEGORIES)[number];
export type RewardGameType = (typeof REWARD_GAME_TYPES)[number];

// =====================================================================
// Game Scores (ご褒美ゲームのスコア記録)
//   - 標準ルーティン完了後でも、追加ルーティン完了後でも記録できる
//   - routineRecordId は紐付け可能ならセット (DB上の routine_records.id)
//   - routineType は標準なら 'morning' 等、追加なら 'custom:<uuid>'
// =====================================================================

export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name").notNull(),
  routineRecordId: varchar("routine_record_id"),
  routineType: text("routine_type").notNull(),
  gameType: text("game_type").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  playedAt: timestamp("played_at").notNull().defaultNow(),
});

export const insertGameScoreSchema = z.object({
  userName: z.string().trim().min(1).max(100),
  routineRecordId: z.string().trim().min(1).nullable().optional(),
  routineType: z.string().trim().min(1).max(100),
  gameType: z.enum(REWARD_GAME_TYPES),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
});

export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;

// =====================================================================
// Weekly summary (集計結果型 — テーブルではなく API レスポンス用)
//   ユーザーごとの今週の取り組みを 1 オブジェクトに集約。
// =====================================================================

// =====================================================================
// Routine Tasks (Google Sheets routine_tasks シート — API レスポンス用)
// =====================================================================

export const routineTaskSchema = z.object({
  step: z.number().int().min(1),
  title_en: z.string(),
  title_ja: z.string(),
  description_en: z.string(),
  description_ja: z.string(),
  minutes: z.number().int().min(0),
  youtubeUrl: z.string(),
  emoji: z.string(),
});

export type RoutineTask = z.infer<typeof routineTaskSchema>;

// =====================================================================
// Routine Logs (Google Sheets routine_logs シート — API リクエスト用)
// =====================================================================

export const insertRoutineLogSchema = z.object({
  userName: z.string().trim().min(1),
  step: z.number().int().min(1),
  taskTitle: z.string().trim().min(1),
  completed: z.literal(true),
  durationSeconds: z.number().int().min(0),
});

export type InsertRoutineLog = z.infer<typeof insertRoutineLogSchema>;

export type WeeklySummary = {
  userName: string;
  weekStartIso: string;
  weekEndIso: string;
  /** 完了したルーティン総数 */
  totalCompletions: number;
  /** ルーティン種別ごとの完了数 ('morning' / 'eyeExercise' / 'stretching' / 'custom:<uuid>') */
  byRoutineType: Record<string, number>;
  /** 直近 7 日の日別カウント (週開始から週末まで、それぞれ Date.toISOString().slice(0,10)) */
  byDay: { date: string; count: number }[];
  /** ゲームスコア集計 */
  gameScores: {
    playCount: number;
    totalScore: number;
    totalMaxScore: number;
    /** 0〜1 の平均達成率。プレイ無しの場合 0 */
    averageRatio: number;
  };
  /** 今日を含む連続実行日数 (今週内のみカウント) */
  streakDays: number;
};
