import { useState } from "react";
import { Button } from "../components/atoms/Button";
import { Modal } from "../components/molecules/Modal";
import { SearchBox } from "../components/molecules/SearchBox";
import { DeleteEmployeeDialog } from "../components/organisms/DeleteEmployeeDialog";
import { EmployeeForm } from "../components/organisms/EmployeeForm";
import { EmployeeTable } from "../components/organisms/EmployeeTable";
import { AppLayout } from "../components/templates/AppLayout";
import { useEmployees } from "../hooks/useEmployees";
import type { Employee } from "../services/types";
import styles from "./RosterPage.module.css";

export function RosterPage() {
  const { employees, loading, error, reload } = useEmployees();
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
    <AppLayout>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div>
            <h1>Roster</h1>
            <p className={styles.sub}>{employees.length} employees</p>
          </div>
          <div className={styles.tools}>
            <SearchBox value={search} onChange={setSearch} placeholder="Search everyone…" />
            <Button variant="success" onClick={() => setCreating(true)}>
              + Add employee
            </Button>
          </div>
        </div>

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
      </section>

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
    </AppLayout>
  );
}