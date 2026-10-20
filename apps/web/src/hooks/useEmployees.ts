import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { Employee } from "../services/types";

export function useEmployees() {
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        try {
            setError("");
            const res = await api.listEmployees();
            setEmployees(res.employees);
        }
        catch{
            setError("Could not load employees. The server may still be waking up, so try again.");
        }
        finally{
            setLoading(false);
        }

    },[]);

    useEffect(() => {
        reload();
    },[reload]);

    return { employees,loading,error,reload};
}