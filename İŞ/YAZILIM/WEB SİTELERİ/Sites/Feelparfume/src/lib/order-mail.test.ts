import assert from "node:assert/strict";
import test from "node:test";
import { mailEventFor, orderMail } from "./order-mail.ts";

test("mail follows fulfillment and does not repeat alındı on payment", () => {
  assert.equal(mailEventFor({ type: "created" }), "alindi");
  assert.equal(mailEventFor({ type: "payment" }), null);
  assert.equal(mailEventFor({ type: "shipping", status: "preparing" }), "hazirlaniyor");
  assert.equal(mailEventFor({ type: "shipping", status: "shipped" }), "kargoda");
  assert.equal(mailEventFor({ type: "shipping", status: "delivered" }), "teslim");
  assert.equal(mailEventFor({ type: "shipping", status: "pending" }), null);
  const mail = orderMail("kargoda", "SW-1");
  assert.equal(mail.subject.includes("SW-1"), true);
  assert.equal(mail.body.length < 80, true);
});
