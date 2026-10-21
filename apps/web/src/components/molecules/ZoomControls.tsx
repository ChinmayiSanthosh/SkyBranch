import { Button } from "../atoms/Button";
import styles from "./ZoomControls.module.css";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut, onFit }: ZoomControlsProps) {
  return (
    <div className={styles.controls} role="group" aria-label="Zoom controls">
      <Button small variant="secondary" aria-label="Zoom in" onClick={onZoomIn}>
        +
      </Button>
      <Button small variant="secondary" aria-label="Zoom out" onClick={onZoomOut}>
        −
      </Button>
      <Button small variant="secondary" aria-label="Fit the whole tree" onClick={onFit}>
        Fit
      </Button>
    </div>
  );
}