import { Link } from "@tanstack/react-router";
import { slugify, type Product } from "@/lib/products";
import {
  COSMETIC_WARNINGS,
  PERFORMANCE_LABELS,
  concentrationOf,
  familyName,
  genderName,
  seasonName,
} from "@/lib/perfume";

export function NotePyramid({ product }: { product: Product }) {
  if (!product.notes) return null;
  const rows = [
    ["Üst notalar", product.notes.top],
    ["Kalp notalar", product.notes.heart],
    ["Alt notalar", product.notes.base],
  ] as const;
  return (
    <section className="border border-solid border-border bg-bg-elevated p-4">
      <h2 className="font-display text-xl">Koku piramidi</h2>
      <ol className="mt-3 grid gap-px bg-border">
        {rows.map(([label, notes], i) => (
          <li key={label} className="bg-bg-elevated py-3" style={{ paddingLeft: `${i * 12}px` }}>
            <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{label}</p>
            <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm">
              {notes.map((n) => (
                <Link key={n} to="/nota/$slug" params={{ slug: slugify(n) }} className="hover:text-taba hover:underline">
                  {n}
                </Link>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Meter({ label, value }: { label: string; value?: number }) {
  if (!value) return null;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-fg-muted">{PERFORMANCE_LABELS[value - 1]}</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= value ? "h-1.5 bg-taba" : "h-1.5 bg-border"} />
        ))}
      </div>
    </div>
  );
}

export function PerfumeFacts({ product }: { product: Product }) {
  const conc = concentrationOf(product.concentration);
  const rows: Array<[string, string | undefined]> = [
    ["Marka", product.brand],
    ["Cinsiyet", genderName(product.gender)],
    ["Konsantrasyon", conc?.name],
    ["Koku ailesi", product.families?.map(familyName).join(", ")],
    ["Mevsim", product.seasons?.map(seasonName).join(", ")],
    ["Parfümör", product.perfumer],
    ["Çıkış yılı", product.year ? String(product.year) : undefined],
    ["Menşei", product.origin],
    ["Barkod", product.gtin],
    ["Parti no", product.batch],
    ["Son kullanma", product.expiry],
  ];
  const visible = rows.filter(([, v]) => v);
  return (
    <section className="border border-solid border-border bg-bg-elevated p-4">
      <h2 className="font-display text-xl">Özellikler</h2>
      {product.longevity || product.sillage ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Meter label="Kalıcılık" value={product.longevity} />
          <Meter label="Yayılım" value={product.sillage} />
        </div>
      ) : null}
      {visible.length ? (
        <table className="mt-4 w-full text-sm">
          <tbody>
            {visible.map(([k, v]) => (
              <tr key={k} className="border-b border-solid border-border last:border-0">
                <td className="py-2 text-fg-muted">{k}</td>
                <td className="py-2 text-right">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}

export function CosmeticInfo({ product }: { product: Product }) {
  return (
    <details className="border border-solid border-border bg-bg-elevated p-4">
      <summary className="cursor-pointer font-display text-xl">İçerik ve güvenlik</summary>
      {product.ingredients ? (
        <p className="mt-3 text-xs leading-relaxed text-fg-muted">
          <span className="text-fg">İçerik (INCI): </span>
          {product.ingredients}
        </p>
      ) : null}
      <ul className="mt-3 grid gap-1 text-sm text-fg-muted">
        {COSMETIC_WARNINGS.map((w) => (
          <li key={w}>• {w}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-fg-muted">
        Ambalajı ve koruma bandı açılmış kozmetik ürünler hijyen nedeniyle iade alınmaz.{" "}
        <Link to="/iade" className="text-taba hover:underline">
          İade koşulları
        </Link>
      </p>
    </details>
  );
}

export function AuthenticityNote() {
  return (
    <div className="grid gap-px bg-border text-sm sm:grid-cols-3">
      {[
        ["Orijinal ürün", "Faturalı, bandrollü ürün."],
        ["Deneme boyu", "Şişeden önce 2–5 ml ile deneyin."],
        ["Güvenli paket", "Darbeye dayanıklı, sızdırmaz ambalaj."],
      ].map(([t, b]) => (
        <div key={t} className="bg-bg-elevated p-3">
          <p className="font-display text-base">{t}</p>
          <p className="mt-1 text-xs text-fg-muted">{b}</p>
        </div>
      ))}
    </div>
  );
}

export function SampleBadge({ product }: { product: Product }) {
  if (!product.sample) return null;
  return (
    <span className="border border-solid border-taba bg-bg px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-taba uppercase">
      Örnek
    </span>
  );
}
