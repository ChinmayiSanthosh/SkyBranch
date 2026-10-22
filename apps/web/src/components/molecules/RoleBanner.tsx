import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import styles from "./RoleBanner.module.css";

export function RoleBanner() {
  const { user } = useAuth();
  const { isEmployee } = usePermissions();
  if (!isEmployee) return null;

  return (
    <div className={styles.banner} role="status">
      <strong>You are signed in as an employee{user?.name ? ` (${user.name})` : ""}.</strong>{" "}
      This is a view-only account: salaries are hidden and you cannot add, edit or delete anyone.
    </div>
  );
}