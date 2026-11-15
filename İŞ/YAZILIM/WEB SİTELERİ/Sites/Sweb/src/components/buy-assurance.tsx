import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { EtaLine } from "@/components/eta-line";

/** Research: returns/shipping next to ATC, not in the footer. No fake reviews. */
export function BuyAssurance({
  price,
  madeToOrder = false,
}: {
  price?: number;
  madeToOrder?: boolean;
}) {
  const ship =
    price != null && price >= FREE_SHIPPING_FROM ? 0 : price != null ? SHIPPING_FEE : null;
  const shipLine =
    ship === 0
      ? `Bu ürün ücretsiz kargoya dahildir. Toplam ${formatPrice(price ?? 0)}.`
      : ship != null && price != null
        ? `Kargo ${formatPrice(ship)}. Bu ürün + kargo ${formatPrice(price + ship)}. ${formatPrice(FREE_SHIPPING_FROM)} üzeri kargo ücretsiz.`
        : `${formatPrice(FREE_SHIPPING_FROM)} üzeri kargo ücretsiz.`;
  return (
    <ul className="grid gap-1.5 text-xs text-fg-muted">
      <li>
        <EtaLine className="text-xs text-fg-muted" />
      </li>
      <li>
        {shipLine}{" "}
        <Link to="/teslimat" className="text-taba hover:underline">
          Teslimat
        </Link>
      </li>
      <li>
        {madeToOrder
          ? "Kişiye özel ölçü, isim veya tasarımla üretilen üründe cayma yoktur; üretim hatasına ilişkin haklar saklıdır."
          : "Hazır ve standart üründe 14 gün; kullanılmamış olmalıdır."}{" "}
        <Link to="/iade" className="text-taba hover:underline">
          İade
        </Link>
        {" · "}
        <Link to="/garanti" className="text-taba hover:underline">
          Garanti
        </Link>
      </li>
      <li>Kart numarası bu sitede alınmaz. Kapıda nakit/kart veya havale. {BRAND.atelier}.</li>
      <li>
        Hediye / kapıcı notu ödeme adımında.{" "}
        <Link to="/hediye" className="text-taba hover:underline">
          Hediye
        </Link>
      </li>
    </ul>
  );
}
