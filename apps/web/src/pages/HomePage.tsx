import { useState } from "react";
import { Modal } from "../components/molecules/Modal";
import { AboutSection } from "../components/organisms/AboutSection";
import { CanopySection } from "../components/organisms/CanopySection";
import { DeleteEmployeeDialog } from "../components/organisms/DeleteEmployeeDialog";
import { EmployeeForm } from "../components/organisms/EmployeeForm";
import { RosterSection } from "../components/organisms/RosterSection";
import { AppLayout } from "../components/templates/AppLayout";
import { useEmployees } from "../hooks/useEmployees";
import type { Employee } from "../services/types";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { employees, loading, error, reload } = useEmployees();
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
      <div className={styles.stack}>
        <CanopySection
          employees={employees}
          loading={loading}
          onAdd={() => setCreating(true)}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
        <RosterSection
          employees={employees}
          loading={loading}
          error={error}
          reload={reload}
          onAdd={() => setCreating(true)}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
        <AboutSection />
      </div>

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