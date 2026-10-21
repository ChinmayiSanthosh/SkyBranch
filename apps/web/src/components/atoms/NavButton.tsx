import type { AnchorHTMLAttributes } from "react";
import styles from "./NavButton.module.css";

interface NavButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export function NavButton({
  active = false,
  children,
  ...rest
}: NavButtonProps) {
  return (
    <a
      className={`${styles.link} ${active ? styles.active : ""}`}
      aria-current={active ? "location" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
