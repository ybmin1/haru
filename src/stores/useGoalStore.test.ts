import { useGoalStore } from "./useGoalStore";

import { act } from "react";

beforeEach(() => {
  useGoalStore.setState({
    finalGoal: null,
    monthlyGoals: [],
    weeklyGoals: [],
    isDemo: true,
  });
});

describe("finalGoal — add then update", () => {
  it("adds finalGoal with title and createdAt", () => {
    act(() => {
      useGoalStore.getState().addFinalGoal({
        title: "become a developer",
        createdAt: "2025-01-01",
      });
    });
    const goal = useGoalStore.getState().finalGoal;
    expect(goal?.title).toBe("become a developer");
    expect(goal?.createdAt).toBe("2025-01-01");
  });

  it("updates title without changing createdAt", () => {
    act(() => {
      useGoalStore
        .getState()
        .addFinalGoal({ title: "original", createdAt: "2025-01-01" });
      useGoalStore.getState().updateFinalGoal({ title: "updated" });
    });
    const goal = useGoalStore.getState().finalGoal;
    expect(goal?.title).toBe("updated");
    expect(goal?.createdAt).toBe("2025-01-01");
  });
});

describe("monthlyGoals — add then update", () => {
  it("adds a monthly goal", () => {
    act(() => {
      useGoalStore
        .getState()
        .addMonthlyGoals({ id: "2026-04", title: "deploy haru project" });
    });
    expect(useGoalStore.getState().monthlyGoals[0].title).toBe(
      "deploy haru project",
    );
  });

  it("updates only the matched monthly goal by id", () => {
    act(() => {
      useGoalStore
        .getState()
        .addMonthlyGoals({ id: "2025-03", title: "march goal" });
      useGoalStore
        .getState()
        .addMonthlyGoals({ id: "2025-04", title: "april goal" });
      useGoalStore
        .getState()
        .updateMonthlyGoals("2025-03", { title: "updated march" });
    });
    const goals = useGoalStore.getState().monthlyGoals;
    expect(goals.find((g) => g.id === "2025-03")?.title).toBe("updated march");
    expect(goals.find((g) => g.id === "2025-04")?.title).toBe("april goal"); // untouched
  });
});

describe("weeklyGoals — add then update", () => {
  it("adds weekly goals", () => {
    act(() => {
      useGoalStore.getState().addWeeklyGoals([
        {
          id: "2025-03-w1",
          monthId: "2025-03",
          weekNumber: 1,
          weekStart: "2025-03-03",
          tasks: [{ id: "w1-t1", text: "task", completed: false }],
          completed: false,
        },
      ]);
    });
    expect(useGoalStore.getState().weeklyGoals[0].id).toBe("2025-03-w1");
  });

  it("updates only the matched weekly goal by id", () => {
    act(() => {
      useGoalStore.getState().addWeeklyGoals([
        {
          id: "2025-03-w1",
          monthId: "2025-03",
          weekNumber: 1,
          weekStart: "2025-03-03",
          tasks: [],
          completed: false,
        },
        {
          id: "2025-03-w2",
          monthId: "2025-03",
          weekNumber: 2,
          weekStart: "2025-03-10",
          tasks: [],
          completed: false,
        },
      ]);
      useGoalStore
        .getState()
        .updateWeeklyGoals("2025-03-w1", { completed: true });
    });
    const goals = useGoalStore.getState().weeklyGoals;
    expect(goals.find((g) => g.id === "2025-03-w1")?.completed).toBe(true);
    expect(goals.find((g) => g.id === "2025-03-w2")?.completed).toBe(false); // untouched
  });
});

describe("toggleWeeklyTask", () => {
  beforeEach(() => {
    useGoalStore.setState({
      weeklyGoals: [
        {
          id: "w1",
          monthId: "2025-03",
          weekNumber: 1,
          weekStart: "2025-03-03",
          tasks: [{ id: "t1", text: "task", completed: false }],
          completed: false,
        },
      ],
    });
  });

  it("toggles a task from false to true", () => {
    act(() => {
      useGoalStore.getState().toggleWeeklyTask("w1", 0);
    });
    expect(useGoalStore.getState().weeklyGoals[0].tasks[0].completed).toBe(
      true,
    );
  });

  it("toggles back to false on second call", () => {
    act(() => {
      useGoalStore.getState().toggleWeeklyTask("w1", 0);
      useGoalStore.getState().toggleWeeklyTask("w1", 0);
    });
    expect(useGoalStore.getState().weeklyGoals[0].tasks[0].completed).toBe(
      false,
    );
  });
});
