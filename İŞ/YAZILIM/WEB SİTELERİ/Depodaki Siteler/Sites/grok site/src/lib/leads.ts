import { BRAND } from "./brand.ts";

export type MailDraft = {
  subject: string;
  body: string;
};

export function isHoneypot(trap: string | null | undefined) {
  return Boolean(trap?.trim());
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Baymard: error text must name the missing piece, not just “invalid”. */
export function emailIssue(value: string) {
  const v = value.trim();
  if (!v) return "E-posta girin.";
  if (!v.includes("@")) return "E-postada @ eksik.";
  const at = v.indexOf("@");
  const domain = v.slice(at + 1);
  if (!domain) return "@ sonrası eksik.";
  if (!domain.includes(".")) return "Alan adı uzantısı eksik (.com gibi).";
  if (!isEmail(v)) return "Geçerli e-posta girin.";
  return "";
}

export function atelierMailto({ subject, body }: MailDraft) {
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openAtelierMail(href: string) {
  if (!href || typeof window === "undefined") return;
  window.location.assign(href);
}

export function contactDraft(input: {
  name: string;
  email: string;
  order?: string;
  message: string;
}): MailDraft {
  const lines = [
    `Ad: ${input.name.trim()}`,
    `E-posta: ${input.email.trim()}`,
  ];
  if (input.order?.trim()) lines.push(`Sipariş no: ${input.order.trim()}`);
  lines.push("", input.message.trim());
  return {
    subject: `Sweb iletişim — ${input.name.trim()}`,
    body: lines.join("\n"),
  };
}

export function quoteDraft(input: {
  firma: string;
  yetkili: string;
  email: string;
  tel?: string;
  adet: number;
  note: string;
}): MailDraft {
  const lines = [
    `Firma: ${input.firma.trim()}`,
    `Yetkili: ${input.yetkili.trim()}`,
    `E-posta: ${input.email.trim()}`,
  ];
  if (input.tel?.trim()) lines.push(`Telefon: ${input.tel.trim()}`);
  lines.push(`Adet: ${input.adet}`, "", input.note.trim());
  return {
    subject: `Sweb kurumsal teklif — ${input.firma.trim()} · ${input.adet} adet`,
    body: lines.join("\n"),
  };
}

export function newsletterDraft(email: string): MailDraft {
  return {
    subject: "Sweb atölye notları kaydı",
    body: `Bülten kaydı (açık rıza):\n${email.trim()}\nAtölye notları; çıkmak için aynı adrese yazın.`,
  };
}

export function visitDraft(input: {
  name: string;
  email: string;
  when: string;
  message: string;
}): MailDraft {
  return {
    subject: `Sweb ziyaret — ${input.name.trim()}`,
    body: [
      "Atölye ziyaret talebi",
      `Ad: ${input.name.trim()}`,
      `E-posta: ${input.email.trim()}`,
      `Tercih: ${input.when.trim() || "—"}`,
      "",
      input.message.trim() || "Randevu istiyorum.",
    ].join("\n"),
  };
}

export function sikayetDraft(input: {
  name: string;
  email: string;
  order: string;
  message: string;
}): MailDraft {
  return {
    subject: `Sweb şikayet — ${input.order.trim() || input.name.trim()}`,
    body: [
      "Şikayet",
      `Ad: ${input.name.trim()}`,
      `E-posta: ${input.email.trim()}`,
      `Sipariş: ${input.order.trim() || "—"}`,
      "",
      input.message.trim(),
    ].join("\n"),
  };
}

export function designDraft(input: {
  email: string;
  brief: string;
  form: string;
  materials: string[];
  features: string[];
  color: string;
  size: string;
  qty: number;
  quoteName?: string;
  unitPrice?: string;
  total?: string;
  photos?: string[];
}): MailDraft {
  const lines = [
    `E-posta: ${input.email.trim()}`,
    `İstek: ${input.brief.trim()}`,
    `Form: ${input.form || "—"}`,
    `Malzeme: ${input.materials.join(", ") || "—"}`,
    `Özellik: ${input.features.join(", ") || "—"}`,
    `Renk: ${input.color || "atölye önerir"}`,
    `Ölçü: ${input.size}`,
    `Adet: ${input.qty}`,
  ];
  if (input.photos?.length) {
    lines.push(
      `Görsel: ${input.photos.join(", ")} — mailto ek taşımaz, bu dosyaları e-postaya iliştirin.`,
    );
  }
  if (input.quoteName) lines.push(`Taslak ad: ${input.quoteName}`);
  if (input.unitPrice) lines.push(`Birim tahmini: ${input.unitPrice}`);
  if (input.total) lines.push(`Toplam tahmini: ${input.total}`);
  return {
    subject: `Sweb tasarım — ${input.quoteName || input.brief.trim().slice(0, 40)}`,
    body: lines.join("\n"),
  };
}

export function caymaDraft(input: {
  name: string;
  email: string;
  order: string;
  sku: string;
  delivered: string;
  message: string;
}): MailDraft {
  return {
    subject: `Sweb cayma — ${input.order.trim() || input.name.trim()}`,
    body: [
      "Cayma bildirimi",
      `Ad soyad: ${input.name.trim()}`,
      `E-posta: ${input.email.trim()}`,
      `Sipariş: ${input.order.trim() || "—"}`,
      `Ürün: ${input.sku.trim() || "—"}`,
      `Teslim tarihi: ${input.delivered.trim() || "—"}`,
      `Not: ${input.message.trim() || "—"}`,
    ].join("\n"),
  };
}

export function orderDraft(input: {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  postal: string;
  address: string;
  note?: string;
  pay: string;
  total: string;
  shipping: string;
  lines: string[];
}): MailDraft {
  const body = [
    `Sipariş: ${input.id}`,
    `Ad: ${input.name}`,
    `E-posta: ${input.email}`,
    `Telefon: ${input.phone}`,
    `İl: ${input.city}`,
    `İlçe: ${input.district}`,
    `Posta kodu: ${input.postal}`,
    `Adres: ${input.address}`,
    ...(input.note?.trim() ? [`Teslimat notu: ${input.note.trim()}`] : []),
    `Ödeme: ${input.pay}`,
    `Kargo: ${input.shipping}`,
    `Toplam: ${input.total}`,
    "",
    "Ürünler:",
    ...input.lines.map((line) => `- ${line}`),
  ].join("\n");
  return {
    subject: `Sweb sipariş ${input.id}`,
    body,
  };
}
