// @/app/context/AuthContext.js

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("userInfo");
    
    if (storedToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user info:", e);
        }
      } else {
        // If we have a token but no user info, fetch the user profile
        fetchUserProfile(storedToken);
      }
    }
    
    setLoading(false);
  }, []);

  // Fetch user profile with the token
  const fetchUserProfile = async (currentToken) => {
    try {
      const tokenToUse = currentToken || token;
      if (!tokenToUse) return null;
      
      const response = await fetch(`${API_URL}api/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${tokenToUse}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          return fetchUserProfile();
        } else {
          handleLogout();
          return null;
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Refresh the access token
  const refreshAccessToken = async () => {
    try {
      const currentRefreshToken = refreshToken || localStorage.getItem("refreshToken");
      if (!currentRefreshToken) return false;
      
      const response = await fetch(`${API_URL}api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: currentRefreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        setToken(data.access);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  // Handle user login
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setToken(data.access);
      setRefreshToken(data.refresh);
      
      // Fetch and store user info
      await fetchUserProfile(data.access);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return "/dashboard";
    
    switch (user.role) {
      case "instructor":
        return "dashboard/instructor";
      case "student":
        return "dashboard/user";
      case "admin":
        return "dashboard/instructor";
      default:
        return "/dashboard";
    }
  };

  // Check if a user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // API request with automatic token refresh
  const apiRequest = async (endpoint, options = {}) => {
    try {
      // Add authorization header if token exists
      const currentToken = token || localStorage.getItem("accessToken");
      
      if (currentToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`
        };
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, options);
      
      // Handle 401 Unauthorized errors - attempt token refresh
      if (response.status === 401) {
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
          // Retry the original request with new token
          return apiRequest(endpoint, options);
        } else {
          // If refresh fails, logout and redirect
          handleLogout();
          router.push('/login');
          throw new Error('Authentication failed');
        }
      }
      
      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
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
    isAuthenticated: !!token,
    apiRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);