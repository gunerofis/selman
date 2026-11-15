import assert from "node:assert/strict";
import test from "node:test";
import { addBusinessDays, atelierOpenAt, cutoffCopy, shipWindow } from "./hours.ts";

test("atelier is open weekday mornings and closed weekends", () => {
  assert.equal(atelierOpenAt(new Date("2026-09-02T10:00:00")), true);
  assert.equal(atelierOpenAt(new Date("2026-09-02T08:59:00")), false);
  assert.equal(atelierOpenAt(new Date("2026-09-02T18:00:00")), false);
  assert.equal(atelierOpenAt(new Date("2026-09-05T11:00:00")), false);
  assert.equal(atelierOpenAt(new Date("2026-09-06T11:00:00")), false);
});

test("business days skip the weekend", () => {
  const wed = new Date("2026-09-02T10:00:00");
  const plus3 = addBusinessDays(wed, 3);
  assert.equal(plus3.getFullYear(), 2026);
  assert.equal(plus3.getMonth(), 8);
  assert.equal(plus3.getDate(), 7);
  const fri = new Date("2026-09-04T10:00:00");
  const fromFri = addBusinessDays(fri, 2);
  assert.equal(fromFri.getDate(), 8);
});

test("ship window after Friday evening starts next week", () => {
  const { earliest, latest } = shipWindow(new Date("2026-09-04T19:00:00"));
  assert.equal(earliest.getDay(), 4);
  assert.equal(latest.getDay(), 1);
});

test("cutoff is today while the atelier is open", () => {
  const copy = cutoffCopy(new Date("2026-09-02T10:00:00"));
  assert.match(copy, /bugün/);
});

test("cutoff after Friday evening names the next workday", () => {
  const copy = cutoffCopy(new Date("2026-09-04T19:00:00"));
  assert.equal(copy.includes("bugün"), false);
  assert.match(copy, /7/);
});
