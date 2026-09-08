import type { PayMethod } from "./commerce";
import type { CartLine } from "./cart";

const DRAFT_KEY = "sweb-checkout-draft";
const ORDER_KEY = "sweb-order-fp";

export type CheckoutDraft = {
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  postal: string;
  address: string;
  note: string;
  pay: PayMethod;
  gift: boolean;
  cityOther: string;
};

export function readCheckoutDraft(): Partial<CheckoutDraft> {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<CheckoutDraft>;
  } catch {
    return {};
  }
}

export function writeCheckoutDraft(patch: Partial<CheckoutDraft>) {
  try {
    const next = { ...readCheckoutDraft(), ...patch };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function clearCheckoutDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function stableOrderId(lines: CartLine[], email: string) {
  const fp = `${[...lines]
    .map((l) => `${l.sku}:${l.color}:${l.qty}`)
    .sort()
    .join("|")}|${email.trim().toLocaleLowerCase("tr")}`;
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (raw) {
      const prev = JSON.parse(raw) as { fp: string; id: string };
      if (prev.fp === fp && prev.id) return prev.id;
    }
  } catch {
    /* ignore */
  }
  const id = `SW-${Date.now().toString(36).toUpperCase()}`;
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify({ fp, id }));
  } catch {
    /* ignore */
  }
  return id;
}
