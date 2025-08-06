// src/routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Shield,
  Server,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { apiClient, queryKeys } from "../lib/api";
import { MainLayout } from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => apiClient.getDashboard(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your O365 security monitoring
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
              >
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Failed to load dashboard
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error instanceof Error
                    ? error.message
                    : "Unknown error occurred"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {dashboardData && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <OverviewCard
                title="Total Incidents"
                value={dashboardData.overview.incidents.total}
                icon={AlertTriangle}
                color="red"
                subtitle={`${dashboardData.overview.incidents.open} open`}
              />
              <OverviewCard
                title="Critical Alerts"
                value={dashboardData.overview.incidents.critical}
                icon={Shield}
                color="yellow"
                subtitle="Requires immediate attention"
              />
              <OverviewCard
                title="Monitored Tenants"
                value={dashboardData.overview.tenants.active}
                icon={Server}
                color="blue"
                subtitle={`${dashboardData.overview.tenants.total} total`}
              />
              <OverviewCard
                title="Active Users"
                value={dashboardData.overview.users?.active || 0}
                icon={Users}
                color="green"
                subtitle={`${dashboardData.overview.users?.total || 0} total`}
              />
            </div>

            {/* Recent Incidents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Incidents
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.recentIncidents?.length > 0 ? (
                  dashboardData.recentIncidents.slice(0, 10).map((incident) => (
                    <div
                      key={incident.id}
                      className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <SeverityBadge severity={incident.severity} />
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {incident.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span>{incident.tenant.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(incident.detectedAt).toLocaleString()}
                            </span>
                            {incident.affectedUser && (
                              <>
                                <span>•</span>
                                <span>{incident.affectedUser}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={incident.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent incidents found
                    </p>
                  </div>
                )}
              </div>
              {dashboardData.recentIncidents?.length > 10 && (
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="/incidents"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all incidents →
                  </a>
                </div>
              )}
            </div>

            {/* Tenant Health Status */}
            {dashboardData.tenantHealth &&
              dashboardData.tenantHealth.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tenant Health Status
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboardData.tenantHealth.map((tenant) => (
                        <div
                          key={tenant.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {tenant.name}
                            </h3>
                            <HealthStatusBadge status={tenant.status} />
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <p>{tenant.incidentCount} incidents</p>
                            <p>
                              Last poll:{" "}
                              {tenant.lastPoll
                                ? new Date(tenant.lastPoll).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

function OverviewCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number;
  icon: any;
  color: "red" | "yellow" | "blue" | "green";
  subtitle?: string;
}) {
  const colorClasses = {
    red: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    MEDIUM:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[severity as keyof typeof colors] || colors.MEDIUM}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    open: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    investigating:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    resolved:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    false_positive:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.open}`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

function HealthStatusBadge({ status }: { status: string }) {
  const colors = {
    healthy:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.error}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
