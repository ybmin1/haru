import {
  baseDate,
  getCurrentMonth,
  getMonthYear,
  getWeekRange,
  getWeeksInMonth,
  getWeekStart,
  monthId,
} from "@/utils/dateUtils";
import {
  demoFinalGoal,
  demoMonthlyGoals,
  demoWeeklyGoals,
} from "@/data/demoGoals";
import { Task, WeeklyGoal } from "@/types/goal";
import { useGoalStore } from "@/stores/useGoalStore";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";

type WeeklyGoalDraft = Partial<WeeklyGoal> & {
  tasks: Task[];
  isOpen: boolean;
};

export default function GoalSetup() {
  //router& store hooks
  const router = useRouter();
  const {
    addFinalGoal,
    addMonthlyGoals,
    addWeeklyGoals,
    isDemo,
    finalGoal,
    monthlyGoals,
    toggleDemoData,
    updateFinalGoal,
    updateMonthlyGoals,
    updateWeeklyGoals,
    weeklyGoals,
  } = useGoalStore();

  //Check if current month's data exists
  const currentMonthGoal = isDemo
    ? demoMonthlyGoals.find((goal) => goal.id === monthId)
    : monthlyGoals.find((goal) => goal.id === monthId);
  const currentWeeklyGoals = isDemo
    ? demoWeeklyGoals.filter((week) => week.monthId === monthId)
    : weeklyGoals.filter((week) => week.monthId === monthId);
  const isEditMode = currentWeeklyGoals.length > 0;

  //local state
  const [finalTitle, setFinalTitle] = useState<string>(
    isDemo ? demoFinalGoal.title : (finalGoal?.title ?? ""),
  );
  const [monthTitle, setMonthTitle] = useState<string>(
    (isDemo ? demoMonthlyGoals : monthlyGoals).find(
      (goal) => goal.id === monthId,
    )?.title ?? "",
  );
  const [weeks, setWeeks] = useState<WeeklyGoalDraft[]>(() => {
    const currentMonthWeeks = (isDemo ? demoWeeklyGoals : weeklyGoals).filter(
      (week) => week.monthId === monthId,
    );
    if (currentMonthWeeks.length > 0) {
      return currentMonthWeeks.map((w, i) => ({ ...w, isOpen: i === 0 }));
    }
    return getNewWeeks();
  });

  useEffect(
    () =>
      setFinalTitle(isDemo ? demoFinalGoal.title : (finalGoal?.title ?? "")),
    [isDemo, finalGoal],
  );
  useEffect(
    () =>
      setMonthTitle(
        (isDemo ? demoMonthlyGoals : monthlyGoals).find(
          (goal) => goal.id === monthId,
        )?.title ?? "",
      ),
    [isDemo, monthlyGoals],
  );
  useEffect(() => {
    const currentMonthWeeks = (isDemo ? demoWeeklyGoals : weeklyGoals).filter(
      (week) => week.monthId === monthId,
    );
    if (currentMonthWeeks.length > 0) {
      setWeeks(currentMonthWeeks.map((w, i) => ({ ...w, isOpen: i === 0 })));
    } else setWeeks(getNewWeeks());
  }, [isDemo, weeklyGoals]);

  function getNewWeeks() {
    const weekCount = getWeeksInMonth(baseDate);
    return Array.from({ length: weekCount }, (_, i) => ({
      tasks: [
        { id: `w${i + 1}-t1`, text: "", completed: false },
        { id: `w${i + 1}-t2`, text: "", completed: false },
        { id: `w${i + 1}-t3`, text: "", completed: false },
      ],
      isOpen: i === 0, //open 1st week only
    }));
  }

  //event handlers
  const handleFinalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalTitle(e.target.value);
  };
  const handleMonthTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMonthTitle(e.target.value);
  const handleTaskChange = (
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
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //🔥 Zustand store 내부 state를 직접 초기화
    // useGoalStore.setState({
    //   finalGoal: null,
    //   monthlyGoals: [],
    //   weeklyGoals: [],
    //   currentMonthId: null,
    // });
    //🔥 localStorage의 persist 데이터 삭제
    // localStorage.removeItem("goal-storage");

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
  const handleToggle = (weekIdx: number) => {
    setWeeks((prev) =>
      prev.map((week, i) =>
        i === weekIdx ? { ...week, isOpen: !week.isOpen } : week,
      ),
    );
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-col pb-6 gap-5">
        <div className="text-3xl font-bold">Set Up Goals</div>
        <div className="text-gray-500">
          Set up goals for this month and break down to weekly tasks
        </div>
      </div>
      <div className=" border border-gray-200 rounded-lg px-14 py-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col border border-gray-200 rounded-lg px-10 py-3 gap-2">
              <div className="text-xl font-bold py-1">Final Goal</div>
              <input
                type="text"
                placeholder="Please enter final goal"
                value={finalTitle}
                onChange={handleFinalTitleChange}
                className="w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col border border-gray-200 rounded-lg px-10 py-3 gap-2">
              <div className="text-xl font-bold py-1">
                {getMonthYear(baseDate)}
              </div>
              <input
                type="text"
                placeholder="Please enter this month's goal"
                value={monthTitle}
                onChange={handleMonthTitleChange}
                className="w-[300px]"
                required
              />
            </div>
            <div className="flex flex-col border border-gray-200 rounded-lg px-10">
              <div className="flex flex-col">
                {weeks.map((week, weekIdx) => (
                  <div
                    key={weekIdx}
                    className="flex flex-col border-b last:border-b-0 border-gray-200"
                  >
                    <div className="flex justify-between text-xl font-bold py-2">
                      <span>
                        Week{weekIdx + 1} ({getWeekRange(baseDate, weekIdx)})
                      </span>
                      <span>
                        <button
                          onClick={() => handleToggle(weekIdx)}
                          type="button"
                          className="hover:cursor-pointer"
                        >
                          {week.isOpen ? <GoChevronUp /> : <GoChevronDown />}
                        </button>
                      </span>
                    </div>
                    <div
                      className={`flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          ${week.isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
                    >
                      {week.tasks.map((task, taskIdx) => (
                        <input
                          key={taskIdx}
                          type="text"
                          placeholder={`Please enter task ${taskIdx + 1}`}
                          value={task.text}
                          onChange={(e) =>
                            handleTaskChange(e, weekIdx, taskIdx)
                          }
                          required={taskIdx === 0}
                          className="w-[300px] pb-0.5 mb-2"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white rounded-lg px-4 py-1 mt-5 hover:cursor-pointer hover:bg-gray-700 transition-all duration-300"
            >
              {isEditMode ? "Update Goals" : "Add Goals"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
