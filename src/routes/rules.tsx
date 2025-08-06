// src/routes/rules.tsx
import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout/MainLayout";

export const Route = createFileRoute("/rules")({
  component: RulesPage,
});

function RulesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Rules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure and manage security rules across your monitored tenants
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Security rules management will be implemented in the next phase.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
