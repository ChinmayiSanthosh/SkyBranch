import { SectionCard } from "../molecules/SectionCard";
import styles from "./AboutSection.module.css";

const FEATURES = [
  {
    title: "See the tree",
    text: "Your organisation drawn as a branching tree, from the CEO down to every team.",
  },
  {
    title: "Manage people",
    text: "Add, edit and remove employees, and choose who each person reports to.",
  },
  {
    title: "Find anyone",
    text: "Search, sort and filter the roster by any field, from name to salary.",
  },
];

export function AboutSection() {
  return (
    <SectionCard id="about" title="About SkyBranch" subtitle="Grow your org chart">
      <p className={styles.intro}>
        SkyBranch is a cloud-hosted employee hierarchy manager. Every person is a branch, every
        reporting line is a connection, and everything stays in sync with a live database. Nobody
        can be their own manager, and circular reporting chains are blocked.
      </p>
      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <article key={f.title} className={styles.feature}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
      <p className={styles.tech}>
        Built with React, TypeScript, Node.js, Express, Prisma and Neon Postgres. Profile pictures
        come from Gravatar.
      </p>
    </SectionCard>
  );
}