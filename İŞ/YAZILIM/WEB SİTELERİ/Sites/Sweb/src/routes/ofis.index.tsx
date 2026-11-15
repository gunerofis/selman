import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/ofis/")({ beforeLoad: () => { throw notFound(); } });
