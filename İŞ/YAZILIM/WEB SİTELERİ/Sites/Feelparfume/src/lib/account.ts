export const POINT_CENTS = 10_000;
export const WELCOME_PERCENT = 10;
export const BIRTHDAY_PERCENT = 10;
export const BOTTLE_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function validBirth(month: number | null, day: number | null) {
  if (month == null && day == null) return true;
  if (month == null || day == null) return false;
  if (!Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12) return false;
  return day >= 1 && day <= MONTH_DAYS[month - 1];
}

export function istanbulDate(now: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(now));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const year = pick("year");
  const month = pick("month");
  const day = pick("day");
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { iso, year, month, day };
}

export function birthdayMatch(month: number | null, day: number | null, now = Date.now()) {
  if (month == null || day == null || !validBirth(month, day)) return false;
  const today = istanbulDate(now);
  return today.month === month && today.day === day;
}

export function pointsFromItems(items: readonly { unitPrice?: unknown; qty?: unknown }[]) {
  let cents = 0;
  for (const item of items) {
    const price = item.unitPrice;
    const qty = item.qty;
    if (typeof price !== "number" || typeof qty !== "number") continue;
    if (!Number.isInteger(price) || !Number.isInteger(qty) || price < 0 || qty < 1) continue;
    cents += price * qty;
  }
  if (cents <= 0) return 0;
  return Math.floor(cents / POINT_CENTS);
}

export function bottleReady(createdAtMs: number, now: number) {
  if (!Number.isFinite(createdAtMs) || !Number.isFinite(now)) return false;
  return now - createdAtMs >= BOTTLE_DAYS * DAY_MS;
}

export function priceDropped(savedCents: number, currentCents: number) {
  return (
    Number.isInteger(savedCents) &&
    Number.isInteger(currentCents) &&
    currentCents >= 0 &&
    currentCents < savedCents
  );
}

export type AccountAddress = {
  id: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  postal: string;
  address: string;
};

export type AccountView = {
  email: string;
  points: number;
  coupons: string[];
  birthMonth: number | null;
  birthDay: number | null;
  consentStock: boolean;
  consentPrice: boolean;
  consentBottle: boolean;
  addresses: AccountAddress[];
  orders: { id: string; totalCents: number; status: string }[];
  wishes: { sku: string; name: string; slug: string }[];
};

export function assertCouponHolder(
  coupon: { ownerEmail?: string | null; expiresOn?: string | null } | null,
  email: string,
  todayIso: string,
) {
  if (!coupon) return;
  const owner = (coupon.ownerEmail ?? "").trim().toLowerCase();
  if (owner && owner !== email.trim().toLowerCase()) throw new Error("Kupon geçersiz.");
  const expires = (coupon.expiresOn ?? "").slice(0, 10);
  if (expires && expires < todayIso) throw new Error("Kupon geçersiz.");
}
