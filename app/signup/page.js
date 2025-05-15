"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axios";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/register/", formData);
      if (response.status === 201 || response.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image - visible only on md and above */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-100">
         <img
          src="/next.svg" // Replace with your actual image path
          alt="Signin illustration"
          className="max-w-md"
        />
        
      </div>

      {/* Form Section */}
      <div className="flex flex-1 justify-center items-center px-6 py-12 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Your Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
