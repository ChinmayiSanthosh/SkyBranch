import type { CSSProperties } from "react";
import styles from "./GrowingTree.module.css";

// How much taller the bare trunk is before the branches start (SVG units).
// Raise it for a longer trunk. The whole tree scales down a little to fit the same space.
const LIFT = 180;

// How much later the branches start, so the trunk finishes growing first (seconds)
const CROWN_DELAY = 0.5;

// The crown is drawn once, then moved up by LIFT.
// d = path, w = stroke width, t = seconds before it starts growing
const BRANCHES = [
  { d: "M199 167.5 C186 137.5 150 122.5 118 73", w: 6, t: 0.9 },
  { d: "M200 145 C216 112 256 97 288 46", w: 6, t: 1.1 },
  { d: "M198 112 C196 73 186 34 170 -8", w: 5, t: 1.3 },
  { d: "M201 100 C206 61 222 25 238 -14", w: 5, t: 1.45 },
  { d: "M118 73 C108 52 98 37 88 13", w: 3, t: 2.0 },
  { d: "M118 73 C134 52 140 31 143 7", w: 3, t: 2.1 },
  { d: "M288 46 C296 25 304 10 316 -2", w: 3, t: 2.2 },
  { d: "M288 46 C272 28 264 13 260 -8", w: 3, t: 2.3 },
  { d: "M170 -8 C160 -26 156 -41 154 -59", w: 2.5, t: 2.4 },
  { d: "M238 -14 C246 -32 250 -47 252 -65", w: 2.5, t: 2.5 },
];

// x, y, size, delay, colour
const LEAVES = [
  [88, 13, 13, 2.9, "leaf"], [143, 7, 12, 3.0, "coral"], [118, 67, 10, 3.1, "leaf"],
  [316, -2, 13, 3.1, "coral"], [260, -8, 12, 3.2, "leaf"], [288, 40, 10, 3.3, "leaf"],
  [154, -59, 12, 3.3, "leaf"], [252, -65, 12, 3.4, "coral"], [170, -11, 10, 3.4, "leaf"],
  [238, -17, 10, 3.5, "leaf"], [200, 79, 11, 3.5, "coral"], [100, 28, 8, 3.6, "coral"],
  [304, 13, 8, 3.7, "leaf"], [196, 25, 9, 3.7, "leaf"], [222, 22, 9, 3.8, "coral"],
] as const;

// The trunk now reaches up to where the (raised) crown begins
const TRUNK_TOP = 85 - LIFT;
const TRUNK_SPAN = 280 - TRUNK_TOP;
const TRUNK = `M200 280 C200 ${280 - TRUNK_SPAN * 0.35} 194 ${280 - TRUNK_SPAN * 0.62} 200 ${TRUNK_TOP}`;

export function GrowingTree() {
  return (
    <svg
      className={styles.tree}
      viewBox={`68 ${-95 - LIFT} 264 ${385 + LIFT}`}
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label="A tree growing branch by branch"
    >
      <line x1="72" x2="328" y1="280" y2="280" className={styles.ground} />

      {/* trunk */}
      <path
        d={TRUNK}
        pathLength={1}
        strokeWidth={10}
        className={styles.branch}
        style={{ "--t": "0.1s" } as CSSProperties}
      />

      {/* crown, lifted up the trunk */}
      <g transform={`translate(0 ${-LIFT})`}>
        {BRANCHES.map((b) => (
          <path
            key={b.d}
            d={b.d}
            pathLength={1}
            strokeWidth={b.w}
            className={styles.branch}
            style={{ "--t": `${b.t + CROWN_DELAY}s` } as CSSProperties}
          />
        ))}

        {LEAVES.map(([x, y, r, t, tone], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            className={`${styles.leaf} ${tone === "coral" ? styles.coral : ""}`}
            style={{
              "--t": `${t + CROWN_DELAY}s`,
              transformOrigin: `${x}px ${y}px`,
            } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}