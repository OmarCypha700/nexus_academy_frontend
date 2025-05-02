"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [initials, setInitials] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const names = user.username?.split(" ") || [];
      const initials = names.map((n) => n[0]).join("").toUpperCase();
      setInitials(initials || "U");
    }
  }, [user]);

  const dashboardPath =
  user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/user";

  const navLinks = [
    { name: "Dashboard", path: dashboardPath },
    { name: "Courses", path: "/courses" },
    { name: "Prices", path: "/prices" },
    { name: "Chat", path: "/chat" },
    { name: "Payment", path: "/payment" },
  ];

  const isActive = (path) => pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#f8f7fc] border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <GraduationCap className="text-black w-6 h-6" />
          <span className="font-bold text-lg text-black">Nexus Academy</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <div className="bg-white rounded-full px-3 py-2 flex gap-2 items-center shadow">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    isActive(link.path)
                      ? "bg-black text-white"
                      : "text-black hover:text-gray-600"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </div>

          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="text-black border-white hover:bg-black hover:text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer">
                  {initials}
                </div>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-2">
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 space-y-2 bg-white p-4 rounded shadow">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} onClick={() => setIsMenuOpen(false)}>
              <div
                className={`block px-4 py-2 rounded ${
                  isActive(link.path)
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {link.name}
              </div>
            </Link>
          ))}

          <div className="mt-4 border-t pt-3 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="default" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full text-black border-white hover:bg-black hover:text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer">
                    {initials}
                  </div>
                </Link>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
