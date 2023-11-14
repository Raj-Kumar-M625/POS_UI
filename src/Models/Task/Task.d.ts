export interface Task {
  name?: string;
  projectName?: string;
  description: string;
  usName?: String;
  uiName?: string;
  teamName?: string;
  employeeName? : string;
  UseCaseName?: string;
  Category: string;
  SubCategory: string;
  Status: string;
  percentage: number;
  EstimatedTime: string;
  ActualTime: string;
  EstimatedStartDate: string;
  EstimatedEndDate: string;
  ActualStartDate: string;
  ActualEndDate: string;
}

export interface TaskListDto {
  taskId: number;
  name: string;
  description: string;
  usName: string;
  uiName: string;
  teamName: string;
  employeeName: string;
  category: string;
  subCategory: string;
  status: string;
  percentage: number;
  estimateTime: number;
  actualTime: number;
  actualStartDate: string;
  actualEndDate:string
}

interface TaskDTO {
  uiUserStoryId?: number | null;
  id: number;
  employeeTaskId: number;
  projectId: number;
  teamId: number;
  categoryId: number;
  uiId: number;
  userStoryId?: number | null;
  name: string;
  description: string;
  actualStartDate?: Date |string | null;
  actualEndDate?: Date | string |null;
  estTime: number | string;
  actTime?: number | null;
  weekEndingDate?: Date |string| null;
  status: string;
  priority?: string | null;
  percentage: number;
  estimateStartDate: Date|string;
  estimateEndDate: Date|string;
  taskType?: string | null;
  classification?: string | null;
  comment?: string | null;
  comments?: string[] | null;
  employeeId: number;
  taskDescription?: string | null;
  userStoryUIId?: number | null;
  createdDate?: Date | null;
  createdBy: string;
  updatedDate?: Date | null;
  employeeName?: string | null;
  updatedBy: string;
  completedTaskCount?: number | null;
  inProgressTaskCount?: number | null;
}
