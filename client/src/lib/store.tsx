import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translation, translations } from './translations';
import {
  clearRoutineSessionUserName,
  setRoutineSessionUserName,
} from './routineSessionUser';

export interface HistoryRecord {
  id: string;
  date: string;
  feeling: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  comment?: string;
}

/**
 * 標準ルーティン (translations.ts に固定)
 * 新しい種類は DB の custom_routines に入れる。
 */
export type RoutineType = 'morning' | 'eyeExercise' | 'stretching';

const STEP_COUNTS: Record<RoutineType, number> = {
  morning: 9,
  eyeExercise: 9,
  stretching: 16,
};

const INTRO_COUNTS: Record<RoutineType, number> = {
  morning: 0,
  eyeExercise: 0,
  stretching: 0,
};

interface AppState {
  language: Language;
  history: HistoryRecord[];
  userName: string;
  routineType: RoutineType;

  /** 追加ルーティン (DB) を選択中のとき UUID を入れる。標準実行中は null。 */
  activeCustomRoutineId: string | null;

  /** オンボーディングを一度でも閉じたか (永続) */
  hasSeenOnboarding: boolean;

  isOnboardingOpen: boolean;
  isRoutineActive: boolean;
  currentStepIndex: number;
  startTime: number | null;

  /** 標準ルーティンのステップ数 (Google Sheets 読み込み後にセット) */
  standardStepCount: number | null;

  /** ルーティン開始時に確定した利用者名 (routine_logs 等に使用) */
  routineSessionUserName: string;

  setLanguage: (lang: Language) => void;
  setUserName: (name: string) => void;
  setRoutineType: (type: RoutineType) => void;
  setActiveCustomRoutineId: (id: string | null) => void;
  setStandardStepCount: (count: number | null) => void;

  openOnboarding: () => void;
  closeOnboarding: () => void;
  markOnboardingSeen: () => void;

  startRoutine: (sessionName: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  exitRoutine: () => void;
  addHistory: (record: Omit<HistoryRecord, 'id'>) => void;
  getTotalSteps: () => number;
}

export const useBaseStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'ja',
      history: [],
      userName: '',
      routineType: 'morning',
      activeCustomRoutineId: null,
      standardStepCount: null,
      hasSeenOnboarding: false,
      isOnboardingOpen: false,
      isRoutineActive: false,
      currentStepIndex: 0,
      startTime: null,
      routineSessionUserName: '',

      setLanguage: (lang) => set({ language: lang }),
      setUserName: (name) => set({ userName: name }),

      // 標準ルーティンを選択するとカスタム選択は解除する
      setRoutineType: (type) => set({ routineType: type, activeCustomRoutineId: null }),
      setActiveCustomRoutineId: (id) => set({ activeCustomRoutineId: id }),
      setStandardStepCount: (count) => set({ standardStepCount: count }),

      openOnboarding: () => set({ isOnboardingOpen: true }),
      closeOnboarding: () => set({ isOnboardingOpen: false, hasSeenOnboarding: true }),
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),

      startRoutine: (sessionName: string) => {
        const name = sessionName.trim();
        if (!name) return;
        setRoutineSessionUserName(name);
        set({
          userName: name,
          isRoutineActive: true,
          currentStepIndex: 0,
          startTime: Date.now(),
          routineSessionUserName: name,
        });
      },

      nextStep: () => set((state) => {
        if (state.activeCustomRoutineId) {
          return { currentStepIndex: state.currentStepIndex + 1 };
        }
        const totalSteps =
          state.standardStepCount ??
          STEP_COUNTS[state.routineType] + INTRO_COUNTS[state.routineType];
        return { currentStepIndex: Math.min(state.currentStepIndex + 1, totalSteps) };
      }),

      prevStep: () => set((state) => ({
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
      })),

      exitRoutine: () => {
        clearRoutineSessionUserName();
        set({
          isRoutineActive: false,
          currentStepIndex: 0,
          startTime: null,
          activeCustomRoutineId: null,
          standardStepCount: null,
          routineSessionUserName: '',
        });
      },

      addHistory: (record) => {
        clearRoutineSessionUserName();
        set((state) => ({
          history: [
            { ...record, id: Math.random().toString(36).substring(7) },
            ...state.history
          ],
          isRoutineActive: false,
          currentStepIndex: 0,
          startTime: null,
          activeCustomRoutineId: null,
          standardStepCount: null,
          routineSessionUserName: '',
        }));
      },

      getTotalSteps: () => STEP_COUNTS[get().routineType],
    }),
    {
      name: 'health-routine-storage',
      partialize: (state) => ({
        language: state.language,
        history: state.history,
        userName: state.userName,
        routineType: state.routineType,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as object),
        routineSessionUserName: current.routineSessionUserName,
        isRoutineActive: current.isRoutineActive,
        currentStepIndex: current.isRoutineActive ? current.currentStepIndex : 0,
        startTime: current.isRoutineActive ? current.startTime : null,
        activeCustomRoutineId: current.isRoutineActive ? current.activeCustomRoutineId : null,
        standardStepCount: current.isRoutineActive ? current.standardStepCount : null,
      }),
    }
  )
);

export const useStore = () => {
  const state = useBaseStore();
  const lang = state.language in translations ? state.language : 'ja';
  const t = translations[lang as Language];

  return {
    ...state,
    language: lang as Language,
    t
  };
};
