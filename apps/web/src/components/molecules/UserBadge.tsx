import { Avatar } from "../atoms/Avatar";
import styles from "./UserBadge.module.css";

export function UserBadge({ email }: { email: string }) {
    return (
        <div className={styles.badge}>
        <Avatar email={email} size={36} />
        <span className={styles.email}>{email}</span>
        </div>
    );
}