import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translation, translations } from './translations';

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  feeling: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  comment?: string;
}

export type RoutineType = 'morning' | 'afternoon';

interface AppState {
  language: Language;
  history: HistoryRecord[];
  userName: string;
  routineType: RoutineType;
  
  // Routine State
  isRoutineActive: boolean;
  currentStepIndex: number; // 0 to 4 (Step 1 to Step 5)
  startTime: number | null;
  
  // Actions
  setLanguage: (lang: Language) => void;
  setUserName: (name: string) => void;
  setRoutineType: (type: RoutineType) => void;
  startRoutine: () => void;
  nextStep: () => void;
  prevStep: () => void;
  exitRoutine: () => void;
  addHistory: (record: Omit<HistoryRecord, 'id'>) => void;
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
      
      nextStep: () => set((state) => ({ 
        currentStepIndex: Math.min(state.currentStepIndex + 1, 5) 
      })),

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

// Wrapper hook to inject translations dynamically
export const useStore = () => {
  const state = useBaseStore();
  const t = translations[state.language];
  
  return {
    ...state,
    t
  };
};
