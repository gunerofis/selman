import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/kurumsal-teklif")({
  beforeLoad: () => {
    throw redirect({ to: "/teklif" });
  },
  component: () => null,
});
