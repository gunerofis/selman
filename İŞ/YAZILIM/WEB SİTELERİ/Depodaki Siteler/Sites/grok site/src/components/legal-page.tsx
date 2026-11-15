import { Link, useRouterState } from "@tanstack/react-router";

const LEGAL_LINKS = [
  { to: "/teslimat" as const, label: "Teslimat" },
  { to: "/iade" as const, label: "İade" },
  { to: "/cayma" as const, label: "Cayma" },
  { to: "/on-bilgilendirme" as const, label: "Ön bilgilendirme" },
  { to: "/gizlilik" as const, label: "Gizlilik" },
  { to: "/cerez" as const, label: "Çerez" },
  { to: "/kvkk" as const, label: "KVKK" },
  { to: "/mesafeli" as const, label: "Mesafeli satış" },
  { to: "/kullanim" as const, label: "Kullanım" },
  { to: "/satici" as const, label: "Satıcı" },
  { to: "/sikayet" as const, label: "Şikayet" },
];

export function LegalPage({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{kicker}</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">{title}</h1>
      {updated ? (
        <p className="mt-3 font-mono text-[11px] text-fg-muted">
          son güncelleme:{" "}
          <time dateTime={updated}>
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(updated))}
          </time>
        </p>
      ) : null}
      <div className="legal-copy mt-8 space-y-4 text-sm leading-relaxed text-fg-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-fg [&_a]:text-taba [&_a]:underline-offset-2 hover:[&_a]:underline">
        {children}
      </div>
      <nav className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-dashed border-border pt-6 font-mono text-xs text-fg-muted" aria-label="Hukuki sayfalar">
        {LEGAL_LINKS.map((item) => {
          const on = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={on ? "page" : undefined}
              className={on ? "text-fg" : "hover:text-taba"}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </article>
  );
}
