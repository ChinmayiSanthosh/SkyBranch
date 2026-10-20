import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./ServerStatusBanner.module.css";

export function ServerStatusBanner() {
    const [waking, setWaking] = useState(false);

    useEffect(() => {
  let active = true;

  // Only show the message if the server hasn't answered after 2.5 seconds
  const timer = setTimeout(() => {
    if (active) setWaking(true);
  }, 2500);

  (async () => {
    while (active) {
      try {
        await api.health();
        clearTimeout(timer); // the server answered, so cancel the pending message
        if (active) setWaking(false);
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  })();

  return () => {
    active = false;
    clearTimeout(timer);
  };
}, []);

  if (!waking) return null;
  return (
    <div className={styles.banner} role="status">
      Waking up the server… free hosting sleeps when idle, so this can take up to a minute.
    </div>
  );
}