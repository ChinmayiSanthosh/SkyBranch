import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../services/api";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import styles from "./SignupForm.module.css";

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await signup(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        const details = err.details as { message?: string }[] | undefined;
        setError(details?.[0]?.message ?? err.message);
      } else {
        setError("Could not reach the server");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormField
        label="Choose a password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormField
        label="Repeat password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={error}
        required
      />
      <Button type="submit" loading={saving}>
        Create my login
      </Button>
      <p className={styles.switch}>
        Already have a login? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}