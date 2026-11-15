import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DimensionPreview } from "@/components/dimension-preview";
import { ProductCard } from "@/components/product-card";
import { FaqList } from "@/components/faq-list";
import { FAQ_DESIGN } from "@/lib/faq";
import { WIDTH_BANDS } from "@/lib/catalog-filters";
import { filterCatalog } from "@/lib/shop";
import { ROOM_SURFACE } from "@/lib/scale";
import { CATEGORIES, type ColorId } from "@/lib/products";
import { ColorSwatches } from "@/components/color-swatch";

export const Route = createFileRoute("/olcu")({
  component: MeasurePage,
  head: () =>
    pageHead({
      title: "Ölçü rehberi",
      description: "En, boy, yükseklik. 80–900 mm. Katalogdaki dış ölçüler ve yer ölçeği.",
      path: "/olcu",
    }),
});

function MeasurePage() {
  const [widthMm, setWidthMm] = useState("280");
  const [depthMm, setDepthMm] = useState("180");
  const [heightMm, setHeightMm] = useState("90");
  const [color, setColor] = useState<ColorId | "">("espresso");

  const bands = useMemo(
    () =>
      WIDTH_BANDS.map((band) => ({
        band,
        products: filterCatalog({ en: band.id }).slice(0, 4),
        total: filterCatalog({ en: band.id }).length,
      })),
    [],
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Nasıl ölçülür</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        Milimetre. En × boy × yükseklik. Tek parçada 80–900 mm. Aşağıda katalogdaki gerçek dış
        ölçüler, oda yüzeyiyle oran.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ol className="space-y-4 text-sm leading-relaxed text-fg-muted">
          <li>
            <span className="font-display text-xl text-fg">1. En</span>
            <p className="mt-1">Oturacağı açıklığın iç genişliği. Çekmece veya tezgâh ağzı.</p>
          </li>
          <li>
            <span className="font-display text-xl text-fg">2. Boy</span>
            <p className="mt-1">Önden arkaya derinlik. Kapak veya duvar payını düşün.</p>
          </li>
          <li>
            <span className="font-display text-xl text-fg">3. Yükseklik</span>
            <p className="mt-1">Üst net boşluk. Menteşe ve ayak payı dahil değilse not düşün.</p>
          </li>
        </ol>
        <div className="flex flex-col gap-4">
          <DimensionPreview
            widthMm={widthMm}
            depthMm={depthMm}
            heightMm={heightMm}
            color={color}
            note="Oran canlıdır. Aşağıda katalogdaki gerçek dış ölçüler var."
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              inputMode="numeric"
              aria-label="En mm"
              value={widthMm}
              onChange={(e) => setWidthMm(e.target.value)}
              placeholder="en"
            />
            <Input
              inputMode="numeric"
              aria-label="Boy mm"
              value={depthMm}
              onChange={(e) => setDepthMm(e.target.value)}
              placeholder="boy"
            />
            <Input
              inputMode="numeric"
              aria-label="Yükseklik mm"
              value={heightMm}
              onChange={(e) => setHeightMm(e.target.value)}
              placeholder="yükseklik"
            />
          </div>
          <ColorSwatches value={color} onChange={setColor} />
          <Link
            to="/tasarla"
            search={{
              en: widthMm || undefined,
              boy: depthMm || undefined,
              yuk: heightMm || undefined,
              renk: color || undefined,
            }}
          >
            <Button className="w-full sm:w-auto" size="lg">
              Bu ölçüyle tasarlayın
            </Button>
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Pay</p>
        <h2 className="mt-2 font-display text-3xl">Ne kadar pay bırakmalı</h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Ölçtüğünüz açıklığa birebir sipariş vermeyin; parça yerine girmez ya da çıkarılamaz.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-strong font-mono text-xs uppercase">
                <th className="py-3 pr-4">Yer</th>
                <th className="py-3 pr-4">Bırakılacak pay</th>
                <th className="py-3">Neden</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Çekmece içi", "Her kenardan 5 mm", "Parçayı iki parmakla çıkarabilmek için."],
                  ["Raf arası", "Üstten 15 mm", "Kapak açılışı ve elin girmesi için."],
                  ["Dolap içi", "Derinlikten 10 mm", "Kapak menteşesi öne taşar."],
                  ["Masa üstü", "Pay gerekmez", "Serbest duran parçada ölçü birebir alınır."],
                  ["Duvara monte", "Yanlardan 20 mm", "Montaj ayarı ve duvar eğriliği payı."],
                ] as const
              ).map(([a, b, c]) => (
                <tr key={a} className="border-b border-dashed border-border align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-fg">
                    {a}
                  </th>
                  <td className="py-3 pr-4 text-fg-muted">{b}</td>
                  <td className="py-3 text-fg-muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-xl text-sm text-fg-muted">
          Ölçüye göre üretimde ±2 mm sapma normaldir; payı bu sapmayı da karşılayacak şekilde
          bırakın.
        </p>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Sık hata</p>
        <h2 className="mt-2 font-display text-3xl">Ölçerken en çok yapılan dört hata</h2>
        <ul className="mt-6 grid gap-px bg-border sm:grid-cols-2">
          {(
            [
              ["Dışarıdan ölçmek", "Çekmece veya rafın iç açıklığını ölçün, dış gövdesini değil."],
              ["Kapağı unutmak", "Kapak, menteşe ve kulp derinliği açıklıktan çalar."],
              ["Tek nokta ölçmek", "İki uçtan ve ortadan ölçün; en dar olanı esas alın."],
              ["cm ile mm karıştırmak", "Formlar milimetre ister: 28 cm yerine 280 yazın."],
            ] as const
          ).map(([k, v]) => (
            <li key={k} className="bg-bg-elevated px-5 py-6">
              <p className="font-display text-xl">{k}</p>
              <p className="mt-2 text-sm text-fg-muted">{v}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Yer ölçeği</p>
        <h2 className="mt-2 font-display text-3xl">Tipik yüzeyler</h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Ürün iddiası değil; evdeki açıklığı tahmin etmek için.
        </p>
        <ul className="mt-6 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.filter((c) => ROOM_SURFACE[c.id]).map((c) => {
            const s = ROOM_SURFACE[c.id];
            if (!s) return null;
            return (
              <li key={c.id} className="bg-bg-elevated px-4 py-5">
                <p className="font-mono text-xs text-fg-muted uppercase">{c.name}</p>
                <p className="mt-2 font-display text-xl">{s.mm / 10} cm</p>
                <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
                <Link
                  to="/kategori/$id"
                  params={{ id: c.id }}
                  className="mt-3 inline-block text-xs text-taba hover:underline"
                >
                  Odayı gör
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Katalog</p>
        <h2 className="mt-2 font-display text-3xl">Ene göre parçalar</h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Dış ölçüdeki ilk milimetre. Bant, koleksiyon filtresiyle aynı.
        </p>
        <div className="mt-10 space-y-14">
          {bands.map(({ band, products, total }) =>
            products.length === 0 ? null : (
              <div key={band.id}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-fg-muted uppercase">{band.label}</p>
                    <p className="mt-1 text-sm text-fg-muted">{total} parça</p>
                  </div>
                  <Link to="/koleksiyon" search={{ en: band.id }}>
                    <Button variant="outline" size="sm">
                      Bu eni filtrele
                    </Button>
                  </Link>
                </div>
                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.sku} product={p} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <div className="mt-16 border border-dashed border-border p-5">
        <p className="font-mono text-xs text-fg-muted">Yapmadıklarımız</p>
        <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
          <li>Elektrikli veya elektronik parça</li>
          <li>Cam ve seramik gövde</li>
          <li>Dış mekân ve suya dayanıklı ürün</li>
          <li>Tek parçada 900 mm üstü ölçü</li>
          <li>Gıdayla doğrudan temas eden yüzey</li>
        </ul>
      </div>
      <FaqList items={FAQ_DESIGN} />
    </div>
  );
}
