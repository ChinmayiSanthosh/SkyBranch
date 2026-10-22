export type Role = "ADMIN" | "EMPLOYEE";

export interface User {
  id: number;
  email: string;
  role: Role;
  employeeId: number | null;
  mustChangePassword: boolean;
  name: string | null;
}

export interface Employee {
    id:number;
    name:string;
    surname: string;
    email: string;
    birthDate: string;
    employeeNumber: string;
    salary: number | null;
    role: string;
    managerId: number | null;
    manager: { id: number; name: string; surname: string } | null;
}


export interface EmployeeInput{
    name:string;
    surname: string;
    email: string;
    birthDate: string;
    salary: number;
    role: string;
    managerId: number | null;
}