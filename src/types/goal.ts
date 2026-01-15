export type FinalGoal = {
  title: string;
  createdAt: string;
};

export type MonthlyGoal = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type WeeklyGoal = {
  id: string;
  monthId: string;
  weekNumber: number;
  weekStart: string;
  tasks: Task[];
  completed: boolean;
};
