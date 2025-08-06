// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, queryKeys } from "../lib/api";
import type { AuthUser, LoginRequest } from "../lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Check if user is authenticated (has token)
  const hasToken = () => {
    if (typeof window === "undefined") return false;
    return !!apiClient.getToken();
  };

  // Query current user if token exists
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
    error,
  } = useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => apiClient.getCurrentUser(),
    enabled: hasToken() && isInitialized,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize auth state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Clear user data if auth error
  useEffect(() => {
    if (error && hasToken()) {
      apiClient.clearToken();
      queryClient.clear();
    }
  }, [error, queryClient]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials);

      // Set user data in query cache
      queryClient.setQueryData(queryKeys.auth, response.user);

      // Invalidate other queries to refetch with new auth
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiClient.clearToken();
    queryClient.clear();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: !isInitialized || (hasToken() && isLoading),
    isAuthenticated: !!user && hasToken(),
    login,
    logout,
    refetchUser: () => refetchUser(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protecting routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    user,
    canAccess: (requiredRole?: string) => {
      if (!user) return false;

      if (!requiredRole) return true;

      const roleHierarchy = ["viewer", "analyst", "manager", "admin"];
      const userRoleIndex = roleHierarchy.indexOf(user.role);
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

      return userRoleIndex >= requiredRoleIndex;
    },
  };
}
