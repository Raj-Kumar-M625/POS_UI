export interface Employee {
  userId?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  category?: string;
  department?: string;
  isActive?: boolean;
}

export interface SessionUser {
  employeeId: number;
  expiration: Date;
  token: string;
  userName: string;
  userRoles: string;
}
