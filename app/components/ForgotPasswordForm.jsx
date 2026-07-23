"use client";

import { useState } from "react";
import axiosInstance from "@/app/lib/axios";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";

/**
 * H4: this page previously didn't exist at all. LoginForm.jsx had a "Forgot password?"
 * link pointing at href="#" (dead), and ResetPasswordConfirmForm.jsx (the *second* half
 * of the flow) already existed and worked, but had nothing upstream of it generating a
 * valid reset link. This is the missing first half.
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      await axiosInstance.post("/auth/reset-password/", { email });
      // Backend intentionally returns the same generic response whether or not the email
      // exists (prevents account enumeration) — so the UI always shows success here too.
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Enter the email associated with your account and we&apos;ll send you a link to
          reset your password.
        </p>

        {status === "sent" ? (
          <div className="bg-green-100 text-green-800 text-sm p-3 rounded text-center">
            If an account with that email exists, a password reset link has been sent.
            Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="bg-red-100 text-red-700 text-sm p-3 rounded text-center">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <p className="text-sm text-center pt-2">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}