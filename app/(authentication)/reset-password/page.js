"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import axiosInstance from "@/app/lib/axios";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setStatus("");

  try {
    const response = await axiosInstance.post("/auth/reset-password/", {
      email,
    });

    setStatus(
      "If an account with that email exists, a reset link has been sent. Please check your inbox."
    );
    setEmail("");
  } catch (err) {
    console.error(err);
    if (err.response?.data?.email?.[0]) {
      setError(err.response.data.email[0]);
    } else {
      setError("An error occurred. Please try again.");
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Your Password</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter your email to receive a password reset link.
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        <div className="text-sm text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
