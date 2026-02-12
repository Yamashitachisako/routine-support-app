import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translation, translations } from './translations';

export interface HistoryRecord {
  id: string;
  date: string;
  feeling: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  comment?: string;
}

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
  
  isRoutineActive: boolean;
  currentStepIndex: number;
  startTime: number | null;
  
  setLanguage: (lang: Language) => void;
  setUserName: (name: string) => void;
  setRoutineType: (type: RoutineType) => void;
  startRoutine: () => void;
  nextStep: () => void;
  prevStep: () => void;
  exitRoutine: () => void;
  addHistory: (record: Omit<HistoryRecord, 'id'>) => void;
  getTotalSteps: () => number;
}

const useBaseStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'ja', 
      history: [],
      userName: '',
      routineType: 'morning',
      isRoutineActive: false,
      currentStepIndex: 0,
      startTime: null,

      setLanguage: (lang) => set({ language: lang }),
      setUserName: (name) => set({ userName: name }),
      setRoutineType: (type) => set({ routineType: type }),
      
      startRoutine: () => set({ 
        isRoutineActive: true, 
        currentStepIndex: 0, 
        startTime: Date.now() 
      }),
      
      nextStep: () => set((state) => {
        const totalSteps = STEP_COUNTS[state.routineType] + INTRO_COUNTS[state.routineType];
        return { currentStepIndex: Math.min(state.currentStepIndex + 1, totalSteps) };
      }),

      prevStep: () => set((state) => ({
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
      })),
      
      exitRoutine: () => set({ 
        isRoutineActive: false, 
        currentStepIndex: 0, 
        startTime: null 
      }),
      
      addHistory: (record) => set((state) => ({
        history: [
          { ...record, id: Math.random().toString(36).substring(7) },
          ...state.history
        ],
        isRoutineActive: false,
        currentStepIndex: 0,
        startTime: null
      })),

      getTotalSteps: () => STEP_COUNTS[get().routineType],
    }),
    {
      name: 'health-routine-storage',
      partialize: (state) => ({ 
        language: state.language, 
        history: state.history,
        userName: state.userName,
        routineType: state.routineType
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
