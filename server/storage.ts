import {
  type RoutineRecord,
  type InsertRoutineRecord,
  routineRecords,
  type CustomRoutine,
  type CustomRoutineStep,
  type CustomRoutineWithSteps,
  type InsertCustomRoutine,
  type UpdateCustomRoutine,
  customRoutines,
  customRoutineSteps,
  type GameScore,
  type InsertGameScore,
  gameScores,
} from "@shared/schema";
import { db } from "./db";
import { asc, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type PersistedRoutineRecord = Omit<RoutineRecord, "date"> & { date: string };
type PersistedCustomRoutine = Omit<CustomRoutine, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
type PersistedGameScore = Omit<GameScore, "playedAt"> & { playedAt: string };
type PersistedStorageState = {
  records: PersistedRoutineRecord[];
  routines: PersistedCustomRoutine[];
  steps: CustomRoutineStep[];
  scores: PersistedGameScore[];
};

const DEFAULT_RENDER_DATA_DIR = "/var/data";

function getPersistentDataDir(): string {
  const configured = process.env.ROUTINE_DATA_DIR?.trim();
  if (configured) return configured;
  if (process.platform !== "win32" && existsSync(DEFAULT_RENDER_DATA_DIR)) {
    return DEFAULT_RENDER_DATA_DIR;
  }
  return resolve(process.cwd(), "data");
}

const PERSISTENT_DATA_DIR = getPersistentDataDir();
const PERSISTENT_STORAGE_PATH = resolve(PERSISTENT_DATA_DIR, "routine-support-storage.json");

export interface IStorage {
  createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord>;
  getRoutineRecords(): Promise<RoutineRecord[]>;
  getRoutineRecordsByUserName(userName: string): Promise<RoutineRecord[]>;

  listCustomRoutines(opts?: { includeHidden?: boolean }): Promise<CustomRoutineWithSteps[]>;
  getCustomRoutineWithSteps(id: string): Promise<CustomRoutineWithSteps | null>;
  createCustomRoutine(data: InsertCustomRoutine): Promise<CustomRoutineWithSteps>;
  updateCustomRoutine(id: string, data: UpdateCustomRoutine): Promise<CustomRoutineWithSteps | null>;
  deleteCustomRoutine(id: string): Promise<boolean>;

  createGameScore(data: InsertGameScore): Promise<GameScore>;
  listGameScores(opts?: { userName?: string; limit?: number }): Promise<GameScore[]>;

  listUserNames(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord> {
    const [newRecord] = await db.insert(routineRecords).values(record).returning();
    return newRecord;
  }
  async getRoutineRecords(): Promise<RoutineRecord[]> {
    return await db.select().from(routineRecords).orderBy(desc(routineRecords.date));
  }
  async getRoutineRecordsByUserName(userName: string): Promise<RoutineRecord[]> {
    return await db
      .select()
      .from(routineRecords)
      .where(eq(routineRecords.userName, userName))
      .orderBy(desc(routineRecords.date));
  }
  async listCustomRoutines(
    opts: { includeHidden?: boolean } = {}
  ): Promise<CustomRoutineWithSteps[]> {
    const routines = await db
      .select()
      .from(customRoutines)
      .orderBy(asc(customRoutines.order), asc(customRoutines.createdAt));
    const filtered = opts.includeHidden ? routines : routines.filter((r) => r.isVisible);
    if (filtered.length === 0) return [];
    const ids = filtered.map((r) => r.id);
    const allSteps = await db
      .select()
      .from(customRoutineSteps)
      .orderBy(asc(customRoutineSteps.order));
    const stepsByRoutine = new Map<string, CustomRoutineStep[]>();
    for (const s of allSteps) {
      if (!ids.includes(s.routineId)) continue;
      const arr = stepsByRoutine.get(s.routineId) ?? [];
      arr.push(s);
      stepsByRoutine.set(s.routineId, arr);
    }
    return filtered.map((r) => ({ ...r, steps: stepsByRoutine.get(r.id) ?? [] }));
  }
  async getCustomRoutineWithSteps(id: string): Promise<CustomRoutineWithSteps | null> {
    const [routine] = await db.select().from(customRoutines).where(eq(customRoutines.id, id));
    if (!routine) return null;
    const steps = await db
      .select()
      .from(customRoutineSteps)
      .where(eq(customRoutineSteps.routineId, id))
      .orderBy(asc(customRoutineSteps.order));
    return { ...routine, steps };
  }
  async createCustomRoutine(data: InsertCustomRoutine): Promise<CustomRoutineWithSteps> {
    return await db.transaction(async (tx) => {
      const [routine] = await tx
        .insert(customRoutines)
        .values({
          category: data.category,
          titleI18n: data.titleI18n,
          iconKey: data.iconKey,
          rewardGameType: data.rewardGameType,
          order: data.order,
          isVisible: data.isVisible,
        })
        .returning();
      const insertedSteps = await tx
        .insert(customRoutineSteps)
        .values(
          data.steps.map((step, idx) => ({
            routineId: routine.id,
            order: step.order ?? idx,
            titleI18n: step.titleI18n,
            descriptionI18n: step.descriptionI18n,
            imageUrl: step.imageUrl ?? null,
          }))
        )
        .returning();
      return { ...routine, steps: insertedSteps };
    });
  }
  async updateCustomRoutine(
    id: string,
    data: UpdateCustomRoutine
  ): Promise<CustomRoutineWithSteps | null> {
    return await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(customRoutines).where(eq(customRoutines.id, id));
      if (!existing) return null;
      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (data.category !== undefined) patch.category = data.category;
      if (data.titleI18n !== undefined) patch.titleI18n = data.titleI18n;
      if (data.iconKey !== undefined) patch.iconKey = data.iconKey;
      if (data.rewardGameType !== undefined) patch.rewardGameType = data.rewardGameType;
      if (data.order !== undefined) patch.order = data.order;
      if (data.isVisible !== undefined) patch.isVisible = data.isVisible;
      const [updated] = await tx
        .update(customRoutines)
        .set(patch)
        .where(eq(customRoutines.id, id))
        .returning();
      let steps: CustomRoutineStep[];
      if (data.steps !== undefined) {
        await tx.delete(customRoutineSteps).where(eq(customRoutineSteps.routineId, id));
        steps = await tx
          .insert(customRoutineSteps)
          .values(
            data.steps.map((step, idx) => ({
              routineId: id,
              order: step.order ?? idx,
              titleI18n: step.titleI18n,
              descriptionI18n: step.descriptionI18n,
              imageUrl: step.imageUrl ?? null,
            }))
          )
          .returning();
      } else {
        steps = await tx
          .select()
          .from(customRoutineSteps)
          .where(eq(customRoutineSteps.routineId, id))
          .orderBy(asc(customRoutineSteps.order));
      }
      return { ...updated, steps };
    });
  }
  async deleteCustomRoutine(id: string): Promise<boolean> {
    const result = await db
      .delete(customRoutines)
      .where(eq(customRoutines.id, id))
      .returning({ id: customRoutines.id });
    return result.length > 0;
  }
  async createGameScore(data: InsertGameScore): Promise<GameScore> {
    const [row] = await db
      .insert(gameScores)
      .values({
        userName: data.userName,
        routineRecordId: data.routineRecordId ?? null,
        routineType: data.routineType,
        gameType: data.gameType,
        score: data.score,
        maxScore: data.maxScore,
      })
      .returning();
    return row;
  }
  async listGameScores(
    opts: { userName?: string; limit?: number } = {}
  ): Promise<GameScore[]> {
    const limit = Math.min(Math.max(opts.limit ?? 200, 1), 1000);
    if (opts.userName) {
      return await db
        .select()
        .from(gameScores)
        .where(eq(gameScores.userName, opts.userName))
        .orderBy(desc(gameScores.playedAt))
        .limit(limit);
    }
    return await db
      .select()
      .from(gameScores)
      .orderBy(desc(gameScores.playedAt))
      .limit(limit);
  }
  async listUserNames(): Promise<string[]> {
    const recordUsers = await db
      .selectDistinct({ name: routineRecords.userName })
      .from(routineRecords);
    const scoreUsers = await db
      .selectDistinct({ name: gameScores.userName })
      .from(gameScores);
    const set = new Set<string>();
    for (const r of recordUsers) if (r.name) set.add(r.name);
    for (const r of scoreUsers) if (r.name) set.add(r.name);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}

export class MemoryStorage implements IStorage {
  protected records: RoutineRecord[] = [];
  protected routines = new Map<string, CustomRoutine>();
  protected steps = new Map<string, CustomRoutineStep[]>();
  protected scores: GameScore[] = [];

  protected afterMutation(): void {}

  async createRoutineRecord(record: InsertRoutineRecord): Promise<RoutineRecord> {
    const newRecord: RoutineRecord = {
      id: randomUUID(),
      userName: record.userName,
      date: new Date(),
      feeling: record.feeling,
      comment: record.comment ?? null,
      routineType: record.routineType ?? "morning",
    };
    this.records = [newRecord, ...this.records];
    this.afterMutation();
    return newRecord;
  }
  async getRoutineRecords(): Promise<RoutineRecord[]> {
    return [...this.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getRoutineRecordsByUserName(userName: string): Promise<RoutineRecord[]> {
    return (await this.getRoutineRecords()).filter((r) => r.userName === userName);
  }
  async listCustomRoutines(
    opts: { includeHidden?: boolean } = {}
  ): Promise<CustomRoutineWithSteps[]> {
    const arr = Array.from(this.routines.values());
    arr.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    const filtered = opts.includeHidden ? arr : arr.filter((r) => r.isVisible);
    return filtered.map((r) => ({
      ...r,
      steps: [...(this.steps.get(r.id) ?? [])].sort((a, b) => a.order - b.order),
    }));
  }
  async getCustomRoutineWithSteps(id: string): Promise<CustomRoutineWithSteps | null> {
    const routine = this.routines.get(id);
    if (!routine) return null;
    return {
      ...routine,
      steps: [...(this.steps.get(id) ?? [])].sort((a, b) => a.order - b.order),
    };
  }
  async createCustomRoutine(data: InsertCustomRoutine): Promise<CustomRoutineWithSteps> {
    const now = new Date();
    const id = randomUUID();
    const routine: CustomRoutine = {
      id,
      category: data.category,
      titleI18n: data.titleI18n,
      iconKey: data.iconKey,
      rewardGameType: data.rewardGameType,
      order: data.order,
      isVisible: data.isVisible,
      createdAt: now,
      updatedAt: now,
    };
    this.routines.set(id, routine);
    const stepRows: CustomRoutineStep[] = data.steps.map((s, idx) => ({
      id: randomUUID(),
      routineId: id,
      order: s.order ?? idx,
      titleI18n: s.titleI18n,
      descriptionI18n: s.descriptionI18n,
      imageUrl: s.imageUrl ?? null,
    }));
    this.steps.set(id, stepRows);
    this.afterMutation();
    return { ...routine, steps: stepRows };
  }
  async updateCustomRoutine(
    id: string,
    data: UpdateCustomRoutine
  ): Promise<CustomRoutineWithSteps | null> {
    const existing = this.routines.get(id);
    if (!existing) return null;
    const next: CustomRoutine = {
      ...existing,
      category: data.category ?? existing.category,
      titleI18n: data.titleI18n ?? existing.titleI18n,
      iconKey: data.iconKey ?? existing.iconKey,
      rewardGameType: data.rewardGameType ?? existing.rewardGameType,
      order: data.order ?? existing.order,
      isVisible: data.isVisible ?? existing.isVisible,
      updatedAt: new Date(),
    };
    this.routines.set(id, next);
    if (data.steps !== undefined) {
      const stepRows: CustomRoutineStep[] = data.steps.map((s, idx) => ({
        id: randomUUID(),
        routineId: id,
        order: s.order ?? idx,
        titleI18n: s.titleI18n,
        descriptionI18n: s.descriptionI18n,
        imageUrl: s.imageUrl ?? null,
      }));
      this.steps.set(id, stepRows);
    }
    this.afterMutation();
    return {
      ...next,
      steps: [...(this.steps.get(id) ?? [])].sort((a, b) => a.order - b.order),
    };
  }
  async deleteCustomRoutine(id: string): Promise<boolean> {
    const existed = this.routines.delete(id);
    this.steps.delete(id);
    if (existed) this.afterMutation();
    return existed;
  }
  async createGameScore(data: InsertGameScore): Promise<GameScore> {
    const row: GameScore = {
      id: randomUUID(),
      userName: data.userName,
      routineRecordId: data.routineRecordId ?? null,
      routineType: data.routineType,
      gameType: data.gameType,
      score: data.score,
      maxScore: data.maxScore,
      playedAt: new Date(),
    };
    this.scores = [row, ...this.scores];
    this.afterMutation();
    return row;
  }
  async listGameScores(
    opts: { userName?: string; limit?: number } = {}
  ): Promise<GameScore[]> {
    const limit = Math.min(Math.max(opts.limit ?? 200, 1), 1000);
    const arr = opts.userName
      ? this.scores.filter((s) => s.userName === opts.userName)
      : [...this.scores];
    arr.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
    return arr.slice(0, limit);
  }
  async listUserNames(): Promise<string[]> {
    const set = new Set<string>();
    for (const r of this.records) if (r.userName) set.add(r.userName);
    for (const s of this.scores) if (s.userName) set.add(s.userName);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}

export class FileStorage extends MemoryStorage {
  constructor(private readonly filePath = PERSISTENT_STORAGE_PATH) {
    super();
    this.loadFromDisk();
  }

  getFilePath(): string {
    return this.filePath;
  }

  protected override afterMutation(): void {
    this.saveToDisk();
  }

  private loadFromDisk(): void {
    try {
      if (!existsSync(this.filePath)) {
        return;
      }
      const raw = readFileSync(this.filePath, "utf8");
      if (!raw.trim()) return;
      const parsed = JSON.parse(raw) as Partial<PersistedStorageState>;

      this.records = (parsed.records ?? []).map((record) => ({
        ...record,
        date: new Date(record.date),
      }));

      this.routines = new Map(
        (parsed.routines ?? []).map((routine) => [
          routine.id,
          {
            ...routine,
            createdAt: new Date(routine.createdAt),
            updatedAt: new Date(routine.updatedAt),
          },
        ]),
      );

      this.steps = new Map<string, CustomRoutineStep[]>();
      for (const step of parsed.steps ?? []) {
        const list = this.steps.get(step.routineId) ?? [];
        list.push(step);
        this.steps.set(step.routineId, list);
      }

      this.scores = (parsed.scores ?? []).map((score) => ({
        ...score,
        playedAt: new Date(score.playedAt),
      }));

      console.log(`[storage] loaded JSON storage from ${this.filePath}`);
    } catch (error) {
      console.warn("[storage] Failed to load JSON storage, starting empty:", error);
      this.records = [];
      this.routines = new Map();
      this.steps = new Map();
      this.scores = [];
    }
  }

  private saveToDisk(): void {
    const state: PersistedStorageState = {
      records: this.records.map((record) => ({
        ...record,
        date: new Date(record.date).toISOString(),
      })),
      routines: Array.from(this.routines.values()).map((routine) => ({
        ...routine,
        createdAt: new Date(routine.createdAt).toISOString(),
        updatedAt: new Date(routine.updatedAt).toISOString(),
      })),
      steps: Array.from(this.steps.values()).flatMap((list) => list),
      scores: this.scores.map((score) => ({
        ...score,
        playedAt: new Date(score.playedAt).toISOString(),
      })),
    };

    mkdirSync(dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.tmp`;
    writeFileSync(tempPath, JSON.stringify(state, null, 2), "utf8");
    renameSync(tempPath, this.filePath);
  }
}

export class StorageFacade implements IStorage {
  private dbImpl = new DatabaseStorage();
  private fileImpl = new FileStorage();
  private mode: "unknown" | "db" | "file" = "unknown";
  private probe: Promise<void> | null = null;

  constructor() {
    this.ensureProbed().catch(() => {});
  }

  private ensureProbed(): Promise<void> {
    if (this.mode !== "unknown") return Promise.resolve();
    if (!this.probe) {
      this.probe = (async () => {
        if (!process.env.DATABASE_URL) {
          this.mode = "file";
          console.warn(
            `[storage] DATABASE_URL is not set - using FileStorage at ${this.fileImpl.getFilePath()}`,
          );
          return;
        }
        try {
          await db.execute(sql`select 1 as one`);
          this.mode = "db";
          console.log("[storage] connected to Postgres - using DatabaseStorage");
        } catch (err: any) {
          this.mode = "file";
          console.warn(
            "[storage] Postgres unreachable - using FileStorage. Reason: " +
              (err?.message ?? err),
          );
        }
      })();
    }
    return this.probe;
  }

  getMode(): "unknown" | "db" | "file" {
    return this.mode;
  }

  getFallbackStoragePath(): string {
    return this.fileImpl.getFilePath();
  }

  private async pick(): Promise<IStorage> {
    await this.ensureProbed();
    return this.mode === "db" ? this.dbImpl : this.fileImpl;
  }

  async createRoutineRecord(record: InsertRoutineRecord) {
    return (await this.pick()).createRoutineRecord(record);
  }
  async getRoutineRecords() {
    return (await this.pick()).getRoutineRecords();
  }
  async getRoutineRecordsByUserName(userName: string) {
    return (await this.pick()).getRoutineRecordsByUserName(userName);
  }
  async listCustomRoutines(opts?: { includeHidden?: boolean }) {
    return (await this.pick()).listCustomRoutines(opts);
  }
  async getCustomRoutineWithSteps(id: string) {
    return (await this.pick()).getCustomRoutineWithSteps(id);
  }
  async createCustomRoutine(data: InsertCustomRoutine) {
    return (await this.pick()).createCustomRoutine(data);
  }
  async updateCustomRoutine(id: string, data: UpdateCustomRoutine) {
    return (await this.pick()).updateCustomRoutine(id, data);
  }
  async deleteCustomRoutine(id: string) {
    return (await this.pick()).deleteCustomRoutine(id);
  }
  async createGameScore(data: InsertGameScore) {
    return (await this.pick()).createGameScore(data);
  }
  async listGameScores(opts?: { userName?: string; limit?: number }) {
    return (await this.pick()).listGameScores(opts);
  }
  async listUserNames() {
    return (await this.pick()).listUserNames();
  }
}

export const storage = new StorageFacade();
