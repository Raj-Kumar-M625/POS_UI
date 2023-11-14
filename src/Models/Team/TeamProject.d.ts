import { IBase } from "../Common/BaseModel";

export interface TeamProject extends IBase {
  ProjectName?: string;
  TeamId?: number;
  ProjectId?: number;
  StartDate?: string;
  EndDate?: string;
}
