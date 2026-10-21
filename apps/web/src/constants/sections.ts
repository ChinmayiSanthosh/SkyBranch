export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "canopy", label: "Canopy" },
  { id: "roster", label: "Roster" },
] as const;

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id);