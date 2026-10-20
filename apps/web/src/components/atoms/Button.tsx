import type {ButtonHTMLAttributes} from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?:"primary"|"secondary"|"success"|"danger";
    loading?:boolean;
}

export function Button({
    variant = "primary",
    loading = false,
    disabled,
    children,
    ...rest
}: 
ButtonProps) {

return (

    <button
    className={`${styles.button} ${styles[variant]}`}
    disabled={disabled || loading}
    {...rest}
    >
    {loading ? "Please wait…" : children}
    </button>
  );
}