"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("userInfo");

      if (storedToken) {
        setToken(storedToken);

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Error parsing stored user info:", e);
          }
        } else {
          // If we have a token but no user info, fetch the user profile
          await fetchUserProfile();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("auth/profile/");
      const userData = response.data;
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Error fetching user profile:", error);
      }
      return null;
    }
  };

  // Handle user login
  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("auth/login/", {
        username,
        password,
      });

      const { access, csrfToken } = response.data;

      // Refresh token is set as an httpOnly cookie by the backend — nothing to store here.
      localStorage.setItem("accessToken", access);
      // The backend also sets this as a cookie, but that cookie lives on the backend's own
      // origin and this page can never read it via document.cookie (frontend/backend are
      // different domains) — so the login response hands us the value directly instead.
      // axios.js echoes it back as X-CSRFToken on the refresh/logout calls that need it.
      if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
      }
      setToken(access);

      // Fetch and store user info
      await fetchUserProfile();

      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  // Handle user logout
  const handleLogout = () => {
    // Clear local state immediately so the UI reacts right away; the server-side call
    // (clearing/blacklisting the refresh cookie) is best-effort and shouldn't block it —
    // the backend's own LogoutView already tolerates a missing/invalid refresh token.
    axiosInstance.post("auth/logout/").catch(() => {});

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("csrfToken");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user || !user.role) return "/dashboard/user";

    const roleMap = {
      instructor: "/dashboard/instructor",
      student: "/dashboard/user",
      admin: "/dashboard/instructor",
    };

    return roleMap[user.role] || "/dashboard/user";
  };

  // Check if a user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout: handleLogout,
    fetchUserProfile,
    getDashboardUrl,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};