import { createFileRoute, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/organizer/$id")({ beforeLoad: () => { throw notFound(); } });
