import { IBase } from "../Common/BaseModel";

export interface PMOScrum extends IBase {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  leadName?: string;
  scrumTime?: Date | null;
  scrumStatus?: string;
  attentationDetails?: Array<string>;
  attendanceStatus?: string | null;
  payAttention?: boolean | null;
  dayId?: number;
  payAttentions?:Array<PayAttention>
}

export interface PMOScrumDto {
  id?: number;
  attendanceStatus?: string;
  payAttention?: boolean;
  scrumStatus?: string;
  payAttentions?: Array<PayAttention>;
}

export interface PayAttention extends IBase {
  id?: number;
  employeeId?: number;
  dayId?: number;
  reason?: string;
  pMOScrumId?: number;
}

export interface EmployeeYesterdayTaskDetailsDTO {
  totalEstTime?: number;
  totalActTime?: number;
  inTime?: string | null;
  outTime?: string | null;
}

export type DialogOptions = {
  employeehistory?: boolean;
  attentiondetails?: boolean;
  scrumdetails?: boolean;
};
