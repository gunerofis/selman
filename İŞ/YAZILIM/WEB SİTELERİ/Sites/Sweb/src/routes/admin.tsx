import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Activity,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Save,
  Search,
  Settings,
  ShieldCheck,
  KeyRound,
  UserCog,
  Users,
  CheckCircle2,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  getAdminAudit,
  getAdminCatalog,
  getAdminSession,
  updateAdminProduct,
  type AdminAuditEntry,
  type AdminCatalogItem,
  type ProductStatus,
} from "@/lib/catalog-admin";
import {
  deleteAdminScript,
  getAdminScripts,
  saveAdminScript,
  type SiteScript,
} from "@/lib/site-scripts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { getAdminOrders, updateAdminOrder } from "@/lib/orders";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  type AdminOrder,
  type OrderStatus,
  type PaymentStatus,
  type ShippingStatus,
} from "@/lib/order-input";
import {
  DEFAULT_SITE_CONFIG,
  getAdminSiteConfig,
  saveAdminSiteConfig,
  type SiteConfig,
} from "@/lib/site-config";
import {
  APPROVAL_MODES,
  PERMISSION_MODULES,
  PERMISSION_SCOPES,
  deleteAdminRole,
  deleteAdminUser,
  getAdminAccessData,
  permissionLabel,
  reviewAdminApproval,
  revokeAdminSession,
  saveAdminRole,
  saveAdminUser,
  type PermissionRule,
} from "@/lib/admin-access";
import {
  deleteAdminRecord,
  getAdminOperations,
  saveAdminRecord,
  type AdminRecord,
  type AdminRecordModule,
  type AdminRecordValue,
} from "@/lib/admin-operations";

type Area =
  | "overview"
  | "products"
  | "orders"
  | "operations"
  | "analytics"
  | "content"
  | "navigation"
  | "seo"
  | "scripts"
  | "activity"
  | "users"
  | "roles"
  | "approvals"
  | "security"
  | "system";
const nav: Record<Area, { label: string; icon: typeof Package }> = {
  overview: { label: "Genel bakış", icon: LayoutDashboard },
  products: { label: "Ürün ve SEO", icon: Package },
  orders: { label: "Siparişler", icon: ShoppingBag },
  operations: { label: "İş akışları", icon: BriefcaseBusiness },
  analytics: { label: "Analiz", icon: Activity },
  content: { label: "Site içeriği", icon: Store },
  navigation: { label: "Navbar ve footer", icon: Menu },
  seo: { label: "Site SEO", icon: Globe2 },
  scripts: { label: "Site kodları", icon: Code2 },
  activity: { label: "İşlem geçmişi", icon: Activity },
  users: { label: "Kullanıcılar", icon: Users },
  roles: { label: "Roller ve yetkiler", icon: UserCog },
  approvals: { label: "İşlem onayları", icon: CheckCircle2 },
  security: { label: "Güvenlik", icon: KeyRound },
  system: { label: "Sistem", icon: Settings },
};

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const session = await getAdminSession();
    if (!session.authenticated)
      return {
        session,
        items: [],
        orders: [],
        operations: [],
        scripts: [],
        audit: [],
        siteConfig: DEFAULT_SITE_CONFIG,
        access: null,
      };
    const can = (key: string) =>
      Boolean(session.user?.isOwner || session.user?.permissions.includes(key));
    const canAny = (keys: string[]) => keys.some(can);
    const [items, orders, operations, scripts, audit, siteConfig] = await Promise.all([
      can("products.view") ? getAdminCatalog() : Promise.resolve([]),
      can("orders.view") ? getAdminOrders() : Promise.resolve([]),
      getAdminOperations(),
      can("theme.edit_code") ? getAdminScripts() : Promise.resolve([]),
      can("logs.view") ? getAdminAudit() : Promise.resolve([]),
      canAny(["settings.view", "content.view", "seo.edit", "theme.edit_menu", "theme.edit_footer"])
        ? getAdminSiteConfig()
        : Promise.resolve(DEFAULT_SITE_CONFIG),
    ]);
    const access = await getAdminAccessData();
    return { session, items, orders, operations, scripts, audit, siteConfig, access };
  },
  head: () =>
    pageHead({
      title: "Teknik Admin",
      description: "Sweb teknik yönetim",
      path: "/admin",
      noindex: true,
    }),
  component: Admin,
});

function Admin() {
  const data = Route.useLoaderData(),
    router = useRouter();
  const [password, setPassword] = useState(""),
    [username, setUsername] = useState(""),
    [otp, setOtp] = useState(""),
    [needsOtp, setNeedsOtp] = useState(false),
    [setupSecret, setSetupSecret] = useState<string | null>(null),
    [busy, setBusy] = useState(false);
  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await adminLogin({
        data: { username: username || undefined, password, otp: otp || undefined },
      });
      if (!r.ok) {
        if ("twoFactorRequired" in r && r.twoFactorRequired) {
          setNeedsOtp(true);
          setSetupSecret(r.setupSecret ?? null);
        }
        return toast.error(r.error);
      }
      await router.invalidate();
    } catch {
      toast.error("Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }
  if (!data.session.authenticated)
    return (
      <main className="grid min-h-dvh place-items-center bg-bg-wash p-4">
        <section className="w-full max-w-md border border-border bg-bg-elevated p-8">
          <ShieldCheck className="size-10 text-accent" />
          <p className="mt-6 font-mono text-xs tracking-widest text-fg-muted uppercase">
            Sweb · Teknik erişim
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin</h1>
          <p className="mt-3 text-sm text-fg-muted">
            SEO, ürün verisi ve site kodları için tam yetkili alan.
          </p>
          <form onSubmit={login} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Kullanıcı adı</span>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Sahip girişi için boş bırakın"
                autoFocus
              />
            </label>
            {needsOtp && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">6 haneli doğrulama kodu</span>
                  <Input
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </label>
                {setupSecret && (
                  <div className="border border-border bg-bg-wash p-3 text-xs">
                    <p>Authenticator uygulamasına bu anahtarı ekleyin:</p>
                    <code className="mt-2 block break-all font-mono">{setupSecret}</code>
                  </div>
                )}
              </>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Admin parolası</span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Kontrol ediliyor…" : "Giriş yap"}
            </Button>
          </form>
        </section>
      </main>
    );
  return (
    <Console
      initialItems={data.items}
      initialOrders={data.orders}
      initialOperations={data.operations}
      initialScripts={data.scripts}
      initialAudit={data.audit}
      initialSiteConfig={data.siteConfig}
      initialAccess={data.access!}
      identity={data.session.user!}
    />
  );
}

function Console({
  initialItems,
  initialOrders,
  initialOperations,
  initialScripts,
  initialAudit,
  initialSiteConfig,
  initialAccess,
  identity,
}: {
  initialItems: AdminCatalogItem[];
  initialOrders: AdminOrder[];
  initialOperations: AdminRecord[];
  initialScripts: SiteScript[];
  initialAudit: AdminAuditEntry[];
  initialSiteConfig: SiteConfig;
  initialAccess: Awaited<ReturnType<typeof getAdminAccessData>>;
  identity: NonNullable<Awaited<ReturnType<typeof getAdminSession>>["user"]>;
}) {
  const router = useRouter();
  const [area, setArea] = useState<Area>("overview"),
    [items, setItems] = useState(initialItems),
    [orders, setOrders] = useState(initialOrders),
    [operations, setOperations] = useState(initialOperations),
    [scripts, setScripts] = useState(initialScripts),
    [audit, setAudit] = useState(initialAudit),
    [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const [access, setAccess] = useState(initialAccess);
  const allowed = (key: string) => identity.isOwner || identity.permissions.includes(key);
  const visibleAreas = (Object.keys(nav) as Area[]).filter((key) => {
    const permissions: Partial<Record<Area, string[]>> = {
      products: ["products.view"],
      orders: ["orders.view"],
      operations: OPERATION_MODULES.flatMap((module) => operationViewPermissions(module)),
      analytics: ["analytics.view", "analytics.sales", "analytics.customers", "analytics.quotes"],
      content: ["settings.view", "content.view"],
      navigation: ["settings.view", "content.manage_menu", "theme.edit_menu", "theme.edit_footer"],
      seo: ["settings.view", "seo.edit", "seo.edit_title"],
      scripts: ["theme.edit_code"],
      activity: ["logs.view"],
      users: ["users.view"],
      roles: ["roles.view"],
      approvals: ["approvals.view"],
      security: ["security.view_sessions", "security.view_logins"],
    };
    return !permissions[key] || permissions[key]!.some(allowed);
  });
  async function refreshAccess() {
    setAccess(await getAdminAccessData());
  }
  async function logout() {
    await adminLogout();
    await router.invalidate();
  }
  async function refreshAudit() {
    setAudit(await getAdminAudit());
  }
  return (
    <main className="min-h-dvh bg-[#eef2ed] lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-[#d5ddd6] bg-[#102f25] p-4 text-white lg:min-h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between lg:block">
          <div>
            <p className="font-display text-2xl">Sweb Admin</p>
            <p className="mt-1 text-xs text-white/60">Teknik yönetim</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 lg:hidden"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
        <nav className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
          {visibleAreas.map((key) => {
            const Icon = nav[key].icon;
            return (
              <button
                key={key}
                onClick={() => setArea(key)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded px-3 text-left text-sm",
                  area === key
                    ? "bg-white text-[#102f25]"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {nav[key].label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 hidden border-t border-white/15 pt-4 lg:block">
          <Link
            to="/yonetim"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white"
          >
            Sade yönetim
            <ExternalLink className="size-3" />
          </Link>
          <button
            onClick={() => void logout()}
            className="mt-1 flex w-full items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white"
          >
            <LogOut className="size-4" />
            Çıkış
          </button>
        </div>
      </aside>
      <section className="min-w-0 p-4 sm:p-7 lg:p-10">
        <header className="mb-6">
          <p className="font-mono text-xs tracking-widest text-fg-muted uppercase">
            Admin / {nav[area].label}
          </p>
          <h1 className="mt-1 font-display text-4xl">{nav[area].label}</h1>
        </header>
        {area === "overview" && (
          <Overview
            items={items}
            orders={orders}
            operations={operations}
            scripts={scripts}
            siteConfig={siteConfig}
          />
        )}
        {area === "products" && (
          <ProductSeo items={items} setItems={setItems} refreshAudit={refreshAudit} />
        )}{" "}
        {area === "orders" && (
          <Orders orders={orders} setOrders={setOrders} refreshAudit={refreshAudit} />
        )}{" "}
        {area === "operations" && (
          <OperationsAdmin
            records={operations}
            setRecords={setOperations}
            access={access}
            identity={identity}
            refreshAudit={refreshAudit}
          />
        )}{" "}
        {area === "analytics" && <AnalyticsAdmin records={operations} orders={orders} />}{" "}
        {area === "content" && (
          <SiteConfigEditor
            mode="content"
            value={siteConfig}
            onSaved={setSiteConfig}
            refreshAudit={refreshAudit}
          />
        )}{" "}
        {area === "navigation" && (
          <NavigationEditor
            value={siteConfig}
            onSaved={setSiteConfig}
            refreshAudit={refreshAudit}
          />
        )}{" "}
        {area === "seo" && (
          <SiteConfigEditor
            mode="seo"
            value={siteConfig}
            onSaved={setSiteConfig}
            refreshAudit={refreshAudit}
          />
        )}{" "}
        {area === "scripts" && (
          <Scripts scripts={scripts} setScripts={setScripts} refreshAudit={refreshAudit} />
        )}{" "}
        {area === "activity" && <Audit entries={audit} />}{" "}
        {area === "users" && <UsersAdmin access={access} refresh={refreshAccess} />}{" "}
        {area === "roles" && <RolesAdmin access={access} refresh={refreshAccess} />}{" "}
        {area === "approvals" && <ApprovalsAdmin access={access} refresh={refreshAccess} />}{" "}
        {area === "security" && (
          <SecurityAdmin
            access={access}
            currentSessionId={identity.sessionId}
            refresh={refreshAccess}
          />
        )}{" "}
        {area === "system" && (
          <System items={items} orders={orders} scripts={scripts} config={siteConfig} />
        )}
      </section>
    </main>
  );
}

function Overview({
  items,
  orders,
  operations,
  scripts,
  siteConfig,
}: {
  items: AdminCatalogItem[];
  orders: AdminOrder[];
  operations: AdminRecord[];
  scripts: SiteScript[];
  siteConfig: SiteConfig;
}) {
  const scope = [
    "Ürün adı, fiyatı, yayın durumu ve ürün SEO bilgileri",
    "Sipariş inceleme, operasyon durumu ve yönetici notu",
    "Marka, iletişim, yasal işletme ve ana sayfa metinleri",
    "Navbar ve footer bağlantı adı, konumu ve görünürlüğü",
    "Site geneli başlık, açıklama ve sosyal paylaşım görseli",
    "İzleme ve entegrasyon kodlarının kontrollü yayını",
    "Tüm yönetim değişikliklerinin işlem geçmişi",
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Ürünler"
          value={`${items.length}`}
          note={`${items.filter((x) => x.status === "active").length} yayında`}
        />
        <Card
          title="Açık sipariş"
          value={`${orders.filter((x) => !["completed", "cancelled", "archived"].includes(x.status)).length}`}
          note={`${orders.filter((x) => x.status === "new").length} yeni`}
        />
        <Card
          title="Açık iş akışı"
          value={`${operations.filter((x) => !["completed", "closed", "cancelled", "archived", "inactive"].includes(x.status)).length}`}
          note={`${operations.length} yönetilen kayıt`}
        />
        <Card
          title="Menü bağlantısı"
          value={`${siteConfig.links.filter((x) => x.visible).length}`}
          note={`${siteConfig.links.length} toplam`}
        />
        <Card
          title="Site kodu"
          value={`${scripts.filter((x) => x.active).length}`}
          note={`${scripts.length} kayıt`}
        />
      </div>
      <section className="border border-border bg-bg-elevated p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-accent" />
          <h2 className="font-display text-2xl">Yönetim kapsamı</h2>
        </div>
        <div className="mt-5 grid gap-px bg-border sm:grid-cols-2">
          {scope.map((item) => (
            <div key={item} className="flex gap-3 bg-bg-elevated p-4 text-sm">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Orders({
  orders,
  setOrders,
  refreshAudit,
}: {
  orders: AdminOrder[];
  setOrders: (x: AdminOrder[]) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(orders[0] ?? null);
  const [status, setStatus] = useState<OrderStatus>(selected?.status ?? "new");
  const [note, setNote] = useState(selected?.adminNote ?? "");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    selected?.paymentStatus ?? "pending",
  );
  const [shippingStatus, setShippingStatus] = useState<ShippingStatus>(
    selected?.shippingStatus ?? "pending",
  );
  const [carrier, setCarrier] = useState(selected?.carrier ?? "");
  const [trackingCode, setTrackingCode] = useState(selected?.trackingCode ?? "");
  const [invoiceNumber, setInvoiceNumber] = useState(selected?.invoiceNumber ?? "");
  const [refundedAmount, setRefundedAmount] = useState(selected?.refundedAmount ?? 0);
  const [busy, setBusy] = useState(false);
  const filtered = orders.filter((order) =>
    `${order.id} ${order.customer.name} ${order.customer.email}`
      .toLocaleLowerCase("tr-TR")
      .includes(q.toLocaleLowerCase("tr-TR")),
  );
  function choose(order: AdminOrder) {
    setSelected(order);
    setStatus(order.status);
    setNote(order.adminNote);
    setPaymentStatus(order.paymentStatus);
    setShippingStatus(order.shippingStatus);
    setCarrier(order.carrier);
    setTrackingCode(order.trackingCode);
    setInvoiceNumber(order.invoiceNumber);
    setRefundedAmount(order.refundedAmount);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (
      status !== selected.status &&
      ["cancelled", "archived"].includes(status) &&
      !confirm(`${selected.id} siparişi “${orderStatusLabel(status)}” durumuna alınsın mı?`)
    )
      return;
    setBusy(true);
    try {
      await updateAdminOrder({
        data: {
          id: selected.id,
          status,
          adminNote: note,
          paymentStatus,
          shippingStatus,
          carrier,
          trackingCode,
          invoiceNumber,
          refundedAmount,
        },
      });
      const next = {
        ...selected,
        status,
        adminNote: note,
        paymentStatus,
        shippingStatus,
        carrier,
        trackingCode,
        invoiceNumber,
        refundedAmount,
      };
      setSelected(next);
      setOrders(orders.map((x) => (x.id === next.id ? next : x)));
      await refreshAudit();
      toast.success("Sipariş güncellendi.");
    } catch {
      toast.error("Sipariş güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
      <section className="border border-border bg-bg-elevated">
        <div className="border-b border-border p-3">
          <Input
            placeholder="Sipariş, müşteri veya e-posta ara"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-2 text-xs text-fg-muted">{filtered.length} sipariş</p>
        </div>
        <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => choose(order)}
              className={cn(
                "w-full p-3 text-left",
                selected?.id === order.id ? "bg-accent/10" : "hover:bg-bg-wash",
              )}
            >
              <div className="flex justify-between gap-3">
                <p className="truncate text-sm font-medium">{order.customer.name}</p>
                <span className="text-xs text-fg-muted">{orderStatusLabel(order.status)}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-fg-muted">
                {order.id} · {formatPrice(order.total)}
              </p>
            </button>
          ))}
        </div>
      </section>
      {selected ? (
        <form onSubmit={save} className="border border-border bg-bg-elevated p-5 sm:p-7">
          <p className="font-mono text-xs text-fg-muted">{selected.id}</p>
          <h2 className="mt-2 font-display text-3xl">{selected.customer.name}</h2>
          <div className="mt-5 grid gap-px bg-border sm:grid-cols-2">
            {[
              ["E-posta", selected.customer.email],
              ["Telefon", selected.customer.phone],
              ["Teslimat", `${selected.customer.city} / ${selected.customer.district}`],
              ["Toplam", formatPrice(selected.total)],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg-elevated p-4">
                <p className="text-xs text-fg-muted">{k}</p>
                <p className="mt-1 text-sm">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border border-border p-4">
            {selected.items.map((item) => (
              <p key={`${item.sku}:${item.color}`} className="text-sm">
                {item.qty} × {item.name} · {item.colorName}
              </p>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium">Sipariş durumu</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
            >
              {ORDER_STATUSES.map((x) => (
                <option key={x} value={x}>
                  {orderStatusLabel(x)}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Ödeme durumu</span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                {PAYMENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {paymentStatusLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Kargo durumu</span>
              <select
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value as ShippingStatus)}
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                {SHIPPING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {shippingStatusLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Kargo firması</span>
              <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} maxLength={120} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Takip kodu</span>
              <Input
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                maxLength={160}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Fatura numarası</span>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                maxLength={160}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">İade tutarı (TL)</span>
              <Input
                type="number"
                min={0}
                max={selected.total}
                step="0.01"
                value={refundedAmount}
                onChange={(e) => setRefundedAmount(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium">Yönetici notu</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={2000}
              className="min-h-32 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
            />
          </label>
          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={busy}>
              <Save className="size-4" />
              {busy ? "Kaydediliyor…" : "Siparişi kaydet"}
            </Button>
          </div>
        </form>
      ) : (
        <p>Henüz sipariş yok.</p>
      )}
    </div>
  );
}

type OperationField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea";
};
type OperationModuleConfig = {
  key: AdminRecordModule;
  label: string;
  group: "Satış" | "Operasyon" | "İçerik" | "Ayarlar";
  singular: string;
  viewPermission: string;
  viewPermissions?: string[];
  statuses: Array<[string, string]>;
  fields: OperationField[];
};

const COMMON_CONTACT_FIELDS: OperationField[] = [
  { key: "contactName", label: "İlgili kişi" },
  { key: "email", label: "E-posta", type: "email" },
  { key: "phone", label: "Telefon", type: "tel" },
];
const ACTIVE_STATUSES: Array<[string, string]> = [
  ["active", "Aktif"],
  ["inactive", "Pasif"],
  ["archived", "Arşiv"],
];

const OPERATION_MODULES: OperationModuleConfig[] = [
  {
    key: "quotes",
    label: "Teklifler",
    group: "Satış",
    singular: "teklif",
    viewPermission: "quotes.view",
    statuses: [
      ["new", "Yeni"],
      ["reviewing", "İnceleniyor"],
      ["priced", "Fiyatlandı"],
      ["sent", "Gönderildi"],
      ["approved", "Onaylandı"],
      ["rejected", "Reddedildi"],
      ["converted", "Siparişe dönüştü"],
    ],
    fields: [
      ...COMMON_CONTACT_FIELDS,
      { key: "amount", label: "Teklif tutarı", type: "number" },
      { key: "discount", label: "İskonto (%)", type: "number" },
      { key: "quantity", label: "Miktar", type: "number" },
      { key: "validUntil", label: "Geçerlilik tarihi", type: "date" },
      { key: "notes", label: "Teklif notu", type: "textarea" },
    ],
  },
  {
    key: "custom_production",
    label: "Özel üretim",
    group: "Satış",
    singular: "özel üretim talebi",
    viewPermission: "custom_production.view",
    statuses: [
      ["new", "Yeni"],
      ["reviewing", "İnceleniyor"],
      ["priced", "Fiyatlandı"],
      ["sample", "Numune"],
      ["in_production", "Üretimde"],
      ["completed", "Tamamlandı"],
      ["closed", "Kapandı"],
    ],
    fields: [
      ...COMMON_CONTACT_FIELDS,
      { key: "measurements", label: "Ölçüler" },
      { key: "quantity", label: "Adet", type: "number" },
      { key: "amount", label: "Fiyat", type: "number" },
      { key: "dueDate", label: "Termin", type: "date" },
      { key: "technicalNote", label: "Teknik not", type: "textarea" },
    ],
  },
  {
    key: "customers",
    label: "Müşteriler",
    group: "Satış",
    singular: "müşteri",
    viewPermission: "customers.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "email", label: "E-posta", type: "email" },
      { key: "phone", label: "Telefon", type: "tel" },
      { key: "address", label: "Adres", type: "textarea" },
      { key: "group", label: "Müşteri grubu" },
      { key: "tags", label: "Etiketler" },
      { key: "notes", label: "Notlar", type: "textarea" },
    ],
  },
  {
    key: "companies",
    label: "Kurumsal müşteriler",
    group: "Satış",
    singular: "firma",
    viewPermission: "companies.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      ...COMMON_CONTACT_FIELDS,
      { key: "taxOffice", label: "Vergi dairesi" },
      { key: "taxNumber", label: "Vergi numarası" },
      { key: "discount", label: "İskonto (%)", type: "number" },
      { key: "paymentTerm", label: "Ödeme vadesi" },
      { key: "billingAddress", label: "Fatura adresi", type: "textarea" },
    ],
  },
  {
    key: "inventory",
    label: "Stok",
    group: "Operasyon",
    singular: "stok kaydı",
    viewPermission: "inventory.view",
    statuses: [
      ["in_stock", "Stokta"],
      ["low", "Kritik"],
      ["out", "Tükendi"],
      ["counting", "Sayımda"],
    ],
    fields: [
      { key: "sku", label: "SKU" },
      { key: "quantity", label: "Mevcut adet", type: "number" },
      { key: "minimum", label: "Minimum stok", type: "number" },
      { key: "unit", label: "Birim" },
      { key: "movementNote", label: "Hareket notu", type: "textarea" },
    ],
  },
  {
    key: "warehouses",
    label: "Depolar",
    group: "Operasyon",
    singular: "depo",
    viewPermission: "warehouses.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "manager", label: "Sorumlu" },
      { key: "phone", label: "Telefon", type: "tel" },
      { key: "address", label: "Adres", type: "textarea" },
      { key: "capacity", label: "Kapasite" },
    ],
  },
  {
    key: "production",
    label: "Üretim",
    group: "Operasyon",
    singular: "üretim emri",
    viewPermission: "production.view",
    statuses: [
      ["planned", "Planlandı"],
      ["in_production", "Üretimde"],
      ["blocked", "Beklemede"],
      ["completed", "Tamamlandı"],
      ["cancelled", "İptal"],
    ],
    fields: [
      { key: "quantity", label: "Üretim adedi", type: "number" },
      { key: "operation", label: "Operasyon" },
      { key: "staff", label: "Personel" },
      { key: "dueDate", label: "Termin", type: "date" },
      { key: "waste", label: "Fire", type: "number" },
      { key: "notes", label: "Üretim notu", type: "textarea" },
    ],
  },
  {
    key: "shipping",
    label: "Kargo",
    group: "Operasyon",
    singular: "kargo",
    viewPermission: "shipping.view",
    statuses: [
      ["waiting", "Bekliyor"],
      ["prepared", "Hazırlandı"],
      ["shipped", "Gönderildi"],
      ["delivered", "Teslim edildi"],
      ["cancelled", "İptal"],
    ],
    fields: [
      { key: "orderNumber", label: "Sipariş numarası" },
      { key: "carrier", label: "Kargo firması" },
      { key: "tracking", label: "Takip numarası" },
      { key: "recipient", label: "Alıcı" },
      { key: "shippedAt", label: "Gönderim tarihi", type: "date" },
      { key: "notes", label: "Kargo notu", type: "textarea" },
    ],
  },
  {
    key: "pricing",
    label: "Fiyatlandırma",
    group: "Satış",
    singular: "fiyat kuralı",
    viewPermission: "pricing.view_sale",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "salePrice", label: "Satış fiyatı", type: "number" },
      { key: "cost", label: "Maliyet", type: "number" },
      { key: "wholesale", label: "Toptan fiyat", type: "number" },
      { key: "corporate", label: "Kurumsal fiyat", type: "number" },
      { key: "campaign", label: "Kampanyalı fiyat", type: "number" },
      { key: "notes", label: "Fiyat notu", type: "textarea" },
    ],
  },
  {
    key: "discounts",
    label: "İndirimler",
    group: "Satış",
    singular: "indirim",
    viewPermission: "discounts.view",
    statuses: [
      ["draft", "Taslak"],
      ["active", "Aktif"],
      ["inactive", "Pasif"],
      ["expired", "Süresi doldu"],
    ],
    fields: [
      { key: "code", label: "İndirim kodu" },
      { key: "value", label: "İndirim değeri", type: "number" },
      { key: "minimum", label: "Minimum sepet", type: "number" },
      { key: "usageLimit", label: "Kullanım limiti", type: "number" },
      { key: "startDate", label: "Başlangıç", type: "date" },
      { key: "endDate", label: "Bitiş", type: "date" },
    ],
  },
  {
    key: "blog",
    label: "Blog ve rehber",
    group: "İçerik",
    singular: "yazı",
    viewPermission: "blog.view",
    statuses: [
      ["draft", "Taslak"],
      ["published", "Yayında"],
      ["unpublished", "Yayından kaldırıldı"],
      ["archived", "Arşiv"],
    ],
    fields: [
      { key: "slug", label: "URL" },
      { key: "category", label: "Kategori" },
      { key: "seoTitle", label: "SEO başlığı" },
      { key: "seoDescription", label: "SEO açıklaması", type: "textarea" },
      { key: "body", label: "İçerik", type: "textarea" },
    ],
  },
  {
    key: "reviews",
    label: "Değerlendirmeler",
    group: "İçerik",
    singular: "değerlendirme",
    viewPermission: "reviews.view",
    statuses: [
      ["pending", "Bekliyor"],
      ["approved", "Onaylandı"],
      ["rejected", "Reddedildi"],
    ],
    fields: [
      { key: "customer", label: "Müşteri" },
      { key: "rating", label: "Puan", type: "number" },
      { key: "comment", label: "Yorum", type: "textarea" },
      { key: "reply", label: "Yanıt", type: "textarea" },
    ],
  },
  {
    key: "forms",
    label: "Form talepleri",
    group: "İçerik",
    singular: "form talebi",
    viewPermission: "forms.view_contact",
    viewPermissions: [
      "forms.view_contact",
      "forms.view_quotes",
      "forms.view_complaints",
      "forms.view_design",
    ],
    statuses: [
      ["new", "Yeni"],
      ["assigned", "Atandı"],
      ["replied", "Yanıtlandı"],
      ["closed", "Kapandı"],
    ],
    fields: [
      ...COMMON_CONTACT_FIELDS,
      { key: "formType", label: "Form türü" },
      { key: "orderNumber", label: "Sipariş numarası" },
      { key: "message", label: "Mesaj", type: "textarea" },
      { key: "internalNote", label: "İç not", type: "textarea" },
    ],
  },
  {
    key: "newsletter",
    label: "Bülten",
    group: "İçerik",
    singular: "bülten kaydı",
    viewPermission: "newsletter.view_subscribers",
    statuses: [
      ["active", "Abone"],
      ["unsubscribed", "Ayrıldı"],
      ["draft", "Kampanya taslağı"],
      ["sent", "Kampanya gönderildi"],
    ],
    fields: [
      { key: "email", label: "E-posta", type: "email" },
      { key: "subject", label: "Kampanya konusu" },
      { key: "content", label: "Kampanya içeriği", type: "textarea" },
      { key: "consentDate", label: "Onay tarihi", type: "date" },
    ],
  },
  {
    key: "finance",
    label: "Finans",
    group: "Satış",
    singular: "finans kaydı",
    viewPermission: "finance.view",
    statuses: [
      ["pending", "Bekliyor"],
      ["paid", "Ödendi"],
      ["refunded", "İade edildi"],
      ["cancelled", "İptal"],
    ],
    fields: [
      { key: "type", label: "İşlem türü" },
      { key: "amount", label: "Tutar", type: "number" },
      { key: "cost", label: "Maliyet", type: "number" },
      { key: "invoice", label: "Fatura numarası" },
      { key: "date", label: "İşlem tarihi", type: "date" },
      { key: "notes", label: "Finans notu", type: "textarea" },
    ],
  },
  {
    key: "payment_settings",
    label: "Ödeme ayarları",
    group: "Ayarlar",
    singular: "ödeme yöntemi",
    viewPermission: "payment_settings.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "provider", label: "Sağlayıcı" },
      { key: "method", label: "Ödeme yöntemi" },
      { key: "account", label: "Hesap / tanım" },
      { key: "installments", label: "Taksit seçenekleri" },
      { key: "notes", label: "Yönetim notu", type: "textarea" },
    ],
  },
  {
    key: "delivery_settings",
    label: "Teslimat ayarları",
    group: "Ayarlar",
    singular: "teslimat kuralı",
    viewPermission: "delivery_settings.manage_carriers",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "carrier", label: "Kargo firması" },
      { key: "fee", label: "Kargo ücreti", type: "number" },
      { key: "freeLimit", label: "Ücretsiz kargo limiti", type: "number" },
      { key: "deliveryTime", label: "Teslimat süresi" },
      { key: "region", label: "Bölge" },
      { key: "rule", label: "Kural", type: "textarea" },
    ],
  },
  {
    key: "tax",
    label: "Vergi",
    group: "Ayarlar",
    singular: "vergi kuralı",
    viewPermission: "tax.view_rates",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "rate", label: "KDV oranı (%)", type: "number" },
      { key: "class", label: "Vergi sınıfı" },
      { key: "scope", label: "Kapsam" },
      { key: "notes", label: "Açıklama", type: "textarea" },
    ],
  },
  {
    key: "domain",
    label: "Domain",
    group: "Ayarlar",
    singular: "domain kaydı",
    viewPermission: "domain.view",
    statuses: [
      ["pending", "Doğrulama bekliyor"],
      ["active", "Aktif"],
      ["redirected", "Yönlendiriliyor"],
      ["inactive", "Pasif"],
    ],
    fields: [
      { key: "hostname", label: "Alan adı" },
      { key: "target", label: "Yönlendirme hedefi" },
      { key: "ssl", label: "SSL durumu" },
      { key: "notes", label: "Not", type: "textarea" },
    ],
  },
  {
    key: "integrations",
    label: "Entegrasyonlar",
    group: "Ayarlar",
    singular: "entegrasyon",
    viewPermission: "integrations.view",
    statuses: [
      ["active", "Aktif"],
      ["inactive", "Pasif"],
      ["error", "Hata"],
    ],
    fields: [
      { key: "provider", label: "Sağlayıcı" },
      { key: "endpoint", label: "Uç nokta" },
      { key: "webhook", label: "Webhook" },
      { key: "lastSync", label: "Son eşitleme" },
      { key: "notes", label: "Not", type: "textarea" },
    ],
  },
  {
    key: "pixels",
    label: "Piksel ve reklam",
    group: "Ayarlar",
    singular: "ölçüm kaydı",
    viewPermission: "pixels.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "provider", label: "Platform" },
      { key: "publicId", label: "Piksel / ölçüm kimliği" },
      { key: "events", label: "Olaylar" },
      { key: "notes", label: "Not", type: "textarea" },
    ],
  },
  {
    key: "media",
    label: "Dosyalar",
    group: "İçerik",
    singular: "dosya kaydı",
    viewPermission: "media.view",
    statuses: ACTIVE_STATUSES,
    fields: [
      { key: "url", label: "Dosya adresi" },
      { key: "folder", label: "Klasör" },
      { key: "alt", label: "Alternatif metin" },
      { key: "contentType", label: "Dosya türü" },
      { key: "notes", label: "Not", type: "textarea" },
    ],
  },
];

function operationViewPermissions(module: OperationModuleConfig) {
  return module.viewPermissions ?? [module.viewPermission];
}

function OperationsAdmin({
  records,
  setRecords,
  access,
  identity,
  refreshAudit,
}: {
  records: AdminRecord[];
  setRecords: (records: AdminRecord[]) => void;
  access: Awaited<ReturnType<typeof getAdminAccessData>>;
  identity: NonNullable<Awaited<ReturnType<typeof getAdminSession>>["user"]>;
  refreshAudit: () => Promise<void>;
}) {
  const modules = OPERATION_MODULES.filter(
    (module) =>
      identity.isOwner ||
      operationViewPermissions(module).some((permission) =>
        identity.permissions.includes(permission),
      ),
  );
  const [moduleKey, setModuleKey] = useState<AdminRecordModule>(modules[0]?.key ?? "quotes");
  const config = modules.find((x) => x.key === moduleKey) ?? modules[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const emptyDraft = (next: OperationModuleConfig) => ({
    id: undefined as string | undefined,
    title: "",
    reference: "",
    status: next.statuses[0][0],
    assignedId: null as string | null,
    category: "",
    warehouse: "",
    brand: "",
    customerGroup: "",
    salesChannel: "",
    data: {} as Record<string, AdminRecordValue>,
  });
  const [draft, setDraft] = useState(() => emptyDraft(config));
  const [savedSignature, setSavedSignature] = useState(() => JSON.stringify(emptyDraft(config)));
  if (!config) return <p>Bu alanda görüntüleme yetkiniz yok.</p>;
  const moduleRecords = records.filter((record) => record.module === config.key);
  const filtered = moduleRecords.filter((record) => {
    const text = `${record.title} ${record.reference ?? ""} ${Object.values(record.data).join(" ")}`;
    return (
      (statusFilter === "all" || record.status === statusFilter) &&
      text.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))
    );
  });
  const dirty = JSON.stringify(draft) !== savedSignature;
  function chooseModule(next: OperationModuleConfig) {
    setModuleKey(next.key);
    setSelectedId(null);
    const empty = emptyDraft(next);
    setDraft(empty);
    setSavedSignature(JSON.stringify(empty));
    setQuery("");
    setStatusFilter("all");
  }
  function chooseRecord(record: AdminRecord) {
    setSelectedId(record.id);
    const nextDraft = {
      id: record.id,
      title: record.title,
      reference: record.reference ?? "",
      status: record.status,
      assignedId: record.assignedId,
      category: record.category ?? "",
      warehouse: record.warehouse ?? "",
      brand: record.brand ?? "",
      customerGroup: record.customerGroup ?? "",
      salesChannel: record.salesChannel ?? "",
      data: record.data,
    };
    setDraft(nextDraft);
    setSavedSignature(JSON.stringify(nextDraft));
  }
  function newRecord() {
    setSelectedId(null);
    const empty = emptyDraft(config);
    setDraft(empty);
    setSavedSignature(JSON.stringify(empty));
  }
  function setData(key: string, value: AdminRecordValue) {
    setDraft((current) => ({ ...current, data: { ...current.data, [key]: value } }));
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await saveAdminRecord({ data: { ...draft, module: config.key } });
      const now = new Date().toISOString();
      const next: AdminRecord = {
        ...draft,
        id: result.id,
        module: config.key,
        reference: draft.reference || null,
        ownerId: records.find((x) => x.id === draft.id)?.ownerId ?? identity.id,
        assignedId: draft.assignedId,
        category: draft.category || null,
        warehouse: draft.warehouse || null,
        brand: draft.brand || null,
        customerGroup: draft.customerGroup || null,
        salesChannel: draft.salesChannel || null,
        createdAt: records.find((x) => x.id === draft.id)?.createdAt ?? now,
        updatedAt: now,
      };
      setRecords([next, ...records.filter((x) => x.id !== next.id)]);
      setSelectedId(next.id);
      const savedDraft = { ...draft, id: next.id };
      setDraft(savedDraft);
      setSavedSignature(JSON.stringify(savedDraft));
      await refreshAudit();
      toast.success(`${config.label} kaydı kaydedildi.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kayıt kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!draft.id || !confirm(`“${draft.title}” kalıcı olarak silinsin mi?`)) return;
    setBusy(true);
    try {
      await deleteAdminRecord({ data: { id: draft.id, module: config.key } });
      setRecords(records.filter((x) => x.id !== draft.id));
      newRecord();
      await refreshAudit();
      toast.success("Kayıt silindi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kayıt silinemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5">
      <section className="border border-border bg-bg-elevated p-3">
        {(["Satış", "Operasyon", "İçerik", "Ayarlar"] as const).map((group) => {
          const groupModules = modules.filter((item) => item.group === group);
          if (!groupModules.length) return null;
          return (
            <div key={group} className="flex flex-wrap items-center gap-2 py-1">
              <span className="w-20 text-xs font-medium text-fg-muted">{group}</span>
              {groupModules.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => chooseModule(item)}
                  className={cn(
                    "min-h-11 rounded border px-3 text-sm",
                    item.key === config.key
                      ? "border-[#102f25] bg-[#102f25] text-white"
                      : "border-border bg-bg-elevated hover:bg-bg-wash",
                  )}
                >
                  {item.label}
                  <span className="ml-2 text-xs opacity-60">
                    {records.filter((record) => record.module === item.key).length}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </section>
      <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
        <section className="border border-border bg-bg-elevated">
          <div className="space-y-3 border-b border-border p-3">
            <div className="flex gap-2">
              <Input
                aria-label={`${config.label} içinde ara`}
                placeholder="Ara"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="button" onClick={newRecord}>
                Yeni
              </Button>
            </div>
            <select
              aria-label="Duruma göre filtrele"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
            >
              <option value="all">Tüm durumlar</option>
              {config.statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-xs text-fg-muted" role="status">
              {filtered.length} kayıt
            </p>
          </div>
          <div className="max-h-[65vh] divide-y divide-border overflow-y-auto">
            {filtered.length ? (
              filtered.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => chooseRecord(record)}
                  className={cn(
                    "min-h-16 w-full p-3 text-left",
                    selectedId === record.id ? "bg-accent/10" : "hover:bg-bg-wash",
                  )}
                >
                  <span className="block truncate text-sm font-medium">{record.title}</span>
                  <span className="mt-1 block text-xs text-fg-muted">
                    {config.statuses.find(([value]) => value === record.status)?.[1] ??
                      record.status}
                    {record.reference ? ` · ${record.reference}` : ""}
                  </span>
                </button>
              ))
            ) : (
              <p className="p-5 text-sm text-fg-muted">Bu görünümde kayıt yok.</p>
            )}
          </div>
        </section>
        <form onSubmit={save} className="border border-border bg-bg-elevated p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-fg-muted">
                {draft.id ? draft.reference || draft.id : `Yeni ${config.singular}`}
              </p>
              <h2 className="mt-1 font-display text-3xl">
                {draft.id
                  ? draft.title
                  : `${config.singular[0].toLocaleUpperCase("tr-TR")}${config.singular.slice(1)} oluştur`}
              </h2>
            </div>
            {dirty && (
              <span className="rounded bg-amber-100 px-3 py-1 text-xs">
                Kaydedilmemiş değişiklik
              </span>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label="Başlık / ad"
              value={draft.title}
              set={(title) => setDraft({ ...draft, title })}
              max={160}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Durum</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                {config.statuses.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Referans</span>
              <Input
                value={draft.reference}
                onChange={(e) => setDraft({ ...draft, reference: e.target.value })}
                maxLength={80}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Atanan kullanıcı</span>
              <select
                value={draft.assignedId ?? ""}
                onChange={(e) => setDraft({ ...draft, assignedId: e.target.value || null })}
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                <option value="">Atanmamış</option>
                {access.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.display_name}
                  </option>
                ))}
              </select>
            </label>
            {config.fields.map((field) => {
              const value = draft.data[field.key];
              const stringValue = value == null ? "" : String(value);
              return (
                <label
                  key={field.key}
                  className={field.type === "textarea" ? "block sm:col-span-2" : "block"}
                >
                  <span className="mb-2 block text-sm font-medium">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={stringValue}
                      onChange={(e) => setData(field.key, e.target.value)}
                      maxLength={4000}
                      className="min-h-28 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
                    />
                  ) : (
                    <Input
                      type={field.type ?? "text"}
                      value={stringValue}
                      onChange={(e) =>
                        setData(
                          field.key,
                          field.type === "number" && e.target.value !== ""
                            ? Number(e.target.value)
                            : e.target.value,
                        )
                      }
                      maxLength={field.type === "number" ? undefined : 500}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <details className="mt-5 border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Kapsam ve sınıflandırma
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["category", "Kategori"],
                  ["warehouse", "Depo"],
                  ["brand", "Marka"],
                  ["customerGroup", "Müşteri grubu"],
                  ["salesChannel", "Satış kanalı"],
                ] as const
              ).map(([key, fieldLabel]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-medium">{fieldLabel}</span>
                  <Input
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    maxLength={100}
                  />
                </label>
              ))}
            </div>
          </details>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!draft.id || busy}
              onClick={() => void remove()}
            >
              <Trash2 className="size-4" /> Sil
            </Button>
            <Button type="submit" disabled={busy || !draft.title.trim()}>
              <Save className="size-4" /> {busy ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AnalyticsAdmin({ records, orders }: { records: AdminRecord[]; orders: AdminOrder[] }) {
  const amount = (record: AdminRecord, key = "amount") => {
    const value = record.data[key];
    return typeof value === "number" ? value : Number(value) || 0;
  };
  const quotes = records.filter((x) => x.module === "quotes");
  const customers = records.filter((x) => x.module === "customers" || x.module === "companies");
  const inventory = records.filter((x) => x.module === "inventory");
  const finance = records.filter((x) => x.module === "finance");
  const revenue = finance
    .filter((x) => x.status === "paid")
    .reduce((sum, record) => sum + amount(record), 0);
  const costs = finance.reduce((sum, record) => sum + amount(record, "cost"), 0);
  const openOrders = orders.filter(
    (order) => !["completed", "cancelled", "archived"].includes(order.status),
  );
  const moduleCounts = OPERATION_MODULES.map((module) => ({
    label: module.label,
    count: records.filter((record) => record.module === module.key).length,
    open: records.filter(
      (record) =>
        record.module === module.key &&
        !["completed", "closed", "cancelled", "archived", "inactive", "rejected"].includes(
          record.status,
        ),
    ).length,
  })).filter((item) => item.count > 0);
  function exportCsv() {
    const quote = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Modül", "Başlık", "Referans", "Durum", "Güncelleme"],
      ...records.map((record) => [
        OPERATION_MODULES.find((module) => module.key === record.module)?.label ?? record.module,
        record.title,
        record.reference ?? "",
        record.status,
        record.updatedAt,
      ]),
    ];
    const blob = new Blob([`\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\n")}`], {
      type: "text/csv;charset=utf-8",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `sweb-yonetim-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(href);
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={exportCsv} disabled={!records.length}>
          CSV dışa aktar
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Açık sipariş"
          value={`${openOrders.length}`}
          note={`${orders.length} toplam sipariş`}
        />
        <Card
          title="Teklif hacmi"
          value={formatPrice(quotes.reduce((sum, record) => sum + amount(record), 0))}
          note={`${quotes.length} teklif`}
        />
        <Card title="Müşteri" value={`${customers.length}`} note="Bireysel ve kurumsal" />
        <Card
          title="Kritik stok"
          value={`${inventory.filter((x) => ["low", "out"].includes(x.status)).length}`}
          note={`${inventory.length} stok kaydı`}
        />
        <Card
          title="Tahsilat"
          value={formatPrice(revenue)}
          note={`${finance.filter((x) => x.status === "paid").length} ödeme`}
        />
        <Card
          title="Kayıtlı maliyet"
          value={formatPrice(costs)}
          note={`Brüt fark ${formatPrice(revenue - costs)}`}
        />
      </div>
      <section className="border border-border bg-bg-elevated">
        <h2 className="border-b border-border p-5 font-display text-2xl">İş yükü dağılımı</h2>
        {moduleCounts.length ? (
          <div className="divide-y divide-border">
            {moduleCounts.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm">
                <span>{item.label}</span>
                <span className="text-fg-muted">{item.open} açık</span>
                <span className="font-medium">{item.count} toplam</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-5 text-sm text-fg-muted">
            Analiz oluşturmak için henüz operasyon kaydı yok.
          </p>
        )}
      </section>
    </div>
  );
}

function SiteConfigEditor({
  mode,
  value,
  onSaved,
  refreshAudit,
}: {
  mode: "content" | "seo";
  value: SiteConfig;
  onSaved: (x: SiteConfig) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const next = await saveAdminSiteConfig({ data: draft });
      setDraft(next);
      onSaved(next);
      await refreshAudit();
      toast.success(mode === "seo" ? "Site SEO ayarları kaydedildi." : "Site içeriği kaydedildi.");
    } catch {
      toast.error("Ayarlar kaydedilemedi. Alanları kontrol edin.");
    } finally {
      setBusy(false);
    }
  }
  const identity = (key: keyof SiteConfig["identity"], next: string) =>
    setDraft({ ...draft, identity: { ...draft.identity, [key]: next } });
  const storefront = (key: keyof SiteConfig["storefront"], next: string) =>
    setDraft({ ...draft, storefront: { ...draft.storefront, [key]: next } });
  const seo = (key: keyof SiteConfig["seo"], next: string) =>
    setDraft({ ...draft, seo: { ...draft.seo, [key]: next } });
  return (
    <form onSubmit={save} className="border border-border bg-bg-elevated p-5 sm:p-7">
      {mode === "content" ? (
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Marka ve iletişim</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ConfigField
                label="Marka adı"
                value={draft.identity.name}
                set={(x) => identity("name", x)}
                required
              />
              <ConfigField
                label="E-posta"
                value={draft.identity.email}
                set={(x) => identity("email", x)}
                required
              />
              <ConfigField
                label="Hukuki bildirim e-postası"
                value={draft.identity.legalEmail}
                set={(x) => identity("legalEmail", x)}
              />
              <ConfigField
                label="Kısa açıklama"
                value={draft.identity.tagline}
                set={(x) => identity("tagline", x)}
                required
              />
              <ConfigField
                label="Telefon"
                value={draft.identity.phone}
                set={(x) => identity("phone", x)}
              />
              <ConfigField
                label="Atölye adresi"
                value={draft.identity.atelier}
                set={(x) => identity("atelier", x)}
                required
              />
              <ConfigField
                label="Çalışma saatleri"
                value={draft.identity.hours}
                set={(x) => identity("hours", x)}
                required
              />
              <ConfigField
                label="Resmî unvan"
                value={draft.identity.legalName}
                set={(x) => identity("legalName", x)}
              />
              <ConfigField
                label="MERSİS numarası"
                value={draft.identity.mersisNumber}
                set={(x) => identity("mersisNumber", x)}
              />
              <ConfigField
                label="Vergi dairesi"
                value={draft.identity.taxOffice}
                set={(x) => identity("taxOffice", x)}
              />
              <ConfigField
                label="Vergi numarası"
                value={draft.identity.taxNumber}
                set={(x) => identity("taxNumber", x)}
              />
              <ConfigField
                label="Resmî açık adres"
                value={draft.identity.legalAddress}
                set={(x) => identity("legalAddress", x)}
              />
              <ConfigField
                label="IBAN"
                value={draft.identity.iban}
                set={(x) => identity("iban", x)}
              />
            </div>
          </section>
          <section className="border-t border-border pt-7">
            <h2 className="font-display text-2xl">Vitrin metinleri</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ConfigField
                label="Üst duyuru"
                value={draft.storefront.announcement}
                set={(x) => storefront("announcement", x)}
                required
              />
              <ConfigField
                label="Ana sayfa başlığı"
                value={draft.storefront.heroTitle}
                set={(x) => storefront("heroTitle", x)}
                required
              />
              <ConfigField
                label="Ana sayfa butonu"
                value={draft.storefront.heroButton}
                set={(x) => storefront("heroButton", x)}
                required
              />
              <ConfigField
                label="Footer kısa başlığı"
                value={draft.storefront.footerKicker}
                set={(x) => storefront("footerKicker", x)}
                required
              />
              <ConfigField
                label="Footer çağrısı"
                value={draft.storefront.footerTitle}
                set={(x) => storefront("footerTitle", x)}
                required
              />
              <ConfigField
                label="Footer butonu"
                value={draft.storefront.footerButton}
                set={(x) => storefront("footerButton", x)}
                required
              />
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            <ConfigField
              label={`Varsayılan SEO başlığı · ${draft.seo.defaultTitle.length}/70`}
              value={draft.seo.defaultTitle}
              set={(x) => seo("defaultTitle", x)}
              required
              max={70}
            />
            <ConfigField
              label={`Varsayılan meta açıklama · ${draft.seo.defaultDescription.length}/170`}
              value={draft.seo.defaultDescription}
              set={(x) => seo("defaultDescription", x)}
              required
              max={170}
              multiline
            />
            <ConfigField
              label="Sosyal paylaşım görsel yolu"
              value={draft.seo.socialImage}
              set={(x) => seo("socialImage", x)}
              required
            />
          </div>
          <div className="h-fit rounded border border-border bg-white p-4">
            <p className="text-lg text-[#1a0dab]">
              {draft.seo.defaultTitle} — {draft.identity.name}
            </p>
            <p className="text-sm text-[#006621]">{new URL(SITE_ORIGIN).host}</p>
            <p className="mt-1 text-sm text-[#4d5156]">{draft.seo.defaultDescription}</p>
          </div>
        </div>
      )}
      <div className="mt-7 flex justify-end">
        <Button type="submit" disabled={busy}>
          <Save className="size-4" />
          {busy ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
        </Button>
      </div>
    </form>
  );
}

function NavigationEditor({
  value,
  onSaved,
  refreshAudit,
}: {
  value: SiteConfig;
  onSaved: (x: SiteConfig) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [links, setLinks] = useState(value.links);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const visible = links.filter((x) =>
    `${x.label} ${x.path}`.toLocaleLowerCase("tr-TR").includes(q.toLocaleLowerCase("tr-TR")),
  );
  function change(path: string, patch: Partial<SiteConfig["links"][number]>) {
    setLinks(links.map((x) => (x.path === path ? { ...x, ...patch } : x)));
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const next = await saveAdminSiteConfig({ data: { ...value, links } });
      onSaved(next);
      setLinks(next.links);
      await refreshAudit();
      toast.success("Navbar ve footer kaydedildi.");
    } catch {
      toast.error("Menüler kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="border border-border bg-bg-elevated">
      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-bg-elevated p-4 sm:flex-row sm:items-center">
        <Input
          className="flex-1"
          placeholder="Sayfa veya bağlantı ara"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="text-xs text-fg-muted">{visible.length} bağlantı</p>
        <Button type="submit" disabled={busy}>
          <Save className="size-4" />
          {busy ? "Kaydediliyor…" : "Menüleri kaydet"}
        </Button>
      </div>
      <div className="divide-y divide-border">
        {visible.map((item) => (
          <div
            key={item.path}
            className="grid gap-3 p-4 lg:grid-cols-[minmax(14rem,1fr)_10rem_10rem_auto] lg:items-end"
          >
            <ConfigField
              label={item.path}
              value={item.label}
              set={(x) => change(item.path, { label: x })}
              required
            />
            <label>
              <span className="mb-2 block text-xs text-fg-muted">Navbar grubu</span>
              <select
                value={item.menuGroup}
                onChange={(e) =>
                  change(item.path, {
                    menuGroup: e.target.value as SiteConfig["links"][number]["menuGroup"],
                  })
                }
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                {["Ana", "Teklif", "Rehberler", "Destek", "Bilgi"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-xs text-fg-muted">Footer grubu</span>
              <select
                value={item.footerGroup ?? ""}
                onChange={(e) =>
                  change(item.path, {
                    footerGroup: (e.target.value ||
                      null) as SiteConfig["links"][number]["footerGroup"],
                  })
                }
                className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              >
                <option value="">Gösterme</option>
                {["Mağaza", "Yardım", "Hukuki"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="flex h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.visible}
                onChange={(e) => change(item.path, { visible: e.target.checked })}
              />
              Yayında
            </label>
          </div>
        ))}
      </div>
    </form>
  );
}

function ConfigField({
  label,
  value,
  set,
  required = false,
  max,
  multiline = false,
}: {
  label: string;
  value: string;
  set: (x: string) => void;
  required?: boolean;
  max?: number;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => set(e.target.value)}
          required={required}
          maxLength={max}
          className="min-h-28 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => set(e.target.value)}
          required={required}
          maxLength={max}
        />
      )}
    </label>
  );
}

function orderStatusLabel(status: OrderStatus) {
  return (
    {
      new: "Yeni",
      reviewed: "İncelendi",
      confirmed: "Onaylandı",
      preparing: "Hazırlanıyor",
      shipped: "Kargoda",
      completed: "Tamamlandı",
      cancelled: "İptal",
      archived: "Arşiv",
    } as const
  )[status];
}

function paymentStatusLabel(status: PaymentStatus) {
  return (
    {
      pending: "Bekliyor",
      paid: "Ödendi",
      failed: "Başarısız",
      partially_refunded: "Kısmen iade edildi",
      refunded: "İade edildi",
    } as const
  )[status];
}

function shippingStatusLabel(status: ShippingStatus) {
  return (
    {
      pending: "Bekliyor",
      preparing: "Hazırlanıyor",
      shipped: "Gönderildi",
      delivered: "Teslim edildi",
      cancelled: "İptal",
    } as const
  )[status];
}

function ProductSeo({
  items,
  setItems,
  refreshAudit,
}: {
  items: AdminCatalogItem[];
  setItems: (x: AdminCatalogItem[]) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [q, setQ] = useState(""),
    [selected, setSelected] = useState(items[0] ?? null);
  const filtered = useMemo(() => {
    const n = q.toLocaleLowerCase("tr-TR");
    return items.filter((x) =>
      `${x.name} ${x.id} ${x.lineTitle}`.toLocaleLowerCase("tr-TR").includes(n),
    );
  }, [items, q]);
  const visibleItems = filtered.slice(0, 100);
  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
      <section className="border border-border bg-bg-elevated">
        <div className="relative border-b border-border p-3">
          <Search className="absolute top-6 left-6 size-4 text-fg-muted" />
          <Input
            className="pl-10"
            placeholder="Ürün ara"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-2 text-xs text-fg-muted">
            {filtered.length} sonuç{filtered.length > 100 ? " · İlk 100 gösteriliyor" : ""}
          </p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
          {visibleItems.map((x) => (
            <button
              key={x.productKey}
              onClick={() => setSelected(x)}
              className={cn(
                "w-full p-3 text-left",
                selected?.productKey === x.productKey ? "bg-accent/10" : "hover:bg-bg-wash",
              )}
            >
              <p className="truncate text-sm font-medium">{x.name}</p>
              <p className="mt-1 truncate font-mono text-xs text-fg-muted">
                {x.lineKey.toUpperCase()} · {x.id}
              </p>
            </button>
          ))}
        </div>
      </section>
      {selected ? (
        <SeoEditor
          key={`${selected.productKey}:${selected.updatedAt}`}
          item={selected}
          onSaved={async (next) => {
            setSelected(next);
            setItems(items.map((x) => (x.productKey === next.productKey ? next : x)));
            await refreshAudit();
          }}
        />
      ) : (
        <p>Ürün seçin.</p>
      )}
    </div>
  );
}

function SeoEditor({
  item,
  onSaved,
}: {
  item: AdminCatalogItem;
  onSaved: (x: AdminCatalogItem) => Promise<void>;
}) {
  const [name, setName] = useState(item.name),
    [price, setPrice] = useState(item.price == null ? "" : String(item.price)),
    [status, setStatus] = useState<ProductStatus>(item.status),
    [title, setTitle] = useState(item.seoTitle),
    [description, setDescription] = useState(item.seoDescription),
    [alt, setAlt] = useState(item.imageAlt),
    [busy, setBusy] = useState(false);
  async function save(e: FormEvent) {
    e.preventDefault();
    const p = price.trim() === "" ? null : Number(price.replace(",", "."));
    if (p !== null && !Number.isFinite(p)) return toast.error("Fiyat geçerli değil.");
    setBusy(true);
    try {
      await updateAdminProduct({
        data: {
          productKey: item.productKey,
          name: name.trim(),
          price: p,
          status,
          seoTitle: title.trim(),
          seoDescription: description.trim(),
          imageAlt: alt.trim(),
        },
      });
      const next = {
        ...item,
        name: name.trim(),
        price: p,
        status,
        seoTitle: title.trim(),
        seoDescription: description.trim(),
        imageAlt: alt.trim(),
        updatedAt: new Date().toISOString(),
      };
      await onSaved(next);
      toast.success("Ürün ve SEO bilgileri kaydedildi.");
    } catch {
      toast.error("Kayıt tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="border border-border bg-bg-elevated p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[12rem_1fr]">
        <img
          src={item.image}
          alt=""
          className="aspect-square w-full bg-bg-wash object-contain p-3"
          width={1500}
          height={1500}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ürün adı" value={name} set={setName} max={120} />
          <Field label="Fiyat (TL)" value={price} set={setPrice} />
          <label>
            <span className="mb-2 block text-sm font-medium">Yayın durumu</span>
            <select
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
            >
              <option value="active">Yayında</option>
              <option value="inactive">Pasif</option>
              <option value="archived">Arşivde</option>
            </select>
          </label>
          <div className="self-end text-xs text-fg-muted">
            Kaynak fiyat: {item.basePrice == null ? "Yok" : formatPrice(item.basePrice)}
          </div>
        </div>
      </div>
      <div className="mt-7 border-t border-border pt-6">
        <h2 className="font-display text-2xl">Arama görünümü</h2>
        <div className="mt-4 space-y-4">
          <Field label={`SEO başlığı · ${title.length}/70`} value={title} set={setTitle} max={70} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Meta açıklama · {description.length}/170
            </span>
            <textarea
              className="min-h-24 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
              maxLength={170}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <Field label="Görsel alt metni" value={alt} set={setAlt} max={160} />
          <div className="rounded border border-border bg-white p-4">
            <p className="text-lg text-[#1a0dab]">{title || name} — Sweb</p>
            <p className="text-sm text-[#006621]">
              {new URL(SITE_ORIGIN).host}/{publicLinePath(item.lineKey)}/{item.id}
            </p>
            <p className="mt-1 text-sm text-[#4d5156]">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={busy}>
          <Save className="size-4" />
          {busy ? "Kaydediliyor…" : "Tüm değişiklikleri kaydet"}
        </Button>
      </div>
    </form>
  );
}

function publicLinePath(lineKey: string) {
  return (
    {
      sweb: "organizer",
      slac: "hediye-setleri",
      clik: "saat-mucevher-kutulari",
      desq: "ofis",
    }[lineKey] ?? lineKey
  );
}

function Scripts({
  scripts,
  setScripts,
  refreshAudit,
}: {
  scripts: SiteScript[];
  setScripts: (x: SiteScript[]) => void;
  refreshAudit: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<SiteScript | null>(null),
    [name, setName] = useState(""),
    [placement, setPlacement] = useState<"head" | "body">("head"),
    [code, setCode] = useState(""),
    [active, setActive] = useState(false),
    [busy, setBusy] = useState(false);
  function load(x: SiteScript | null) {
    setEditing(x);
    setName(x?.name ?? "");
    setPlacement(x?.placement ?? "head");
    setCode(x?.code ?? "");
    setActive(x?.active ?? false);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveAdminScript({ data: { id: editing?.id, name, placement, code, active } });
      setScripts(await getAdminScripts());
      await refreshAudit();
      load(null);
      toast.success("Site kodu kaydedildi.");
    } catch {
      toast.error("Site kodu kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!editing || !confirm(`“${editing.name}” kodu kalıcı olarak silinsin mi?`)) return;
    setBusy(true);
    try {
      await deleteAdminScript({ data: { id: editing.id } });
      setScripts(await getAdminScripts());
      await refreshAudit();
      load(null);
      toast.success("Site kodu silindi.");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[20rem_1fr]">
      <section className="border border-border bg-bg-elevated p-3">
        <Button className="w-full" onClick={() => load(null)}>
          Yeni kod ekle
        </Button>
        <div className="mt-3 divide-y divide-border">
          {scripts.map((x) => (
            <button key={x.id} onClick={() => load(x)} className="w-full py-3 text-left">
              <p className="text-sm font-medium">{x.name}</p>
              <p className="mt-1 text-xs text-fg-muted">
                {x.placement === "head" ? "Sayfa başı" : "Sayfa sonu"} ·{" "}
                {x.active ? "Etkin" : "Kapalı"}
              </p>
            </button>
          ))}
        </div>
      </section>
      <form onSubmit={save} className="border border-border bg-bg-elevated p-5 sm:p-7">
        <h2 className="font-display text-2xl">{editing ? "Kodu düzenle" : "Yeni site kodu"}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Kod adı" value={name} set={setName} max={80} />
          <label>
            <span className="mb-2 block text-sm font-medium">Yerleşim</span>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as "head" | "body")}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
            >
              <option value="head">Sayfa başı</option>
              <option value="body">Sayfa sonu</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium">JavaScript kodu</span>
          <textarea
            className="min-h-72 w-full border border-border-strong bg-[#102f25] p-4 font-mono text-xs text-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Etiket olmadan JavaScript kodunu girin"
            required
          />
        </label>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Kod sitede etkin
        </label>
        <div className="mt-6 flex justify-between">
          {editing ? (
            <Button
              type="button"
              variant="outline"
              className="text-danger"
              onClick={() => void remove()}
              disabled={busy}
            >
              <Trash2 className="size-4" />
              Sil
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={busy}>
            <Save className="size-4" />
            {busy ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Audit({ entries }: { entries: AdminAuditEntry[] }) {
  return (
    <section className="divide-y divide-border border border-border bg-bg-elevated">
      {entries.map((e) => (
        <article key={e.id} className="grid gap-1 p-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-medium">{label(e.action)}</p>
            <p className="mt-1 font-mono text-xs text-fg-muted">{e.productKey}</p>
          </div>
          <p className="text-xs text-fg-muted">{new Date(e.createdAt).toLocaleString("tr-TR")}</p>
        </article>
      ))}
    </section>
  );
}

type AccessData = Awaited<ReturnType<typeof getAdminAccessData>>;

function RolesAdmin({ access, refresh }: { access: AccessData; refresh: () => Promise<void> }) {
  const [selectedId, setSelectedId] = useState<string | null>(access.roles[0]?.id ?? null);
  const selected = access.roles.find((x) => x.id === selectedId) ?? null;
  const [name, setName] = useState(selected?.name ?? "");
  const [description, setDescription] = useState(selected?.description ?? "");
  const [rules, setRules] = useState<PermissionRule[]>(selected?.rules ?? []);
  const [busy, setBusy] = useState(false);
  function choose(id: string | null) {
    const role = access.roles.find((x) => x.id === id);
    setSelectedId(id);
    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setRules(role?.rules ?? []);
  }
  function updateRule(permission: string, patch: Partial<PermissionRule>) {
    const current = rules.find((x) => x.permission === permission) ?? {
      permission,
      scope: "all" as const,
      approval: "deny" as const,
    };
    const next = { ...current, ...patch };
    setRules([...rules.filter((x) => x.permission !== permission), next]);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveAdminRole({ data: { id: selectedId ?? undefined, name, description, rules } });
      await refresh();
      toast.success("Rol ve yetkiler kaydedildi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rol kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!selectedId || !confirm(`“${name}” rolü silinsin mi?`)) return;
    setBusy(true);
    try {
      await deleteAdminRole({ data: { id: selectedId } });
      choose(null);
      await refresh();
      toast.success("Rol silindi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rol silinemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[18rem_1fr]">
      <section className="h-fit border border-border bg-bg-elevated p-3">
        <Button className="w-full" onClick={() => choose(null)}>
          Yeni rol
        </Button>
        <div className="mt-3 divide-y divide-border">
          {access.roles.map((role) => (
            <button
              key={role.id}
              onClick={() => choose(role.id)}
              className={cn("w-full px-2 py-3 text-left", selectedId === role.id && "bg-accent/10")}
            >
              <p className="text-sm font-medium">{role.name}</p>
              <p className="mt-1 text-xs text-fg-muted">
                {role.rules.filter((x) => x.approval !== "deny").length} yetki
              </p>
            </button>
          ))}
        </div>
      </section>
      <form onSubmit={save} className="space-y-5">
        <section className="border border-border bg-bg-elevated p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rol adı" value={name} set={setName} max={80} />
            <ConfigField label="Açıklama" value={description} set={setDescription} />
          </div>
          <p className="mt-4 text-sm text-fg-muted">
            Her izin için kapsam ve işlem onayı ayrı belirlenir.
          </p>
        </section>
        <section className="space-y-2">
          {PERMISSION_MODULES.map((module) => (
            <details
              key={module.key}
              className="border border-border bg-bg-elevated"
              open={module.key === "products" || module.key === "orders"}
            >
              <summary className="cursor-pointer px-5 py-4 font-medium">
                {module.label}
                <span className="ml-2 text-xs font-normal text-fg-muted">
                  {module.permissions.length} işlem
                </span>
              </summary>
              <div className="divide-y divide-border border-t border-border">
                {module.permissions.map((permission) => {
                  const rule = rules.find((x) => x.permission === permission.key) ?? {
                    permission: permission.key,
                    scope: "none" as const,
                    approval: "deny" as const,
                  };
                  const needsValue = [
                    "category",
                    "warehouse",
                    "brand",
                    "customer_group",
                    "sales_channel",
                  ].includes(rule.scope);
                  return (
                    <div
                      key={permission.key}
                      className="grid gap-3 p-4 lg:grid-cols-[minmax(15rem,1fr)_12rem_12rem_14rem] lg:items-center"
                    >
                      <div>
                        <p className="text-sm font-medium">{permission.label}</p>
                        <p className="font-mono text-xs text-fg-muted">{permission.key}</p>
                      </div>
                      <select
                        value={rule.scope}
                        onChange={(e) =>
                          updateRule(permission.key, {
                            scope: e.target.value as PermissionRule["scope"],
                          })
                        }
                        className="h-10 border border-border-strong bg-bg-elevated px-2 text-sm"
                      >
                        {PERMISSION_SCOPES.map((x) => (
                          <option key={x.value} value={x.value}>
                            {x.label}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={rule.scopeValue ?? ""}
                        onChange={(e) => updateRule(permission.key, { scopeValue: e.target.value })}
                        disabled={!needsValue}
                        placeholder={needsValue ? "Kapsam değeri" : "Ek değer yok"}
                      />
                      <select
                        value={rule.approval}
                        onChange={(e) =>
                          updateRule(permission.key, {
                            approval: e.target.value as PermissionRule["approval"],
                          })
                        }
                        className="h-10 border border-border-strong bg-bg-elevated px-2 text-sm"
                      >
                        {APPROVAL_MODES.map((x) => (
                          <option key={x.value} value={x.value}>
                            {x.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </section>
        <div className="sticky bottom-3 flex justify-between border border-border bg-bg-elevated p-4 shadow-lg">
          {selectedId ? (
            <Button
              type="button"
              variant="outline"
              className="text-danger"
              onClick={() => void remove()}
              disabled={busy}
            >
              <Trash2 className="size-4" />
              Sil
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={busy || !name.trim()}>
            <Save className="size-4" />
            {busy ? "Kaydediliyor…" : "Rolü kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function UsersAdmin({ access, refresh }: { access: AccessData; refresh: () => Promise<void> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null),
    [username, setUsername] = useState(""),
    [displayName, setDisplayName] = useState(""),
    [password, setPassword] = useState(""),
    [roleId, setRoleId] = useState(
      access.roles.find((x) => x.role_key === "viewer")?.id ?? access.roles[0]?.id ?? "",
    ),
    [active, setActive] = useState(true),
    [locked, setLocked] = useState(false),
    [twoFactorRequired, setTwoFactorRequired] = useState(false),
    [busy, setBusy] = useState(false);
  function choose(id: string | null) {
    const user = access.users.find((x) => x.id === id);
    setSelectedId(id);
    setUsername(user?.username ?? "");
    setDisplayName(user?.display_name ?? "");
    setPassword("");
    setRoleId(
      user?.role_id ??
        access.roles.find((x) => x.role_key === "viewer")?.id ??
        access.roles[0]?.id ??
        "",
    );
    setActive(user?.active ?? true);
    setLocked(user?.locked ?? false);
    setTwoFactorRequired(user?.two_factor_required ?? false);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveAdminUser({
        data: {
          id: selectedId ?? undefined,
          username,
          displayName,
          password: password || undefined,
          roleId,
          active,
          locked,
          twoFactorRequired,
        },
      });
      await refresh();
      toast.success("Kullanıcı kaydedildi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kullanıcı kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!selectedId || !confirm(`“${displayName}” kullanıcısı silinsin mi?`)) return;
    setBusy(true);
    try {
      await deleteAdminUser({ data: { id: selectedId } });
      choose(null);
      await refresh();
      toast.success("Kullanıcı silindi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kullanıcı silinemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[20rem_1fr]">
      <section className="h-fit border border-border bg-bg-elevated p-3">
        <Button className="w-full" onClick={() => choose(null)}>
          Yeni kullanıcı
        </Button>
        <div className="mt-3 divide-y divide-border">
          {access.users.map((user) => (
            <button
              key={user.id}
              onClick={() => choose(user.id)}
              className={cn("w-full px-2 py-3 text-left", selectedId === user.id && "bg-accent/10")}
            >
              <p className="text-sm font-medium">{user.display_name}</p>
              <p className="text-xs text-fg-muted">
                @{user.username} · {user.role_name}
              </p>
            </button>
          ))}
        </div>
      </section>
      <form onSubmit={save} className="h-fit border border-border bg-bg-elevated p-5 sm:p-7">
        <h2 className="font-display text-2xl">
          {selectedId ? "Kullanıcıyı düzenle" : "Yeni kullanıcı"}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Ad soyad" value={displayName} set={setDisplayName} max={100} />
          <Field label="Kullanıcı adı" value={username} set={setUsername} max={60} />
          <Field
            label={selectedId ? "Yeni parola (değişmeyecekse boş)" : "Parola"}
            value={password}
            set={setPassword}
            max={256}
          />
          <label>
            <span className="mb-2 block text-sm font-medium">Rol</span>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="h-11 w-full border border-border-strong bg-bg-elevated px-3"
            >
              {access.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Aktif
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} />
            Kilitli
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={twoFactorRequired}
              onChange={(e) => setTwoFactorRequired(e.target.checked)}
            />
            2FA zorunlu
          </label>
        </div>
        <div className="mt-7 flex justify-between">
          {selectedId ? (
            <Button
              type="button"
              variant="outline"
              className="text-danger"
              onClick={() => void remove()}
            >
              <Trash2 className="size-4" />
              Sil
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={busy || !roleId}>
            <Save className="size-4" />
            {busy ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ApprovalsAdmin({ access, refresh }: { access: AccessData; refresh: () => Promise<void> }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function review(id: string, status: "approved" | "rejected") {
    setBusy(id);
    try {
      await reviewAdminApproval({ data: { id, status, note: "" } });
      await refresh();
      toast.success(status === "approved" ? "İşlem onaylandı." : "İşlem reddedildi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İşlem tamamlanamadı.");
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="divide-y divide-border border border-border bg-bg-elevated">
      {access.approvals.length ? (
        access.approvals.map((item) => (
          <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-medium">{permissionLabel(item.permission_key)}</p>
              <p className="mt-1 text-xs text-fg-muted">
                {item.requester_name} · {item.resource_type}
                {item.resource_id ? ` / ${item.resource_id}` : ""} ·{" "}
                {new Date(item.created_at).toLocaleString("tr-TR")}
              </p>
              <span className="mt-2 inline-block rounded bg-bg-wash px-2 py-1 text-xs">
                {item.status === "pending"
                  ? "Bekliyor"
                  : item.status === "approved"
                    ? "Onaylandı"
                    : "Reddedildi"}
              </span>
            </div>
            {item.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={busy === item.id}
                  onClick={() => void review(item.id, "rejected")}
                >
                  Reddet
                </Button>
                <Button
                  disabled={busy === item.id}
                  onClick={() => void review(item.id, "approved")}
                >
                  Onayla
                </Button>
              </div>
            )}
          </article>
        ))
      ) : (
        <p className="p-6 text-sm text-fg-muted">Onay talebi yok.</p>
      )}
    </section>
  );
}

function SecurityAdmin({
  access,
  currentSessionId,
  refresh,
}: {
  access: AccessData;
  currentSessionId: string;
  refresh: () => Promise<void>;
}) {
  async function revoke(id: string) {
    if (!confirm("Bu oturum kapatılsın mı?")) return;
    try {
      await revokeAdminSession({ data: { id } });
      await refresh();
      toast.success("Oturum kapatıldı.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Oturum kapatılamadı.");
    }
  }
  return (
    <div className="space-y-6">
      <section className="border border-border bg-bg-elevated">
        <h2 className="border-b border-border p-5 font-display text-2xl">Aktif oturumlar</h2>
        <div className="divide-y divide-border">
          {access.sessions.map((session) => (
            <article
              key={session.id}
              className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-medium">
                  {session.actor_name}
                  {session.id === currentSessionId ? " · Bu oturum" : ""}
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  {session.ip} · {session.user_agent} ·{" "}
                  {new Date(session.created_at).toLocaleString("tr-TR")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={Boolean(session.revoked_at)}
                onClick={() => void revoke(session.id)}
              >
                {session.revoked_at ? "Kapatıldı" : "Oturumu kapat"}
              </Button>
            </article>
          ))}
        </div>
      </section>
      <section className="border border-border bg-bg-elevated">
        <h2 className="border-b border-border p-5 font-display text-2xl">Giriş geçmişi</h2>
        <div className="divide-y divide-border">
          {access.logins.map((event) => (
            <article key={event.id} className="grid gap-1 p-4 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-medium">
                  {event.username} · {event.success ? "Başarılı" : "Başarısız"}
                </p>
                <p className="text-xs text-fg-muted">
                  {event.ip} · {event.user_agent}
                  {event.reason ? ` · ${event.reason}` : ""}
                </p>
              </div>
              <p className="text-xs text-fg-muted">
                {new Date(event.created_at).toLocaleString("tr-TR")}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="border border-border bg-bg-elevated">
        <h2 className="border-b border-border p-5 font-display text-2xl">
          Değiştirilemeyen aktivite kayıtları
        </h2>
        <div className="divide-y divide-border">
          {access.activity.map((event) => (
            <article key={event.id} className="grid gap-1 p-4 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-medium">
                  {event.actor_name} · {permissionLabel(event.permission_key)}
                </p>
                <p className="text-xs text-fg-muted">
                  {event.action} · {event.resource_type}
                  {event.resource_id ? ` / ${event.resource_id}` : ""} · {event.ip}
                </p>
              </div>
              <p className="text-xs text-fg-muted">
                {new Date(event.created_at).toLocaleString("tr-TR")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function System({
  items,
  orders,
  scripts,
  config,
}: {
  items: AdminCatalogItem[];
  orders: AdminOrder[];
  scripts: SiteScript[];
  config: SiteConfig;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Katalog"
        value={`${items.length} ürün`}
        note={`${items.filter((x) => x.status === "active").length} yayında`}
      />
      <Card
        title="Site kodları"
        value={`${scripts.length} kayıt`}
        note={`${scripts.filter((x) => x.active).length} etkin`}
      />
      <Card title="Sipariş verisi" value={`${orders.length} kayıt`} note="Sunucu veritabanında" />
      <Card
        title="Site ayarları"
        value={config.updatedAt ? "Yönetiliyor" : "Varsayılan"}
        note={
          config.updatedAt
            ? new Date(config.updatedAt).toLocaleString("tr-TR")
            : "Henüz değiştirilmedi"
        }
      />
      <Card title="Güvenlik" value="Oturum etkin" note="Sunucu doğrulamalı · 8 saat" />
    </div>
  );
}
function Field({
  label,
  value,
  set,
  max,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <Input value={value} onChange={(e) => set(e.target.value)} maxLength={max} required />
    </label>
  );
}
function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <section className="border border-border bg-bg-elevated p-5">
      <p className="text-sm text-fg-muted">{title}</p>
      <p className="mt-4 font-display text-3xl">{value}</p>
      <p className="mt-1 text-xs text-fg-muted">{note}</p>
    </section>
  );
}
function label(a: string) {
  if (a === "site_config_update") return "Site ayarları güncellendi";
  if (a.startsWith("order_"))
    return `Sipariş ${orderStatusLabel(a.slice(6) as OrderStatus).toLocaleLowerCase("tr-TR")}`;
  if (a.startsWith("script_"))
    return a === "script_create"
      ? "Site kodu eklendi"
      : a === "script_delete"
        ? "Site kodu silindi"
        : "Site kodu güncellendi";
  if (a.includes("archive")) return "Ürün arşivlendi";
  if (a.includes("inactive")) return "Ürün pasife alındı";
  if (a.includes("active")) return "Ürün yayınlandı";
  return "Ürün ve SEO güncellendi";
}
