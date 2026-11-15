import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAdminSession } from "@/lib/catalog-admin";
import {
  deleteProduct,
  exportProductsCsv,
  getAdminProducts,
  importProductsCsv,
  saveProduct,
  setProductStatus,
  type ProductForm,
} from "@/lib/catalog";
import { CATEGORIES } from "@/lib/products";
import { CONCENTRATIONS, FAMILIES, GENDERS, SEASONS } from "@/lib/perfume";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/katalog-yonetimi")({
  loader: async () => {
    const session = await getAdminSession();
    if (!session.authenticated) return { session, products: [] };
    return { session, products: await getAdminProducts() };
  },
  head: () => pageHead({ title: "Katalog yönetimi", path: "/katalog-yonetimi", noindex: true }),
  component: CatalogAdmin,
});

type AdminProduct = Awaited<ReturnType<typeof getAdminProducts>>[number];
type Row = { ml: string; price: string; stock: string; gtin: string; batch: string; expiry: string; sample: boolean };

const STATUS = { active: "Yayında", draft: "Taslak", archived: "Arşiv" } as const;
const emptyRow = (): Row => ({ ml: "", price: "", stock: "0", gtin: "", batch: "", expiry: "", sample: false });

function blank(): FormState {
  return {
    sku: "", name: "", brand: "", category: "kadin", gender: "kadin", concentration: "edp",
    families: [], top: "", heart: "", base: "", longevity: "", sillage: "", seasons: [],
    year: "", perfumer: "", origin: "", ingredients: "", tagline: "", description: "",
    features: "", image: "", images: "", featured: false, status: "draft", rows: [emptyRow()],
  };
}

type FormState = {
  sku: string; name: string; brand: string; category: string; gender: string; concentration: string;
  families: string[]; top: string; heart: string; base: string; longevity: string; sillage: string;
  seasons: string[]; year: string; perfumer: string; origin: string; ingredients: string;
  tagline: string; description: string; features: string; image: string; images: string;
  featured: boolean; status: "active" | "draft" | "archived"; rows: Row[]; sample?: boolean;
};

function fromProduct(p: AdminProduct): FormState {
  return {
    sku: p.sku, name: p.name, brand: p.brand ?? "", category: p.category, gender: p.gender ?? "",
    concentration: p.concentration ?? "", families: [...(p.families ?? [])],
    top: p.notes?.top.join(", ") ?? "", heart: p.notes?.heart.join(", ") ?? "", base: p.notes?.base.join(", ") ?? "",
    longevity: p.longevity ? String(p.longevity) : "", sillage: p.sillage ? String(p.sillage) : "",
    seasons: [...(p.seasons ?? [])], year: p.year ? String(p.year) : "", perfumer: p.perfumer ?? "",
    origin: p.origin ?? "", ingredients: p.ingredients ?? "", tagline: p.tagline, description: p.description,
    features: p.features.join("\n"), image: p.image, images: (p.images ?? []).join("\n"),
    featured: Boolean(p.featured), status: p.status ?? "active", sample: p.sample,
    rows: p.variantRows.map((v) => ({
      ml: String(v.ml), price: String(v.price), stock: String(v.stock), gtin: v.gtin, batch: v.batch,
      expiry: v.expiry, sample: v.sample,
    })),
  };
}

const split = (s: string, re = /[,\n]/) => s.split(re).map((x) => x.trim()).filter(Boolean);
const n = (s: string) => (s.trim() === "" ? undefined : Number(s.replace(",", ".")));

function toPayload(f: FormState): ProductForm {
  return {
    sku: f.sku, name: f.name, brand: f.brand || undefined, category: f.category,
    gender: (f.gender || undefined) as ProductForm["gender"],
    concentration: (f.concentration || undefined) as ProductForm["concentration"],
    families: f.families as ProductForm["families"],
    notes: { top: split(f.top), heart: split(f.heart), base: split(f.base) },
    longevity: n(f.longevity), sillage: n(f.sillage), seasons: f.seasons as ProductForm["seasons"],
    year: n(f.year), perfumer: f.perfumer || undefined, origin: f.origin || undefined,
    ingredients: f.ingredients || undefined, tagline: f.tagline, description: f.description,
    features: split(f.features, /\n/), image: f.image, images: split(f.images, /\n/),
    featured: f.featured, status: f.status, sample: f.sample,
    sizes: f.rows
      .filter((r) => r.ml.trim())
      .map((r) => ({
        ml: Number(r.ml.replace(",", ".")), price: Number(r.price.replace(",", ".")), stock: Number(r.stock || 0),
        sample: r.sample, gtin: r.gtin || undefined, batch: r.batch || undefined, expiry: r.expiry || undefined,
      })),
  };
}

function CatalogAdmin() {
  const { session, products } = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | keyof typeof STATUS>("");
  const [form, setForm] = useState<FormState | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [csv, setCsv] = useState<{ name: string; text: string } | null>(null);
  const [report, setReport] = useState<Awaited<ReturnType<typeof importProductsCsv>> | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    return products.filter(
      (p) =>
        (!status || p.status === status) &&
        (!needle || `${p.sku} ${p.name} ${p.brand ?? ""}`.toLocaleLowerCase("tr").includes(needle)),
    );
  }, [products, q, status]);

  if (!session.authenticated)
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Katalog yönetimi</h1>
        <p className="mt-3 text-sm text-fg-muted">Önce yönetim hesabıyla giriş yapın.</p>
        <Link to="/admin">
          <Button className="mt-6">Yönetime giriş</Button>
        </Link>
      </main>
    );

  async function run<T>(fn: () => Promise<T>, ok: string) {
    setBusy(true);
    try {
      const r = await fn();
      toast.success(ok);
      await router.invalidate();
      return r;
    } catch (e) {
      toast.error(e instanceof Error ? e.message.slice(0, 300) : "İşlem başarısız.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!form) return;
    const r = await run(() => saveProduct({ data: toPayload(form) }), `${form.sku} kaydedildi`);
    if (r) setForm(null);
  }

  async function download() {
    const text = await exportProductsCsv();
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `urunler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importCsv(dryRun: boolean) {
    if (!csv) return;
    setBusy(true);
    try {
      const r = await importProductsCsv({ data: { csv: csv.text, dryRun } });
      setReport(r);
      if (r.applied) {
        toast.success(`${r.count} ürün, ${r.variants} hacim içe aktarıldı`);
        setCsv(null);
        await router.invalidate();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message.slice(0, 300) : "İçe aktarma başarısız.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Yönetim</p>
          <h1 className="mt-2 font-display text-5xl">Katalog</h1>
          <p className="mt-2 font-mono text-sm text-fg-muted">{products.length} ürün</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin"><Button variant="outline">Admin</Button></Link>
          <Button variant="outline" onClick={() => void download()}>CSV indir</Button>
          <Button onClick={() => { setForm(blank()); setIsNew(true); }}>Yeni ürün</Button>
        </div>
      </div>

      <section className="mt-8 border border-solid border-border bg-bg-elevated p-4">
        <p className="font-display text-xl">CSV</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setReport(null);
              setCsv(file ? { name: file.name, text: await file.text() } : null);
            }}
          />
          <Button variant="outline" disabled={!csv || busy} onClick={() => void importCsv(true)}>Kontrol et</Button>
          <Button disabled={!csv || busy || !report || report.errors.length > 0 || report.applied} onClick={() => void importCsv(false)}>
            İçe aktar
          </Button>
        </div>
        {report ? (
          <div className="mt-3 text-sm">
            <p>{report.count} ürün · {report.variants} hacim {report.applied ? "aktarıldı" : "hazır"}.</p>
            {report.errors.length ? (
              <ul className="mt-2 max-h-40 overflow-y-auto text-red-700">
                {report.errors.map((e) => <li key={e}>• {e}</li>)}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="SKU, ad, marka" className="h-11 max-w-xs" />
        <select className="h-11 border border-border-strong bg-bg px-3" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="">Tüm durumlar</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto border border-solid border-border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-bg-wash font-mono text-xs tracking-wide text-fg-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-normal">Ürün</th>
              <th className="px-3 py-2 font-normal">Kategori</th>
              <th className="px-3 py-2 font-normal">Hacim · fiyat · stok</th>
              <th className="px-3 py-2 font-normal">Durum</th>
              <th className="px-3 py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.sku} className="border-t border-solid border-border align-top">
                <td className="px-3 py-3">
                  <div className="flex gap-3">
                    {p.image ? <img src={p.image} alt="" className="size-12 border border-border object-contain" /> : null}
                    <div>
                      <p className="font-medium">{p.name}{p.sample ? <span className="ml-2 font-mono text-[10px] text-taba">ÖRNEK</span> : null}</p>
                      <p className="font-mono text-xs text-fg-muted">{p.sku} · {p.brand ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-fg-muted">{CATEGORIES.find((c) => c.id === p.category)?.name ?? p.category}</td>
                <td className="px-3 py-3 font-mono text-xs">
                  {p.variantRows.map((v) => (
                    <p key={v.ml} className={v.stock === 0 ? "text-red-700" : undefined}>
                      {v.ml} ml · {formatPrice(v.price)} · {v.stock} ad.{v.sample ? " · deneme" : ""}
                    </p>
                  ))}
                </td>
                <td className="px-3 py-3">
                  <select
                    className="h-9 border border-border-strong bg-bg px-2 text-xs"
                    value={p.status}
                    disabled={busy}
                    onChange={(e) => void run(() => setProductStatus({ data: { sku: p.sku, status: e.target.value as keyof typeof STATUS } }), "Durum güncellendi")}
                  >
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => { setForm(fromProduct(p)); setIsNew(false); }}>Düzenle</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => {
                        if (window.prompt(`Silmek için SKU yazın: ${p.sku}`) === p.sku)
                          void run(() => deleteProduct({ data: { sku: p.sku } }), `${p.sku} silindi`);
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-deep/40 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-4xl border border-border bg-bg p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">{isNew ? "Yeni ürün" : `Düzenle · ${form.sku}`}</h2>
              <Button variant="outline" onClick={() => setForm(null)}>Kapat</Button>
            </div>
            <Editor form={form} setForm={setForm} isNew={isNew} />
            <div className="sticky bottom-0 mt-6 flex justify-end gap-2 border-t border-solid border-border bg-bg pt-4">
              <Button variant="outline" onClick={() => setForm(null)}>Vazgeç</Button>
              <Button disabled={busy} onClick={() => void save()}>Kaydet</Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function F({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={cn("flex flex-col gap-1 text-sm", wide && "sm:col-span-2")}>
      <span className="font-mono text-xs text-fg-muted">{label}</span>
      {children}
    </label>
  );
}

const box = "h-10 border border-border-strong bg-bg px-2";
const area = "min-h-20 border border-border-strong bg-bg p-2";

function Editor({ form, setForm, isNew }: { form: FormState; setForm: (f: FormState) => void; isNew: boolean }) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm({ ...form, [k]: v });
  const toggle = (k: "families" | "seasons", id: string) =>
    set(k, form[k].includes(id) ? form[k].filter((x) => x !== id) : [...form[k], id]);
  const setRow = (i: number, patch: Partial<Row>) =>
    set("rows", form.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <F label="SKU *"><input className={box} value={form.sku} disabled={!isNew} onChange={(e) => set("sku", e.target.value)} /></F>
      <F label="Ürün adı *"><input className={box} value={form.name} onChange={(e) => set("name", e.target.value)} /></F>
      <F label="Marka"><input className={box} value={form.brand} onChange={(e) => set("brand", e.target.value)} /></F>
      <F label="Kategori *">
        <select className={box} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </F>
      <F label="Cinsiyet">
        <select className={box} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
          <option value="">—</option>
          {GENDERS.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </F>
      <F label="Konsantrasyon">
        <select className={box} value={form.concentration} onChange={(e) => set("concentration", e.target.value)}>
          <option value="">—</option>
          {CONCENTRATIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </F>
      <F label="Koku ailesi" wide>
        <div className="flex flex-wrap gap-1.5">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" onClick={() => toggle("families", f.id)}
              className={cn("min-h-9 border px-2.5 text-xs", form.families.includes(f.id) ? "border-fg bg-fg text-bg-elevated" : "border-border-strong")}>
              {f.name}
            </button>
          ))}
        </div>
      </F>
      <F label="Üst notalar (virgülle)"><input className={box} value={form.top} onChange={(e) => set("top", e.target.value)} /></F>
      <F label="Kalp notalar (virgülle)"><input className={box} value={form.heart} onChange={(e) => set("heart", e.target.value)} /></F>
      <F label="Alt notalar (virgülle)"><input className={box} value={form.base} onChange={(e) => set("base", e.target.value)} /></F>
      <F label="Mevsim">
        <div className="flex flex-wrap gap-1.5">
          {SEASONS.map((s) => (
            <button key={s.id} type="button" onClick={() => toggle("seasons", s.id)}
              className={cn("min-h-9 border px-2.5 text-xs", form.seasons.includes(s.id) ? "border-fg bg-fg text-bg-elevated" : "border-border-strong")}>
              {s.name}
            </button>
          ))}
        </div>
      </F>
      <F label="Kalıcılık (1–5)"><input className={box} inputMode="numeric" value={form.longevity} onChange={(e) => set("longevity", e.target.value)} /></F>
      <F label="Yayılım (1–5)"><input className={box} inputMode="numeric" value={form.sillage} onChange={(e) => set("sillage", e.target.value)} /></F>
      <F label="Çıkış yılı"><input className={box} inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value)} /></F>
      <F label="Parfümör"><input className={box} value={form.perfumer} onChange={(e) => set("perfumer", e.target.value)} /></F>
      <F label="Menşei"><input className={box} value={form.origin} onChange={(e) => set("origin", e.target.value)} /></F>
      <F label="Durum">
        <select className={box} value={form.status} onChange={(e) => set("status", e.target.value as FormState["status"])}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </F>
      <F label="Kısa açıklama" wide><input className={box} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></F>
      <F label="Açıklama" wide><textarea className={area} value={form.description} onChange={(e) => set("description", e.target.value)} /></F>
      <F label="Öne çıkan özellikler (satır başına bir)" wide><textarea className={area} value={form.features} onChange={(e) => set("features", e.target.value)} /></F>
      <F label="İçerik (INCI)" wide><textarea className={area} value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} /></F>
      <F label="Ana görsel URL"><input className={box} value={form.image} onChange={(e) => set("image", e.target.value)} /></F>
      <F label="Ek görseller (satır başına URL)"><textarea className={area} value={form.images} onChange={(e) => set("images", e.target.value)} /></F>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Ana sayfada öne çıkar
      </label>

      <div className="sm:col-span-2">
        <p className="font-mono text-xs text-fg-muted">Hacimler *</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="font-mono text-xs text-fg-muted">
              <tr>{["ml", "Fiyat ₺", "Stok", "Barkod", "Parti", "SKT", "Deneme", ""].map((h) => <th key={h} className="px-1 py-1 text-left font-normal">{h}</th>)}</tr>
            </thead>
            <tbody>
              {form.rows.map((r, i) => (
                <tr key={i}>
                  <td className="p-1"><input className={cn(box, "w-20")} value={r.ml} onChange={(e) => setRow(i, { ml: e.target.value })} /></td>
                  <td className="p-1"><input className={cn(box, "w-24")} value={r.price} onChange={(e) => setRow(i, { price: e.target.value })} /></td>
                  <td className="p-1"><input className={cn(box, "w-20")} value={r.stock} onChange={(e) => setRow(i, { stock: e.target.value })} /></td>
                  <td className="p-1"><input className={cn(box, "w-36")} value={r.gtin} onChange={(e) => setRow(i, { gtin: e.target.value })} /></td>
                  <td className="p-1"><input className={cn(box, "w-24")} value={r.batch} onChange={(e) => setRow(i, { batch: e.target.value })} /></td>
                  <td className="p-1"><input className={cn(box, "w-24")} value={r.expiry} placeholder="AA/YYYY" onChange={(e) => setRow(i, { expiry: e.target.value })} /></td>
                  <td className="p-1 text-center"><input type="checkbox" checked={r.sample} onChange={(e) => setRow(i, { sample: e.target.checked })} /></td>
                  <td className="p-1"><Button size="sm" variant="outline" onClick={() => set("rows", form.rows.filter((_, j) => j !== i))}>Sil</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button size="sm" variant="outline" className="mt-2" onClick={() => set("rows", [...form.rows, emptyRow()])}>Hacim ekle</Button>
      </div>
    </div>
  );
}
