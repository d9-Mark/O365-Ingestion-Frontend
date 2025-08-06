import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Redirect root to dashboard for authenticated users
    throw redirect({ to: "/dashboard" });
  },
});
