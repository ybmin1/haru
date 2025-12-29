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
  //router& store hooks
  const router = useRouter();
  const { addFinalGoal, addMonthlyGoals, addWeeklyGoals } = useGoalStore();
  //local state
  const [finalTitle, setFinalTitle] = useState<string>("");
  const [monthTitle, setMonthTitle] = useState<string>("");
  const [weeks, setWeeks] = useState<Week[]>([
    {
      tasks: [
        { id: "w1-t1", text: "", completed: false },
        { id: "w1-t2", text: "", completed: false },
        { id: "w1-t3", text: "", completed: false },
      ],
      isOpen: true,
    },
    {
      tasks: [
        { id: "w2-t1", text: "", completed: false },
        { id: "w2-t2", text: "", completed: false },
        { id: "w2-t3", text: "", completed: false },
      ],
      isOpen: false,
    },
    {
      tasks: [
        { id: "w3-t1", text: "", completed: false },
        { id: "w3-t2", text: "", completed: false },
        { id: "w3-t3", text: "", completed: false },
      ],
      isOpen: false,
    },
    {
      tasks: [
        { id: "w4-t1", text: "", completed: false },
        { id: "w4-t2", text: "", completed: false },
        { id: "w4-t3", text: "", completed: false },
      ],
      isOpen: false,
    },
  ]);

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
      id: getCurrentMonth(),
      title: monthTitle,
    });
    const weeklyGoals = weeks.map((w, i) => ({
      id: `${getCurrentMonth()}-w${i + 1}`,
      monthId: getCurrentMonth(),
      weekNumber: i + 1,
      weekStart: getWeekStart(i),
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
  //helper functions
  function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
  }
  //start of a week = Monday
  function getWeekStart(weekIndex: number) {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const day = firstOfMonth.getDay();
    //첫 월요일까지 남은 일수 (월요일=1)
    const daysToMonday = (1 - day + 7) % 7;
    //첫 월요일
    const firstMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      1 + daysToMonday
    );
    //weekIndex번째 주
    firstMonday.setDate(firstMonday.getDate() + weekIndex * 7);
    return firstMonday.toLocaleDateString("sv-SE"); //내 컴퓨터(한국)/영국 시차로인한 오류 없애기 위함
    //return firstMonday.toISOString().slice(0, 10);
  }
  function getMonthYear() {
    const today = new Date();
    const month = today.toLocaleString("en-GB", { month: "short" });
    const year = today.getFullYear();
    return `${month} ${year}`;
  }
  function getWeekRange(weekIndex: number) {
    const weekStart = new Date(getWeekStart(weekIndex));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const startMonth = weekStart.toLocaleString("en-GB", { month: "short" });
    const endMonth = weekEnd.toLocaleString("en-GB", { month: "short" });
    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${endMonth}`;
    } else {
      return `${startDay}${startMonth} - ${endDay}${endMonth}`;
    }
  }

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
              <div className="text-xl font-bold py-1">{getMonthYear()}</div>
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
                        Week{weekIdx + 1} ({getWeekRange(weekIdx)})
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
