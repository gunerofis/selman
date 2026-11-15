import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { FaqList } from "@/components/faq-list";
import { FAQ_CARE, FAQ_CONTACT, FAQ_DESIGN, FAQ_QUOTE, FAQ_RETURN, FAQ_SHIP } from "@/lib/faq";
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
  const items = [
    ...FAQ_SHIP,
    ...FAQ_RETURN,
    ...FAQ_CARE,
    ...FAQ_DESIGN,
    ...FAQ_QUOTE,
    ...FAQ_CONTACT,
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <LegalPage kicker="Yardım" title="Sıkça sorulanlar" updated={BRAND.legalUpdated}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p>Kısa yanıtlar. Teslimat, iade, bakım ve tasarım sayfalarında ayrıntı var.</p>
      <h2>Kısa yol</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {(
          [
            ["Siparişim nerede?", "/siparis-sorgu", "Sipariş sorgula"],
            ["Nasıl iade ederim?", "/iade", "İade"],
            ["Kargo ne zaman gelir?", "/teslimat", "Teslimat"],
            ["Nasıl öderim?", "/odeme-yontemleri", "Ödeme yöntemleri"],
            ["Hangi renk?", "/palet", "Renk paleti"],
            ["Nasıl ölçerim?", "/olcu", "Ölçü rehberi"],
            ["Tek parça fiyatı", "/teklif", "Ürün teklifi"],
            ["50 adet ve üzeri", "/kurumsal-teklif", "Kurumsal teklif"],
          ] as const
        ).map(([q, to, label]) => (
          <li key={q} className="flex flex-wrap gap-x-2">
            <span className="text-fg">{q}</span>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
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
      <h2>Teklif ve kurumsal</h2>
      <FaqList items={FAQ_QUOTE} heading={false} />
      <h2>Yazışma</h2>
      <FaqList items={FAQ_CONTACT} heading={false} />
    </LegalPage>
  );
}
