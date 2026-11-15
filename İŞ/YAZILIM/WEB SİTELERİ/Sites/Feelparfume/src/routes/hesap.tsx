import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authEnabled, signIn } from "@/lib/auth/client";
import { validBirth, type AccountView } from "@/lib/account";
import {
  addAddress,
  loginAccount,
  logoutAccount,
  readAccount,
  registerAccount,
  removeAddress,
  removeWish,
  saveProfile,
} from "@/lib/account-api";
import { isPostalCode, isTurkishPhone } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { isTurkeyCity, TR_CITIES } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { FormField } from "@/components/form-field";
import { CatalogShelf } from "@/components/catalog-shelf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/hesap")({
  head: () => pageHead({ title: "Hesap", description: "Hesap.", path: "/hesap", noindex: true }),
  component: AccountPage,
});

const mergedEmails = new Set<string>();

function localSkus() {
  try {
    const raw = localStorage.getItem("sweb-prefs");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { wishlist?: unknown } };
    const list = parsed.state?.wishlist;
    if (!Array.isArray(list)) return [];
    return list.filter((sku): sku is string => typeof sku === "string" && /^[A-Za-z0-9-]{3,40}$/.test(sku)).slice(0, 40);
  } catch {
    return [];
  }
}

function messageOf(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function birthPair(monthRaw: string, dayRaw: string) {
  const parse = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^\d{1,2}$/.test(trimmed)) return Number.NaN;
    return Number(trimmed);
  };
  const month = parse(monthRaw);
  const day = parse(dayRaw);
  if (Number.isNaN(month) || Number.isNaN(day) || !validBirth(month, day)) return null;
  return { month, day };
}

function AccountPage() {
  const [account, setAccount] = useState<AccountView | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [consentStock, setConsentStock] = useState(false);
  const [consentPrice, setConsentPrice] = useState(false);
  const [consentBottle, setConsentBottle] = useState(false);

  useEffect(() => {
    let live = true;
    void readAccount()
      .then((view) => {
        if (live) setAccount(view);
      })
      .catch((err) => {
        if (!live) return;
        setAccount(null);
        setError(messageOf(err, "Hesap açılamadı."));
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!account) return;
    setBirthMonth(account.birthMonth == null ? "" : String(account.birthMonth));
    setBirthDay(account.birthDay == null ? "" : String(account.birthDay));
    setConsentStock(account.consentStock);
    setConsentPrice(account.consentPrice);
    setConsentBottle(account.consentBottle);
  }, [account]);

  useEffect(() => {
    const email = account?.email;
    if (!email || mergedEmails.has(email)) return;
    mergedEmails.add(email);
    const skus = localSkus();
    if (!skus.length) return;
    void saveProfile({ data: { skus } })
      .then((view) => setAccount(view))
      .catch(() => undefined);
  }, [account?.email]);

  async function enter(kind: "login" | "register", form: HTMLFormElement) {
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const birth = birthPair(String(data.get("birthMonth") ?? ""), String(data.get("birthDay") ?? ""));
    if (kind === "register" && password.length < 8) {
      setError("Şifre en az 8 karakter.");
      return;
    }
    if (kind === "register" && !birth) {
      setError("Tarih geçersiz.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const view =
        kind === "register"
          ? await registerAccount({
              data: {
                email,
                password,
                birthMonth: birth?.month ?? null,
                birthDay: birth?.day ?? null,
                skus: localSkus(),
              },
            })
          : await loginAccount({ data: { email, password } });
      setAccount(view);
    } catch (err) {
      setError(messageOf(err, kind === "register" ? "Kayıt açılamadı." : "E-posta veya şifre hatalı."));
    } finally {
      setBusy(false);
    }
  }

  async function saveBirth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const birth = birthPair(birthMonth, birthDay);
    if (!birth) {
      setError("Tarih geçersiz.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      setAccount(
        await saveProfile({
          data: {
            birthMonth: birth.month,
            birthDay: birth.day,
            consentStock,
            consentPrice,
            consentBottle,
          },
        }),
      );
    } catch (err) {
      setError(messageOf(err, "Kaydedilemedi."));
    } finally {
      setBusy(false);
    }
  }

  async function createAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      city: String(form.get("city") ?? ""),
      district: String(form.get("district") ?? ""),
      postal: String(form.get("postal") ?? ""),
      address: String(form.get("address") ?? ""),
    };
    if (!isTurkishPhone(payload.phone)) {
      setError("Telefon geçersiz.");
      return;
    }
    if (!isTurkeyCity(payload.city)) {
      setError("İl geçersiz.");
      return;
    }
    if (!isPostalCode(payload.postal)) {
      setError("Posta kodu geçersiz.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      setAccount(await addAddress({ data: payload }));
      event.currentTarget.reset();
    } catch (err) {
      setError(messageOf(err, "Adres eklenemedi."));
    } finally {
      setBusy(false);
    }
  }

  if (account === undefined) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="font-display text-4xl">Hesap</h1>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 py-10 lg:grid-cols-[minmax(0,36rem)_1fr]">
      <div>
        <h1 className="font-display text-4xl">Hesap</h1>
        <form
          id="hesap"
          className="mt-8 grid gap-4 rounded-xl border border-solid border-border bg-bg-elevated p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void enter("login", event.currentTarget);
          }}
        >
          <FormField label="E-posta" required htmlFor="hesap-email">
            <Input id="hesap-email" name="email" type="email" autoComplete="email" required maxLength={254} />
          </FormField>
          <FormField label="Şifre" required htmlFor="hesap-password">
            <Input id="hesap-password" name="password" type="password" autoComplete="current-password" required maxLength={72} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ay" optional htmlFor="hesap-ay">
              <Input id="hesap-ay" name="birthMonth" inputMode="numeric" autoComplete="bday-month" />
            </FormField>
            <FormField label="Gün" optional htmlFor="hesap-gun">
              <Input id="hesap-gun" name="birthDay" inputMode="numeric" autoComplete="bday-day" />
            </FormField>
          </div>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              Giriş
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={(event) => {
                const form = event.currentTarget.form;
                if (!form?.reportValidity()) return;
                void enter("register", form);
              }}
            >
              Kayıt
            </Button>
            {authEnabled ? (
              <Button type="button" variant="outline" onClick={() => void signIn("grok-google", { callbackURL: "/hesap" })}>
                Google
              </Button>
            ) : null}
          </div>
        </form>
      </div>
      <CatalogShelf limit={6} className="sm:grid-cols-3 lg:grid-cols-2" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 py-10 lg:grid-cols-[minmax(0,36rem)_1fr]">
    <div id="hesap" className="grid gap-8">
      <h1 className="font-display text-4xl">Hesap</h1>
      <p className="text-sm">{account.email}</p>
      <p className="font-mono text-sm">{account.points} puan · 100 ₺ = 1</p>
      {account.coupons.length ? (
        <ul className="grid gap-1 font-mono text-sm">
          {account.coupons.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <form className="grid gap-4 rounded-xl border border-solid border-border bg-bg-elevated p-6" onSubmit={(event) => void createAddress(event)}>
        <h2 className="font-display text-2xl">Adres</h2>
        <FormField label="Ad" required htmlFor="adres-ad">
          <Input id="adres-ad" name="name" autoComplete="name" required minLength={2} maxLength={120} />
        </FormField>
        <FormField label="Telefon" required htmlFor="adres-telefon">
          <Input id="adres-telefon" name="phone" autoComplete="tel" required maxLength={30} />
        </FormField>
        <FormField label="İl" required htmlFor="adres-il">
          <select
            id="adres-il"
            name="city"
            required
            className="h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              İl
            </option>
            {TR_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="İlçe" required htmlFor="adres-ilce">
          <Input id="adres-ilce" name="district" autoComplete="address-level2" required minLength={2} maxLength={80} />
        </FormField>
        <FormField label="Posta" required htmlFor="adres-posta">
          <Input id="adres-posta" name="postal" inputMode="numeric" autoComplete="postal-code" required pattern="[0-9]{5}" />
        </FormField>
        <FormField label="Adres" required htmlFor="adres-adres">
          <textarea
            id="adres-adres"
            name="address"
            required
            minLength={10}
            maxLength={600}
            rows={3}
            className="w-full border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>
        <Button type="submit" disabled={busy}>
          Ekle
        </Button>
      </form>
      {account.addresses.length ? (
        <ul className="grid gap-3 text-sm">
          {account.addresses.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 border border-border-strong px-3 py-3">
              <span>
                {item.name} · {item.city} · {item.district}
                <span className="mt-1 block">{item.address}</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  setError("");
                  void removeAddress({ data: { id: item.id } })
                    .then(setAccount)
                    .catch((err) => setError(messageOf(err, "Adres silinemedi.")))
                    .finally(() => setBusy(false));
                }}
              >
                Sil
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {account.orders.length ? (
        <section className="grid gap-2">
          <h2 className="font-display text-2xl">Sipariş</h2>
          <ul className="grid gap-2 text-sm">
            {account.orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-baseline justify-between gap-2">
                <Link to="/siparis/$id" params={{ id: order.id }} className="font-mono">
                  {order.id}
                </Link>
                <span>{formatPrice(order.totalCents / 100)}</span>
                <span>{order.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {account.wishes.length ? (
        <section className="grid gap-2">
          <h2 className="font-display text-2xl">Favori</h2>
          <ul className="grid gap-2 text-sm">
            {account.wishes.map((wish) => (
              <li key={wish.sku} className="flex items-center justify-between gap-3">
                <Link to="/urun/$sku" params={{ sku: wish.slug }}>
                  {wish.name}
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    setError("");
                    void removeWish({ data: { sku: wish.sku } })
                      .then(setAccount)
                      .catch((err) => setError(messageOf(err, "Favori silinemedi.")))
                      .finally(() => setBusy(false));
                  }}
                >
                  Sil
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <form className="grid gap-4" onSubmit={(event) => void saveBirth(event)}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Ay" optional htmlFor="profil-ay">
            <Input id="profil-ay" inputMode="numeric" value={birthMonth} onChange={(event) => setBirthMonth(event.target.value)} />
          </FormField>
          <FormField label="Gün" optional htmlFor="profil-gun">
            <Input id="profil-gun" inputMode="numeric" value={birthDay} onChange={(event) => setBirthDay(event.target.value)} />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consentStock} onChange={(event) => setConsentStock(event.target.checked)} />
          Stok
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consentPrice} onChange={(event) => setConsentPrice(event.target.checked)} />
          Fiyat
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consentBottle} onChange={(event) => setConsentBottle(event.target.checked)} />
          Şişe
        </label>
        <Button type="submit" disabled={busy}>
          Kaydet
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          setError("");
          void logoutAccount()
            .then(() => setAccount(null))
            .catch((err) => setError(messageOf(err, "Çıkış yapılamadı.")))
            .finally(() => setBusy(false));
        }}
      >
        Çıkış
      </Button>
    </div>
    <CatalogShelf limit={6} className="sm:grid-cols-3 lg:grid-cols-2" />
    </div>
  );
}
