import WeeklyGoalItem from "./WeeklyGoalItem";

import { render, screen, fireEvent } from "@testing-library/react";

const mockHandleTaskChange = jest.fn();
const mockHandleToggle = jest.fn();

const defaultProps = {
  weekIdx: 0,
  handleTaskChange: mockHandleTaskChange,
  handleToggle: mockHandleToggle,
  week: {
    isOpen: true,
    tasks: [
      { id: "w1-t1", text: "", completed: false },
      { id: "w1-t2", text: "", completed: false },
    ],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("WeeklyGoalItem", () => {
  it("renders week number in the title", () => {
    render(<WeeklyGoalItem {...defaultProps} />);
    expect(screen.getByText(/Week1/)).toBeInTheDocument();
  });

  it("shows tasks when isOpen is true", () => {
    render(<WeeklyGoalItem {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("Please enter task 1"),
    ).toBeInTheDocument();
  });

  it("calls handleToggle when toggle button is clicked", () => {
    render(<WeeklyGoalItem {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockHandleToggle).toHaveBeenCalledWith(0);
  });

  it("calls handleTaskChange when user types in a task input", () => {
    render(<WeeklyGoalItem {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText("Please enter task 1"), {
      target: { value: "finish test code" },
    });
    expect(mockHandleTaskChange).toHaveBeenCalledWith(
      expect.anything(), // event object
      0, // weekIdx
      0, // taskIdx
    );
  });
});
