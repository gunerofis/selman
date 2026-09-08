import assert from "node:assert/strict";
import test from "node:test";
import { BRAND } from "./brand.ts";
import {
  atelierMailto,
  caymaDraft,
  contactDraft,
  sikayetDraft,
  visitDraft,
  designDraft,
  emailIssue,
  isEmail,
  isHoneypot,
  newsletterDraft,
  orderDraft,
  quoteDraft,
} from "./leads.ts";

test("email and honeypot helpers", () => {
  assert.equal(isEmail("selam@sweb.co"), true);
  assert.equal(isEmail("nope"), false);
  assert.equal(isHoneypot("bot"), true);
  assert.equal(isHoneypot("  "), false);
});

test("email issues name the missing piece", () => {
  assert.match(emailIssue("john.newman"), /@/);
  assert.match(emailIssue("john@newman"), /uzant/);
  assert.equal(emailIssue("selam@sweb.co"), "");
});

test("mailto targets the atelier inbox", () => {
  const href = atelierMailto({ subject: "Konu", body: "Gövde satır" });
  assert.match(href, new RegExp(`^mailto:${BRAND.email}\\?`));
  assert.match(href, /subject=Konu/);
  assert.match(href, /body=G%C3%B6vde/);
});

test("contact and quote drafts keep the sender identity", () => {
  const contact = contactDraft({
    name: "Ayşe Kaya",
    email: "ayse@firma.com",
    order: "SW-1",
    message: "Renk sorusu",
  });
  assert.match(contact.subject, /Ayşe Kaya/);
  assert.match(contact.body, /ayse@firma.com/);
  assert.match(contact.body, /SW-1/);

  const quote = quoteDraft({
    firma: "Ofis A.Ş.",
    yetkili: "Ali",
    email: "ali@ofis.com",
    tel: "05051234567",
    adet: 80,
    note: "7101 espresso",
  });
  assert.match(quote.subject, /80 adet/);
  assert.match(quote.body, /Ofis A\.Ş\./);
});

test("newsletter and order drafts stay compact", () => {
  const news = newsletterDraft("ada@sweb.co");
  assert.match(news.body, /ada@sweb.co/);
  const order = orderDraft({
    id: "SW-ABC",
    name: "Ada",
    email: "ada@sweb.co",
    phone: "05051234567",
    city: "İstanbul",
    district: "Şişli",
    postal: "34380",
    address: "Bomonti sokak 1",
    pay: "Kapıda nakit",
    total: "1.500 ₺",
    shipping: "Ücretsiz",
    lines: ["Sümen · espresso × 1"],
  });
  assert.equal(order.subject, "Sweb sipariş SW-ABC");
  assert.match(order.body, /Kapıda nakit/);
  assert.match(order.body, /Şişli/);
  assert.match(order.body, /34380/);
  assert.match(order.body, /Sümen/);
});

test("design draft lists photo filenames for the mailto body", () => {
  const draft = designDraft({
    email: "ada@sweb.co",
    brief: "Çekmece tepsisi",
    form: "Tepsi",
    materials: ["Deri kaplama"],
    features: [],
    color: "",
    size: "280 × 180 × 90 mm",
    qty: 1,
    photos: ["masa.jpg", "olcu.png"],
  });
  assert.match(draft.body, /masa\.jpg/);
  assert.match(draft.body, /iliştirin/);
});

test("cayma draft is a clear withdrawal notice", () => {
  const draft = caymaDraft({
    name: "Ada",
    email: "ada@sweb.co",
    order: "SW-1",
    sku: "7002",
    delivered: "2026-09-01",
    message: "Kullanılmadı",
  });
  assert.match(draft.subject, /cayma/);
  assert.match(draft.body, /SW-1/);
  assert.match(draft.body, /7002/);
});

test("visit and complaint drafts name the sender", () => {
  const visit = visitDraft({
    name: "Ada",
    email: "ada@sweb.co",
    when: "Salı",
    message: "Renk bakacağım",
  });
  assert.match(visit.subject, /ziyaret/);
  assert.match(visit.body, /Salı/);
  const complaint = sikayetDraft({
    name: "Ada",
    email: "ada@sweb.co",
    order: "SW-1",
    message: "Hasar",
  });
  assert.match(complaint.subject, /şikayet/);
  assert.match(complaint.body, /SW-1/);
});
