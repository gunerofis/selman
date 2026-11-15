import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hediye-setleri")({
  component: () => <Outlet />,
});
