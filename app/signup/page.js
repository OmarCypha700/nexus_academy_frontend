"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:8000/api/auth/register/", {
        username,
        email,
        password,
      });
      router.push("/login");
    } catch (err) {
      setError("Failed to create account");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Image Section (only on desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center bg-[url('/signup-bg.jpg')]"></div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign Up</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-3"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-3"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
