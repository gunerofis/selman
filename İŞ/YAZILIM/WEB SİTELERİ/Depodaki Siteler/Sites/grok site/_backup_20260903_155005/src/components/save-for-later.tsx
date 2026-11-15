import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import type { ColorId } from "@/lib/products";

/** Baymard: cart is a holding list — move aside without deleting intent. */
export function SaveForLater({ sku, color }: { sku: string; color: ColorId }) {
  const remove = useCart((s) => s.remove);
  const wishlist = usePrefs((s) => s.wishlist);
  const toggleWish = usePrefs((s) => s.toggleWish);

  return (
    <button
      type="button"
      className="text-xs text-fg-muted hover:text-fg"
      onClick={() => {
        if (!wishlist.includes(sku)) toggleWish(sku);
        remove(sku, color);
        toast.success("Favorilere alındı");
      }}
    >
      Sonra bak
    </button>
  );
}
