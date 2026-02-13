import { baseDate, getMonthYear } from "@/utils/dateUtils";
import { useGoalSetupForm } from "@/hooks/useGoalSetupForm";
import WeeklyGoalItem from "@/components/WeeklyGoalItem";

export default function GoalSetup() {
  const {
    finalTitle,
    monthTitle,
    weeks,
    isEditMode,
    handleFinalTitleChange,
    handleMonthTitleChange,
    handleTaskChange,
    handleToggle,
    handleSubmit,
  } = useGoalSetupForm();

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
                  <WeeklyGoalItem
                    key={weekIdx}
                    handleTaskChange={handleTaskChange}
                    handleToggle={handleToggle}
                    week={week}
                    weekIdx={weekIdx}
                  />
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
