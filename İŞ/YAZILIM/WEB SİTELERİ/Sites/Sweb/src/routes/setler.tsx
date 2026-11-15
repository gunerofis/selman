import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/setler")({
  beforeLoad: () => { throw notFound(); },
});
