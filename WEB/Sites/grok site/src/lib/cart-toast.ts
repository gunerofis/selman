import { toast } from "sonner";
import { useCart } from "./cart";

/** Baymard: after add, confirm and offer a path to the cart. */
export function toastAdded(name: string) {
  toast.success(`${name} sepete eklendi`, {
    action: {
      label: "Sepet",
      onClick: () => useCart.getState().openDrawer(),
    },
  });
}

/** Accidental remove is a top cart error — undo without re-picking color/qty. */
export function toastRemoved(name: string) {
  toast(`${name} sepetten alındı`, {
    action: {
      label: "Geri al",
      onClick: () => useCart.getState().restoreLast(),
    },
  });
}
