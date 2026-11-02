// Usage: npm run shots -- [route ...]   (dev server must be running; BASE_URL overrides http://localhost:3000)
// Saves full-page and per-section screenshots at the four review widths into .shots/<timestamp>/.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];
const widths = [390, 768, 1440, 1920];
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(".shots", stamp);

const browser = await chromium.launch();
for (const route of routes) {
  const slug = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Scroll through once so lazy images and in-view effects load, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const dir = path.join(outDir, slug, String(width));
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, "full.png"), fullPage: true });
    const sections = await page.locator("main > section, main > header, body > header, body > footer").all();
    for (const [i, el] of sections.entries()) {
      await el.screenshot({ path: path.join(dir, `section-${String(i + 1).padStart(2, "0")}.png`) });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`${route} @${width}: ${sections.length} sections${overflow ? "  ⚠ horizontal overflow" : ""}`);
    await page.close();
  }
}
await browser.close();
console.log(`Saved to ${outDir}`);
