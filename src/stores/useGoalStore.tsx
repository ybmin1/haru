import {
  FinalGoal,
  MonthlyGoal,
  WeeklyGoal,
  GoalSourceData,
} from "@/types/goal";
import {
  demoFinalGoal,
  demoMonthlyGoals,
  demoWeeklyGoals,
} from "@/data/demoGoals";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

type GoalStore = {
  finalGoal: FinalGoal | null;
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  currentMonthId: string | null;
  isDemo: boolean;
  addFinalGoal: (goal: FinalGoal) => void;
  updateFinalGoal: (update: Partial<FinalGoal>) => void;
  addMonthlyGoals: (goal: MonthlyGoal) => void;
  updateMonthlyGoals: (id: string, updates: Partial<MonthlyGoal>) => void;
  addWeeklyGoals: (weeks: WeeklyGoal[]) => void;
  updateWeeklyGoals: (id: string, updates: Partial<WeeklyGoal>) => void;
  toggleWeeklyTask: (weekId: string, taskIdx: number) => void;
  toggleDemoData: () => void;
};

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      finalGoal: null,
      monthlyGoals: [] as MonthlyGoal[],
      weeklyGoals: [] as WeeklyGoal[],
      currentMonthId: null,
      isDemo: true,
      addFinalGoal: (finalGoal) => set(() => ({ finalGoal: finalGoal })),
      updateFinalGoal: (updates) =>
        set((state) => {
          if (!state.finalGoal) return state;
          return { finalGoal: { ...state.finalGoal, ...updates } };
        }),
      addMonthlyGoals: (goal) =>
        set((state) => ({ monthlyGoals: [...state.monthlyGoals, goal] })),
      updateMonthlyGoals: (id, updates) =>
        set((state) => ({
          monthlyGoals: state.monthlyGoals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal,
          ),
        })),
      addWeeklyGoals: (weeks) =>
        set((state) => ({ weeklyGoals: [...state.weeklyGoals, ...weeks] })),
      updateWeeklyGoals: (id, updates) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((w) =>
            w.id === id ? { ...w, ...updates } : w,
          ),
        })),
      toggleWeeklyTask: (weekId, taskIdx) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  tasks: w.tasks.map((t, idx) =>
                    idx === taskIdx ? { ...t, completed: !t.completed } : t,
                  ),
                }
              : w,
          ),
        })),
      toggleDemoData: () => set((state) => ({ isDemo: !state.isDemo })),
    }),
    { name: "goal-storage", storage: createJSONStorage(() => localStorage) },
  ),
);

export const useGoalSource = (): GoalSourceData =>
  useGoalStore(
    useShallow((state) =>
      state.isDemo
        ? {
            finalGoal: demoFinalGoal,
            monthlyGoals: demoMonthlyGoals,
            weeklyGoals: demoWeeklyGoals,
          }
        : {
            finalGoal: state.finalGoal,
            monthlyGoals: state.monthlyGoals,
            weeklyGoals: state.weeklyGoals,
          },
    ),
  );
