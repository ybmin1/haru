import {
  baseDate,
  getCurrentMonth,
  getWeekStart,
  monthId,
} from "@/utils/dateUtils";
import { getNewWeeks } from "@/utils/goalUtils";
import { Task, WeeklyGoal } from "@/types/goal";
import { useGoalSource, useGoalStore } from "@/stores/useGoalStore";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

type WeeklyGoalDraft = Partial<WeeklyGoal> & {
  tasks: Task[];
  isOpen: boolean;
};

export function useGoalSetupForm() {
  //router& store hooks
  const router = useRouter();
  const {
    addFinalGoal,
    addMonthlyGoals,
    addWeeklyGoals,
    isDemo,
    toggleDemoData,
    updateFinalGoal,
    updateMonthlyGoals,
    updateWeeklyGoals,
  } = useGoalStore();
  const { finalGoal, monthlyGoals, weeklyGoals } = useGoalSource();

  //Check if current month's data exists
  const currentMonthGoal = monthlyGoals.find((goal) => goal.id === monthId);
  const currentWeeklyGoals = weeklyGoals.filter(
    (week) => week.monthId === monthId,
  );
  const isEditMode = currentWeeklyGoals.length > 0;

  //local state
  const [finalTitle, setFinalTitle] = useState<string>(finalGoal?.title ?? "");
  const [monthTitle, setMonthTitle] = useState<string>(
    monthlyGoals.find((goal) => goal.id === monthId)?.title ?? "",
  );
  const [weeks, setWeeks] = useState<WeeklyGoalDraft[]>(() => {
    const currentMonthWeeks = weeklyGoals.filter(
      (week) => week.monthId === monthId,
    );
    if (currentMonthWeeks.length > 0) {
      return currentMonthWeeks.map((w, i) => ({ ...w, isOpen: i === 0 }));
    }
    return getNewWeeks(baseDate);
  });

  useEffect(() => setFinalTitle(finalGoal?.title ?? ""), [finalGoal]);
  useEffect(
    () =>
      setMonthTitle(
        monthlyGoals.find((goal) => goal.id === monthId)?.title ?? "",
      ),
    [monthlyGoals],
  );
  useEffect(() => {
    const currentMonthWeeks = weeklyGoals.filter(
      (week) => week.monthId === monthId,
    );
    if (currentMonthWeeks.length > 0) {
      setWeeks(currentMonthWeeks.map((w, i) => ({ ...w, isOpen: i === 0 })));
    } else setWeeks(getNewWeeks(baseDate));
  }, [weeklyGoals]);

  //event handlers
  const handleFinalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalTitle(e.target.value);
  };
  const handleMonthTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMonthTitle(e.target.value);
  const handleTaskChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      weekIdx: number,
      taskIdx: number,
    ) => {
      setWeeks((prev) =>
        prev.map((w, wIdx) =>
          wIdx === weekIdx
            ? {
                ...w,
                tasks: w.tasks.map((t, tIdx) =>
                  tIdx === taskIdx ? { ...t, text: e.target.value } : t,
                ),
              }
            : w,
        ),
      );
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //if Demo mode, do not save and ask to switch
    if (isDemo) {
      const shouldSwitch = window.confirm(
        "You can't save change in demo mode.\nSwitch to user mode to add or update your own goals?",
      );
      if (shouldSwitch) {
        toggleDemoData();
      }
      return;
    }
    //user mode
    if (finalGoal) {
      updateFinalGoal({ title: finalTitle });
    } else {
      addFinalGoal({
        title: finalTitle,
        createdAt: new Date().toISOString(),
      });
    }
    if (isEditMode && currentMonthGoal) {
      updateMonthlyGoals(monthId, { title: monthTitle });
    } else {
      addMonthlyGoals({
        id: getCurrentMonth(baseDate),
        title: monthTitle,
      });
    }
    const weeklyGoals = weeks.map((w, i) => ({
      id: `${getCurrentMonth(baseDate)}-w${i + 1}`,
      monthId: getCurrentMonth(baseDate),
      weekNumber: i + 1,
      weekStart: getWeekStart(baseDate, i),
      tasks: w.tasks.filter((t) => t.text.trim() !== ""),
      completed: false,
    }));
    if (isEditMode) {
      weeklyGoals.forEach((weekGoal) => {
        updateWeeklyGoals(weekGoal.id, weekGoal);
      });
    } else {
      addWeeklyGoals(weeklyGoals);
    }
    window.alert("Goals saved successfully!");
    router.push("/");
  };

  const handleToggle = useCallback((weekIdx: number) => {
    setWeeks((prev) =>
      prev.map((week, i) =>
        i === weekIdx ? { ...week, isOpen: !week.isOpen } : week,
      ),
    );
  }, []);

  return {
    // State
    finalTitle,
    monthTitle,
    weeks,
    isEditMode,

    // Setters
    setFinalTitle,
    setMonthTitle,

    // Handlers
    handleFinalTitleChange,
    handleMonthTitleChange,
    handleTaskChange,
    handleToggle,
    handleSubmit,
  };
}
