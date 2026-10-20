import type { InputHTMLAttributes } from "react";
import { Input } from "../atoms/Input";
import styles from "./FormField.module.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function FormField({ label, error, id, ...rest }: FormFieldProps) {
    const fieldId = id ?? rest.name ?? label;
    return (
        <div className={styles.field}>
        <label htmlFor={fieldId}>{label}</label>
        <Input id={fieldId} aria-invalid={Boolean(error)} {...rest} />
        {error && (
            <span role="alert" className={styles.error}>
            {error}
            </span>
        )}
        </div>
    );
}