import type {Employee,EmployeeInput,User} from "./types";

const BASE_URL =
(import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

const TOKEN_KEY ="skybranch_token";

export const tokenStore = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token:string)  => localStorage.setItem(TOKEN_KEY,token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
    status: number;
    details?:unknown;

    constructor(status:number , message:string, details?:unknown){
        super(message);
        this.status = status;
        this.details = details;
    }

}

async function request<T>(path:string,options:RequestInit = {}):Promise<T> {
    const token = tokenStore.get();
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type":"application/json",
            ...(token ? {Authorization:`Bearer ${token}`}:{}),
            ...options.headers,
        },
    });

    if (response.status === 204) return undefined as T;

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new ApiError(response.status, body.error ?? "Request failed", body.details);
    }
    return body as T;
}



export const api = {
    health: () => request<{ status: string}>("/api/health"),
      signup: (email: string, password: string) =>
        request<{ token: string; user: User }>("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ email, password }),
    }),
    login: (email:string,password:string) => 
        request<{token: string; user:User}>("/api/auth/login",{
            method:"POST",
            body:JSON.stringify({email,password}),
        }),
        me: () => request<{user: User }>("/api/auth/me"),
        listEmployees: () => request<{employees: Employee[]}>("/api/employees"),

        createEmployee: (data:EmployeeInput) =>
            request<{employee:Employee}>("/api/employees", {
                method: "POST",
                body:JSON.stringify(data),
            }),

        updateEmployee:(id:number,data:Partial<EmployeeInput>) =>
            request<{employee:Employee}>(`/api/employees/${id}`,{
                method: "PATCH",
                body:JSON.stringify(data),
            }),
        
        deleteEmployee:(id:number) =>
            request<void>(`/api/employees/${id}`, {method:"DELETE"}),
            
};