import { useAuth } from "../context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  return {
    isAdmin,
    isEmployee: user?.role === "EMPLOYEE",
    canManage: isAdmin, // add, edit, delete
    canSeeSalary: isAdmin,
  };
}