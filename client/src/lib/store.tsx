import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translation, translations } from './translations';

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  feeling: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  comment?: string;
}

interface AppState {
  language: Language;
  history: HistoryRecord[];
  
  // Routine State
  isRoutineActive: boolean;
  currentStepIndex: number; // 0 to 4 (Step 1 to Step 5)
  startTime: number | null;
  
  // Actions
  setLanguage: (lang: Language) => void;
  startRoutine: () => void;
  nextStep: () => void;
  prevStep: () => void;
  exitRoutine: () => void;
  addHistory: (record: Omit<HistoryRecord, 'id'>) => void;
  
  // Computed
  t: Translation;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'ja', // Default to Japanese as per the first key in translation file usually, or change to 'en'
      history: [],
      isRoutineActive: false,
      currentStepIndex: 0,
      startTime: null,

      setLanguage: (lang) => set({ language: lang }),
      
      startRoutine: () => set({ 
        isRoutineActive: true, 
        currentStepIndex: 0, 
        startTime: Date.now() 
      }),
      
      nextStep: () => set((state) => ({ 
        currentStepIndex: Math.min(state.currentStepIndex + 1, 4) 
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

      get t() {
        return translations[get().language];
      }
    }),
    {
      name: 'health-routine-storage',
      partialize: (state) => ({ language: state.language, history: state.history }), // Only persist lang and history
    }
  )
);
