import { useEffect, useState } from "react";
import { AppLayout } from "../components/templates/AppLayout";
import { api } from "../services/api";

export function DashboardPage() {
    const [count, setCount] = useState<number | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        api
        .listEmployees()
        .then((res) => setCount(res.employees.length))
        .catch(() => setFailed(true));
    }, []);

    return (
        <AppLayout>
            <section className="glass" style={{ padding: "1.5rem", display: "grid", gap: "0.5rem" }}>
                <h1>Welcome to SkyBranch</h1>
                <p>
                Employees in the database:{" "}
                {failed ? "could not load" : count === null ? "loading…" : count}
                </p>
            </section>
        </AppLayout>
    );
}