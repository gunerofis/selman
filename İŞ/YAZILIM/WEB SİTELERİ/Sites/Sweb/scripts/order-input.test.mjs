import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { orderInput, priceOrder } from "../src/lib/order-input.ts";

const draft = () => ({
  id: "SW-00000000-0000-4000-8000-000000000001",
  name: "Test Müşteri",
  email: "test@example.invalid",
  phone: "05000000000",
  city: "İstanbul",
  district: "Test",
  postal: "34000",
  address: "Yalnız yerel test adresi",
  note: "",
  pay: "kapida-nakit",
  consent: true,
  expectedTotal: 1500,
  items: [{ sku: "test", color: "siyah", qty: 1 }],
});
const product = () => ({ name: "Test ürün", colorName: "Siyah", price: 1500 });
test("server rejects tampered quantities, missing consent and invalid contact data", () => {
  for (const patch of [
    { consent: false },
    { email: "a" },
    { phone: "123" },
    { items: [{ sku: "test", color: "siyah", qty: -1 }] },
    { items: [{ sku: "test", color: "siyah", qty: 1.5 }] },
  ])
    assert.equal(orderInput.safeParse({ ...draft(), ...patch }).success, false);
});
test("prices come from server catalog and shipping includes exactly 1500 TL", () => {
  const out = priceOrder(orderInput.parse(draft()), product);
  assert.equal(out.total, 150000);
  assert.equal(out.shipping, 0);
  assert.throws(() => priceOrder({ ...draft(), expectedTotal: 1 }, product), /tutarı değişti/);
  assert.throws(() => priceOrder(draft(), () => undefined), /sipariş verilemeyen/);
});
test("duplicate item rows are rejected", () =>
  assert.throws(
    () => priceOrder({ ...draft(), items: [...draft().items, ...draft().items] }, product),
    /tekrar/,
  ));
test("database enforces durable idempotency and private receipt snapshots", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      await readFile(new URL("../migrations/0002_order_requests.sql", import.meta.url), "utf8"),
    );
    const sql =
      "insert into storefront_order_requests (id,request_hash,customer,items,total_cents,shipping_cents) values ($1,$2,$3,$4,$5,$6) on conflict(id) do nothing returning id";
    const params = [draft().id, "hash", JSON.stringify({ name: "Yerel test" }), "[]", 150000, 0];
    assert.equal((await db.query(sql, params)).rows.length, 1);
    assert.equal((await db.query(sql, params)).rows.length, 0);
    assert.equal(
      (await db.query("select count(*)::int as count from storefront_order_requests")).rows[0]
        .count,
      1,
    );
    assert.equal(
      (await db.query("select customer from storefront_order_requests")).rows[0].customer.name,
      "Yerel test",
    );
  } finally {
    await db.close();
  }
});
