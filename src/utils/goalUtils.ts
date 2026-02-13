import { getWeeksInMonth } from "@/utils/dateUtils";

export function getNewWeeks(date: Date) {
  const weekCount = getWeeksInMonth(date);
  return Array.from({ length: weekCount }, (_, i) => ({
    tasks: [
      { id: `w${i + 1}-t1`, text: "", completed: false },
      { id: `w${i + 1}-t2`, text: "", completed: false },
      { id: `w${i + 1}-t3`, text: "", completed: false },
    ],
    isOpen: i === 0, //open 1st week only
  }));
}
