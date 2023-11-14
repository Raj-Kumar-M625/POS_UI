export interface UserCreateDto{
    PhoneNumber: string;
    SecondaryPhoneNumber: string;
    UserName: string;
    EmployeeCode?: string;
    Email: string;
    SecondaryEmail?: string;
    Password: string; 
    ConfirmPassword: string;
    Role: string;
    Department: string;
    Category: string;
}

export interface PasswordUpdateDto {
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
  versionCode: string;
}
  