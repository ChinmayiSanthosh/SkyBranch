import { Input } from "../atoms/Input";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, onEnter, placeholder = "Search…" }: SearchBoxProps) {
  return (
    <div className={styles.box}>
      <Input
        type="search"
        aria-label="Search employees"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter?.();
        }}
      />
    </div>
  );
}