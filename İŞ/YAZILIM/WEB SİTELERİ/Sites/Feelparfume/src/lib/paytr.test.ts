import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { installmentRows, parseRatePayload } from "./installments.ts";
import {
  amountMatches,
  basketRows,
  callbackToken,
  decideCallback,
  iframeToken,
  merchantOid,
  refundToken,
  userBasket,
} from "./paytr.ts";

const key = "key";
const salt = "salt";

test("iframe, callback and refund hashes keep the official field order", () => {
  const basket = userBasket([["Gül", "18.00", 1]]);
  const token = iframeToken({
    merchantId: "1",
    merchantKey: key,
    merchantSalt: salt,
    userIp: "1.1.1.1",
    merchantOid: "SWabc",
    email: "a@b.co",
    paymentAmount: "1800",
    userBasket: basket,
    testMode: "1",
  });
  const iframeHash =
    "1" + "1.1.1.1" + "SWabc" + "a@b.co" + "1800" + basket + "0" + "0" + "TL" + "1" + salt;
  assert.equal(token, createHmac("sha256", key).update(iframeHash).digest("base64"));

  const callback = callbackToken({
    merchantOid: "SWabc",
    merchantSalt: salt,
    status: "success",
    totalAmount: "1800",
    merchantKey: key,
  });
  assert.equal(
    callback,
    createHmac("sha256", key).update("SWabc" + salt + "success" + "1800").digest("base64"),
  );

  const refund = refundToken({
    merchantId: "1",
    merchantOid: "SWabc",
    returnAmount: "11.97",
    merchantSalt: salt,
    merchantKey: key,
  });
  assert.equal(refund, createHmac("sha256", key).update("1" + "SWabc" + "11.97" + salt).digest("base64"));
});

test("merchant oid, amount and callback decisions", () => {
  assert.equal(merchantOid("SW-abc-def"), "SWabcdef");
  assert.equal(amountMatches("1800", 1800), true);
  assert.equal(amountMatches("18.00", 1800), false);
  assert.deepEqual(
    decideCallback({ hashOk: false, status: "success", amountOk: true, alreadyPaid: false, stockApplied: false }),
    { response: "ERR", markPaid: false, applyStock: false, markFailed: false },
  );
  assert.deepEqual(
    decideCallback({ hashOk: true, status: "success", amountOk: false, alreadyPaid: false, stockApplied: false }),
    { response: "OK", markPaid: false, applyStock: false, markFailed: false },
  );
  assert.deepEqual(
    decideCallback({ hashOk: true, status: "success", amountOk: true, alreadyPaid: true, stockApplied: true }),
    { response: "OK", markPaid: false, applyStock: false, markFailed: false },
  );
  assert.equal(
    decideCallback({ hashOk: true, status: "success", amountOk: true, alreadyPaid: false, stockApplied: false }).applyStock,
    true,
  );
  assert.equal(
    decideCallback({ hashOk: true, status: "failed", amountOk: true, alreadyPaid: true, stockApplied: true }).markFailed,
    false,
  );
});

test("installments come only from a parsed rate table", () => {
  assert.deepEqual(parseRatePayload({}), []);
  const rates = parseRatePayload({ status: "success", oranlar: { axess: { taksit_2: "1.99" } } });
  assert.deepEqual(rates, [{ bank: "axess", months: 2, ratioBps: 199 }]);
  const [row] = installmentRows(10_000, rates);
  assert.equal(row.totalCents, 10_199);
  assert.equal(row.eachCents, 5_100);
  assert.deepEqual(
    basketRows({
      items: [{ name: "Gül", unitCents: 10_000, qty: 1 }],
      shippingCents: 0,
      giftWrapCents: 0,
      discountCents: 1_000,
      totalCents: 9_000,
    }),
    [["Siparis", "90.00", 1]],
  );
});
