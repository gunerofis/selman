import { readFileSync } from "node:fs";
for (const f of ["art-parca.html", "art-bakim.html", "art-renk.html"]) {
  const h = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/" + f, "utf8");
  const body = (h.match(/article-body rte">([\s\S]*?)<\/div>\s*<\/div>\s*<footer/i) || [])[1] || "";
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const links = [...body.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
  console.log(f, {
    title: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1],
    words: text.split(" ").filter(Boolean).length,
    links,
    sample: text.slice(0, 280),
  });
}
