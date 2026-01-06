import {
  getCurrentMonth,
  getMonthYear,
  getWeekRange,
  getWeeksInMonth,
  getWeekStart,
} from "@/utils/dateUtils";
import { Task } from "@/types/task";
import { useGoalStore } from "@/stores/useGoalStore";

import { useRouter } from "next/router";
import { useState } from "react";

import { GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";

type Week = {
  tasks: Task[];
  isOpen: boolean;
};

export default function GoalSetup() {
  const baseDate = new Date(); //or test date
  //router& store hooks
  const router = useRouter();
  const { addFinalGoal, addMonthlyGoals, addWeeklyGoals } = useGoalStore();
  //local state
  const [finalTitle, setFinalTitle] = useState<string>("");
  const [monthTitle, setMonthTitle] = useState<string>("");
  const [weeks, setWeeks] = useState<Week[]>(() => {
    const weekCount = getWeeksInMonth(baseDate);
    console.log(weekCount);
    return Array.from({ length: weekCount }, (_, i) => ({
      tasks: [
        { id: `w${i + 1}-t1`, text: "", completed: false },
        { id: `w${i + 1}-t2`, text: "", completed: false },
        { id: `w${i + 1}-t3`, text: "", completed: false },
      ],
      isOpen: i === 0, //open 1st week only
    }));
  });
  //event handlers
  const handleFinalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalTitle(e.target.value);
  };
  const handleMonthTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMonthTitle(e.target.value);
  const handleTaskChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    weekIdx: number,
    taskIdx: number
  ) => {
    setWeeks((prev) =>
      prev.map((w, wIdx) =>
        wIdx === weekIdx
          ? {
              ...w,
              tasks: w.tasks.map((t, tIdx) =>
                tIdx === taskIdx ? { ...t, text: e.target.value } : t
              ),
            }
          : w
      )
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //🔥 Zustand store 내부 state를 직접 초기화
    // useGoalStore.setState({
    //   monthlyGoals: [],
    //   weeklyGoals: [],
    //   currentMonthId: null,
    // });
    //🔥 localStorage의 persist 데이터 삭제
    // localStorage.removeItem("goal-storage");
    addFinalGoal({
      title: finalTitle,
      createdAt: new Date().toISOString(),
    });
    addMonthlyGoals({
      id: getCurrentMonth(baseDate),
      title: monthTitle,
    });
    const weeklyGoals = weeks.map((w, i) => ({
      id: `${getCurrentMonth(baseDate)}-w${i + 1}`,
      monthId: getCurrentMonth(baseDate),
      weekNumber: i + 1,
      weekStart: getWeekStart(baseDate, i),
      tasks: w.tasks.filter((t) => t.text.trim() !== ""),
      completed: false,
    }));
    addWeeklyGoals(weeklyGoals);
    router.push("/");
  };
  const handleToggle = (weekIdx: number) => {
    setWeeks((prev) =>
      prev.map((week, i) =>
        i === weekIdx ? { ...week, isOpen: !week.isOpen } : week
      )
    );
  };
  return (
    <div className="max-w-[800px] w-[90%] mx-auto">
      <div className="flex flex-col pt-15 pb-13 gap-5">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
