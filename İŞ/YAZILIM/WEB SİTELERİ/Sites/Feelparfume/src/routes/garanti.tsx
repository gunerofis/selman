import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { batchGroups } from "@/lib/reviews";
import { lookupBatch } from "@/lib/reviews-api";
import { batchInput } from "@/lib/reviews-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/garanti")({
  component: Page,
  head: () =>
    pageHead({
      title: "Orijinallik ve ayıplı ürün",
      description: "Orijinal ürün güvencesi, ayıplı ürün ve kargo hasarı süreci.",
      path: "/garanti",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Yardım" title="Orijinallik ve ayıplı ürün" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-3">
        {(
          [
            ["Orijinal", "Faturalı, bandrollü ürün"],
            ["Ayıp", "Sızıntı, kırık şişe, bozuk sprey"],
            ["Cayma", "Açılmamış üründe 14 gün"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <BatchLookup />
      <h2>Orijinallik</h2>
      <p>
        Satılan tüm ürünler yetkili kaynaktan, faturalı olarak temin edilir. Ürün etiketinde parti
        (batch) numarası bulunur. Orijinallikten şüphe ederseniz sipariş numarası ve parti
        numarasıyla yazın; inceleme sonucu yazılı bildirilir.
      </p>
      <h2>Deneme boyu (dekant)</h2>
      <p>
        Deneme boyları, orijinal şişeden hijyenik koşullarda cam şişelere aktarılır ve etiketlenir.
        Deneme boyunda ambalaj, orijinal üretici ambalajı değildir.
      </p>
      <h2>Ne ayıptır</h2>
      <p>
        Şişe kırığı, kapak veya sprey başlığı arızası, sızıntı, eksik hacim, teslimde kargo hasarı ve
        siparişle uyuşmayan ürün. Koku algısının kişiden kişiye değişmesi ve kalıcılığın cilde göre
        farklılaşması ayıp sayılmaz.
      </p>
      <h2>Başvuruda ne gerekir</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {[
          "Sipariş numarası",
          "Ürün ve parti numarası",
          "Sorunu gösteren 2–3 fotoğraf veya kısa video",
          "Kargo hasarında paketin açılmadan önceki fotoğrafı",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 bg-taba" />
            {item}
          </li>
        ))}
      </ul>
      <h2>Süreç</h2>
      <p>
        {BRAND.reply} içinde yanıt verilir. Ayıp görülürse yeni ürün gönderilir veya yasal seçimlik
        haklarınız (bedel iadesi, indirim, değişim) uygulanır. Ayıplı üründe iade ve yeniden gönderim
        kargosu satıcıya aittir.
      </p>
      <p>
        Yasal ayıp hükümleri 6502 sayılı Tüketicinin Korunması Hakkında Kanun’dadır. Cayma için{" "}
        <Link to="/cayma">cayma hakkı</Link>, şikayet için <Link to="/sikayet">şikayet</Link>.
      </p>
    </LegalPage>
  );
}

function BatchLookup() {
  const [batch, setBatch] = useState("");
  const [hits, setHits] = useState<ReturnType<typeof batchGroups> | null>(null);
  const [error, setError] = useState("");
  return (
    <form
      id="parti"
      className="mb-8 grid max-w-md gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = batchInput.safeParse({ batch });
        if (!parsed.success) {
          setHits(null);
          setError(parsed.error.issues[0]?.message ?? "Parti no geçersiz");
          return;
        }
        setError("");
        void lookupBatch({ data: parsed.data })
          .then((rows) => setHits(batchGroups(rows)))
          .catch(() => setError("Kayıt açılamadı."));
      }}
    >
      <label className="text-sm">
        Parti no
        <Input className="mt-2" value={batch} onChange={(event) => setBatch(event.target.value)} required />
      </label>
      <Button type="submit" className="w-fit">
        Sorgula
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {hits?.length === 0 ? <p className="text-sm">Kayıt yok</p> : null}
      {hits?.length ? (
        <ul className="grid gap-2 text-sm">
          {hits.map((hit) => (
            <li key={hit.sku}>
              <Link to="/urun/$sku" params={{ sku: hit.slug }} className="hover:underline">
                {hit.name}
              </Link>
              <span className="font-mono text-fg-muted"> · {hit.mls.map((ml) => `${ml} ml`).join(", ")}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
