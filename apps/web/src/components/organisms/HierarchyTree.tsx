import { useEffect, useMemo, useRef, useState } from "react";
import { usePanZoom } from "../../hooks/usePanZoom";
import type { Employee } from "../../services/types";
import { NODE_H, buildForest, layoutForest, type PlacedNode } from "../../utils/tree";
import StarBorder from "../atoms/StarBorder";
import { TreeNodeCard, type NodeState } from "../molecules/TreeNodeCard";
import { ZoomControls } from "../molecules/ZoomControls";
import { EmployeeDetailPanel } from "./EmployeeDetailPanel";
import styles from "./HierarchyTree.module.css";

interface HierarchyTreeProps {
  employees: Employee[];
  growUp: boolean;
  search: string;
  cursor: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function branchPath(parent: PlacedNode, child: PlacedNode, growUp: boolean) {
  const dir = growUp ? -1 : 1;
  const startY = parent.y + (dir * NODE_H) / 2;
  const endY = child.y - (dir * NODE_H) / 2;
  const midY = (startY + endY) / 2;
  return `M ${parent.x} ${startY} C ${parent.x} ${midY}, ${child.x} ${midY}, ${child.x} ${endY}`;
}

function matchesQuery(e: Employee, query: string) {
  return [e.name, e.surname, `${e.name} ${e.surname}`, e.email, e.employeeNumber, e.role]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

export function HierarchyTree({
  employees,
  growUp,
  search,
  cursor,
  onEdit,
  onDelete,
}: HierarchyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const layout = useMemo(() => layoutForest(buildForest(employees), growUp), [employees, growUp]);
  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout]);

  const { view, animate, dragging, size, fit, focus, zoomBy, bind } = usePanZoom(
    containerRef,
    layout.bounds
  );

  const query = search.trim().toLowerCase();
  const matches = useMemo(
    () =>
      query ? layout.nodes.filter((n) => matchesQuery(n.employee, query)).map((n) => n.id) : [],
    [layout, query]
  );
  const matchSet = useMemo(() => new Set(matches), [matches]);

  // Fit the whole tree on first load, and again when the tree is flipped
  const fitted = useRef(false);
  const lastDirection = useRef(growUp);
  useEffect(() => {
    if (lastDirection.current !== growUp) {
      lastDirection.current = growUp;
      fitted.current = false;
    }
    if (!fitted.current && size.w > 0 && layout.nodes.length > 0) {
      fitted.current = true;
      fit(layout.bounds);
    }
  }, [growUp, size.w, layout, fit]);

  // Glide to the current search match
  useEffect(() => {
    if (matches.length === 0) return;
    const target = byId.get(matches[cursor % matches.length]);
    if (target) focus(target.x, target.y, 1);
  }, [matches, cursor, byId, focus]);

  // Centre the selected person. This also re-runs when the details column opens or closes
  // and the canvas changes width, so the person always stays in view.
  useEffect(() => {
    if (selectedId === null) return;
    const node = byId.get(selectedId);
    if (node) focus(node.x, node.y, 1);
  }, [selectedId, size.w, size.h, byId, focus]);

  function stateFor(id: number): NodeState {
    if (id === selectedId) return "selected";
    if (query) return matchSet.has(id) ? "match" : "dim";
    return "normal";
  }

  const groundY = layout.groundY;
  const selected = selectedId !== null ? byId.get(selectedId) : undefined;
  const isEmpty = layout.nodes.length === 0;

  return (
    <div>
      <div className={`${styles.layout} ${selected ? styles.withPanel : ""}`}>
        {/* StarBorder owns its own ref, so the pan/zoom container sits inside it */}
        <StarBorder
          as="div"
          className={styles.frame}
          radius={12}
          theme="dark"
          color="#ffffff"
          borderColor="rgba(63, 79, 116, 0.22)"
          thickness={1.5}
          duration={12}
          glow={1}
        >
          <div ref={containerRef} className={styles.canvas}>
            {isEmpty ? (
              <div className={styles.empty}>
                <p>No employees yet. Add the first one to plant the tree.</p>
              </div>
            ) : (
              <>
                <svg
                  className={`${styles.svg} ${dragging ? styles.dragging : ""}`}
                  width="100%"
                  height="100%"
                  role="group"
                  aria-label="Organisation tree"
                  {...bind}
                >
                  <g
                    style={{
                      transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
                      transformOrigin: "0 0",
                      transition: animate && !dragging ? "transform 0.6s ease" : "none",
                    }}
                  >
                    {groundY !== null && (
                      <>
                        <line
                          x1={layout.bounds.minX}
                          x2={layout.bounds.maxX}
                          y1={groundY}
                          y2={groundY}
                          className={styles.ground}
                        />
                        {layout.roots.map((root) => (
                          <line
                            key={`trunk-${root.id}`}
                            x1={root.x}
                            x2={root.x}
                            y1={NODE_H / 2}
                            y2={groundY}
                            strokeWidth={9}
                            className={styles.trunk}
                          />
                        ))}
                      </>
                    )}

                    {layout.links.map((link) => {
                      const from = byId.get(link.from);
                      const to = byId.get(link.to);
                      if (!from || !to) return null;
                      return (
                        <path
                          key={`${link.from}-${link.to}`}
                          d={branchPath(from, to, growUp)}
                          strokeWidth={Math.max(1.6, 7 - to.depth * 1.5)}
                          className={styles.branch}
                        />
                      );
                    })}

                    {layout.nodes.map((node) => (
                      <TreeNodeCard
                        key={node.id}
                        node={node}
                        state={stateFor(node.id)}
                        onSelect={(n) => setSelectedId(n.id)}
                      />
                    ))}
                  </g>
                </svg>

                <ZoomControls
                  onZoomIn={() => zoomBy(1.25)}
                  onZoomOut={() => zoomBy(0.8)}
                  onFit={() => fit(layout.bounds)}
                />
              </>
            )}
          </div>
        </StarBorder>

        {selected && (
          <EmployeeDetailPanel
            employee={selected.employee}
            reports={selected.reports}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <p className={styles.hint}>
        Drag to pan · Ctrl + scroll or the + / − buttons to zoom · click a person for details
        {query && matches.length > 0 && ` · ${matches.length} match${matches.length === 1 ? "" : "es"}, press Enter for the next`}
        {query && matches.length === 0 && " · no matches"}
      </p>
    </div>
  );
}