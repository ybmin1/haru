// Week starts on Monday (Mon–Sun)

export const baseDate = new Date(); //or test date

export const monthId = getCurrentMonth(baseDate);

export const weekId = `${getCurrentMonth(baseDate)}-w${getWeekIndex(baseDate)}`;

export function getCurrentMonth(date: Date) {
  return date.toISOString().slice(0, 7);
}

export function getWeekIndex(date: Date) {
  const daysToMonday = date.getDay() === 0 ? -6 : 1 - date.getDay(); //to this week's Monday
  const mondayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + daysToMonday,
  );
  const weekIndex = Math.ceil(mondayOfWeek.getDate() / 7);
  return weekIndex;
}

export function getMonthYear(date: Date) {
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

//first Monday of this month
export function getFirstMonday(date: Date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = firstOfMonth.getDay();
  const daysToMonday = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  const firstMonday = new Date(
    date.getFullYear(),
    date.getMonth(),
    1 + daysToMonday,
  );
  return firstMonday;
}

export function getLastDateOfMonth(date: Date) {
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDate;
}

//calculate the number of weeks in the month
export function getWeeksInMonth(date: Date) {
  const weeks = Math.ceil(
    (getLastDateOfMonth(date).getDate() - getFirstMonday(date).getDate() + 1) /
      7,
  );
  return Math.max(4, weeks); //minimum 4 weeks
}

export function getWeekStart(date: Date, weekIndex: number) {
  const baseMonday = getFirstMonday(date);
  const weekStart = new Date(baseMonday);
  weekStart.setDate(weekStart.getDate() + weekIndex * 7);
  return weekStart.toLocaleDateString("sv-SE"); //sv-SE formats date as YYYY-MM-DD using local timezone
}

export function getWeekRange(date: Date, weekIndex: number) {
  const weekStart = new Date(getWeekStart(date, weekIndex));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.toLocaleString("en-GB", { month: "short" });
  const endMonth = weekEnd.toLocaleString("en-GB", { month: "short" });
  if (startMonth === endMonth) {
    return `${startDay}-${endDay}${endMonth}`;
  } else {
    return `${startDay}${startMonth}-${endDay}${endMonth}`;
  }
}
