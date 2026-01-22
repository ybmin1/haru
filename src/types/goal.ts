export type FinalGoal = {
  title: string;
  createdAt: string;
};

export type EmptyFinalGoal = {
  title: string;
};

export type MonthlyGoal = {
  id: string;
  title: string;
};

export type EmptyMonthlyGoal = {
  title: string;
};

export type WeeklyGoal = {
  id: string;
  monthId: string;
  weekNumber: number;
  weekStart: string;
  tasks: Task[];
  completed: boolean;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};
