import { readFileSync, writeFileSync } from "node:fs";

const arts = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/articles.json", "utf8")).blog.articles.nodes;
const extra = {
  "sumen-takimi-secerken-nelere-dikkat-edilmeli": `<p>Devamı: <a href="/pages/sumen-takimi-rehberi">sümen takımı rehberi</a>, <a href="/collections/sumen-takimi">sümen takımı modelleri</a>, <a href="/blogs/news/masa-olcusune-gore-sumen-takimi-secimi">masa ölçüsüne göre seçim</a>.</p>`,
  "ofis-masasinda-duzen-kurmanin-7-pratik-yolu": `<p>İlgili: <a href="/collections/sumen-takimi">sümen takımları</a>, <a href="/pages/sumen-takimi-rehberi">rehber merkezi</a>.</p>`,
  "deri-ve-kristal-sumen-takimi-arasindaki-farklar": `<p>Koleksiyonlar: <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>, <a href="/collections/kristal-sumen-takimlari">kristal sümen takımları</a>.</p>`,
  "kisiye-ozel-masa-isimligi-siparis-rehberi": `<p>İlgili: <a href="/collections/masa-ustu-isimlikler">masa üstü isimlikler</a>, <a href="/blogs/news/kurumsal-logolu-sumen-takimi-siparis-sureci">kurumsal logo siparişi</a>.</p>`,
};

let g = "mutation UpdateOldArticles {\n";
arts.forEach((a, i) => {
  let body = a.body.replaceAll("/pages/contact", "/pages/bize-ulasin").replaceAll("/collections/all", "/collections/sumen-takimi");
  if (extra[a.handle]) body += "\n" + extra[a.handle];
  g += `  a${i + 1}: articleUpdate(id: "${a.id}", article: { body: ${JSON.stringify(body)} }) { article { handle } userErrors { field message } }\n`;
});
g += "}\n";
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/mutations-old-articles.graphql", g);
console.log("ok", arts.length);
