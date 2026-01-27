"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import clsx from "clsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [initials, setInitials] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.username) {
      const initials = (user?.last_name?.[0] || "P") + (user?.first_name?.[0] || "")
      setInitials(initials);
    }
  }, [user]);

  const dashboardPath =
    user?.role === "instructor" ? "/dashboard/instructor/overview" : "/dashboard/user";

  const navLinks = [
    { name: "Dashboard", path: dashboardPath },
    { name: "Courses", path: "/courses" },
    // { name: "Pricing", path: "/prices" },
  ];

  const isActive = (path) => pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur bg-white/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-black" />
            <span className="text-xl font-bold text-gray-900">Nexus Academy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={clsx(
                  "text-sm font-medium transition px-3 py-1 rounded-full",
                  isActive(link.path)
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-blue-100"
                )}
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white font-semibold">
                    {initials}
                  </div>
                </Link>
                <Button size="sm" variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Menu */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 shadow-lg md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-900">Menu</span>
            <button onClick={toggleMenu}>
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "text-base px-4 py-2 rounded transition",
                  isActive(link.path)
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-blue-100"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    {initials}
                  </div>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}
    </>
  );
}
