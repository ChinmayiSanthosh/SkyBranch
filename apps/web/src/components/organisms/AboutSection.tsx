import { useMemo } from "react";
import { usePermissions } from "../../hooks/usePermissions";
import type { Employee } from "../../services/types";
import { formatSalary } from "../../utils/format";
import StarBorder from "../atoms/StarBorder";
import { GrowingTree } from "../molecules/GrowingTree";
import styles from "./AboutSection.module.css";

// Shared look for every star-bordered card
const STAR = {
  theme: "dark",
  color: "#ffffff",
  borderColor: "rgba(63, 79, 116, 0.22)",
  thickness: 1.5,
  duration: 12,
  glow: 1,
} as const;

const FEATURES = [
  { title: "See the tree", text: "Your organisation drawn as a branching tree, from the CEO down to every team." },
  { title: "Manage people", text: "Add, edit and remove employees, and choose who each person reports to." },
  { title: "Find anyone", text: "Search, sort and filter the roster by any field, from name to salary." },
];

interface AboutSectionProps {
  employees: Employee[];
  loading: boolean;
}

function computeStats(employees: Employee[]) {
  const managerOf = new Map(employees.map((e) => [e.id, e.managerId]));
  const managers = new Set<number>();
  const roles = new Set<string>();
  let total = 0;
  let deepest = 0;

  for (const e of employees) {
    total += e.salary ?? 0;
    roles.add(e.role.trim().toLowerCase());
    if (e.managerId) managers.add(e.managerId);

    // Count how many steps up to the top. The guard stops a bad data loop.
    let depth = 1;
    let current = e.managerId;
    while (current && depth <= employees.length) {
      depth += 1;
      current = managerOf.get(current) ?? null;
    }
    deepest = Math.max(deepest, depth);
  }

  return {
    people: employees.length,
    managers: managers.size,
    levels: employees.length ? deepest : 0,
    roles: roles.size,
    average: employees.length ? total / employees.length : 0,
  };
}

export function AboutSection({ employees, loading }: AboutSectionProps) {
  const { canSeeSalary } = usePermissions();
  const stats = useMemo(() => computeStats(employees), [employees]);
  const show = (value: string | number) => (loading ? "—" : value);

  const rows = [
    { label: "People", value: show(stats.people) },
    { label: "Managers", value: show(stats.managers) },
    { label: "Levels deep", value: show(stats.levels) },
    { label: "Distinct roles", value: show(stats.roles) },
    ...(canSeeSalary
      ? [{ label: "Average salary", value: show(stats.people ? formatSalary(stats.average) : "—") }]
      : []),
  ];

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`${styles.panel} ${styles.main}`}>
        <div>
          <h2 id="about-title" className={styles.title}>About SkyBranch</h2>
          <p className={styles.sub}>Grow your org chart</p>
        </div>
        <p className={styles.text}>
          SkyBranch is a cloud-hosted employee hierarchy manager. Every person is a branch, every
          reporting line is a connection, and everything stays in sync with a live database. Nobody
          can be their own manager, and circular reporting chains are blocked.
        </p>

        <div className={styles.body}>
          <div className={styles.stack}>
            {FEATURES.map((f) => (
              <StarBorder
                as="article"
                key={f.title}
                className={styles.feature}
                radius={10}
                sync
                hover="brighten"
                {...STAR}
              >
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </StarBorder>
            ))}
          </div>
          <div className={styles.treeWrap}>
            <GrowingTree />
          </div>
        </div>

        <p className={styles.tech}>
          Built with React, TypeScript, Node.js, Express, Prisma and Neon Postgres. Profile pictures
          come from Gravatar.
        </p>
      </div>

      <StarBorder
        as="aside"
        className={`${styles.panel} ${styles.statsCard}`}
        radius={18} /* must equal var(--radius) in px */
        aria-labelledby="stats-title"
        {...STAR}
      >
        <header className={styles.statsHead}>
          <div>
            <p className={styles.eyebrow}>Overview</p>
            <h3 id="stats-title" className={styles.statsTitle}>Organisation at a glance</h3>
          </div>
          <span className={styles.live}>Live</span>
        </header>
        <dl className={styles.statList} aria-live="polite">
          {rows.map((r) => (
            <div key={r.label} className={styles.statRow}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </StarBorder>
    </section>
  );
}