"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/app/components/ui/button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Show error from query string (e.g., redirected from protected page)
  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      setError(authError);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        router.push("/courses");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side image (only on desktop) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-100">
        <img
          src="/next.svg" // Replace with your actual image path
          alt="Login illustration"
          className="max-w-md"
        />
      </div>

      {/* Right side login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="bg-white w-full max-w-md p-6 rounded shadow space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
