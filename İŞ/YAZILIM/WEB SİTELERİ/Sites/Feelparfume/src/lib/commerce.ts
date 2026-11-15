import { DEFAULT_SHIPPING, shippingAmount, type ShippingRule } from "./shipping.ts";

export const FREE_SHIPPING_FROM = DEFAULT_SHIPPING.freeFrom;
export const SHIPPING_FEE = DEFAULT_SHIPPING.fee;
export const VAT_RATE = 0.2;

export function shippingForSubtotal(subtotal: number, rule: ShippingRule = DEFAULT_SHIPPING) {
  return shippingAmount(subtotal, rule);
}

export function orderTotal(subtotal: number) {
  const safeSubtotal = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
  return safeSubtotal + shippingForSubtotal(safeSubtotal);
}

export function includedVat(gross: number) {
  if (!Number.isFinite(gross) || gross <= 0) return 0;
  return gross - gross / (1 + VAT_RATE);
}

export function normalizeTurkishMobile(value: string) {
  return value.trim().replace(/[\s()-]/g, "");
}

export function isTurkishMobile(value: string) {
  return /^(?:\+90|0)?5\d{9}$/.test(normalizeTurkishMobile(value));
}

export function isTurkishPhone(value: string) {
  return /^(?:\+90|0)?(?:5\d{9}|[234]\d{9})$/.test(normalizeTurkishMobile(value));
}

export function isPostalCode(value: string) {
  return /^\d{5}$/.test(value.trim());
}

export function isTaxNumber(value: string) {
  // VKN (vergi kimlik no) 10 hane, TCKN 11 hane.
  return /^\d{10,11}$/.test(value.trim());
}

export const PAY_METHODS = [
  { id: "kapida-nakit", label: "Kapıda nakit", hint: "Teslimde nakit. Kart sitede alınmaz." },
  { id: "kapida-kart", label: "Kapıda kart", hint: "Kuryenin POS'u. Numara sitede yazılmaz." },
  {
    id: "havale",
    label: "Havale-EFT",
    hint: "IBAN onay e-postasındadır. Açıklamaya sipariş no.",
  },
] as const;

export const KART_METHOD = { id: "kart" as const, label: "Kart" };

export type PayMethod = (typeof PAY_METHODS)[number]["id"] | "kart";

export function checkoutPayMethods(paytr: boolean) {
  return paytr ? [...PAY_METHODS, KART_METHOD] : [...PAY_METHODS];
}

export function payLabel(pay: string) {
  if (pay === "kart") return KART_METHOD.label;
  return PAY_METHODS.find((item) => item.id === pay)?.label ?? pay;
}
