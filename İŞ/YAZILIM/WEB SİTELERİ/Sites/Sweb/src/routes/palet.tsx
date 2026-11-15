import { createFileRoute, Link } from "@tanstack/react-router";
import { COLORS, PASTEL, featuredProducts } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import type { ColorId } from "@/lib/products";

export const Route = createFileRoute("/palet")({
  component: PalettePage,
  head: () =>
    pageHead({
      title: "Renk paleti",
      description:
        "On dört deri renk: ton, doku, hangi alanda iyi durduğu ve uyumlu ikilileri. Kurumsal renk ve numune talebi.",
      path: "/palet",
    }),
});

type ColorNote = {
  tone: string;
  finish: string;
  use: string;
  care: string;
};

const NOTES: Record<ColorId, ColorNote> = {
  espresso: {
    tone: "Koyu sıcak",
    finish: "Mat, ince dokulu",
    use: "Ceviz ve koyu ahşap masalarda; yönetici masası setlerinde ilk tercih.",
    care: "İz ve parmak izini en az gösteren renk.",
  },
  siyah: {
    tone: "En koyu",
    finish: "Mat",
    use: "Cam, metal ve teknoloji ürünlerinin yanında; modern ofis düzeninde.",
    care: "Toz açık renkten daha görünür; kuru bezle silin.",
  },
  bordo: {
    tone: "Koyu sıcak",
    finish: "Hafif parlak",
    use: "Klasik ahşap mobilya ve deri koltuk yanında.",
    care: "Güneşte uzun süre kalırsa tonu açılır.",
  },
  taba: {
    tone: "Orta sıcak",
    finish: "Doğal deri görünümü",
    use: "Meşe, kayın ve açık ahşapta; hediye setlerinde en çok seçilen renk.",
    care: "Zamanla patina yapar; bu rengin beklenen davranışıdır.",
  },
  lacivert: {
    tone: "Koyu soğuk",
    finish: "Mat",
    use: "Krem ve bej zeminlerde vurgu rengi; kütüphane ve çalışma odasında.",
    care: "Koyu renkler gibi iz göstermez.",
  },
  gri: {
    tone: "Orta nötr",
    finish: "Mat",
    use: "Beton, mermer ve gri tonlu mekânlarda; banyo ve makyaj alanında.",
    care: "Açık renklerden daha dayanıklı, koyu renklerden daha yumuşak.",
  },
  krem: {
    tone: "Açık sıcak",
    finish: "Mat",
    use: "Küçük alanları büyütmek için; makyaj ve gardırop ürünlerinde.",
    care: "Leke gösterir; nemli bezle düzenli silin.",
  },
  beyaz: {
    tone: "En açık",
    finish: "Mat",
    use: "Beyaz mobilya ve yüksek kontrastlı sunumlarda.",
    care: "En çok bakım isteyen renk; açık renk eşya ile kullanın.",
  },
  kirmizi: {
    tone: "Canlı sıcak",
    finish: "Hafif parlak",
    use: "Nötr ve koyu mobilyalarda güçlü vurgu rengi olarak.",
    care: "Doğrudan güneşte uzun süre bırakmayın.",
  },
  turuncu: {
    tone: "Canlı sıcak",
    finish: "Mat",
    use: "Yaratıcı çalışma alanları ve açık ahşap yüzeylerde.",
    care: "Nemli, renksiz bir bezle temizleyin.",
  },
  pembe: {
    tone: "Açık sıcak",
    finish: "Mat",
    use: "Açık renkli masa ve kişisel çalışma alanlarında.",
    care: "Koyu renkli kumaşlarla uzun süre temas ettirmeyin.",
  },
  turkuaz: {
    tone: "Canlı soğuk",
    finish: "Mat",
    use: "Beyaz, krem ve açık ahşap yüzeylerde belirgin vurgu için.",
    care: "Rengi korumak için doğrudan güneşten uzak tutun.",
  },
  mavi: {
    tone: "Orta soğuk",
    finish: "Mat",
    use: "Modern ofislerde beyaz, gri ve metal yüzeylerle.",
    care: "Kuru veya hafif nemli bezle silin.",
  },
  yesil: {
    tone: "Koyu doğal",
    finish: "Mat",
    use: "Ceviz, meşe ve doğal dokulu çalışma alanlarında.",
    care: "Koyu ton olduğu için günlük kullanım izlerini iyi saklar.",
  },
};

const PAIRS: { title: string; body: string; ids: ColorId[] }[] = [
  {
    title: "Kahve + Taba",
    body: "Aynı sıcak ailede iki ton. Masa setinde büyük parçalar kahve, küçük aksesuarlar taba.",
    ids: ["espresso", "taba"],
  },
  {
    title: "Lacivert + Krem",
    body: "Koyu soğuk zemine açık sıcak vurgu. Vitrin ve kitaplık düzeninde çalışır.",
    ids: ["lacivert", "krem"],
  },
  {
    title: "Siyah + Gri",
    body: "Tek renkli, nötr bir düzen. Teknoloji ağırlıklı masalarda dağınık görünmez.",
    ids: ["siyah", "gri"],
  },
];

function PalettePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Deri</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">On dört renk</h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted">
        Sümen takımlarında kullanılan on dört deri rengi. Aşağıda her rengin tonu, dokusu, hangi alanda iyi
        durduğu ve günlük kullanımda nasıl davrandığı yazılıdır.
      </p>

      <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {COLORS.map((c) => (
          <li key={c.id}>
            <Link
              to="/koleksiyon"
              search={{ renk: c.id }}
              className="group flex min-h-56 flex-col justify-between p-5"
              style={{ backgroundColor: PASTEL[c.id] }}
            >
              <span
                className="size-10 border border-border-strong"
                style={{ backgroundColor: c.swatch }}
              />
              <span>
                <span className="block font-display text-3xl">{c.name}</span>
                <span className="mt-1 block font-mono text-xs text-fg-muted">
                  {NOTES[c.id].tone}
                </span>
                <span className="mt-1 block font-mono text-xs text-fg-muted">Ürünlerde gör →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Renk künyesi</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Ekrandaki renk ile deri arasında ton farkı olabilir; kesin karar için numune isteyin.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-strong font-mono text-xs uppercase">
                <th className="py-3 pr-4">Renk</th>
                <th className="py-3 pr-4">Ton</th>
                <th className="py-3 pr-4">Yüzey</th>
                <th className="py-3 pr-4">Nerede iyi durur</th>
                <th className="py-3">Kullanımda</th>
              </tr>
            </thead>
            <tbody>
              {COLORS.map((c) => (
                <tr key={c.id} className="border-b border-dashed border-border align-top">
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-5 shrink-0 border border-border-strong"
                        style={{ backgroundColor: c.swatch }}
                      />
                      <span className="font-display text-base">{c.name}</span>
                    </span>
                  </th>
                  <td className="py-4 pr-4 text-fg-muted">{NOTES[c.id].tone}</td>
                  <td className="py-4 pr-4 text-fg-muted">{NOTES[c.id].finish}</td>
                  <td className="py-4 pr-4 text-fg-muted">{NOTES[c.id].use}</td>
                  <td className="py-4 text-fg-muted">{NOTES[c.id].care}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Renk nasıl seçilir</h2>
        <ol className="mt-6 grid gap-px bg-border sm:grid-cols-3">
          {[
            [
              "Mobilyaya değil, zemine bakın",
              "Ürün çoğu zaman masanın veya rafın üstünde durur. Rengi mobilyanın tonuyla değil, altındaki yüzeyle karşılaştırın.",
            ],
            [
              "Kullanım sıklığına göre koyulaştırın",
              "Her gün elle temas eden parçalarda (saat ve mücevher kutuları) koyu renkler izi gizler. Vitrin parçalarında açık renk serbesttir.",
            ],
            [
              "Sette tek renk, aksesuarda ikinci renk",
              "Büyük parçaları tek renkte tutun; küçük aksesuarlarda ikinci bir ton kullanın. Üç renk bir masada dağınık görünür.",
            ],
          ].map(([t, d], i) => (
            <li key={t} className="bg-bg-elevated px-5 py-6">
              <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-xl">{t}</p>
              <p className="mt-2 text-sm text-fg-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Uyumlu ikililer</h2>
        <div className="mt-6 grid gap-px bg-border sm:grid-cols-3">
          {PAIRS.map((pair) => (
            <div key={pair.title} className="bg-bg-elevated px-5 py-6">
              <div className="flex gap-1">
                {pair.ids.map((id) => (
                  <span
                    key={id}
                    className="h-10 flex-1 border border-border-strong"
                    style={{ backgroundColor: COLORS.find((c) => c.id === id)?.swatch }}
                  />
                ))}
              </div>
              <p className="mt-4 font-display text-xl">{pair.title}</p>
              <p className="mt-2 text-sm text-fg-muted">{pair.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Aynı parça, on dört zemin</h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Fotoğraf değişmez. Seçilen renk kartın zeminini boyar.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((c, i) => {
            const sample = featuredProducts()[i % Math.max(1, featuredProducts().length)];
            if (!sample) return null;
            return (
              <div key={c.id}>
                <p className="mb-3 font-display text-xl">{c.name}</p>
                <ProductCard product={sample} color={c.id} />
                <Link
                  to="/koleksiyon"
                  search={{ renk: c.id }}
                  className="mt-2 inline-block text-xs text-taba hover:underline"
                >
                  {c.name} zeminde koleksiyon
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-bg-elevated px-6 py-8">
          <h2 className="font-display text-2xl">Palet dışı renk</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Kurumsal kimlik rengi veya palet dışı bir ton isteniyorsa 50 adet ve üzeri siparişlerde
            özel renk çalışılır. Pantone veya fiziksel numune gönderin.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/kurumsal-teklif" search={{ not: "Palet dışı renk talebi" }}>
              <Button>Kurumsal teklif</Button>
            </Link>
            <Link to="/iletisim">
              <Button variant="outline">Numune iste</Button>
            </Link>
          </div>
        </div>
        <div className="bg-bg-elevated px-6 py-8">
          <h2 className="font-display text-2xl">Renkten sonra</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Renk seçtikten sonra sırada ölçü ve bakım var.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/olcu">
              <Button variant="outline">Ölçü rehberi</Button>
            </Link>
            <Link to="/bakim">
              <Button variant="outline">Bakım rehberi</Button>
            </Link>
            <Link to="/malzeme">
              <Button variant="outline">Malzemeler</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
