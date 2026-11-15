import assert from "node:assert/strict";
import test from "node:test";
import { createShipmentXml, parseCreateShipment, parseQueryShipment, queryShipmentXml } from "./yurtici.ts";

const shipment = {
  cargoKey: "00000000000040008000",
  invoiceKey: "40008000000000000001",
  name: "Test <Müşteri>",
  address: "Adres & sokak",
  phone: "05000000000",
  city: "İstanbul",
  town: "Şişli",
  email: "test@example.invalid",
};

test("shipment xml matches the dispatcher contract and parses docId", () => {
  const xml = createShipmentXml({ user: "YKTEST", password: "YK" }, shipment);
  assert.match(xml, /<userLanguage>TR<\/userLanguage>/);
  assert.match(xml, /<cargoKey>00000000000040008000<\/cargoKey>/);
  assert.match(xml, /receiverCustName>Test &lt;Müşteri&gt;</);
  assert.match(xml, /receiverAddress>Adres &amp; sokak</);
  const query = queryShipmentXml({ user: "YKTEST", password: "YK" }, shipment.cargoKey);
  assert.match(query, /<wsLanguage>TR<\/wsLanguage>/);
  assert.match(query, /<keyType>0<\/keyType>/);
  assert.deepEqual(parseCreateShipment("<outFlag>0</outFlag><jobId>55</jobId>"), { ok: true, jobId: "55" });
  assert.equal(parseCreateShipment("<outFlag>1</outFlag><errMessage>no</errMessage>").ok, false);
  assert.equal(parseQueryShipment("<docId>9876543210</docId>"), "9876543210");
  assert.equal(parseQueryShipment("<ns1:docId>9876543210</ns1:docId>"), "9876543210");
});
