import { useMemo, useState } from "react";
import type { Employee } from "../../services/types";
import { formatSalary } from "../../utils/format";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SortableHeader } from "../molecules/SortableHeader";
import styles from "./EmployeeTable.module.css";

type ColumnKey =
  | "name"
  | "surname"
  | "email"
  | "employeeNumber"
  | "role"
  | "salary"
  | "birthDate"
  | "manager";

interface Column {
  key: ColumnKey;
  label: string;
  text: (e: Employee) => string;
  sortValue: (e: Employee) => string | number;
  display?: (e: Employee) => string;
  numeric?: boolean;
  placeholder?: string;
}

const managerName = (e: Employee) => (e.manager ? `${e.manager.name} ${e.manager.surname}` : "");

const COLUMNS: Column[] = [
  { key: "name", label: "Name", text: (e) => e.name, sortValue: (e) => e.name },
  { key: "surname", label: "Surname", text: (e) => e.surname, sortValue: (e) => e.surname },
  { key: "email", label: "Email", text: (e) => e.email, sortValue: (e) => e.email },
  { key: "employeeNumber", label: "Emp. no.", text: (e) => e.employeeNumber, sortValue: (e) => e.employeeNumber },
  { key: "role", label: "Role", text: (e) => e.role, sortValue: (e) => e.role },
  {
    key: "salary",
    label: "Salary",
    text: (e) => String(e.salary),
    sortValue: (e) => e.salary,
    display: (e) => formatSalary(e.salary),
    numeric: true,
    placeholder: ">100000",
  },
  { key: "birthDate", label: "Birth date", text: (e) => e.birthDate, sortValue: (e) => e.birthDate, placeholder: "e.g. 1995" },
  { key: "manager", label: "Manager", text: managerName, sortValue: managerName, display: (e) => managerName(e) || "—" },
];

// Text columns match "contains". The salary column also understands >, >=, <, <= and =
function matchesColumn(column: Column, employee: Employee, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (column.numeric) {
    const m = q.match(/^(>=|<=|>|<|=)\s*(\d+(?:\.\d+)?)$/);
    if (m) {
      const value = column.sortValue(employee) as number;
      const n = Number(m[2]);
      switch (m[1]) {
        case ">": return value > n;
        case ">=": return value >= n;
        case "<": return value < n;
        case "<=": return value <= n;
        default: return value === n;
      }
    }
  }
  return column.text(employee).toLowerCase().includes(q);
}

interface EmployeeTableProps {
  employees: Employee[];
  search: string;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({ employees, search, onEdit, onDelete }: EmployeeTableProps) {
  const [sort, setSort] = useState<{ key: ColumnKey; dir: "asc" | "desc" }>({
    key: "surname",
    dir: "asc",
  });
  const [filters, setFilters] = useState<Partial<Record<ColumnKey, string>>>({});

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    const filtered = employees.filter((e) => {
      if (s && !COLUMNS.some((c) => c.text(e).toLowerCase().includes(s))) return false;
      return COLUMNS.every((c) => matchesColumn(c, e, filters[c.key] ?? ""));
    });

    const column = COLUMNS.find((c) => c.key === sort.key)!;
    return [...filtered].sort((x, y) => {
      const a = column.sortValue(x);
      const b = column.sortValue(y);
      const result =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
      return sort.dir === "asc" ? result : -result;
    });
  }, [employees, search, filters, sort]);

  function toggleSort(key: ColumnKey) {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th aria-label="Avatar" />
              {COLUMNS.map((c) => (
                <SortableHeader
                  key={c.key}
                  label={c.label}
                  active={sort.key === c.key}
                  direction={sort.dir}
                  onSort={() => toggleSort(c.key)}
                />
              ))}
              <th>Actions</th>
            </tr>
            <tr className={styles.filters}>
              <th />
              {COLUMNS.map((c) => (
                <th key={c.key}>
                  <Input
                    aria-label={`Filter by ${c.label}`}
                    placeholder={c.placeholder ?? "Filter"}
                    value={filters[c.key] ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}
                  />
                </th>
              ))}
              <th>
                <Button small variant="secondary" onClick={() => setFilters({})}>
                  Clear
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>
                  <Avatar email={e.email} name={`${e.name} ${e.surname}`} size={32} />
                </td>
                {COLUMNS.map((c) => (
                  <td key={c.key}>{c.display ? c.display(e) : c.text(e)}</td>
                ))}
                <td>
                  <div className={styles.actions}>
                    <Button small variant="secondary" onClick={() => onEdit(e)}>
                      Edit
                    </Button>
                    <Button small variant="danger" onClick={() => onDelete(e)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className={styles.empty}>No employees match your filters.</div>}
      </div>
      <p className={styles.footer}>
        Showing {rows.length} of {employees.length}
      </p>
    </div>
  );
}