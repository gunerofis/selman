import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BoxBoxMark({ compact = false }: { compact?: boolean }) {
  const cell = cn(
    "flex items-center justify-center transition-opacity hover:opacity-80",
    compact ? "gap-1.5 px-2 py-1.5 sm:gap-2.5" : "gap-2 px-3 py-3 sm:gap-3 sm:py-4",
  );
  const word = compact
    ? "boxbox-word text-base leading-none text-white sm:text-xl lg:text-2xl"
    : "boxbox-word text-xl leading-none text-white sm:text-3xl lg:text-5xl";
  const sq = compact ? "h-7 w-auto shrink-0 sm:h-8 lg:h-9" : "h-10 w-auto shrink-0 sm:h-14 lg:h-16";
  const tree = compact ? "h-8 w-auto shrink-0 sm:h-9 lg:h-10" : "h-11 w-auto shrink-0 sm:h-14 lg:h-16";
  const desc = "mt-1.5 hidden font-mono text-[10px] leading-tight tracking-wide text-white/65 lg:block";

  return (
    <div className="boxbox-bar border-b border-dashed border-border bg-[#0a2419] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-dashed divide-white/25 sm:grid-cols-4">
        {/* 1 · SWEB — düzen ve organize gereçleri */}
        <Link to="/organizer" aria-label="SWEB — Düzen ve Organize Gereçleri" className={cell}>
          <svg viewBox="0 0 120 132" className={sq} role="img" aria-label="Sweb düzen logosu" fill="none">
            <rect x="12" y="18" width="52" height="44" fill="#ffffff" />
            <rect x="70" y="18" width="38" height="44" fill="#ffffff" />
            <rect x="12" y="68" width="34" height="46" fill="#ffffff" />
            <rect x="52" y="68" width="56" height="46" fill="#ffffff" />
            <rect x="30" y="38" width="16" height="3.5" fill="#0a2419" />
            <rect x="80" y="38" width="18" height="3.5" fill="#0a2419" />
            <rect x="22" y="89" width="14" height="3.5" fill="#0a2419" />
            <rect x="70" y="89" width="20" height="3.5" fill="#0a2419" />
          </svg>
          <span className="flex flex-col">
            <span className={word}>SWEB</span>
            {compact ? null : <span className={desc}>Düzen ve Organize Gereçleri</span>}
          </span>
        </Link>

        {/* 2 · SLAC — hediye setleri */}
        <Link to="/hediye-setleri" aria-label="SLAC — Hediye Setleri" className={cell}>
          <svg viewBox="0 0 150 132" className={tree} role="img" aria-label="Çam ağacı ve hediye kutuları" fill="none">
            <path d="M75 4 L80 20 L96 20 L83 30 L88 46 L75 36 L62 46 L67 30 L54 20 L70 20 Z" fill="#ffffff" />
            <path d="M75 22 L52 56 L98 56 Z" fill="#ffffff" />
            <path d="M75 44 L42 82 L108 82 Z" fill="#ffffff" />
            <path d="M75 66 L32 106 L118 106 Z" fill="#ffffff" />
            <rect x="68" y="106" width="14" height="12" fill="#ffffff" />
            <circle cx="75" cy="40" r="3" fill="#0a2419" />
            <circle cx="63" cy="62" r="3" fill="#0a2419" />
            <circle cx="87" cy="66" r="3" fill="#0a2419" />
            <circle cx="60" cy="90" r="3.5" fill="#0a2419" />
            <circle cx="90" cy="92" r="3.5" fill="#0a2419" />
            <circle cx="75" cy="82" r="3.5" fill="#0a2419" />
            <rect x="18" y="112" width="30" height="20" fill="#ffffff" />
            <rect x="31" y="112" width="4" height="20" fill="#0a2419" />
            <rect x="18" y="120" width="30" height="3" fill="#0a2419" />
            <path d="M33 112 L26 104 L33 108 L40 104 Z" fill="#ffffff" />
            <rect x="60" y="118" width="30" height="14" fill="#ffffff" />
            <rect x="72" y="118" width="4" height="14" fill="#0a2419" />
            <rect x="60" y="124" width="30" height="2.5" fill="#0a2419" />
            <rect x="102" y="112" width="30" height="20" fill="#ffffff" />
            <rect x="115" y="112" width="4" height="20" fill="#0a2419" />
            <rect x="102" y="120" width="30" height="3" fill="#0a2419" />
            <path d="M117 112 L110 104 L117 108 L124 104 Z" fill="#ffffff" />
          </svg>
          <span className="flex flex-col">
            <span className={word}>SLAC</span>
            {compact ? null : <span className={desc}>Hediye Setleri</span>}
          </span>
        </Link>

        {/* 3 · CLIK — saat ve mücevher kutuları */}
        <Link to="/saat-mucevher-kutulari" aria-label="CLIK — Saat ve Mücevher Kutuları" className={cell}>
          <svg viewBox="0 0 120 132" className={sq} role="img" aria-label="Mücevher kutusu logosu" fill="none">
            <path d="M48 30 L72 30 L80 47 L60 82 L40 47 Z" fill="#ffffff" />
            <path
              d="M40 47 L80 47 M48 30 L60 47 M72 30 L60 47 M60 47 L60 82 M40 47 L60 82 M80 47 L60 82"
              stroke="#0a2419"
              strokeWidth="2.4"
            />
            <rect x="28" y="92" width="64" height="28" fill="#ffffff" />
            <rect x="28" y="99" width="64" height="2.6" fill="#0a2419" />
            <rect x="54" y="97" width="12" height="7" fill="#0a2419" />
          </svg>
          <span className="flex flex-col">
            <span className={word}>CLIK</span>
            {compact ? null : <span className={desc}>Saat ve Mücevher kutuları</span>}
          </span>
        </Link>

        {/* 4 · DESQ — lüks ofis ürünleri */}
        <Link to="/ofis" aria-label="DESQ — Lüks Ofis Ürünleri" className={cell}>
          <svg viewBox="0 0 120 132" className={sq} role="img" aria-label="Ofis seti logosu" fill="none">
            <rect x="40" y="60" width="40" height="9" fill="#ffffff" />
            <rect x="44" y="69" width="32" height="42" fill="#ffffff" />
            <rect x="44" y="74" width="32" height="3" fill="#0a2419" />
            <rect x="55" y="14" width="6" height="50" fill="#ffffff" transform="rotate(11 58 40)" />
            <rect x="66" y="12" width="6" height="52" fill="#ffffff" transform="rotate(-9 69 40)" />
            <rect x="55" y="14" width="6" height="7" fill="#0a2419" transform="rotate(11 58 40)" />
            <rect x="66" y="12" width="6" height="7" fill="#0a2419" transform="rotate(-9 69 40)" />
            <rect x="20" y="116" width="80" height="12" fill="#ffffff" />
            <rect x="46" y="119" width="28" height="6" fill="#0a2419" />
          </svg>
          <span className="flex flex-col">
            <span className={word}>DESQ</span>
            {compact ? null : <span className={desc}>Lüks Ofis Ürünleri</span>}
          </span>
        </Link>
      </div>
    </div>
  );
}
