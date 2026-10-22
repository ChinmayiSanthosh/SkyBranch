import { SignupForm } from "../components/organisms/SignupForm";
import { AuthLayout } from "../components/templates/AuthLayout";

export function SignupPage() {
  return (
    <AuthLayout
      title="Create your employee login"
      subtitle="Use the work email your administrator added you with."
    >
      <SignupForm />
    </AuthLayout>
  );
}