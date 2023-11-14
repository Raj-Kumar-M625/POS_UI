import { IBase } from "../Common/BaseModel";

export interface CustomerProject extends IBase {
    Id?:number;
    EmployeeId?: number;
    ProjectId?: number;
    StartDate?: string;
    EndDate?: string;
}