import { describe } from "node:test";

import {
  getCurrentMonth,
  getWeekIndex,
  getFirstMonday,
  getWeeksInMonth,
  getWeekRange,
  getWeekStart,
} from "./dateUtils";

// Helper to create a date without timezone surprises
const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

describe("getCurrentMonth", () => {
  it("returns YYYY-MM format", () => {
    expect(getCurrentMonth(d(2026, 3, 19))).toBe("2026-03");
  });
});

describe("getWeekIndex", () => {
  it("returns correct week index", () => {
    expect(getWeekIndex(d(2026, 3, 2))).toBe(1); //Monday
    expect(getWeekIndex(d(2026, 3, 18))).toBe(3); //Wednesday
    expect(getWeekIndex(d(2026, 3, 31))).toBe(5); //Tuesday, End of the month
  });

  it("handles Sunday correctly (should belong to previous week)", () => {
    expect(getWeekIndex(d(2026, 3, 1))).toBe(4); //Sunday
    expect(getWeekIndex(d(2026, 3, 8))).toBe(1); //Sunday
  });

  it("Handles a date whose Monday falls in the previous month", () => {
    expect(getWeekIndex(d(2026, 1, 1))).toBe(5); //Thursday -> its Monday is 29th Dec 2025
  });
});

describe("getFirstMonday", () => {
  it("returns the 1st when the month starts on a Monday", () => {
    // December 2025 starts on Monday 1st
    const result = getFirstMonday(d(2025, 12, 15));
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(11); //Dec (0-indexed)
  });

  it("returns the correct Monday when the 1st is not a Monday", () => {
    const result1 = getFirstMonday(d(2026, 2, 1)); //1 Feb is a Sunday -> first Monday is 5 Jan (previous month)
    expect(result1.getDate()).toBe(5);
    expect(result1.getMonth()).toBe(0); //Jan (0-indexed)
  });
});
