import { NODE_H, NODE_W, type PlacedNode } from "../../utils/tree";
import { Avatar } from "../atoms/Avatar";
import styles from "./TreeNodeCard.module.css";

export type NodeState = "normal" | "match" | "selected" | "dim";

interface TreeNodeCardProps {
  node: PlacedNode;
  state: NodeState;
  onSelect: (node: PlacedNode) => void;
}

export function TreeNodeCard({ node, state, onSelect }: TreeNodeCardProps) {
  const { employee } = node;
  const fullName = `${employee.name} ${employee.surname}`;

  return (
    <foreignObject
      x={node.x - NODE_W / 2}
      y={node.y - NODE_H / 2}
      width={NODE_W}
      height={NODE_H}
      style={{ overflow: "visible" }}
    >
      <button
        type="button"
        className={`${styles.card} ${state !== "normal" ? styles[state] : ""}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onSelect(node)}
        aria-label={`${fullName}, ${employee.role}`}
      >
        <Avatar email={employee.email} name={fullName} size={36} />
        <span className={styles.text}>
          <span className={styles.name}>{fullName}</span>
          <span className={styles.role}>{employee.role}</span>
        </span>
      </button>
    </foreignObject>
  );
}