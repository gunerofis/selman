import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/irsaliye/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { renderInvoice } = await import("@/lib/commerce.server");
        const pdf = await renderInvoice(params.id, "irsaliye");
        if (!pdf) return new Response(null, { status: 404 });
        return new Response(pdf, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": "attachment; filename=\"irsaliye.pdf\"",
            "cache-control": "private, no-store",
          },
        });
      },
    },
  },
});
