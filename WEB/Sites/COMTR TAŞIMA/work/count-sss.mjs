import { readFileSync } from "node:fs";
const h = readFileSync("work/sss-body.html", "utf8");
console.log("faq-item", (h.match(/class="faq-item"/g) || []).length);
console.log("makro", (h.match(/Makro Ofis/g) || []).length);
console.log("guner", (h.match(/Güner Ofis/g) || []).length);
