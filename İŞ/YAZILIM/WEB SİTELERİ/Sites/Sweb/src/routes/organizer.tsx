import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/organizer")({
  beforeLoad: () => { throw notFound(); },
});
