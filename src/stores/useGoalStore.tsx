import { FinalGoal, MonthlyGoal, WeeklyGoal } from "@/types/goal";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GoalStore = {
  finalGoal: FinalGoal | null;
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  currentMonthId: string | null;
  addFinalGoal: (goal: FinalGoal) => void;
  updateFinalGoal: (update: Partial<FinalGoal>) => void;
  addMonthlyGoals: (goal: MonthlyGoal) => void;
  updateMonthlyGoals: (id: string, updates: Partial<MonthlyGoal>) => void;
  addWeeklyGoals: (weeks: WeeklyGoal[]) => void;
  updateWeeklyGoals: (id: string, updates: Partial<WeeklyGoal>) => void;
  toggleWeeklyTask: (weekId: string, taskIdx: number) => void;
};

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      finalGoal: null,
      monthlyGoals: [] as MonthlyGoal[],
      weeklyGoals: [] as WeeklyGoal[],
      currentMonthId: null,
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
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),
      addWeeklyGoals: (weeks) =>
        set((state) => ({ weeklyGoals: [...state.weeklyGoals, ...weeks] })),
      updateWeeklyGoals: (id, updates) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),
      toggleWeeklyTask: (weekId, taskIdx) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((w) =>
            w.id === weekId
              ? {
                  ...w,
                  tasks: w.tasks.map((t, idx) =>
                    idx === taskIdx ? { ...t, completed: !t.completed } : t
                  ),
                }
              : w
          ),
        })),
    }),
    { name: "goal-storage", storage: createJSONStorage(() => localStorage) }
  )
);
