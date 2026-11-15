import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/urunler/")({
  beforeLoad: () => {
    throw redirect({ to: "/koleksiyon", statusCode: 301 });
  },
});
