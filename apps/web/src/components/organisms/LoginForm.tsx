import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../services/api";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import styles from "./LoginForm.module.css";


export function LoginForm(){
    const {login} = useAuth();
    const[email,setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
        await login(email, password);
    } catch (err) {
        if (err instanceof ApiError) {
            const details = err.details as { message?: string }[] | undefined;
            setError(details?.[0]?.message ?? err.message);
        } 
        else {
        setError("Could not reach the server");
        }
    } 
    finally {
        setSubmitting(false);
    }
}

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <FormField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                required
            />
            <Button type="submit" loading={submitting}>
                Sign in
            </Button>
            </form>
        );
}

