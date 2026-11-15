import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { checkoutPayMethods } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/odeme-yontemleri")({
  loader: async () => {
    const { paytrConfigured } = await import("@/lib/paytr.server");
    return { paytr: paytrConfigured() };
  },
  component: Page,
  head: () =>
    pageHead({
      title: "Ödeme yöntemleri",
      description: "Kapıda nakit veya kart, havale. Kart numarası sitede alınmaz.",
      path: "/odeme-yontemleri",
    }),
});

function Page() {
  const { paytr } = Route.useLoaderData();
  const { identity } = useSiteConfig();

  return (
    <LegalPage kicker="Yardım" title="Ödeme yöntemleri" updated={BRAND.legalUpdated}>
      <p>
        {paytr
          ? "Kart ödemesi PayTR 3D Secure sayfasında alınır. Kart numarası bu sitede saklanmaz."
          : "Kart numarası bu sitede alınmaz."}
      </p>
      <ul className="mt-6 grid gap-3">
        {checkoutPayMethods(paytr).map((method) => (
          <li key={method.id} className="border border-border bg-bg-elevated px-4 py-4">
            <p className="font-display text-xl text-fg">{method.label}</p>
          </li>
        ))}
      </ul>
      {identity.iban ? <p className="mt-6 font-mono text-sm">{identity.iban}</p> : null}
      <p>
        Ön bilgi: <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Sepet:{" "}
        <Link to="/sepet">sepet</Link>. İade: <Link to="/iade">iade</Link>.
      </p>
      <Link to="/odeme" className="mt-8 inline-block">
        <Button>Ödemeye geç</Button>
      </Link>
    </LegalPage>
  );
}
