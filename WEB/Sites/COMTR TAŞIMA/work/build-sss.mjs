import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("C:/Users/DELL/Desktop/sss.md", "utf8");
const marker = "# SAYFADA YAYINLANACAK METİN";
const start = src.indexOf(marker);
if (start < 0) throw new Error("Yayın metni bulunamadı");
let md = src.slice(start + marker.length).replace(/^\s+/, "");

function rewrite(s) {
  const pairs = [
    [/https?:\/\/www\.gunerofis\.com\/?/gi, "https://www.sumentakimi.com.tr/"],
    [/\/sumen-takimlari\/?/g, "/collections/sumen-takimi"],
    [/\/deri-sumen-takimlari\/?/g, "/collections/deri-sumen-takimlari"],
    [/\/ahsap-sumen-takimlari\/?/g, "/collections/sumen-takimi"],
    [/\/kristal-sumen-takimi\/?/g, "/collections/kristal-sumen-takimlari"],
    [/\/tek-parca-sumen\/?/g, "/collections/masa-ustu-setler"],
    [/\/sumen-takimi-olusturma\/?/g, "/pages/bize-ulasin"],
    [/\/masa-ustu-isimlikleri\/?/g, "/collections/masa-ustu-isimlikler"],
    [/\/makam-panolari\/?/g, "/collections/makam-panolari"],
    [/\/yazi-tahtasi\/?/g, "/collections/kumasli-panolar"],
    [/\/makam-bayragi-3\/?/g, "/collections/makam-bayraklari"],
    [/\/deri-saat-kutulari\/?/g, "/collections/sumen-aksesuarlari"],
    [/\/deri-otel-ekipmanlari\/?/g, "/collections/deri-otel-ekipmanlari"],
    [/\/sumen-aksesuarlari-2\/?/g, "/collections/sumen-aksesuarlari"],
    [/\/hakkimizda\/?/g, "/pages/about-us"],
  ];
  for (const [re, to] of pairs) s = s.replace(re, to);
  s = s.replace(
    /Güner Ofis’ten sümen takımı siparişi nasıl verilir\?/g,
    "Sümen Takımı TR’den sümen takımı siparişi nasıl verilir?"
  );
  s = s.replace(
    /Güner Ofis’te modeller doğrudan kategori ve ürün sayfalarından incelenebilir\./g,
    "Sümen Takımı TR’de modeller doğrudan kategori ve ürün sayfalarından incelenebilir."
  );
  s = s.replace(
    /Güner Ofis’in güncel garanti ve destek koşulları/g,
    "Sümen Takımı TR’nin güncel garanti ve destek koşulları"
  );
  s = s.replace(
    /Satın almadan önce Güner Ofis’e hangi bilgiler sorulmalıdır\?/g,
    "Satın almadan önce Sümen Takımı TR’ye hangi bilgiler sorulmalıdır?"
  );
  s = s.replace(
    /Güner Ofis Üretim Ekibi tarafından hazırlanmıştır\./g,
    "Sümen Takımı TR tarafından, Güner Ofis üretimi ürünler için hazırlanmıştır."
  );
  return s;
}

md = rewrite(md);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const lines = md.split(/\r?\n/);
const out = [];
let pendingId = "";
let mode = "intro"; // intro | quick | toc | section
let inDetails = false;
let listType = null;

function closeList() {
  if (listType) {
    out.push(`</${listType}>`);
    listType = null;
  }
}
function closeDetails() {
  closeList();
  if (inDetails) {
    out.push("</div></details>");
    inDetails = false;
  }
}
function closeSection() {
  closeDetails();
  if (mode === "section") out.push("</section>");
  if (mode === "quick" || mode === "toc") closeList();
}

function openList(kind) {
  if (listType !== kind) {
    closeList();
    out.push(`<${kind}${kind === "ul" && mode === "quick" ? ' class="faq-quick"' : ""}>`);
    listType = kind;
  }
}

function p(text) {
  closeList();
  out.push(`<p>${inline(text)}</p>`);
}

for (const raw of lines) {
  const line = raw.trim();
  if (!line) continue;
  if (line === "---") continue;
  const idOnly = line.match(/^<a id="([^"]+)"><\/a>$/);
  if (idOnly) {
    pendingId = idOnly[1];
    continue;
  }

  if (line.startsWith("# ") && !line.startsWith("## ")) continue;

  if (line.startsWith("## ")) {
    closeSection();
    const title = line.slice(3).trim();
    const plain = title.replace(/^\d+\.\s*/, "");
    if (plain === "Hızlı ürün bağlantıları") {
      mode = "quick";
      out.push('<nav class="faq-quick-wrap" aria-label="Hızlı ürün bağlantıları">');
      out.push(`<h2>${inline(plain)}</h2>`);
      continue;
    }
    if (plain === "Bölümler") {
      if (mode === "quick") out.push("</nav>");
      mode = "toc";
      out.push('<nav class="faq-toc" aria-label="Bölümler">');
      out.push("<h2>Bölümler</h2>");
      continue;
    }
    if (mode === "quick") out.push("</nav>");
    if (mode === "toc") {
      closeList();
      out.push("</nav>");
    }
    const id = pendingId || slugify(plain);
    pendingId = "";
    mode = "section";
    out.push(`<section class="faq-section" id="${esc(id)}" aria-labelledby="${esc(id)}-baslik">`);
    out.push(`<h2 id="${esc(id)}-baslik">${inline(plain)}</h2>`);
    continue;
  }

  if (line.startsWith("### ")) {
    if (mode === "quick") {
      closeList();
      out.push("</nav>");
      mode = "section";
    }
    if (mode === "toc") {
      closeList();
      out.push("</nav>");
      mode = "section";
    }
    closeDetails();
    const q = line.slice(4).trim();
    const id = pendingId || slugify(q);
    pendingId = "";
    out.push(`<details class="faq-item" id="${esc(id)}">`);
    out.push(`<summary>${inline(q)}</summary>`);
    out.push('<div class="faq-answer">');
    inDetails = true;
    continue;
  }

  const li = line.match(/^[-*] (.+)/);
  if (li) {
    const kind = mode === "toc" || mode === "quick" || !inDetails ? "ul" : "ul";
    openList("ul");
    out.push(`<li>${inline(li[1])}</li>`);
    continue;
  }

  if (mode === "intro" || mode === "section" || inDetails) {
    p(line);
  }
}

closeSection();
if (mode === "quick") out.push("</nav>");
if (mode === "toc") out.push("</nav>");

const html = out.join("\n");
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/sss-body.html", html);
console.log(
  JSON.stringify({
    chars: html.length,
    details: (html.match(/<details/g) || []).length,
    h2: (html.match(/<h2/g) || []).length,
    sections: (html.match(/<section/g) || []).length,
    gunerofisUrl: /gunerofis\.com/i.test(html),
    deadAhsap: /ahsap-sumen/.test(html),
    deadYazi: /yazi-tahtasi/.test(html),
  })
);
