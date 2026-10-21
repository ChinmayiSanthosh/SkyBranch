import type { Employee } from "../services/types";

export interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface PlacedNode {
  id: number;
  employee: Employee;
  x: number;
  y: number;
  depth: number;
  parentId: number | null;
  reports: number;
}

export interface Link {
  from: number;
  to: number;
}

export interface TreeLayout {
  nodes: PlacedNode[];
  links: Link[];
  roots: PlacedNode[];
  groundY: number | null;
  bounds: Bounds;
}

export const NODE_W = 176;
export const NODE_H = 64;
const H_GAP = 32;
const V_GAP = 96;
const SLOT_W = NODE_W + H_GAP;
const LEVEL_H = NODE_H + V_GAP;
const TRUNK_LEN = 28;

// Turns the flat employee list into trees. Anyone with no manager starts a tree.
export function buildForest(employees: Employee[]): TreeNode[] {
  const nodes = new Map<number, TreeNode>(
    employees.map((e) => [e.id, { employee: e, children: [] }])
  );
  const roots: TreeNode[] = [];

  for (const node of nodes.values()) {
    const managerId = node.employee.managerId;
    const parent = managerId !== null ? nodes.get(managerId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortTree = (list: TreeNode[]) => {
    list.sort((a, b) => a.employee.surname.localeCompare(b.employee.surname));
    list.forEach((n) => sortTree(n.children));
  };
  sortTree(roots);
  return roots;
}

// Places every node: leaves get their own slot, and each manager is centred over their team
export function layoutForest(roots: TreeNode[], growUp: boolean): TreeLayout {
  const dir = growUp ? -1 : 1;
  const nodes: PlacedNode[] = [];
  const links: Link[] = [];
  let slot = 0;

  function place(node: TreeNode, depth: number, parentId: number | null): number {
    const id = node.employee.id;
    const childSlots = node.children.map((child) => place(child, depth + 1, id));
    const slotX =
      childSlots.length > 0
        ? (childSlots[0] + childSlots[childSlots.length - 1]) / 2
        : slot++;

    nodes.push({
      id,
      employee: node.employee,
      x: slotX * SLOT_W,
      y: depth * LEVEL_H * dir,
      depth,
      parentId,
      reports: node.children.length,
    });
    if (parentId !== null) links.push({ from: parentId, to: id });
    return slotX;
  }

  roots.forEach((root) => place(root, 0, null));

  const groundY = growUp ? NODE_H / 2 + TRUNK_LEN : null;

  if (nodes.length === 0) {
    return {
      nodes,
      links,
      roots: [],
      groundY,
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    };
  }

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const bounds: Bounds = {
    minX: Math.min(...xs) - NODE_W / 2 - 24,
    maxX: Math.max(...xs) + NODE_W / 2 + 24,
    minY: Math.min(...ys) - NODE_H / 2 - 24,
    maxY: (groundY ?? Math.max(...ys) + NODE_H / 2) + 24,
  };

  return { nodes, links, roots: nodes.filter((n) => n.depth === 0), groundY, bounds };
}
