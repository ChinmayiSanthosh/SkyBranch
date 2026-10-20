import { useState } from "react";
import { api, ApiError } from "../../services/api";
import type { Employee } from "../../services/types";
import { Button } from "../atoms/Button";
import { Modal } from "../molecules/Modal";
import styles from "./DeleteEmployeeDialog.module.css";

interface DeleteEmployeeDialogProps {
  employee: Employee;
  onDeleted: () => void;
  onCancel: () => void;
}

export function DeleteEmployeeDialog({ employee, onDeleted, onCancel }: DeleteEmployeeDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await api.deleteEmployee(employee.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server");
      setBusy(false);
    }
  }

  return (
    <Modal title="Delete employee" onClose={onCancel}>
      <p className={styles.text}>
        Delete <strong>{employee.name} {employee.surname}</strong>? This can't be undone. Anyone who
        reports to them will move up to their manager.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" loading={busy} onClick={confirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}