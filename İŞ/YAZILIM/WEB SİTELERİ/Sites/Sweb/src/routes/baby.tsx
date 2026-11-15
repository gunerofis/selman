import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/baby")({
  beforeLoad: () => { throw notFound(); },
});
