export interface User {
    id:number;
    email:string;
}

export interface Employee {
    id:number;
    name:string;
    surname: string;
    email: string;
    birthDate: string;
    employeeNumber: string;
    salary: number;
    role: string;
    managerId: number | null;
    manager: { id: number; name: string; surname: string } | null;
}