"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
 
  // Update display name when user changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.username || "User");
    }
  }, [user]);

  const handleLogout = () => {
    logout(); // clear tokens and user data
    router.push("/"); // redirect to homepage
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" className="text-lg font-semibold hover:text-gray-300 transition">
        Nexus Academy
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link href="/courses" className="hover:underline">
              Courses
            </Link>
            {user && user.role === "instructor" ? (
              <Link href="/dashboard/instructor" className="hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/dashboard/user" className="hover:underline">
                Dashboard
              </Link>
            )}
            <span className="hidden sm:inline">Welcome, {displayName}</span>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="default">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="text-black border-white hover:bg-black hover:text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}