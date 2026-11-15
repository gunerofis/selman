import { BRAND } from "@/lib/brand";
import { istanbulNow } from "@/lib/hours";
import { useHydrated } from "@/lib/use-hydrated";

export function OpenBadge({ tone = "light" }: { tone?: "light" | "deep" }) {
  const ready = useHydrated();
  const muted = tone === "deep" ? "text-fg-on-deep/70" : "text-fg-muted";
  if (!ready) {
    return <p className={`font-mono text-xs ${muted}`}>Hafta içi {BRAND.hours}</p>;
  }
  const { open } = istanbulNow();
  return (
    <p className="font-mono text-xs">
      <span className={open ? "text-taba" : muted}>{open ? "Şu an açık" : "Şu an kapalı"}</span>
      <span className={muted}> · hafta içi {BRAND.hours}</span>
    </p>
  );
}
