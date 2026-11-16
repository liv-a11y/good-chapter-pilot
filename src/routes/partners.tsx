import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/partners")({
  component: PartnersLayout,
});

// Layout-only parent. Each child route renders its own page inside this outlet.
function PartnersLayout() {
  return <Outlet />;
}
