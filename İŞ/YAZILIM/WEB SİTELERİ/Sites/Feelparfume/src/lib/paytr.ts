import { createHmac, timingSafeEqual } from "node:crypto";

export function merchantOid(orderId: string) {
  const oid = orderId.replace(/[^a-zA-Z0-9]/g, "");
  if (!oid || oid.length > 64) throw new Error("merchant_oid");
  return oid;
}

export function tlAmount(cents: number) {
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

export function userBasket(rows: [string, string, number][]) {
  return Buffer.from(JSON.stringify(rows), "utf8").toString("base64");
}

export function basketRows(input: {
  items: { name: string; unitCents: number; qty: number }[];
  shippingCents: number;
  giftWrapCents: number;
  discountCents: number;
  totalCents: number;
}) {
  if (input.discountCents > 0) {
    return [["Siparis", tlAmount(input.totalCents), 1]] as [string, string, number][];
  }
  const rows: [string, string, number][] = input.items.map((item) => [
    item.name.slice(0, 80),
    tlAmount(item.unitCents),
    item.qty,
  ]);
  if (input.shippingCents > 0) rows.push(["Kargo", tlAmount(input.shippingCents), 1]);
  if (input.giftWrapCents > 0) rows.push(["Hediye paketi", tlAmount(input.giftWrapCents), 1]);
  return rows;
}

function hmac(data: string, key: string) {
  return createHmac("sha256", key).update(data).digest("base64");
}

export function iframeToken(args: {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: string;
  userBasket: string;
  noInstallment?: string;
  maxInstallment?: string;
  currency?: string;
  testMode: string;
}) {
  const noInstallment = args.noInstallment ?? "0";
  const maxInstallment = args.maxInstallment ?? "0";
  const currency = args.currency ?? "TL";
  const hashStr =
    args.merchantId +
    args.userIp +
    args.merchantOid +
    args.email +
    args.paymentAmount +
    args.userBasket +
    noInstallment +
    maxInstallment +
    currency +
    args.testMode;
  return hmac(hashStr + args.merchantSalt, args.merchantKey);
}

export function callbackToken(args: {
  merchantOid: string;
  merchantSalt: string;
  status: string;
  totalAmount: string;
  merchantKey: string;
}) {
  return hmac(
    args.merchantOid + args.merchantSalt + args.status + args.totalAmount,
    args.merchantKey,
  );
}

export function refundToken(args: {
  merchantId: string;
  merchantOid: string;
  returnAmount: string;
  merchantSalt: string;
  merchantKey: string;
}) {
  return hmac(
    args.merchantId + args.merchantOid + args.returnAmount + args.merchantSalt,
    args.merchantKey,
  );
}

export function ratesToken(args: {
  merchantId: string;
  requestId: string;
  merchantSalt: string;
  merchantKey: string;
}) {
  return hmac(args.merchantId + args.requestId + args.merchantSalt, args.merchantKey);
}

export function sameToken(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function amountMatches(totalAmount: string, totalCents: number) {
  return /^\d+$/.test(totalAmount) && Number(totalAmount) === totalCents;
}

export function decideCallback(input: {
  hashOk: boolean;
  status: string;
  amountOk: boolean;
  alreadyPaid: boolean;
  stockApplied: boolean;
}) {
  if (!input.hashOk) {
    return { response: "ERR" as const, markPaid: false, applyStock: false, markFailed: false };
  }
  if (input.status === "success") {
    if (!input.amountOk) {
      return { response: "OK" as const, markPaid: false, applyStock: false, markFailed: false };
    }
    return {
      response: "OK" as const,
      markPaid: !input.alreadyPaid,
      applyStock: !input.stockApplied,
      markFailed: false,
    };
  }
  return {
    response: "OK" as const,
    markPaid: false,
    applyStock: false,
    markFailed: !input.alreadyPaid,
  };
}
