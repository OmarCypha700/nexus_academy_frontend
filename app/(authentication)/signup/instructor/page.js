import { Suspense } from "react";
import InstructorSignUpForm from "@/app/components/InstructorSignUpForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading Instructor Signup page...</div>}>
      <InstructorSignUpForm />
    </Suspense>
  );
}