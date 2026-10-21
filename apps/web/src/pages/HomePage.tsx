import { AboutSection } from "../components/organisms/AboutSection";
import { CanopySection } from "../components/organisms/CanopySection";
import { RosterSection } from "../components/organisms/RosterSection";
import { AppLayout } from "../components/templates/AppLayout";
import { useEmployees } from "../hooks/useEmployees";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { employees, loading, error, reload } = useEmployees();

  return (
    <AppLayout>
      <div className={styles.stack}>
        <CanopySection />
        <RosterSection employees={employees} loading={loading} error={error} reload={reload} />
        <AboutSection />
      </div>
    </AppLayout>
  );
}