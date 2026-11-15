import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = "file:///" + path.join(__dirname, "test-page.html").replaceAll(/\\/g, "/");
  await page.goto(url, { waitUntil: "load" });

  const title = await page.title();
  const h1 = await page.textContent("h1");

  console.log("Sayfa baisligi: " + title);
  console.log("h1 icerik: " + h1);

  if (process.argv.includes("--shot")) {
    const shotDir = path.join(__dirname, "ekran-goruntuleri");
    const fs = await import("node:fs");
    fs.mkdirSync(shotDir, { recursive: true });
    const shotPath = path.join(shotDir, "test-ekrani.png");
    await page.screenshot({ path: shotPath });
    console.log("Ekran goruntusu: " + shotPath);
  }

  let failures = 0;
  if (title !== "TEST AGENT SAYFASI") { failures++; console.error("HATA: baslik yanlis"); }
  if (h1 !== "TEST AGENT SAYFASI") { failures++; console.error("HATA: h1 yanlis"); }

  await browser.close();
  if (failures > 0) process.exit(1);
  console.log("TARAYICI TESTI GECTI (cikis kodu 0)");
})().catch((e) => { console.error(e); process.exit(1); });