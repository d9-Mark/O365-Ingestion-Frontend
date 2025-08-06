import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { apiClient } from "../lib/api";

export function HealthCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 10000, // Check every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
        <Clock className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Checking API...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">API Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm">API Online</span>
    </div>
  );
}
