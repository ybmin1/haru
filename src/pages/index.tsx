import Calendar from "@/components/Calendar";
import {
  demoFinalGoal,
  demoMonthlyGoals,
  demoWeeklyGoals,
} from "@/data/demoGoals";
import { getCurrentMonth, getWeekIndex } from "@/utils/dateUtils";
import { MonthlyGoal, WeeklyGoal } from "@/types/goal";
import { useGoalStore } from "@/stores/useGoalStore";

import Link from "next/link";

import { GoGoal } from "react-icons/go";
import { LuSettings } from "react-icons/lu";

export default function Home() {
  const baseDate = new Date();

  const { isDemo, finalGoal, monthlyGoals, toggleWeeklyTask, weeklyGoals } =
    useGoalStore();

  const monthId = getCurrentMonth(baseDate);
  const weekId = `${getCurrentMonth(baseDate)}-w${getWeekIndex(baseDate)}`;
  const finalGoalData = isDemo ? demoFinalGoal : finalGoal;
  const monthlyGoalData: MonthlyGoal | null =
    (isDemo ? demoMonthlyGoals : monthlyGoals).find(
      (goal) => goal.id === monthId
    ) || null;
  const weeklyGoalData: WeeklyGoal | null =
    (isDemo ? demoWeeklyGoals : weeklyGoals).find(
      (goal) => goal.id === weekId
    ) || null;

  const handleCheckbox = (wId: string, taskIdx: number) => {
    toggleWeeklyTask(wId, taskIdx);
  };

  return (
    <div className="w-full px-20 py-7">
      <div className="px-8">
        <div className="flex justify-end rounded-lg border border-gray-200 bg-gray-100 p-2">
          <div className="p-2">
            <div className="w-[272px] bg-gray-100 m-2">Side Bar</div>
          </div>
          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between h-[47px] border-b border-gray-200 px-6">
              <div className="flex items-center gap-2">
                <GoGoal className="font-bold" />
                {finalGoalData
                  ? `Final Goal: ${finalGoalData.title}`
                  : "Set your Final Goal !! "}
              </div>
              <Link
                href={"/goal-setup"}
                className="flex items-center justify-center gap-2"
              >
                <span>Set up goals</span>
                <LuSettings />
              </Link>
            </div>
            <div className="p-6">
              <div className="mx-auto grid grid-cols-2 gap-5">
                <div className="w-full h-[184px] rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-100  p-6">
                  <div className="text-gray-400">This Month Goal</div>
                  <div className="flex flex-col justify-center h-full list-disc pb-6 gap-1">
                    {monthlyGoalData
                      ? monthlyGoalData.title
                      : "Please add this month goal"}
                  </div>
                </div>
                <div className="w-full h-[184px] rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-100 p-6">
                  <div className="text-gray-400">Tasks</div>
                  <div className="flex flex-col justify-center h-full list-disc pb-6 gap-1">
                    {weeklyGoalData ? (
                      weeklyGoalData.tasks.map((task, taskIdx) => (
                        <label key={taskIdx}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => handleCheckbox(weekId, taskIdx)}
                            className="mr-1"
                          />
                          <span
                            className={
                              task.completed ? "text-gray-400 line-through" : ""
                            }
                          >
                            {task.text}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div>Please add this week goal</div>
                    )}
                  </div>
                </div>
              </div>
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
