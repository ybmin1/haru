import { useGoalStore } from "@/stores/useGoalStore";

import Link from "next/link";

import { GoGoal } from "react-icons/go";
import { LuSettings } from "react-icons/lu";

export default function Home() {
  const { finalGoal, monthlyGoals, updateWeeklyGoals, weeklyGoals } =
    useGoalStore();

  const handleCheckbox = (
    wId: string,
    taskIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    updateWeeklyGoals(wId, {
      tasks: weeklyGoals
        .find((w) => w.id === wId)!
        .tasks.map((t, idx) =>
          idx === taskIdx ? { ...t, completed: checked } : t
        ),
    });
  };

  return (
    <div className="w-full px-20 py-12">
      <div className="px-8">
        <div className="flex justify-end rounded-lg border border-gray-200 bg-gray-100 p-2">
          <div className="p-2">
            <div className="w-[272px] bg-gray-100 m-2">Side Bar</div>
          </div>
          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between h-[47px] border-b border-gray-200 px-6">
              <div className="flex items-center gap-2">
                <GoGoal className="font-bold" />
                Final Goal. {finalGoal.title}
              </div>
              <Link href={"/goal-setup"}>
                <LuSettings />
              </Link>
            </div>
            <div className="p-6">
              <div className="mx-auto grid grid-cols-2 gap-5">
                <div className="w-full h-[184px] rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-100  p-6">
                  <div className="text-gray-400">This Week Goal</div>
                  <div className="flex flex-col justify-center h-full list-disc pb-6 gap-1">
                    {monthlyGoals[0]?.title && (
                      <div>{monthlyGoals[0].title}</div>
                    )}
                  </div>
                </div>
                <div className="w-full h-[184px] rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-100 p-6">
                  <div className="text-gray-400">Tasks</div>
                  <div className="flex flex-col justify-center h-full list-disc pb-6 gap-1">
                    {weeklyGoals[0]?.tasks?.map((task, taskIdx) => (
                      <label key={taskIdx}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) =>
                            handleCheckbox(weeklyGoals[0].id, taskIdx, e)
                          }
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
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[390px] border border-gray-200 rounded-2xl mt-6 p-6">
                <div className="text-gray-400">Calendar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
