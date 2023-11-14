import { IBase } from "../Common/BaseModel";

export interface EmployeeProject extends IBase {
  EmployeeId?: number;
  ProjectId?: number;
  StartDate?: string;
  EndDate?: string;
}
