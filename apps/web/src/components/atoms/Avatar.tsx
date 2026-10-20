import { useEffect, useState } from "react";
import styles from "./Avatar.module.css";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface AvatarProps {
  email: string;
  name?: string;
  size?: number;
}

export function Avatar({ email, name, size = 40 }: AvatarProps) {
  const [hash, setHash] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    sha256Hex(email.trim().toLowerCase()).then((h) => {
      if (active) setHash(h);
    });
    return () => {
      active = false;
    };
  }, [email]);

  const initials = (name ?? email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  // d=404 makes Gravatar return an error when there is no picture, so we show initials instead
  const src = hash ? `https://www.gravatar.com/avatar/${hash}?s=${size * 2}&d=404` : null;

  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {src && !failed ? (
        <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}