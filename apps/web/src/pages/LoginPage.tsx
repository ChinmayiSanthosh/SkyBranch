import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../components/organisms/LoginForm";
import { AuthLayout } from "../components/templates/AuthLayout";


export function LoginPage() {
    const { user,loading} = useAuth();
    if(!loading && user) return <Navigate to="/" replace/>;

    return(
        <AuthLayout title="SkyBranch" subtitle="Sign in to grow your org chart">
            <LoginForm/>
        </AuthLayout>
    );
}