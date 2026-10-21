import type { Employee } from "../../services/types";
import { formatSalary } from "../../utils/format";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import styles from "./EmployeeDetailPanel.module.css";

interface EmployeeDetailPanelProps {
  employee: Employee;
  reports: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onClose: () => void;
}

export function EmployeeDetailPanel({
  employee,
  reports,
  onEdit,
  onDelete,
  onClose,
}: EmployeeDetailPanelProps) {
  const fullName = `${employee.name} ${employee.surname}`;

  return (
    <aside className={styles.panel} aria-label="Employee details">
      <button type="button" className={styles.close} aria-label="Close details" onClick={onClose}>
        ×
      </button>
      <div className={styles.head}>
        <Avatar email={employee.email} name={fullName} size={56} />
        <div>
          <h3>{fullName}</h3>
          <p className={styles.role}>{employee.role}</p>
        </div>
      </div>
      <dl className={styles.list}>
        <dt>Employee no.</dt>
        <dd>{employee.employeeNumber}</dd>
        <dt>Email</dt>
        <dd>{employee.email}</dd>
        <dt>Salary</dt>
        <dd>{formatSalary(employee.salary)}</dd>
        <dt>Birth date</dt>
        <dd>{employee.birthDate}</dd>
        <dt>Manager</dt>
        <dd>{employee.manager ? `${employee.manager.name} ${employee.manager.surname}` : "None"}</dd>
        <dt>Direct reports</dt>
        <dd>{reports}</dd>
      </dl>
      <div className={styles.actions}>
        <Button small variant="secondary" onClick={() => onEdit(employee)}>
          Edit
        </Button>
        <Button small variant="danger" onClick={() => onDelete(employee)}>
          Delete
        </Button>
      </div>
    </aside>
  );
}