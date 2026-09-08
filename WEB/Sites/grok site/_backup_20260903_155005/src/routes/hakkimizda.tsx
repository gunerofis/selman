import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hakkimizda")({
  beforeLoad: () => {
    throw redirect({ to: "/atolye" });
  },
  component: () => null,
});
