import assert from "node:assert/strict";
import test from "node:test";
import { discoverySetPrice, sampleChoices } from "./discovery.ts";
import { matchesQuery, similarityScore, type Product } from "./products.ts";
import { orderInput, priceOrder } from "./order-input.ts";
import { applySampleCredit, openSampleCredits } from "./sample-credit.ts";
import { SCENT_QUESTIONS, scentScore } from "./scent-quiz.ts";

const DAY = 24 * 60 * 60 * 1000;

function perfume(partial: Partial<Product> & Pick<Product, "sku" | "name">): Product {
  return {
    shortName: partial.name,
    brand: "Maison",
    category: "kadin",
    price: 100,
    image: "/x.svg",
    tagline: "",
    description: "",
    features: [],
    specs: [],
    stockStatus: "stokta",
    ...partial,
  };
}

function draft(items: Array<{ sku: string; color: string; qty: number }>, expectedTotal: number) {
  return orderInput.parse({
    id: "SW-00000000-0000-4000-8000-000000000001",
    name: "Test Müşteri",
    email: "test@example.invalid",
    phone: "05000000000",
    city: "İstanbul",
    district: "Test",
    postal: "34000",
    taxNumber: "00000000000",
    address: "Yalnız yerel test adresi",
    note: "",
    pay: "kapida-nakit",
    consent: true,
    expectedTotal,
    items,
  });
}

test("scent quiz asks six questions and prefers a matching note", () => {
  assert.equal(SCENT_QUESTIONS.length, 6);
  const rose = perfume({
    sku: "A",
    name: "Gül",
    families: ["ciceksi"],
    seasons: ["ilkbahar"],
    notes: { top: ["Bergamot"], heart: ["Türk gülü"], base: ["Misk"] },
    sillage: 3,
    gender: "kadin",
  });
  const wood = perfume({
    sku: "B",
    name: "Odun",
    families: ["odunsu"],
    seasons: ["kis"],
    notes: { top: ["Bergamot"], heart: ["Sedir"], base: ["Vetiver"] },
    sillage: 3,
    gender: "kadin",
  });
  const answers = { kim: "kadin" as const, his: "ciceksi" as const, mevsim: "ilkbahar" as const, nota: "Gül" as const };
  assert.ok(scentScore(rose, answers) > scentScore(wood, answers));
});

test("discovery price is the five cheapest samples", () => {
  assert.equal(discoverySetPrice([9, 1, 4, 3, 8, 2]), 18);
  assert.equal(discoverySetPrice([1, 2, 3, 4]), null);
  const one = sampleChoices([
    perfume({
      sku: "FP-005",
      name: "Oud",
      sizes: [
        { id: "2ml", ml: 2, price: 190, sample: true },
        { id: "5ml", ml: 5, price: 420, sample: true },
      ],
    }),
  ]);
  assert.equal(one.length, 1);
  assert.equal(one[0]?.color, "2ml");
  const items = [0, 1, 2, 3, 4].map((n) => ({ sku: `S${n}`, color: "5ml", qty: 1 }));
  const priced = priceOrder(
    { ...draft(items, 1149), discoverySet: true },
    () => ({ name: "Deneme", colorName: "5 ml", price: 400, sample: true }),
    { discoveryCents: 100_000 },
  );
  assert.equal(priced.total, 114_900);
  assert.equal(
    priced.items.reduce((sum, item) => sum + item.unitPrice, 0),
    100_000,
  );
  assert.throws(
    () =>
      priceOrder(
        { ...draft(items.slice(0, 4), 1), discoverySet: true },
        () => ({ name: "Deneme", colorName: "5 ml", price: 400, sample: true }),
        { discoveryCents: 100_000 },
      ),
    /5 deneme/,
  );
});

test("sample credit stays inside 30 days and does not buy free shipping", () => {
  const now = Date.UTC(2026, 8, 29);
  const open = openSampleCredits(
    [
      { sku: "FP-001", sampleCents: 29_000, bottle: false, at: now - 10 * DAY },
      { sku: "FP-002", sampleCents: 29_000, bottle: false, at: now - 40 * DAY },
      { sku: "FP-003", sampleCents: 29_000, bottle: false, at: now - 2 * DAY },
      { sku: "FP-003", sampleCents: 0, bottle: true, at: now - DAY },
    ],
    now,
  );
  assert.deepEqual(open, { "FP-001": 29_000 });
  assert.equal(applySampleCredit([{ sku: "FP-001", unitPrice: 10_000, qty: 1, sample: true }], open, 10_000), 0);
  const priced = priceOrder(
    draft([{ sku: "FP-001", color: "50ml", qty: 1 }], 859),
    () => ({ name: "Şişe", colorName: "50 ml", price: 1000, sample: false }),
    { sampleCredits: { "FP-001": 29_000 } },
  );
  assert.equal(priced.sampleCredit, 29_000);
  assert.equal(priced.shipping, 14_900);
  assert.equal(priced.total, 85_900);
});

test("similar scents use shared notes and search tolerates one typo", () => {
  const current = perfume({
    sku: "A",
    name: "Gül",
    category: "kadin",
    families: ["ciceksi"],
    notes: { top: [], heart: ["Gül"], base: [] },
  });
  const noted = perfume({
    sku: "B",
    name: "Başka",
    category: "erkek",
    families: ["amber"],
    notes: { top: [], heart: ["Gül"], base: [] },
  });
  const sameShelf = perfume({
    sku: "C",
    name: "Raf",
    category: "kadin",
    families: ["odunsu"],
    notes: { top: [], heart: ["Sedir"], base: [] },
  });
  assert.ok(similarityScore(current, noted) > similarityScore(current, sameShelf));
  const vanilya = perfume({
    sku: "D",
    name: "Gece",
    notes: { top: [], heart: [], base: ["Vanilya"] },
  });
  assert.equal(matchesQuery(vanilya, "vanlya"), true);
  assert.equal(matchesQuery(vanilya, "zzzz"), false);
});
