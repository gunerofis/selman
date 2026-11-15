import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    id: "malzeme",
    title: "Malzeme",
    body: "Dış deri kaplama, iç keçe veya süet. Birleşimler ve varsa metal aksam (menteşe, vida) gizli kalır. On dört renk: siyah, beyaz, gri, krem, kahve, taba, bordo, kırmızı, turuncu, pembe, turkuaz, mavi, lacivert ve yeşil.",
    href: "/palet" as const,
    link: "Palet",
  },
  {
    id: "bakim",
    title: "Bakım",
    body: "Nemli bez. Yağ, çözücü, buhar yok. Güneşe uzun süre bırakmayın. Damlama tepsisi varsa çıkarıp ayrı silin.",
    href: "/bakim" as const,
    link: "Bakım rehberi",
  },
  {
    id: "uretim",
    title: "Üretim",
    body: `Kalıp, kaplama, dikiş, montaj. ${BRAND.atelier}. Hazır stok 3–5 iş günü; ölçüye göre 10–15.`,
    href: "/atolye" as const,
    link: "Atölye",
  },
] as const;

export function CraftFold() {
  const [open, setOpen] = useState<string | null>("malzeme");
  return (
    <div className="border-y border-dashed border-border">
      {ROWS.map((row) => {
        const on = open === row.id;
        return (
          <div key={row.id} className="border-b border-dashed border-border last:border-0">
            <button
              type="button"
              className="flex h-12 w-full items-center justify-between text-left text-sm"
              aria-expanded={on}
              onClick={() => setOpen(on ? null : row.id)}
            >
              {row.title}
              <span className={cn("font-mono text-xs text-fg-muted", on && "text-fg")}>
                {on ? "−" : "+"}
              </span>
            </button>
            {on ? (
              <p className="pb-4 text-sm leading-relaxed text-fg-muted">
                {row.body}{" "}
                <Link to={row.href} className="text-taba hover:underline">
                  {row.link}
                </Link>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
