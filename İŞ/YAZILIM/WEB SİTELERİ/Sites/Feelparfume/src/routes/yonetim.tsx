import { useMemo, useState, type FormEvent } from "react";
import { BRAND } from "@/lib/brand";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Activity,
  Archive,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  bulkUpdateAdminProducts,
  getAdminAudit,
  getAdminCatalog,
  getAdminSession,
  updateAdminProduct,
  type AdminAuditEntry,
  type AdminCatalogItem,
  type ProductStatus,
} from "@/lib/catalog-admin";
import { getAdminOrders, pullCargoTracking, reviewOrder, saveShippingSettings, updateAdminOrder } from "@/lib/orders";
import { CargoBarcode } from "@/components/cargo-barcode";
import { trackingUrl, type ShippingRule } from "@/lib/shipping";
import type { AdminOrder } from "@/lib/order-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { payLabel } from "@/lib/commerce";
import { fulfillmentLabel, paymentLabel } from "@/lib/order-mail";
import { pageHead } from "@/lib/seo";

type Section = "overview" | "orders" | "products" | "activity" | "shipping";
type StatusFilter = "all" | ProductStatus;
const PAGE_SIZE = 24;
const sections: Record<
  Section,
  { label: string; description: string; icon: typeof LayoutDashboard }
> = {
  overview: { label: "Genel bakış", description: "", icon: LayoutDashboard },
  orders: { label: "Siparişler", description: "", icon: ShoppingBag },
  products: { label: "Ürünler", description: "", icon: Boxes },
  activity: { label: "Hareketler", description: "", icon: Activity },
  shipping: { label: "Kargo", description: "", icon: Truck },
};

export const Route = createFileRoute("/yonetim")({
  loader: async () => {
    const { readShippingRule } = await import("@/lib/shipping.server");
    const { yurticiConfigured } = await import("@/lib/yurtici.server");
    const session = await getAdminSession();
    const shipping = await readShippingRule();
    const yurtici = yurticiConfigured();
    if (!session.authenticated)
      return { session, items: [], orders: [], audit: [], shipping, yurtici };
    const can = (key: string) =>
      Boolean(session.user?.isOwner || session.user?.permissions.includes(key));
    const [items, orders, audit] = await Promise.all([
      can("products.view") ? getAdminCatalog() : Promise.resolve([]),
      can("orders.view") ? getAdminOrders() : Promise.resolve([]),
      can("logs.view") ? getAdminAudit() : Promise.resolve([]),
    ]);
    return { session, items, orders, audit, shipping, yurtici };
  },
  head: () =>
    pageHead({
      title: "Yönetim",
      description: `${BRAND.name} yönetim merkezi`,
      path: "/yonetim",
      noindex: true,
    }),
  component: AdminPage,
});

function AdminPage() {
  const { session, items, orders, audit, shipping, yurtici } = Route.useLoaderData();
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
        <section className="w-full max-w-md border border-border bg-bg-elevated p-7 sm:p-9">
          <h1 className="font-display text-4xl">{BRAND.name}</h1>
          {session.configured ? (
            <form className="mt-7 space-y-4" onSubmit={login}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Kullanıcı adı</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
  return (
    <Workspace
      initialItems={items}
      initialOrders={orders}
      initialAudit={audit}
      shipping={shipping}
      yurtici={yurtici}
      permissions={session.user!.permissions}
      isOwner={session.user!.isOwner}
    />
  );
}

function Workspace({
  initialItems,
  initialOrders,
  initialAudit,
  shipping,
  yurtici,
  permissions,
  isOwner,
}: {
  initialItems: AdminCatalogItem[];
  initialOrders: AdminOrder[];
  initialAudit: AdminAuditEntry[];
  shipping: ShippingRule;
  yurtici: boolean;
  permissions: string[];
  isOwner: boolean;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [items, setItems] = useState(initialItems);
  const [orders, setOrders] = useState(initialOrders);
  const [audit, setAudit] = useState(initialAudit);
  const allowed = (key: string) => isOwner || permissions.includes(key);
  const visibleSections = (Object.keys(sections) as Section[]).filter(
    (key) =>
      key === "overview" ||
      (key === "products" && allowed("products.view")) ||
      (key === "orders" && allowed("orders.view")) ||
      (key === "activity" && allowed("logs.view")) ||
      (key === "shipping" && (isOwner || allowed("delivery_settings.change_fee"))),
  );
  async function refreshAll() {
    try {
      const [a, b, c] = await Promise.all([
        allowed("products.view") ? getAdminCatalog() : Promise.resolve([]),
        allowed("orders.view") ? getAdminOrders() : Promise.resolve([]),
        allowed("logs.view") ? getAdminAudit() : Promise.resolve([]),
      ]);
      setItems(a);
      setOrders(b);
      setAudit(c);
      toast.success("Yönetim verileri yenilendi.");
    } catch {
      toast.error("Veriler yenilenemedi.");
    }
  }
  async function logout() {
    await adminLogout();
    await router.invalidate();
  }
  const meta = sections[section];
  return (
    <main className="min-h-[calc(100vh-7rem)] bg-bg-wash lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-bg-elevated lg:flex lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:p-5">
        <div className="border-b border-border pb-5">
          <p className="font-display text-2xl">{BRAND.name}</p>
          <Link to="/katalog-yonetimi" className="mt-3 flex min-h-11 items-center text-sm">
            Katalog
          </Link>
          <Link to="/admin" className="flex min-h-11 items-center text-sm text-fg-muted">
            Site
          </Link>
        </div>
        <nav aria-label="Yönetim bölümleri" className="mt-5 space-y-1">
          {visibleSections.map((key) => (
            <Nav key={key} name={key} active={section === key} onClick={() => setSection(key)} />
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t border-border pt-5">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => void refreshAll()}
          >
            <RefreshCw className="size-4" />
            Verileri yenile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-fg-muted"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
            Çıkış yap
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="sticky top-0 z-20 border-b border-border bg-bg-elevated/95 px-4 py-3 backdrop-blur lg:hidden">
          <select
            aria-label="Yönetim bölümü"
            value={section}
            onChange={(e) => setSection(e.target.value as Section)}
            className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm font-medium"
          >
            {visibleSections.map((key) => (
              <option key={key} value={key}>
                {sections[key].label}
              </option>
            ))}
          </select>
        </div>
        <header className="border-b border-border bg-bg-elevated px-4 py-6 sm:px-7 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
            <h1 className="font-display text-3xl sm:text-4xl">{meta.label}</h1>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex lg:hidden"
              onClick={() => void logout()}
            >
              <LogOut className="size-4" />
              Çıkış
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
          {section === "overview" && (
            <Overview items={items} orders={orders} audit={audit} go={setSection} />
          )}
          {section === "products" && (
            <Products
              items={items}
              setItems={setItems}
              refreshAudit={async () => setAudit(await getAdminAudit())}
            />
          )}
          {section === "orders" && <Orders orders={orders} setOrders={setOrders} yurtici={yurtici} />}
          {section === "activity" && <ActivityLog entries={audit} items={items} />}
          {section === "shipping" && <ShippingSettings initial={shipping} />}
        </div>
      </div>
    </main>
  );
}

function Nav({ name, active, onClick }: { name: Section; active: boolean; onClick: () => void }) {
  const Icon = sections[name].icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-sm transition-colors",
        active ? "bg-accent text-fg-on-deep" : "text-fg-muted hover:bg-bg-wash hover:text-fg",
      )}
    >
      <Icon className="size-4" />
      {sections[name].label}
    </button>
  );
}

function Overview({
  items,
  orders,
  audit,
  go,
}: {
  items: AdminCatalogItem[];
  orders: AdminOrder[];
  audit: AdminAuditEntry[];
  go: (s: Section) => void;
}) {
  const active = items.filter((x) => x.status === "active").length,
    inactive = items.filter((x) => x.status === "inactive").length,
    archived = items.filter((x) => x.status === "archived").length,
    fresh = orders.filter((x) => x.status === "new").length;
  const cards = [
    {
      label: "Yayındaki ürün",
      value: active,
      note: `${items.length} toplam kayıt`,
      icon: Boxes,
      target: "products" as Section,
    },
    {
      label: "Bekleyen talep",
      value: fresh,
      note: `${orders.length} son sipariş talebi`,
      icon: ClipboardList,
      target: "orders" as Section,
    },
    {
      label: "Pasif ürün",
      value: inactive,
      note: "Mağazada görünmez",
      icon: EyeOff,
      target: "products" as Section,
    },
    {
      label: "Arşivlenen",
      value: archived,
      note: "Geri alınabilir",
      icon: Archive,
      target: "products" as Section,
    },
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, target }) => (
          <button
            key={label}
            type="button"
            onClick={() => go(target)}
            className="border border-border bg-bg-elevated p-5 text-left hover:border-border-strong"
          >
            <div className="flex justify-between">
              <p className="text-sm text-fg-muted">{label}</p>
              <Icon className="size-4 text-accent" />
            </div>
            <p className="mt-4 font-display text-4xl">{value}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Panel title="Yeni sipariş talepleri" action="Tümünü gör" onAction={() => go("orders")}>
          {orders
            .filter((x) => x.status === "new")
            .slice(0, 5)
            .map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => go("orders")}
                className="flex w-full items-center justify-between gap-3 border-t border-border px-5 py-4 text-left hover:bg-bg-wash"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.customer.name}</p>
                  <p className="mt-1 text-xs text-fg-muted">
                    {date(o.at)} · {o.items.length} kalem
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">{formatPrice(o.total)}</p>
              </button>
            ))}
          {fresh === 0 && <Empty text="Bekleyen yeni sipariş talebi yok." />}
        </Panel>
        <Panel title="Son hareketler" action="Tümü" onAction={() => go("activity")}>
          {audit.slice(0, 5).map((e) => (
            <div key={e.id} className="border-t border-border px-5 py-3">
              <p className="text-sm">{actionLabel(e.action)}</p>
              <p className="mt-1 truncate font-mono text-xs text-fg-muted">
                {e.productKey} · {date(e.createdAt)}
              </p>
            </div>
          ))}
          {audit.length === 0 && <Empty text="Henüz yönetim hareketi yok." />}
        </Panel>
      </div>
    </>
  );
}

function Panel({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-bg-elevated">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="font-display text-2xl">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onAction}>
          {action}
          <ChevronRight className="size-4" />
        </Button>
      </div>
      {children}
    </section>
  );
}

function Products({
  items,
  setItems,
  refreshAudit,
}: {
  items: AdminCatalogItem[];
  setItems: (x: AdminCatalogItem[]) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [query, setQuery] = useState(""),
    [line, setLine] = useState("all"),
    [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState<Set<string>>(new Set()),
    [editing, setEditing] = useState<AdminCatalogItem | null>(null),
    [busy, setBusy] = useState(false);
  const lines = useMemo(
    () => [...new Map(items.map((x) => [x.lineKey, x.lineTitle])).entries()],
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
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    safe = Math.min(page, pages),
    shown = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE),
    all = shown.length > 0 && shown.every((x) => selected.has(x.productKey));
  function toggle(key: string) {
    setSelected((old) => {
      const n = new Set(old);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }
  async function bulk(next: ProductStatus) {
    if (!selected.size) return;
    setBusy(true);
    try {
      await bulkUpdateAdminProducts({ data: { productKeys: [...selected], status: next } });
      const count = selected.size;
      setItems(
        items.map((x) =>
          selected.has(x.productKey)
            ? { ...x, status: next, updatedAt: new Date().toISOString() }
            : x,
        ),
      );
      setSelected(new Set());
      await refreshAudit();
      toast.success(`${count} ürün güncellendi.`);
    } catch {
      toast.error("Toplu işlem tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="border border-border bg-bg-elevated">
        <div className="grid gap-3 border-b border-border p-4 lg:grid-cols-[minmax(16rem,1fr)_13rem_11rem]">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Ürün adı, kod veya kategori"
          />
          <Select
            label="Kategori"
            value={line}
            onChange={(v) => {
              setLine(v);
              setPage(1);
            }}
            options={[["all", "Tüm kategoriler"], ...lines]}
          />
          <Select
            label="Durum"
            value={status}
            onChange={(v) => {
              setStatus(v as StatusFilter);
              setPage(1);
            }}
            options={[
              ["all", "Tüm durumlar"],
              ["active", "Yayında"],
              ["inactive", "Pasif"],
              ["archived", "Arşivde"],
            ]}
          />
        </div>
        {selected.size > 0 && (
          <div
            role="status"
            className="flex flex-wrap items-center gap-2 border-b border-border bg-accent/5 px-4 py-3"
          >
            <p className="w-full text-sm font-medium sm:mr-auto sm:w-auto">
              {selected.size} ürün seçildi
            </p>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => void bulk("active")}>
              <Eye className="size-4" />
              Yayınla
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => void bulk("inactive")}
            >
              <EyeOff className="size-4" />
              Pasife al
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-danger"
              disabled={busy}
              onClick={() => void bulk("archived")}
            >
              <Archive className="size-4" />
              Arşivle
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              <X className="size-4" />
              <span className="sr-only sm:not-sr-only">Temizle</span>
            </Button>
          </div>
        )}
        <table className="w-full table-fixed border-collapse text-left text-sm md:table-auto">
          <thead className="bg-bg-wash text-xs text-fg-muted">
            <tr>
              <th className="w-11 px-3 py-3 sm:w-12 sm:px-4">
                <input
                  type="checkbox"
                  aria-label="Bu sayfadaki ürünleri seç"
                  checked={all}
                  onChange={() =>
                    setSelected((old) => {
                      const n = new Set(old);
                      shown.forEach((x) => (all ? n.delete(x.productKey) : n.add(x.productKey)));
                      return n;
                    })
                  }
                />
              </th>
              <th className="px-2 py-3 font-medium">Ürün</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Kategori</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Fiyat</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Durum</th>
              <th className="w-12 px-2 py-3 text-right font-medium sm:w-28">
                <span className="sr-only sm:not-sr-only">İşlem</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((x) => (
              <tr key={x.productKey} className="hover:bg-bg-wash/70">
                <td className="px-3 py-3 sm:px-4">
                  <input
                    type="checkbox"
                    aria-label={`${x.name} seç`}
                    checked={selected.has(x.productKey)}
                    onChange={() => toggle(x.productKey)}
                  />
                </td>
                <td className="min-w-0 px-2 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-11 shrink-0 bg-bg-wash sm:size-12">
                      <img
                        src={x.image}
                        alt=""
                        className="size-full object-contain p-1"
                        loading="lazy"
                        width={1500}
                        height={1500}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{x.name}</p>
                      <p className="mt-0.5 truncate font-mono text-xs text-fg-muted sm:text-xs">
                        {x.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-fg-muted md:table-cell">{x.lineTitle}</td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {x.price == null ? "Teklif" : formatPrice(x.price)}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge status={x.status} />
                </td>
                <td className="px-2 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`${x.name} düzenle`}
                    onClick={() => setEditing(x)}
                  >
                    <Settings2 className="size-4" />
                    <span className="hidden sm:inline">Düzenle</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <Empty text="Bu filtrelerle eşleşen ürün yok." />}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-fg-muted">
            {filtered.length} ürün · Sayfa {safe}/{pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              aria-label="Önceki sayfa"
              disabled={safe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Sonraki sayfa"
              disabled={safe >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
      {editing && (
        <Editor
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={async (next) => {
            setItems(items.map((x) => (x.productKey === next.productKey ? next : x)));
            setEditing(next);
            await refreshAudit();
          }}
        />
      )}
    </>
  );
}

function Editor({
  item,
  onClose,
  onSaved,
}: {
  item: AdminCatalogItem;
  onClose: () => void;
  onSaved: (x: AdminCatalogItem) => Promise<void>;
}) {
  const [name, setName] = useState(item.name),
    [price, setPrice] = useState(item.price == null ? "" : String(item.price)),
    [status, setStatus] = useState(item.status),
    [saving, setSaving] = useState(false);
  const changed =
    name.trim() !== item.name ||
    price.trim() !== (item.price == null ? "" : String(item.price)) ||
    status !== item.status;
  async function save(e: FormEvent) {
    e.preventDefault();
    const p = price.trim() === "" ? null : Number(price.replace(",", "."));
    if (p != null && (!Number.isFinite(p) || p < 0)) return toast.error("Geçerli bir fiyat girin.");
    setSaving(true);
    try {
      await updateAdminProduct({
        data: {
          productKey: item.productKey,
          name: name.trim(),
          price: p,
          status,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
          imageAlt: item.imageAlt,
        },
      });
      await onSaved({
        ...item,
        name: name.trim(),
        price: p,
        status,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Ürün kaydedildi.");
    } catch {
      toast.error("Değişiklik kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/25"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        className="h-full w-full max-w-lg overflow-y-auto bg-bg-elevated shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-elevated px-5 py-4">
          <div>
            <p className="font-mono text-xs text-fg-muted">
              {item.lineKey.toUpperCase()} · {item.id}
            </p>
            <h2 id="edit-title" className="mt-1 font-display text-2xl">
              Ürünü düzenle
            </h2>
          </div>
          <Button size="sm" variant="ghost" aria-label="Kapat" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <form onSubmit={save} className="p-5">
          <div className="mx-auto aspect-square max-w-[18rem] bg-bg-wash">
            <img
              src={item.image}
              alt=""
              className="size-full object-contain p-4"
              width={1500}
              height={1500}
            />
          </div>
          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Ürün adı</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={120}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Fiyat (TL)</span>
              <Input
                inputMode="decimal"
                value={price}
                placeholder="Teklif ile"
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Yayın durumu</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
              >
                <option value="active">Yayında</option>
                <option value="inactive">Pasif</option>
                <option value="archived">Arşivde</option>
              </select>
            </label>
            <div className="bg-bg-wash p-4 text-xs leading-5 text-fg-muted">
              <p>Kaynak adı: {item.baseName}</p>
              <p>
                Kaynak fiyat:{" "}
                {item.basePrice == null ? "Tanımlı değil" : formatPrice(item.basePrice)}
              </p>
              <p>
                Son değişiklik: {item.updatedAt ? date(item.updatedAt) : "Henüz değiştirilmedi"}
              </p>
            </div>
          </div>
          <div className="mt-7 flex justify-end gap-2 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={!changed || saving}>
              <Save className="size-4" />
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function ShippingSettings({ initial }: { initial: ShippingRule }) {
  const [fee, setFee] = useState(String(initial.fee));
  const [freeFrom, setFreeFrom] = useState(String(initial.freeFrom));
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await saveShippingSettings({ data: { fee: Number(fee), freeFrom: Number(freeFrom) } });
      toast.success("Kaydedildi");
    } catch {
      toast.error("Kargo kuralı kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={(event) => void save(event)} className="max-w-md space-y-4 border border-border bg-bg-elevated p-5">
      <label className="block text-sm">
        Kargo ücreti
        <Input className="mt-2" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} required />
      </label>
      <label className="block text-sm">
        Ücretsiz eşik
        <Input className="mt-2" inputMode="numeric" value={freeFrom} onChange={(e) => setFreeFrom(e.target.value)} required />
      </label>
      <p className="text-sm">Yurt dışı kapalı</p>
      <Button type="submit" disabled={busy}>
        <Save className="size-4" />
        Kaydet
      </Button>
    </form>
  );
}

function Orders({
  orders,
  setOrders,
  yurtici,
}: {
  orders: AdminOrder[];
  setOrders: (x: AdminOrder[]) => void;
  yurtici: boolean;
}) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState<"all" | AdminOrder["status"]>("all"),
    [busy, setBusy] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return orders.filter(
      (o) =>
        (status === "all" || o.status === status) &&
        (!q ||
          `${o.id} ${o.customer.name} ${o.customer.email} ${o.customer.phone}`
            .toLocaleLowerCase("tr-TR")
            .includes(q)),
    );
  }, [orders, query, status]);
  async function reviewed(id: string) {
    setBusy(id);
    try {
      await reviewOrder({ data: { id } });
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: "reviewed" } : o)));
      toast.success("Sipariş talebi incelendi olarak işaretlendi.");
    } catch {
      toast.error("Sipariş durumu kaydedilemedi.");
    } finally {
      setBusy(null);
    }
  }
  async function patch(
    order: AdminOrder,
    next: { paymentStatus?: AdminOrder["paymentStatus"]; shippingStatus?: AdminOrder["shippingStatus"] },
  ) {
    setBusy(order.id);
    const paymentStatus = next.paymentStatus ?? order.paymentStatus;
    const shippingStatus = next.shippingStatus ?? order.shippingStatus;
    try {
      const saved = await updateAdminOrder({
        data: {
          id: order.id,
          status: order.status,
          adminNote: order.adminNote,
          paymentStatus,
          shippingStatus,
          carrier: order.carrier,
          trackingCode: order.trackingCode,
          invoiceNumber: order.invoiceNumber,
          refundedAmount: order.refundedAmount,
        },
      });
      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? {
                ...o,
                paymentStatus,
                shippingStatus,
                carrier: saved.carrier,
                trackingCode: saved.trackingCode,
                cargoKey: saved.cargoKey,
              }
            : o,
        ),
      );
    } catch {
      toast.error("Sipariş durumu kaydedilemedi.");
    } finally {
      setBusy(null);
    }
  }
  async function track(order: AdminOrder) {
    setBusy(order.id);
    try {
      const saved = await pullCargoTracking({ data: { id: order.id } });
      setOrders(
        orders.map((o) =>
          o.id === order.id ? { ...o, trackingCode: saved.trackingCode, carrier: "Yurtiçi" } : o,
        ),
      );
    } catch {
      toast.error("Takip no alınamadı.");
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="border border-border bg-bg-elevated">
      <div className="grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_12rem]">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Ad, telefon, e-posta veya talep no"
        />
        <Select
          label="Sipariş durumu"
          value={status}
          onChange={(v) => setStatus(v as typeof status)}
          options={[
            ["all", "Tüm talepler"],
            ["new", "Yeni"],
            ["reviewed", "İncelendi"],
          ]}
        />
      </div>
      <div className="divide-y divide-border">
        {filtered.map((o) => (
          <details key={o.id} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 hover:bg-bg-wash sm:px-5">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  o.status === "new" ? "bg-accent" : "bg-fg-subtle",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{o.customer.name}</p>
                <p className="mt-1 truncate text-xs text-fg-muted">
                  {o.id} · {date(o.at)}
                </p>
              </div>
              <p className="hidden text-sm text-fg-muted sm:block">{o.items.length} kalem</p>
              <p className="shrink-0 text-sm font-medium">{formatPrice(o.total)}</p>
              <ChevronRight className="size-4 shrink-0 text-fg-muted transition-transform group-open:rotate-90" />
            </summary>
            <div className="border-t border-border bg-bg-wash px-4 py-5 sm:px-10">
              <div className="grid gap-5 text-sm lg:grid-cols-2">
                <div>
                  <h3 className="font-medium">Müşteri ve teslimat</h3>
                  <div className="mt-3 space-y-1 text-fg-muted">
                    <p>{o.customer.email}</p>
                    <p>{o.customer.phone}</p>
                    <p>{o.customer.address}</p>
                    <p>
                      {o.customer.district} / {o.customer.city} · {o.customer.postal}
                    </p>
                    {o.customer.taxNumber && <p>Vergi / TC no: {o.customer.taxNumber}</p>}
                    <p>{payLabel(o.customer.pay)}</p>
                    <p>
                      {paymentLabel(o.paymentStatus)} · {fulfillmentLabel(o.shippingStatus)}
                    </p>
                    {o.couponCode ? <p>Kupon {o.couponCode}</p> : null}
                    {o.discount > 0 ? <p>İndirim {formatPrice(o.discount)}</p> : null}
                    {o.giftWrap ? <p>Hediye paketi</p> : null}
                    {o.giftNote ? <p>{o.giftNote}</p> : null}
                    {o.hidePrices ? <p>Fiyatsız irsaliye</p> : null}
                    {o.carrier ? <p>{o.carrier}</p> : null}
                    {o.cargoKey ? <CargoBarcode code={o.cargoKey} /> : null}
                    {o.trackingCode ? (
                      trackingUrl(o.trackingCode) ? (
                        <a className="text-taba hover:underline" href={trackingUrl(o.trackingCode)} rel="noreferrer">
                          Takip {o.trackingCode}
                        </a>
                      ) : (
                        <p>Takip {o.trackingCode}</p>
                      )
                    ) : null}
                    {o.customer.note && <p className="mt-3 text-fg">Not: {o.customer.note}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Ürünler</h3>
                  <ul className="mt-3 space-y-2 text-fg-muted">
                    {o.items.map((x) => (
                      <li key={`${x.sku}:${x.color}`} className="flex justify-between gap-3">
                        <span>
                          {x.name} · {x.colorName} × {x.qty}
                        </span>
                        <span className="shrink-0">
                          {x.pricePending
                            ? "Fiyat teyidi"
                            : formatPrice((x.unitPrice * x.qty) / 100)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between border-t border-border pt-3 font-medium">
                    <span>Toplam</span>
                    <span>{formatPrice(o.total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {o.status === "new" ? (
                  <Button disabled={busy === o.id} onClick={() => void reviewed(o.id)}>
                    <Check className="size-4" />
                    İncelendi
                  </Button>
                ) : null}
                {o.paymentStatus !== "paid" && o.paymentStatus !== "refunded" ? (
                  <Button
                    variant="outline"
                    disabled={busy === o.id}
                    onClick={() => void patch(o, { paymentStatus: "paid" })}
                  >
                    Ödendi
                  </Button>
                ) : null}
                {o.shippingStatus !== "preparing" ? (
                  <Button
                    variant="outline"
                    disabled={busy === o.id}
                    onClick={() => void patch(o, { shippingStatus: "preparing" })}
                  >
                    Hazırlanıyor
                  </Button>
                ) : null}
                {o.shippingStatus !== "shipped" ? (
                  <Button
                    variant="outline"
                    disabled={busy === o.id}
                    onClick={() => void patch(o, { shippingStatus: "shipped" })}
                  >
                    Kargoda
                  </Button>
                ) : null}
                {yurtici && o.cargoKey && !o.trackingCode ? (
                  <Button
                    variant="outline"
                    disabled={busy === o.id}
                    onClick={() => void track(o)}
                  >
                    Takip al
                  </Button>
                ) : null}
                {o.shippingStatus !== "delivered" ? (
                  <Button
                    variant="outline"
                    disabled={busy === o.id}
                    onClick={() => void patch(o, { shippingStatus: "delivered" })}
                  >
                    Teslim
                  </Button>
                ) : null}
              </div>
            </div>
          </details>
        ))}
        {filtered.length === 0 && <Empty text="Bu filtrelerle eşleşen sipariş talebi yok." />}
      </div>
    </section>
  );
}

function ActivityLog({
  entries,
  items,
}: {
  entries: AdminAuditEntry[];
  items: AdminCatalogItem[];
}) {
  const [query, setQuery] = useState("");
  const map = useMemo(() => new Map(items.map((x) => [x.productKey, x])), [items]),
    q = query.trim().toLocaleLowerCase("tr-TR"),
    filtered = entries.filter(
      (e) =>
        !q ||
        `${e.productKey} ${map.get(e.productKey)?.name ?? ""} ${actionLabel(e.action)}`
          .toLocaleLowerCase("tr-TR")
          .includes(q),
    );
  return (
    <section className="border border-border bg-bg-elevated">
      <div className="border-b border-border p-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Ürün veya işlem ara" />
      </div>
      <div className="divide-y divide-border">
        {filtered.map((e) => (
          <article key={e.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{map.get(e.productKey)?.name ?? e.productKey}</p>
                <span className="rounded-full bg-bg-wash px-2 py-1 text-xs text-fg-muted">
                  {actionLabel(e.action)}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-fg-muted">{e.productKey}</p>
            </div>
            <p className="text-xs text-fg-muted sm:text-right">
              {date(e.createdAt)}
              <br />
              Yönetici
            </p>
          </article>
        ))}
        {filtered.length === 0 && <Empty text="Eşleşen yönetim hareketi yok." />}
      </div>
    </section>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">Ara</span>
      <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" />
      <Input
        className="pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly (readonly [string, string])[];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
      >
        {options.map(([k, t]) => (
          <option key={k} value={k}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
function Badge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
        status === "active"
          ? "bg-accent/10 text-accent"
          : status === "inactive"
            ? "bg-bg-wash text-fg-muted"
            : "bg-danger/10 text-danger",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status === "active" ? "Yayında" : status === "inactive" ? "Pasif" : "Arşivde"}
    </span>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="px-5 py-12 text-center text-sm text-fg-muted">{text}</p>;
}
function date(value: string) {
  return new Date(value).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
function actionLabel(action: string) {
  if (action === "archive" || action.endsWith("archived")) return "Arşivlendi";
  if (action.endsWith("inactive")) return "Pasife alındı";
  if (action.endsWith("active")) return "Yayınlandı";
  return "Ürün güncellendi";
}
