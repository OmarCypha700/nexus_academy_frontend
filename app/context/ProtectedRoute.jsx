// @/app/context/ProtectedRoute.jsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * ProtectedRoute component for hardened routing and role-based access control.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string | string[]} props.requiredRole - Required role(s) for access
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.fallbackPath - Path to redirect if not authorized (default: "/login")
 */
export function ProtectedRoute({
  children,
  requiredRole = null,
  requireAuth = true,
  fallbackPath = "/login",
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to initialize

    // Check if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    // Check if specific role is required
    if (requiredRole && isAuthenticated) {
      const rolesRequired = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      const hasRequiredRole = user && rolesRequired.includes(user.role);

      if (!hasRequiredRole) {
        // Redirect to unauthorized page or dashboard based on user role
        const redirectPath = user?.role
          ? `/unauthorized?from=${encodeURIComponent(window.location.pathname)}`
          : fallbackPath;
        router.push(redirectPath);
      }
    }
  }, [user, loading, isAuthenticated, requiredRole, requireAuth, fallbackPath, router]);

  // Show loading state while auth is being initialized
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user should have access
  const isAuthorized =
    !requireAuth ||
    (isAuthenticated &&
      (!requiredRole ||
        (user &&
          (Array.isArray(requiredRole)
            ? requiredRole.includes(user.role)
            : requiredRole === user.role))));

  if (!isAuthorized) {
    return null; // Already redirecting in useEffect
  }

  return <>{children}</>;
}

/**
 * HOC to wrap a page component with role-based access control.
 *
 * Usage:
 * export default withProtectedRoute(DashboardPage, {
 *   requiredRole: "instructor"
 * });
 */
export function withProtectedRoute(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
