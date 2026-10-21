export const MIN_AGE = 18;
export const MAX_AGE = 100;
export const MIN_SALARY = 500;

const pad = (n: number) => String(n).padStart(2, "0");

// The date exactly N years before today, as YYYY-MM-DD (what a date input expects)
export function isoDateYearsAgo(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function validateBirthDate(value: string): string | undefined {
  if (!value) return "Birth date is required";
  if (value > isoDateYearsAgo(0)) return "Birth date cannot be in the future";
  if (value > isoDateYearsAgo(MIN_AGE))
    return `Employees must be at least ${MIN_AGE} years old`;
  if (value < isoDateYearsAgo(MAX_AGE)) return "Birth date is not valid";
  return undefined;
}

export function validateSalary(value: string): string | undefined {
  if (value.trim() === "") return "Salary is required";
  const n = Number(value);
  if (!Number.isFinite(n)) return "Salary must be a number";
  if (n <= MIN_SALARY) return `Salary must be more than ${MIN_SALARY}`;
  return undefined;
}
