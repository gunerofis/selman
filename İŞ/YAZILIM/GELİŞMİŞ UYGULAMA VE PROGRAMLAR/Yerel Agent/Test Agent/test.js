const fs = require("node:fs");
const path = require("node:path");

let failures = 0;
function check(name, cond) {
  if (!cond) {
    failures++;
    console.error("HATA: " + name);
  } else {
    console.log("GECTI: " + name);
  }
}

check("toplama 2+2=4", 2 + 2 === 4);

const dosya = path.join(__dirname, "ornek-metin.txt");
check("dosya var", fs.existsSync(dosya));
const icerik = fs.readFileSync(dosya, "utf8");
console.log("--- ornek-metin.txt ---");
console.log(icerik.trim());
console.log("------------------------");
check("dosya icerigi OKUMA-TESTI iceriyor", icerik.includes("OKUMA-TESTI"));

if (failures > 0) {
  console.error("TOPLAM HATA: " + failures);
  process.exit(1);
}
console.log("TOPLAM: tum testler gecti (cikis kodu 0)");