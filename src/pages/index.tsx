import Calendar from "@/components/Calendar";
import { monthId, weekId } from "@/utils/dateUtils";
import {
  EmptyFinalGoal,
  EmptyMonthlyGoal,
  FinalGoal,
  MonthlyGoal,
  WeeklyGoal,
} from "@/types/goal";
import { useGoalSource, useGoalStore } from "@/stores/useGoalStore";

import { GoGoal } from "react-icons/go";

export default function Home() {
  const { toggleWeeklyTask } = useGoalStore();
  const { finalGoal, monthlyGoals, weeklyGoals } = useGoalSource();

  const finalGoalData: FinalGoal | EmptyFinalGoal = finalGoal ?? {
    title: "Set your final Goal!",
  };
  const monthlyGoalData: MonthlyGoal | EmptyMonthlyGoal = monthlyGoals.find(
    (goal) => goal.id === monthId,
  ) ?? {
    title: "Please add this month goal",
  };
  const weeklyGoalData: WeeklyGoal | null =
    weeklyGoals.find((goal) => goal.id === weekId) || null;

  const handleCheckbox = (wId: string, taskIdx: number) => {
    toggleWeeklyTask(wId, taskIdx);
  };

  return (
    <>
      <div className="w-full rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between h-[70px] border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <GoGoal className="font-bold" />
            {`Final Goal: ${finalGoalData.title}`}
          </div>
        </div>
        <div className="p-6">
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full h-[184px] rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-100 p-6">
              <div className="text-gray-400">This Month Goal</div>
              <div className="flex flex-col justify-center h-full list-disc pb-6 gap-1">
                {monthlyGoalData.title}
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
        </div>
        <Calendar />
      </div>
    </>
  );
}
