const WIN: Record<string, string> = {
  ç: "\\347",
  Ç: "\\307",
  ö: "\\366",
  Ö: "\\326",
  ü: "\\374",
  Ü: "\\334",
  ş: "s",
  Ş: "S",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  İ: "I",
};

export type InvoiceLine = { name: string; qty: number; unitCents: number };

export type InvoiceDoc = {
  number: string;
  title: "FATURA" | "IRSALIYE";
  prices: boolean;
  seller: {
    name: string;
    address: string;
    taxOffice: string;
    taxNumber: string;
    phone: string;
    email: string;
  };
  buyer: { name: string; address: string; taxNumber: string; email: string };
  lines: InvoiceLine[];
  shippingCents: number;
  discountCents: number;
  giftWrapCents: number;
  totalCents: number;
};

function pdfText(value: string) {
  let out = "";
  for (const ch of value) {
    const mapped = WIN[ch];
    if (mapped) {
      out += mapped;
      continue;
    }
    if (ch === "\\") out += "\\\\";
    else if (ch === "(") out += "\\(";
    else if (ch === ")") out += "\\)";
    else if (ch === "\n" || ch === "\r") out += " ";
    else if (ch.charCodeAt(0) < 128) out += ch;
  }
  return out;
}

function money(cents: number) {
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  return `${sign}${Math.floor(abs / 100)},${String(abs % 100).padStart(2, "0")} TL`;
}

function includedVatCents(grossCents: number) {
  if (grossCents <= 0) return 0;
  return Math.round(grossCents - grossCents / 1.2);
}

export function invoiceLines(doc: InvoiceDoc) {
  const rows = [
    doc.title,
    doc.number,
    doc.seller.name,
    doc.seller.address,
    `${doc.seller.taxOffice} ${doc.seller.taxNumber}`,
    doc.seller.phone,
    doc.seller.email,
    doc.buyer.name,
    doc.buyer.address,
    doc.buyer.taxNumber,
    doc.buyer.email,
  ];
  for (const line of doc.lines) {
    rows.push(
      doc.prices
        ? `${line.name} x${line.qty} ${money(line.unitCents)} ${money(line.unitCents * line.qty)}`
        : `${line.name} x${line.qty}`,
    );
  }
  if (doc.prices) {
    if (doc.discountCents > 0) rows.push(`Indirim ${money(-doc.discountCents)}`);
    rows.push(`Kargo ${money(doc.shippingCents)}`);
    if (doc.giftWrapCents > 0) rows.push(`Hediye paketi ${money(doc.giftWrapCents)}`);
    rows.push(`Toplam ${money(doc.totalCents)}`);
    rows.push(`KDV ${money(includedVatCents(doc.totalCents))}`);
  }
  return rows.filter((row) => row.trim());
}

export function invoicePdf(doc: InvoiceDoc) {
  const commands = ["BT", "/F1 12 Tf", "48 800 Td"];
  for (const [index, line] of invoiceLines(doc).entries()) {
    if (index === 0) commands.push(`(${pdfText(line)}) Tj`);
    else commands.push("0 -16 Td", `(${pdfText(line)}) Tj`);
  }
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(body);
}
