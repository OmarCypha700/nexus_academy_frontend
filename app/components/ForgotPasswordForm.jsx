"use client";

import { useState } from "react";
import axiosInstance from "@/app/lib/axios";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";

// First half of the reset flow — sends the email; ResetPasswordConfirmForm handles the link.
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md bg-card rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter the email associated with your account and we&apos;ll send you a link to
          reset your password.
        </p>

        {status === "sent" ? (
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm p-3 rounded text-center">
            If an account with that email exists, a password reset link has been sent.
            Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded text-center">
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
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}