import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../atoms/Button";
import { Logo } from "../atoms/Logo";
import { UserBadge } from "../molecules/UserBadge";
import styles from "./AppHeader.module.css";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo size={34} />
        <span>SkyBranch</span>
      </div>
      <nav className={styles.nav} aria-label="Main">
        <NavLink
          to="/roster"
          className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
        >
          Roster
        </NavLink>
      </nav>
      <div className={styles.actions}>
        {user && <UserBadge email={user.email} />}
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}