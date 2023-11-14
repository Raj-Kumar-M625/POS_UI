export type EmployeeLeave = {
    id?: number;
    employeeId?: number;
    leaveType?: string;
    leaveSubType?: string;
    createdDate?: Date;
    leaveRequestDate?: Date[];
    leaveStatus?: string;
    leaveReason?: string;
    leaveHistory?: EmployeeLeaveHistory[];
    employeeName?: string;
  }
  
  export type EmployeeLeaveHistory = {
    leaveId?: number;
    employeeId?: number;
    leaveRequestDate?: Date | null;
    approveStatus?: string | null;
    approvedBy?: string | null;
    rejectedReason?: string | null;
  }