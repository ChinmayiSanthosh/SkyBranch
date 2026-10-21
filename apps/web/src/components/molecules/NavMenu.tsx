import { NavButton } from "../atoms/NavButton";
import styles from "./NavMenu.module.css";

interface NavMenuProps {
  items: readonly { id: string; label: string }[];
  active: string;
  onNavigate: (id: string) => void;
}

export function NavMenu({ items, active, onNavigate }: NavMenuProps) {
  return (
    <nav className={styles.nav} aria-label="Main">
      {items.map((item) => (
        <NavButton
          key={item.id}
          href={`#${item.id}`}
          active={active === item.id}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(item.id);
          }}
        >
          {item.label}
        </NavButton>
      ))}
    </nav>
  );
}