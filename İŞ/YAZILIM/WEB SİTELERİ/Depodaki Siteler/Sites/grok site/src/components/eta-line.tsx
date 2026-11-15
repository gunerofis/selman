import { useHydrated } from "@/lib/use-hydrated";
import { cutoffCopy, formatTrDay, shipWindow } from "@/lib/hours";

export function EtaLine({ className = "text-sm text-fg-muted" }: { className?: string }) {
  const ready = useHydrated();
  if (!ready) {
    return (
      <p className={className}>
        Bugün sipariş: kargo 3–5 iş günü. Hafta içi 18.00'a kadar bugün işleme alınır.
      </p>
    );
  }
  const { earliest, latest } = shipWindow();
  return (
    <p className={className}>
      Bugün sipariş: kargo {formatTrDay(earliest)} – {formatTrDay(latest)}. {cutoffCopy()}
    </p>
  );
}
