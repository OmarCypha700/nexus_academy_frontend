"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/reset-password-confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, token, new_password: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("Password has been reset successfully.");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data?.detail || "Reset failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-red-500">
          Invalid or missing reset link.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Set New Password
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Enter and confirm your new password.
        </p>

        {status && (
          <div className="bg-green-100 text-green-800 text-sm p-3 rounded text-center">
            {status}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
