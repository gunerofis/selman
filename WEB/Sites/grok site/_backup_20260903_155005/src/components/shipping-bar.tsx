import { FREE_SHIPPING_FROM } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function ShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);

  return (
    <div>
      <div className="h-1 overflow-hidden bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-fg-muted">
        {remaining > 0
          ? `Ücretsiz kargo için ${formatPrice(remaining)} kaldı.`
          : "Kargo ücretsiz."}
      </p>
    </div>
  );
}
