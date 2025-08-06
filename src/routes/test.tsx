// src/routes/test.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "../lib/api";
import {
  HealthCheck,
  LoadingSpinner,
  ErrorAlert,
} from "../components/HealthCheck";
import { Shield, Server, Database, Wifi } from "lucide-react";

export const Route = createFileRoute("/test")({
  component: TestPage,
});

function TestPage() {
  const [testAuth, setTestAuth] = useState(false);

  const {
    data: healthData,
    isLoading: healthLoading,
    error: healthError,
  } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.healthCheck(),
  });

  const handleTestLogin = async () => {
    setTestAuth(true);
    try {
      // Test with demo credentials
      await apiClient.login({
        email: "admin@demo.com",
        password: "demo123",
      });
      alert("Login test successful!");
    } catch (error) {
      alert(
        `Login test failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setTestAuth(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            O365 Security Monitor - System Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Testing connectivity and functionality
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* API Health Check */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Health
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <HealthCheck />
              </div>
              {healthData && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Response: {JSON.stringify(healthData)}
                </div>
              )}
              {healthError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  Error:{" "}
                  {healthError instanceof Error
                    ? healthError.message
                    : "Unknown error"}
                </div>
              )}
            </div>
          </div>

          {/* Authentication Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Authentication
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Token:
                </span>
                <span className="text-sm">
                  {apiClient.getToken() ? (
                    <span className="text-green-600 dark:text-green-400">
                      Present
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Missing
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={handleTestLogin}
                disabled={testAuth}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {testAuth ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Testing...
                  </div>
                ) : (
                  "Test Login"
                )}
              </button>
            </div>
          </div>

          {/* Frontend Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Wifi className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Frontend
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  React:
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  TanStack Router:
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  TanStack Query:
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Tailwind:
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Navigation Test
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/login"
              className="text-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Login
              </div>
            </a>
            <a
              href="/dashboard"
              className="text-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Dashboard
              </div>
            </a>
            <a
              href="/incidents"
              className="text-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Incidents
              </div>
            </a>
            <a
              href="/tenants"
              className="text-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Tenants
              </div>
            </a>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Environment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Frontend URL:
              </span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">
                {typeof window !== "undefined" ? window.location.origin : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">API URL:</span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">
                http://localhost:3001
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Environment:
              </span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">
                {process.env.NODE_ENV || "development"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
