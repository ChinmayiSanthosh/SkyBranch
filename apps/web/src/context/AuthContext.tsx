import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokenStore } from "../services/api";
import type { User } from "../services/types"

interface AuthState {
    user:User|null;
    loading: boolean;
    login:(email:string,password:string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    // On first load, restore the session if a saved token is still valid
    useEffect(() => {
        if (!tokenStore.get()) {
        setLoading(false);
        return;
        }
        api
        .me()
        .then((res) => setUser(res.user))
        .catch(() => tokenStore.clear())
        .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const res = await api.login(email, password);
        tokenStore.set(res.token);
        setUser(res.user);
    }

    function logout() {
        tokenStore.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}