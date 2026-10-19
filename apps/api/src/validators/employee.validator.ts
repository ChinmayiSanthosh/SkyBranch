import {z} from "zod";

export const employeeSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    surname: z.string().trim().min(1, "Surname is required").max(100),
    email: z.string().trim().toLowerCase().email(),
    birthDate: z.coerce
    .date()
    .refine((d) => d <= new Date(), "Birth date cannot be in the future")
    .refine((d) => d.getFullYear() >= 1900, "Birth date is not valid"),
    employeeNumber:z.string().trim().min(1, "Employee number is required").max(30),
    salary :z.number().min(0,"Salary cannot be negative").max(9_999_999_999),
    role: z.string().trim().min(1,"Role is required").max(100),
    managerId: z.number().int().positive().nullable().optional(),

});

export const updateEmployeeSchema = employeeSchema
.partial()
.refine((data) => Object.keys(data).length > 0, "Provide at least one field to update");


export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;