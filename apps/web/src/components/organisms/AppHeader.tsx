import { SECTIONS, SECTION_IDS } from "../../constants/sections";
import { useAuth } from "../../context/AuthContext";
import { useActiveSection } from "../../hooks/useActiveSection";
import { scrollToSection } from "../../utils/scroll";
import { Button } from "../atoms/Button";
import { Logo } from "../atoms/Logo";
import { NavMenu } from "../molecules/NavMenu";
import { UserBadge } from "../molecules/UserBadge";
import styles from "./AppHeader.module.css";

export function AppHeader() {
  const { user, logout } = useAuth();
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo size={34} />
        <span>SkyBranch</span>
      </div>
      <NavMenu items={SECTIONS} active={active} onNavigate={scrollToSection} />
      <div className={styles.actions}>
        {user && <UserBadge email={user.email} />}
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}