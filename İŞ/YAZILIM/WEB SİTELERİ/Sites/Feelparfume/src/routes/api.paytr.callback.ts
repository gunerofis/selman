import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paytr/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePaytrCallback } = await import("@/lib/paytr.server");
        const body = await handlePaytrCallback(request);
        return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
