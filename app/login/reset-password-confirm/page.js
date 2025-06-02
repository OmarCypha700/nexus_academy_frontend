import { Suspense } from "react";
import ResetPasswordConfirmForm from "@/app/components/ResetPasswordConfirmForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading reset password page...</div>}>
      <ResetPasswordConfirmForm />
    </Suspense>
  );
}