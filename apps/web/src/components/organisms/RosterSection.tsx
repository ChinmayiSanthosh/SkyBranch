import { useState } from "react";
import type { Employee } from "../../services/types";
import { Button } from "../atoms/Button";
import { SearchBox } from "../molecules/SearchBox";
import { SectionCard } from "../molecules/SectionCard";
import { EmployeeTable } from "./EmployeeTable";
import styles from "./RosterSection.module.css";

interface RosterSectionProps {
  employees: Employee[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function RosterSection({
  employees,
  loading,
  error,
  reload,
  onAdd,
  onEdit,
  onDelete,
}: RosterSectionProps) {
  const [search, setSearch] = useState("");

  return (
    <SectionCard
      id="roster"
      title="Roster"
      subtitle={`${employees.length} employees`}
      solid
      actions={
        <>
          <SearchBox value={search} onChange={setSearch} placeholder="Search everyone…" />
          <Button variant="success" onClick={onAdd}>
            + Add employee
          </Button>
        </>
      }
    >
      {error && (
        <div role="alert" className={styles.error}>
          {error}
          <Button small variant="secondary" onClick={reload}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <p>Loading employees…</p>
      ) : (
        <EmployeeTable employees={employees} search={search} onEdit={onEdit} onDelete={onDelete} />
      )}
    </SectionCard>
  );
}