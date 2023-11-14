import { IBase } from "../Common/BaseModel";

export interface DayPlan extends IBase {
  EmployeeId?: number;
  TaskId?: number;
  ProjectId?: number;
  Name?: string;
  Description?: string;
  WeekEndingDate?: string;
  StartDate?: Date;
  EndDate?: Date;
  EstTime?: number;
  ActTime?: number;
  EstStartDate?: string;
  EstEndDate?: string;
  Status?: string;
  Priority?: string;
  Percentage?: number;
  Comment?: string;
}
