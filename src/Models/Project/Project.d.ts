import { Task, TaskListDto } from "../Task/Task";
import { UserInterface } from "./UserInterface";
import { UserStory } from "./UserStory";

export interface Project {
  id: number;
  name: string;
  description: String;
  type: string;
  status: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface ProjectReportVM {
  highPriorityTasks: Array<TaskListDto>;
  todaysTasks: Array<TaskListDto>;
  userStory: Array<UserStory>;
  userInterface: Array<UserInterface>;
  task: Array<Task>;
  totalResource: number;
  totalResourceHours: number;
  completedPercentage: number;
  pendingPercentage: number;
}


export type ReportFilter = {
  startDate: string | null,
  endDate: string | null,
  userStory: string | null,
  userInterface: string | null,
  category: string | null,
  subCategory: string | null
}
