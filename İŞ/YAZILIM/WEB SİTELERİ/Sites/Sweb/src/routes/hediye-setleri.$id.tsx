import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/hediye-setleri/$id")({ beforeLoad: () => { throw notFound(); } });
