import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout/MainLayout";

export const Route = createFileRoute("/incidents")({
  component: IncidentsPage,
});

function IncidentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Incidents
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and investigate security incidents across your O365 tenants
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Incident management functionality will be implemented in the next
            phase.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
