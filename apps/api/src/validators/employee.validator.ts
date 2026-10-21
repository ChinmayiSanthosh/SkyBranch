import { z } from "zod";

const MIN_AGE = 18;
const MAX_AGE = 100;
const MIN_SALARY = 500;

// Compares dates in UTC, because the date from the form arrives as midnight UTC
function yearsAgo(years: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear() - years, now.getUTCMonth(), now.getUTCDate()));
}

const employeeFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  surname: z.string().trim().min(1, "Surname is required").max(100),
  email: z.string().trim().toLowerCase().email(),
  birthDate: z.coerce
    .date()
    .refine((d) => d <= new Date(), "Birth date cannot be in the future")
    .refine((d) => d <= yearsAgo(MIN_AGE), `Employees must be at least ${MIN_AGE} years old`)
    .refine((d) => d >= yearsAgo(MAX_AGE), "Birth date is not valid"),
  salary: z
    .number()
    .gt(MIN_SALARY, `Salary must be more than ${MIN_SALARY}`)
    .max(9_999_999_999, "Salary is too large"),
  role: z.string().trim().min(1, "Role is required").max(100),
  managerId: z.number().int().positive().nullable().optional(),
});

// The employee number is assigned by the server, so clients cannot send or change it
export const employeeSchema = employeeFields;

export const updateEmployeeSchema = employeeFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Provide at least one field to update");

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;