import { describe } from "node:test";

import { getNewWeeks } from "./goalUtils";
import { getWeeksInMonth } from "@/utils/dateUtils";

// Helper to create a date without timezone surprises
const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

describe("getNewWeeks", () => {
  it("returns the correct number of weeks for the month", () => {
    const date = d(2026, 4, 1);
    expect(getNewWeeks(date).length).toBe(getWeeksInMonth(date));
  });

  it("tasks have correct id format", () => {
    const weeks = getNewWeeks(d(2026, 3, 5));
    expect(weeks[0].tasks[1].id).toBe("w1-t2");
  });

  it("only the first week is open", () => {
    const weeks = getNewWeeks(d(2026, 2, 20));
    expect(weeks[0].isOpen).toBe(true);
    weeks.slice(1).forEach((week) => {
      expect(week.isOpen).toBe(false);
    });
  });
});
