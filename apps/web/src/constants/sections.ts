export const SECTIONS = [
  { id: "canopy", label: "Canopy" },
  { id: "roster", label: "Roster" },
  { id: "about", label: "About" },
] as const;

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id);