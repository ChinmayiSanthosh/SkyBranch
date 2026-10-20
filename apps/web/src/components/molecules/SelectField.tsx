import type { SelectHTMLAttributes } from "react";
import { Select } from "../atoms/Select";
import styles from "./FormField.module.css";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error? :string;
}

export function SelectField({ label, error, id, children, ...rest }: SelectFieldProps) {
    const fieldId = id ?? rest.name ?? label;
    return (
        <div className={styles.field}>
        <label htmlFor={fieldId}>{label} </label>
        <Select id={fieldId} aria-invalid={Boolean(error)} {...rest}>
            {children}
        </Select>
        {error &&(
            <span role="alert" className={styles.error}>
            {error}
            </span>
        )}
        </div>
    );
}