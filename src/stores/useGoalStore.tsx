import { Task } from "@/types/task";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FinalGoal = {
  title: string;
  createdAt: string;
};

type MonthlyGoal = {
  id: string;
  title: string;
};

type WeeklyGoal = {
  id: string;
  monthId: string;
  weekNumber: number;
  weekStart: string;
  tasks: Task[];
  completed: boolean;
};

type GoalStore = {
  finalGoal: FinalGoal;
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  currentMonthId: string | null;
  addFinalGoal: (goal: FinalGoal) => void;
  updateFinalGoal: (update: Partial<FinalGoal>) => void;
  addMonthlyGoals: (goal: MonthlyGoal) => void;
  updateMonthlyGoals: (id: string, updates: Partial<MonthlyGoal>) => void;
  addWeeklyGoals: (weeks: WeeklyGoal[]) => void;
  updateWeeklyGoals: (id: string, updates: Partial<WeeklyGoal>) => void;
};

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      finalGoal: {} as FinalGoal,
      monthlyGoals: [] as MonthlyGoal[],
      weeklyGoals: [] as WeeklyGoal[],
      currentMonthId: null,
      addFinalGoal: (finalGoal) => set(() => ({ finalGoal: finalGoal })),
      updateFinalGoal: (updates) =>
        set((state) => ({ finalGoal: { ...state.finalGoal, ...updates } })),
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
    }),
    { name: "goal-storage", storage: createJSONStorage(() => localStorage) }
  )
);
