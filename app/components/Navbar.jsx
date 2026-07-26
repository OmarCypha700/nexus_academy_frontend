"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import ThemeToggle from "@/app/components/ThemeToggle";
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
      <nav className="sticky top-3 z-50 mx-3 md:mx-6 lg:mx-auto lg:max-w-6xl backdrop-blur bg-background/80 md:border md:border-border md:shadow-lg md:rounded-full transition-all">
        <div className="flex justify-between items-center px-4 py-2 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Nexus Academy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={clsx(
                  "text-sm font-medium transition px-3 py-1 rounded-full",
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}

            <ThemeToggle />

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
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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
          <div className="md:hidden float-right ml-auto">
            <button onClick={toggleMenu} className="text-foreground focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Menu */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-40 transform transition-transform duration-300 shadow-lg md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-foreground">Menu</span>
            <button onClick={toggleMenu}>
              <X className="w-6 h-6 text-muted-foreground" />
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
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
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
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
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
