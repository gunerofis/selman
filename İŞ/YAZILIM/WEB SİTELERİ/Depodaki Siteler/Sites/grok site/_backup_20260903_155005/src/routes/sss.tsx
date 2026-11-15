import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { FaqList } from "@/components/faq-list";
import {
  FAQ_CARE,
  FAQ_CONTACT,
  FAQ_DESIGN,
  FAQ_QUOTE,
  FAQ_RETURN,
  FAQ_SHIP,
} from "@/lib/faq";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/sss")({
  component: Page,
  head: () =>
    pageHead({
      title: "Sıkça sorulanlar",
      description: "Sipariş, kargo, iade, ölçü, renk ve teklif.",
      path: "/sss",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Yardım" title="Sıkça sorulanlar" updated={BRAND.legalUpdated}>
      <p>
        Kısa yanıtlar. Teslimat, iade, bakım ve tasarım sayfalarında ayrıntı var.
      </p>
      <h2>Teslimat</h2>
      <FaqList items={FAQ_SHIP} heading={false} />
      <h2>İade ve cayma</h2>
      <FaqList items={FAQ_RETURN} heading={false} />
      <p className="mt-2 text-sm">
        Bildirim: <Link to="/cayma">cayma formu</Link>.
      </p>
      <h2>Bakım</h2>
      <FaqList items={FAQ_CARE} heading={false} />
      <h2>Ölçüye göre</h2>
      <FaqList items={FAQ_DESIGN} heading={false} />
      <h2>Kurumsal</h2>
      <FaqList items={FAQ_QUOTE} heading={false} />
      <h2>Yazışma</h2>
      <FaqList items={FAQ_CONTACT} heading={false} />
    </LegalPage>
  );
}
