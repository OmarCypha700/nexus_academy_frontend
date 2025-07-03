import { Suspense } from "react";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      <LoginForm />
    </Suspense>
  );
}