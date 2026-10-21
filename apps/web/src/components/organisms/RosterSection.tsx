import { useState } from "react";
import type { Employee } from "../../services/types";
import { Button } from "../atoms/Button";
import { Modal } from "../molecules/Modal";
import { SearchBox } from "../molecules/SearchBox";
import { SectionCard } from "../molecules/SectionCard";
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeTable } from "./EmployeeTable";
import styles from "./RosterSection.module.css";

interface RosterSectionProps {
  employees: Employee[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

export function RosterSection({ employees, loading, error, reload }: RosterSectionProps) {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function handleSaved() {
    closeForm();
    reload();
  }

  function handleDeleted() {
    setDeleting(null);
    reload();
  }

  return (
    <>
      <SectionCard
        id="roster"
        title="Roster"
        subtitle={`${employees.length} employees`}
        solid
        actions={
          <>
            <SearchBox value={search} onChange={setSearch} placeholder="Search everyone…" />
            <Button variant="success" onClick={() => setCreating(true)}>
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
          <EmployeeTable
            employees={employees}
            search={search}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        )}
      </SectionCard>

      {(creating || editing) && (
        <Modal title={editing ? "Edit employee" : "Add employee"} onClose={closeForm}>
          <EmployeeForm
            employee={editing ?? undefined}
            employees={employees}
            onSaved={handleSaved}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleting && (
        <DeleteEmployeeDialog
          employee={deleting}
          onDeleted={handleDeleted}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}