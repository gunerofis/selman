import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const adminPassword = process.env.SWEB_ADMIN_PASSWORD;
assert.ok(adminPassword, "SWEB_ADMIN_PASSWORD is required for the admin smoke test");
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8080/yonetim", { waitUntil: "networkidle" });
  await page.getByLabel("Yönetim parolası").fill(adminPassword);
  await page.getByRole("button", { name: "Giriş yap" }).click();
  await page.getByRole("heading", { name: "Ürünler" }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await page.getByRole("button", { name: "Pasife al" }).first().isVisible(), true);
  await page.screenshot({ path: "work/admin-mobile.png", fullPage: false });

  await page.goto("http://127.0.0.1:8080/hediye-setleri/tas-6368ce0073a8", { waitUntil: "networkidle" });
  await page.getByText("Fiyat için teklif alın").waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: "work/product-mobile.png", fullPage: false });
  process.stdout.write("mobile smoke passed\n");
} finally {
  await browser.close();
}
