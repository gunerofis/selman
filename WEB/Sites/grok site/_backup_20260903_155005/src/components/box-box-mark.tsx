export function BoxBoxMark() {
  return (
    <div className="boxbox-bar border-b border-dashed border-border bg-[#0a2419] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-3 divide-x divide-dashed divide-white/25">
        {/* 1 · SWEB — düzen / organizer */}
        <div className="flex items-center justify-center gap-2 px-3 py-3 sm:gap-4 sm:py-4">
          <svg
            viewBox="0 0 120 132"
            className="h-11 w-auto shrink-0 sm:h-16 lg:h-20"
            role="img"
            aria-label="Sweb düzen logosu"
            fill="none"
          >
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
            <span className="boxbox-word text-2xl leading-none text-white sm:text-4xl lg:text-6xl">
              SWEB
            </span>
            <span className="mt-1.5 hidden font-mono text-[10px] leading-tight tracking-wide text-white/65 sm:block sm:text-[11px]">
              Düzen ve Organize Gereçleri
            </span>
          </span>
        </div>

        {/* 2 · SLAC — hediye setleri */}
        <div className="flex items-center justify-center gap-2 px-3 py-3 sm:gap-5 sm:py-4">
          <svg
            viewBox="0 0 150 132"
            className="h-12 w-auto shrink-0 sm:h-16 lg:h-20"
            role="img"
            aria-label="Çam ağacı ve hediye kutuları"
            fill="none"
          >
            <path
              d="M75 4 L80 20 L96 20 L83 30 L88 46 L75 36 L62 46 L67 30 L54 20 L70 20 Z"
              fill="#ffffff"
            />
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
            <span className="boxbox-word text-2xl leading-none text-white sm:text-4xl lg:text-6xl">
              SLAC
            </span>
            <span className="mt-1.5 hidden font-mono text-[10px] leading-tight tracking-wide text-white/65 sm:block sm:text-[11px]">
              Hediye Setleri
            </span>
          </span>
        </div>

        {/* 3 · CLIK — aksesuar / saat / takı / mücevher kutuları */}
        <div className="flex items-center justify-center gap-2 px-3 py-3 sm:gap-4 sm:py-4">
          <svg
            viewBox="0 0 120 132"
            className="h-11 w-auto shrink-0 sm:h-16 lg:h-20"
            role="img"
            aria-label="Mücevher kutusu logosu"
            fill="none"
          >
            {/* Elmas (faceted, keskin) */}
            <path d="M48 30 L72 30 L80 47 L60 82 L40 47 Z" fill="#ffffff" />
            <path
              d="M40 47 L80 47 M48 30 L60 47 M72 30 L60 47 M60 47 L60 82 M40 47 L60 82 M80 47 L60 82"
              stroke="#0a2419"
              strokeWidth="2.4"
            />
            {/* Mücevher kutusu */}
            <rect x="28" y="92" width="64" height="28" fill="#ffffff" />
            <rect x="28" y="99" width="64" height="2.6" fill="#0a2419" />
            <rect x="54" y="97" width="12" height="7" fill="#0a2419" />
          </svg>
          <span className="flex flex-col">
            <span className="boxbox-word text-2xl leading-none text-white sm:text-4xl lg:text-6xl">
              CLIK
            </span>
            <span className="mt-1.5 hidden font-mono text-[10px] leading-tight tracking-wide text-white/65 sm:block sm:text-[11px]">
              Saat ve Mücevher kutuları
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
