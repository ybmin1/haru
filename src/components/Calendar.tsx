import { useGoalSource } from "@/stores/useGoalStore";

export default function Calendar() {
  const { weeklyGoals } = useGoalSource();

  const getWeeksData = () => {
    const weeksData = [];
    for (let i = 0; i <= 29; i++) {
      //해당 주의 시작일 계산 (오늘부터 i주 전)
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - i * 7);
      //해당 주의 월요일 찾기 (시작 요일이 월요일인 경우를 제외하고는 과거로 돌아가기에 음수여야함)
      const daysToMonday = -(weekStart.getDay() - 1 + 7) % 7;
      weekStart.setDate(weekStart.getDate() + daysToMonday);
      const weekStartStr = weekStart.toLocaleDateString("sv-SE");
      //해당 weekStart에 해당하는 weeklyGoal찾기 (demo일 경우에는 demo데이터에서 찾는다)
      const matchingGoal = weeklyGoals.find(
        (goal) => goal.weekStart === weekStartStr,
      );
      let status: "full" | "partial" | "none" | "empty";
      if (!matchingGoal || matchingGoal.tasks.length === 0) {
        status = "empty";
      } else {
        const completedCount = matchingGoal.tasks.filter(
          (task) => task.completed,
        ).length;
        const totalCount = matchingGoal.tasks.length;
        if (completedCount === totalCount) {
          status = "full";
        } else if (completedCount > 0) {
          status = "partial";
        } else {
          status = "none";
        }
      }
      weeksData.unshift({
        status,
        weekStart: weekStartStr,
        wIdx: i,
      });
    }
    return weeksData;
  };
  const weeksData = getWeeksData();
  const getColourClass = (status: string) => {
    switch (status) {
      case "full":
        return "bg-green-700";
      case "partial":
        return "bg-green-500";
      case "none":
        return "bg-gray-100";
      case "empty":
      default:
        return "bg-white";
    }
  };
  const isNewMonth = (index: number) => {
    if (index === 0) return true;
    return (
      new Date(weeksData[index].weekStart).getMonth() !==
      new Date(weeksData[index - 1].weekStart).getMonth()
    );
  };

  return (
    <div className="h-[300px] border border-gray-200 rounded-2xl mx-6 mb-6 p-6 flex flex-col">
      <div className="flex flex-col h-full">
        <div className="text-gray-400 mb-5">Calendar</div>
        {/* Weekly Blocks */}
        <div className="flex items-center gap-0.5 pt-5">
          {weeksData.map((week, i) => (
            <span
              key={i}
              className={`border border-gray-200 rounded-sm flex-1 h-25 mb-2 ${getColourClass(
                week.status,
              )}`}
            ></span>
          ))}
        </div>
        {/* Month labels */}
        <div className="flex gap-1">
          {weeksData.map((week, index) => (
            <span key={index} className="relative flex-1 h-6">
              {isNewMonth(index) && (
                <div className="absolute text-xs text-gray-600 whitespace-nowrap">
                  {new Date(week.weekStart).toLocaleDateString("en-EN", {
                    month: "short",
                  })}
                </div>
              )}
            </span>
          ))}
        </div>
        {/* Legend */}
        <div className="flex justify-end gap-1 pt-7">
          <span className="text-xs text-gray-600">Less</span>
          <div
            className={`border border-gray-200 rounded-sm w-4 h-4 ${getColourClass(
              "none",
            )}`}
          ></div>
          <div
            className={`border border-gray-200 rounded-sm w-4 h-4 ${getColourClass(
              "partial",
            )}`}
          ></div>
          <div
            className={`border border-gray-200 rounded-sm w-4 h-4 ${getColourClass(
              "full",
            )}`}
          ></div>
          <span className="text-xs text-gray-600">More</span>
        </div>
      </div>
    </div>
  );
}
