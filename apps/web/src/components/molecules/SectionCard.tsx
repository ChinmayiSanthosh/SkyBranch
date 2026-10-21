import type { ReactNode } from "react";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  solid?: boolean;
  children: ReactNode;
}

export function SectionCard({ id, title, subtitle, actions, solid = false, children }: SectionCardProps) {
  return (
    <section id={id} className={`${styles.card} ${solid ? styles.solid : ""}`} aria-labelledby={`${id}-title`}>
      <div className={styles.head}>
        <div>
          <h2 id={`${id}-title`} className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </section>
  );
}