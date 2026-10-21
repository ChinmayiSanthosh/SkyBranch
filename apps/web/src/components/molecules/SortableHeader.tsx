import styles from "./SortableHeader.module.css";

interface SortableHeaderProps {
    label: string;
    active: boolean;
    direction: "asc" | "desc";
    onSort: () => void;
}

export function SortableHeader({ label, active, direction, onSort }: SortableHeaderProps) {

    const ariaSort = active ? (direction === "asc" ? "ascending" : "descending") : "none";
    return (
        <th aria-sort={ariaSort}>
        <button type="button" className={styles.button} onClick={onSort}>
            {label}
            <span aria-hidden="true">{active ? (direction === "asc" ? " ▲" : " ▼") : " ↕"}</span>
        </button>
        </th>
    );
}