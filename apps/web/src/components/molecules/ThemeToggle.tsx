import { useTheme } from "../../hooks/useTheme";
import { Button } from "../atoms/Button";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="secondary" onClick={toggle}>
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}