import { Heart } from "lucide-react";
import { toast } from "sonner";
import { usePrefs } from "@/lib/prefs";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function WishButton({
  sku,
  className,
}: {
  sku: string;
  className?: string;
}) {
  const ready = useHydrated();
  const wishlist = usePrefs((s) => s.wishlist);
  const toggle = usePrefs((s) => s.toggleWish);
  const on = ready && wishlist.includes(sku);

  return (
    <button
      type="button"
      aria-label={on ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !on;
        toggle(sku);
        toast.success(next ? "Favorilere eklendi" : "Favorilerden çıktı");
      }}
      className={cn(
        "flex size-11 items-center justify-center bg-bg-elevated/90 text-fg transition-colors duration-200 hover:bg-bg",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-transform duration-200", on && "heart-pop fill-accent text-accent")} />
    </button>
  );
}
