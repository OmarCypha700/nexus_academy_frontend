import { Suspense } from "react";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading Signup page...</div>}>
      <SignUpForm />
    </Suspense>
  );
}