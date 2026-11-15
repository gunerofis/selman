import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { Archive, Eye, EyeOff, RefreshCw, Save, Search, Settings2, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  getAdminCatalog,
  getAdminSession,
  updateAdminProduct,
  type AdminCatalogItem,
  type ProductStatus,
} from "@/lib/catalog-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

type StatusFilter = "all" | ProductStatus;
const PAGE_SIZE = 18;

export const Route = createFileRoute("/urun-temizlik")({
  loader: async () => {
    const session = await getAdminSession();
    if (!session.authenticated) return { session, items: [] as AdminCatalogItem[] };
    const can = (key: string) =>
      Boolean(session.user?.isOwner || session.user?.permissions.includes(key));
    const items = can("products.view") ? await getAdminCatalog() : [];
    return { session, items };
  },
  head: () =>
    pageHead({
      title: "Ürün Temizlik",
      description: "Geçici ürün temizleme ekranı",
      path: "/urun-temizlik",
      noindex: true,
    }),
  component: CleanupPage,
});

function CleanupPage() {
  const { session, items } = Route.useLoaderData();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [busy, setBusy] = useState(false);
  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await adminLogin({
        data: { username: username || undefined, password, otp: otp || undefined },
      });
      if (!result.ok) {
        if ("twoFactorRequired" in result && result.twoFactorRequired) setNeedsOtp(true);
        return toast.error(result.error);
      }
      setPassword("");
      await router.invalidate();
    } catch {
      toast.error("Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }
  if (!session.authenticated)
    return (
      <main className="grid min-h-[calc(100vh-7rem)] place-items-center bg-bg-wash px-4 py-12">
        <section className="w-full max-w-md border border-border bg-bg-elevated p-7 shadow-[0_24px_80px_rgba(15,35,25,.08)] sm:p-9">
          <div className="flex size-11 items-center justify-center rounded-full bg-accent text-fg-on-deep">
            <Settings2 className="size-5" />
          </div>
          <p className="mt-7 font-mono text-xs tracking-[.16em] text-fg-muted uppercase">Sweb</p>
          <h1 className="mt-2 font-display text-4xl">Ürün temizlik</h1>
          <p className="mt-3 text-sm leading-6 text-fg-muted">
            Büyük görsellerle ürünleri hızlıca gözden geçirin, pasife alın veya arşivleyin.
          </p>
          {session.configured ? (
            <form className="mt-7 space-y-4" onSubmit={login}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Kullanıcı adı</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Sahip girişi için boş bırakın"
                  autoFocus
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Yönetim parolası</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              {needsOtp && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Doğrulama kodu</span>
                  <Input
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </label>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Kontrol ediliyor…" : "Giriş yap"}
              </Button>
            </form>
          ) : (
            <p
              role="alert"
              className="mt-7 border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
            >
              Yönetim erişimi yapılandırılmadı.
            </p>
          )}
        </section>
      </main>
    );
  return <Cleanup initialItems={items} />;
}

function Cleanup({ initialItems }: { initialItems: AdminCatalogItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const lines = useMemo(
    () => [...new Map(items.map((x) => [x.lineKey, x.lineTitle])).entries()],
    [items],
  );
  const counts = useMemo(
    () => ({
      active: items.filter((x) => x.status === "active").length,
      inactive: items.filter((x) => x.status === "inactive").length,
      archived: items.filter((x) => x.status === "archived").length,
    }),
    [items],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return items.filter(
      (x) =>
        (line === "all" || x.lineKey === line) &&
        (status === "all" || x.status === status) &&
        (!q || `${x.name} ${x.id} ${x.lineTitle}`.toLocaleLowerCase("tr-TR").includes(q)),
    );
  }, [items, line, query, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safe = Math.min(page, pages);
  const shown = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  function update(next: AdminCatalogItem) {
    setItems((old) => old.map((x) => (x.productKey === next.productKey ? next : x)));
  }
  async function refresh() {
    setRefreshing(true);
    try {
      setItems(await getAdminCatalog());
      toast.success("Ürünler yenilendi.");
    } catch {
      toast.error("Yenilenemedi.");
    } finally {
      setRefreshing(false);
    }
  }
  async function logout() {
    await adminLogout();
    await router.invalidate();
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-bg-wash">
      <header className="border-b border-border bg-bg-elevated px-4 py-6 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[.14em] text-fg-muted uppercase">
                Sweb / Geçici temizlik ekranı
              </p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl">Ürün temizlik</h1>
              <p className="mt-1 text-sm text-fg-muted">
                Büyük görsellerle ürünleri seçin; isim ve fiyatı düzenleyin, pasife alın veya
                arşivleyin.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/yonetim"
                className="inline-flex h-11 items-center justify-center gap-2 border border-border-strong px-3 text-xs font-medium text-fg transition-colors hover:border-fg"
              >
                Yönetim merkezi
              </Link>
              <Button
                variant="outline"
                size="sm"
                disabled={refreshing}
                onClick={() => void refresh()}
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
                Yenile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-fg-muted"
                onClick={() => void logout()}
              >
                <LogOut className="size-4" />
                Çıkış
              </Button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <Tally label="Yayında" value={counts.active} tone="active" />
            <Tally label="Pasif" value={counts.inactive} tone="inactive" />
            <Tally label="Arşivde" value={counts.archived} tone="archived" />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-border bg-bg-elevated/95 px-4 py-3 backdrop-blur sm:px-7 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-[minmax(16rem,1fr)_14rem_12rem]">
          <label className="relative">
            <span className="sr-only">Ara</span>
            <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" />
            <Input
              className="pl-10"
              placeholder="Ürün adı, kod veya kategori"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            <span className="sr-only">Kategori</span>
            <select
              value={line}
              onChange={(e) => {
                setLine(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
            >
              <option value="all">Tüm kategoriler</option>
              {lines.map(([k, t]) => (
                <option key={k} value={k}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Durum</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
            >
              <option value="all">Tüm durumlar</option>
              <option value="active">Yayında</option>
              <option value="inactive">Pasif</option>
              <option value="archived">Arşivde</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 lg:px-10">
        {shown.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-fg-muted">
            Bu filtrelerle eşleşen ürün yok.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((item) => (
              <Card key={item.productKey} item={item} onChange={update} />
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-fg-muted">
            {filtered.length} ürün · Sayfa {safe}/{pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safe >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Sonraki
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  item,
  onChange,
}: {
  item: AdminCatalogItem;
  onChange: (x: AdminCatalogItem) => void;
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price == null ? "" : String(item.price));
  const [saving, setSaving] = useState(false);
  const dirty =
    name.trim() !== item.name || price.trim() !== (item.price == null ? "" : String(item.price));

  async function persist(nextStatus?: ProductStatus) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return toast.error("Ürün adı en az 2 karakter olmalı.");
    const p = price.trim() === "" ? null : Number(price.replace(",", "."));
    if (p != null && (!Number.isFinite(p) || p < 0)) return toast.error("Geçerli bir fiyat girin.");
    const status = nextStatus ?? item.status;
    setSaving(true);
    try {
      await updateAdminProduct({
        data: {
          productKey: item.productKey,
          name: trimmed,
          price: p,
          status,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
          imageAlt: item.imageAlt,
        },
      });
      onChange({
        ...item,
        name: trimmed,
        price: p,
        status,
        updatedAt: new Date().toISOString(),
      });
      toast.success(
        nextStatus === "inactive"
          ? "Pasife alındı."
          : nextStatus === "archived"
            ? "Arşivlendi."
            : nextStatus === "active"
              ? "Yayınlandı."
              : "Kaydedildi.",
      );
    } catch {
      toast.error("İşlem tamamlanamadı.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article
      className={cn(
        "flex flex-col border border-border bg-bg-elevated transition-opacity",
        item.status !== "active" && "opacity-70",
      )}
    >
      <div className="relative aspect-square bg-bg-wash">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="size-full object-contain p-4"
          loading="lazy"
          width={1500}
          height={1500}
        />
        <span className="absolute top-3 left-3">
          <StatusBadge status={item.status} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="truncate font-mono text-xs text-fg-muted">
          {item.lineTitle} · {item.id}
        </p>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-fg-muted">Ürün adı</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-fg-muted">Fiyat (TL)</span>
          <Input
            inputMode="decimal"
            value={price}
            placeholder="Teklif ile"
            onChange={(e) => setPrice(e.target.value)}
          />
          {price.trim() !== "" && Number.isFinite(Number(price.replace(",", "."))) && (
            <span className="mt-1 block text-xs text-fg-subtle">
              {formatPrice(Number(price.replace(",", ".")))}
            </span>
          )}
        </label>

        <div className="mt-auto space-y-2 pt-1">
          {dirty && (
            <Button
              size="sm"
              className="w-full"
              disabled={saving}
              onClick={() => void persist()}
            >
              <Save className="size-4" />
              {saving ? "Kaydediliyor…" : "İsim / fiyatı kaydet"}
            </Button>
          )}
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={saving || item.status === "active"}
              onClick={() => void persist("active")}
            >
              <Eye className="size-4" />
              Yayında
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={saving || item.status === "inactive"}
              onClick={() => void persist("inactive")}
            >
              <EyeOff className="size-4" />
              Pasif
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-danger"
              disabled={saving || item.status === "archived"}
              onClick={() => void persist("archived")}
            >
              <Archive className="size-4" />
              Arşiv
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Tally({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: ProductStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        tone === "active"
          ? "border-accent/30 bg-accent/10 text-accent"
          : tone === "inactive"
            ? "border-border bg-bg-wash text-fg-muted"
            : "border-danger/30 bg-danger/10 text-danger",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}: <strong className="font-semibold">{value}</strong>
    </span>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs shadow-sm",
        status === "active"
          ? "bg-accent text-fg-on-deep"
          : status === "inactive"
            ? "bg-bg-elevated text-fg-muted"
            : "bg-danger text-fg-on-deep",
      )}
    >
      {status === "active" ? "Yayında" : status === "inactive" ? "Pasif" : "Arşivde"}
    </span>
  );
}
