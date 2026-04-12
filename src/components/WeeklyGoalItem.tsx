import { baseDate, getWeekRange } from "@/utils/dateUtils";
import { WeeklyGoal } from "@/types/goal";

import React from "react";

import { GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";

type Props = {
  week: Partial<WeeklyGoal> & { isOpen: boolean };
  weekIdx: number;
  handleTaskChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    weekIdx: number,
    taskIdx: number,
  ) => void;
  handleToggle: (weekIdx: number) => void;
};

function WeeklyGoalItem({
  handleTaskChange,
  handleToggle,
  week,
  weekIdx,
}: Props) {
  return (
    <div className="flex flex-col border-b last:border-b-0 border-gray-200">
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
        {week?.tasks?.map((task, i) => (
          <input
            key={task.id}
            type="text"
            placeholder={`Please enter task ${i + 1}`}
            value={task.text}
            onChange={(e) => handleTaskChange(e, weekIdx, i)}
            required={i === 0}
            className="w-full pb-0.5 mb-2"
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(WeeklyGoalItem);
