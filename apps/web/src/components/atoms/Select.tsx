import type {SelectHTMLAttributes} from "react";
import styles from "./Select.module.css"

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select className={styles.select} {...props} />;
}