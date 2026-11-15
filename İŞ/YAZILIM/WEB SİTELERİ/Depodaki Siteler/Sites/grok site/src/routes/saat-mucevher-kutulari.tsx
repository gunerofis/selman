import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/saat-mucevher-kutulari")({
  component: () => <Outlet />,
});
