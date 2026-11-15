import assert from "node:assert/strict";
import test from "node:test";
import { invoicePdf } from "./invoice-pdf.ts";

test("shop invoice is a PDF without a filed e-archive claim", () => {
  const bytes = invoicePdf({
    number: "EAR2026000001",
    title: "FATURA",
    prices: true,
    seller: {
      name: "Feel Parfüm",
      address: "Şişli",
      taxOffice: "Şişli",
      taxNumber: "0000000000",
      phone: "+90 212 000 00 00",
      email: "destek@feelparfume.com",
    },
    buyer: { name: "Ada", address: "Test", taxNumber: "00000000000", email: "a@b.co" },
    lines: [{ name: "Gül", qty: 1, unitCents: 15_000 }],
    shippingCents: 0,
    discountCents: 0,
    giftWrapCents: 9_000,
    totalCents: 24_000,
  });
  const text = new TextDecoder().decode(bytes);
  assert.equal(text.startsWith("%PDF"), true);
  assert.match(text, /FATURA/);
  assert.match(text, /KDV/);
  assert.match(text, /Sisli/);
  assert.equal(text.includes("ş"), false);
  assert.equal(/G[İI]B|ETTN/i.test(text), false);
});
