// src/routes/tenants.tsx
import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout/MainLayout";

export const Route = createFileRoute("/tenants")({
  component: TenantsPage,
});

function TenantsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            O365 Tenants
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your Office 365 tenant connections and monitoring settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tenant management functionality will be implemented in the next
            phase.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
