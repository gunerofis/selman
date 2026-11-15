import { type FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { Notice } from "@/components/demo-notice";

export const Route = createFileRoute("/siparis-sorgu")({
  component: Page,
  head: () =>
    pageHead({
      title: "Sipariş sorgula",
      description: "Bu tarayıcıdaki SW- kaydı. Üyelik yok.",
      path: "/siparis-sorgu",
      noindex: true,
    }),
});

type StoredOrder = {
  id: string;
  name: string;
  total: number;
  pay: string;
};

function Page() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [last, setLast] = useState<StoredOrder | null>(null);
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweb-last-order");
      if (raw) setLast(JSON.parse(raw) as StoredOrder);
    } catch {
      /* ignore */
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const id = q.trim().toLocaleUpperCase("tr");
    if (last?.id && last.id.toLocaleUpperCase("tr") === id) {
      void navigate({ to: "/siparis/$id", params: { id: last.id } });
      return;
    }
    setMiss(true);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Yardım</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Sipariş sorgula</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Hesap yok. Özet yalnızca bu tarayıcıda, son gönderilen SW- numarasıyla durur.
        Başka cihaz veya silinmiş kayıt için {BRAND.email} adresine yazın.
      </p>
      <Notice>
        Sunucuda sipariş listesi tutulmaz. Kart tahsilatı da yoktur.
      </Notice>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Sipariş no" required htmlFor="order" hint="Örnek: SW-…">
          <Input
            id="order"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setMiss(false);
            }}
            required
            autoComplete="off"
            placeholder="SW-"
          />
        </FormField>
        {miss ? (
          <p className="text-sm text-danger" role="alert">
            Bu tarayıcıda bu numara yok. {BRAND.email} adresine yazın.
          </p>
        ) : null}
        <Button type="submit" size="lg">
          Özeti aç
        </Button>
      </form>
      {last ? (
        <div className="mt-10 border border-dashed border-border bg-bg-elevated p-5">
          <p className="font-mono text-[11px] text-fg-muted">Bu tarayıcıdaki son kayıt</p>
          <p className="mt-2 font-display text-2xl">{last.id}</p>
          <p className="mt-1 text-sm text-fg-muted">
            {last.name} · {formatPrice(last.total)}
          </p>
          <Link to="/siparis/$id" params={{ id: last.id }} className="mt-4 inline-block">
            <Button variant="outline">Kayıtlı özeti aç</Button>
          </Link>
        </div>
      ) : null}
      <p className="mt-8 text-sm text-fg-muted">
        <Link to="/iletisim" className="text-taba hover:underline">
          İletişim
        </Link>
        {" · "}
        <Link to="/cayma" className="text-taba hover:underline">
          Cayma
        </Link>
      </p>
    </div>
  );
}
