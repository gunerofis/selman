import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/fatura/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { renderInvoice } = await import("@/lib/commerce.server");
        const pdf = await renderInvoice(params.id, "fatura");
        if (!pdf) return new Response(null, { status: 404 });
        return new Response(pdf, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": "attachment; filename=\"fatura.pdf\"",
            "cache-control": "private, no-store",
          },
        });
      },
    },
  },
});
