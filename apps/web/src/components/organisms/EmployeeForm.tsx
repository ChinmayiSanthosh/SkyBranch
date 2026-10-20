import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { api, ApiError } from "../../services/api";
import type { Employee, EmployeeInput } from "../../services/types";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import { SelectField } from "../molecules/SelectField";
import styles from "./EmployeeForm.module.css";

interface EmployeeFormProps {
  employee?: Employee;
  employees: Employee[];
  onSaved: () => void;
  onCancel: () => void;
}

interface Values {
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  employeeNumber: string;
  salary: string;
  role: string;
  managerId: string;
}

function toValues(e?: Employee): Values {
  return {
    name: e?.name ?? "",
    surname: e?.surname ?? "",
    email: e?.email ?? "",
    birthDate: e?.birthDate ?? "",
    employeeNumber: e?.employeeNumber ?? "",
    salary: e ? String(e.salary) : "",
    role: e?.role ?? "",
    managerId: e?.managerId ? String(e.managerId) : "",
  };
}

export function EmployeeForm({ employee, employees, onSaved, onCancel }: EmployeeFormProps) {
  const [values, setValues] = useState<Values>(() => toValues(employee));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Nobody can be their own manager, so the person being edited is left out of the list
  const managerOptions = useMemo(
    () =>
      employees
        .filter((e) => e.id !== employee?.id)
        .sort((a, b) => a.surname.localeCompare(b.surname)),
    [employees, employee]
  );

  const set =
    (key: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSaving(true);

    const payload: EmployeeInput = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      birthDate: values.birthDate,
      employeeNumber: values.employeeNumber,
      salary: Number(values.salary),
      role: values.role,
      managerId: values.managerId ? Number(values.managerId) : null,
    };

    try {
      if (employee) await api.updateEmployee(employee.id, payload);
      else await api.createEmployee(payload);
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        if (Array.isArray(err.details)) {
          const mapped: Record<string, string> = {};
          for (const d of err.details as { field?: string; message?: string }[]) {
            if (d.field && d.message && !mapped[d.field]) mapped[d.field] = d.message;
          }
          setFieldErrors(mapped);
        }
        setFormError(
          err.status === 409 ? "That email or employee number is already in use." : err.message
        );
      } else {
        setFormError("Could not reach the server");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <FormField label="Name" name="name" value={values.name} onChange={set("name")} error={fieldErrors.name} required />
        <FormField label="Surname" name="surname" value={values.surname} onChange={set("surname")} error={fieldErrors.surname} required />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={set("email")} error={fieldErrors.email} required />
        <FormField label="Employee number" name="employeeNumber" value={values.employeeNumber} onChange={set("employeeNumber")} error={fieldErrors.employeeNumber} required />
        <FormField label="Role / position" name="role" value={values.role} onChange={set("role")} error={fieldErrors.role} required />
        <FormField label="Salary (ZAR)" name="salary" type="number" min={0} step="0.01" value={values.salary} onChange={set("salary")} error={fieldErrors.salary} required />
        <FormField
          label="Birth date"
          name="birthDate"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={values.birthDate}
          onChange={set("birthDate")}
          error={fieldErrors.birthDate}
          required
        />
        <SelectField label="Reporting manager" name="managerId" value={values.managerId} onChange={set("managerId")} error={fieldErrors.managerId}>
          <option value="">No manager (top of the organisation)</option>
          {managerOptions.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {m.surname} ({m.role})
            </option>
          ))}
        </SelectField>
      </div>

      {formError && (
        <p role="alert" className={styles.formError}>
          {formError}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="success" loading={saving}>
          {employee ? "Save changes" : "Add employee"}
        </Button>
      </div>
    </form>
  );
}