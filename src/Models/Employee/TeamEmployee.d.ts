import { IBase } from "../Common/BaseModel";

export interface TeamEmployee extends IBase {
  TeamId?: number;
  EmployeeId?: number;
  LeadId?: number;
  StartDate?: Date;
  EndDate?: string;
}
