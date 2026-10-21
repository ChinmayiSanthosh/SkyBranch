import { SectionCard } from "../molecules/SectionCard";
import styles from "./CanopySection.module.css";

export function CanopySection() {
  return (
    <SectionCard id="canopy" title="Canopy" subtitle="Your organisation as a living tree">
      <div className={styles.placeholder}>
        <p>The tree view will grow here.</p>
      </div>
    </SectionCard>
  );
}