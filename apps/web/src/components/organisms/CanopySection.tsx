import { useState } from "react";
import { usePermissions } from "../../hooks/usePermissions";
import type { Employee } from "../../services/types";
import { Button } from "../atoms/Button";
import { SearchBox } from "../molecules/SearchBox";
import { SectionCard } from "../molecules/SectionCard";
import { HierarchyTree } from "./HierarchyTree";

interface CanopySectionProps {
  employees: Employee[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function CanopySection({ employees, loading, onAdd, onEdit, onDelete }: CanopySectionProps) {
  const { canManage } = usePermissions();
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(0);
  const [growUp, setGrowUp] = useState(true);

  function handleSearch(value: string) {
    setSearch(value);
    setCursor(0);
  }

  return (
    <SectionCard
      id="canopy"
      title="Canopy"
      subtitle="Your organisation as a living tree"
      actions={
        <>
          <SearchBox
            value={search}
            onChange={handleSearch}
            onEnter={() => setCursor((c) => c + 1)}
            placeholder="Find someone in the tree…"
          />
          <Button variant="secondary" onClick={() => setGrowUp((g) => !g)}>
            Flip tree
          </Button>
          {canManage && (
            <Button variant="success" onClick={onAdd}>
              + Add employee
            </Button>
          )}
        </>
      }
    >
      {loading ? (
        <p>Growing the tree…</p>
      ) : (
        <HierarchyTree
          employees={employees}
          growUp={growUp}
          search={search}
          cursor={cursor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </SectionCard>
  );
}