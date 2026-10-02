import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = process.env.UX_BASE_URL ?? "http://127.0.0.1:4321";
const out = path.resolve("index-ux-audit-output");
fs.mkdirSync(out, { recursive: true });

const modes = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "desktop", width: 1440, height: 1000, isMobile: false }
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const mode of modes) {
  const context = await browser.newContext({
    viewport: { width: mode.width, height: mode.height },
    isMobile: mode.isMobile,
    hasTouch: mode.isMobile,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(100);

  async function measure(state) {
    return page.evaluate((state) => {
      const doc = document.documentElement;
      const rect = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top + scrollY),
          height: Math.round(r.height),
          width: Math.round(r.width)
        };
      };
      const allText = document.body.textContent || "";
      const internalTokens = [
        ...(allText.match(/\bP[1-4]\b/g) || []),
        ...(allText.match(/\bB\d{3}\b/g) || []),
        ...(allText.match(/Representative lessons/gi) || []),
        ...(allText.match(/canonical/gi) || [])
      ];
      const routeStartLinks = [...document.querySelectorAll(".route-start-link")].map((a) => {
        const r = a.getBoundingClientRect();
        return { text: a.textContent.trim(), height: Math.round(r.height), href: a.getAttribute("href") };
      });
      return {
        state,
        width: innerWidth,
        scrollWidth: doc.scrollWidth,
        scrollHeight: doc.scrollHeight,
        screens: +(doc.scrollHeight / innerHeight).toFixed(2),
        h1: document.querySelector("h1")?.textContent?.trim() ?? "",
        routeCards: document.querySelectorAll(".route-stage-card").length,
        coreRoutes: document.querySelectorAll(".core-route-details").length,
        openCoreRoutes: document.querySelectorAll(".core-route-details[open]").length,
        repairOpen: document.querySelector(".repair-catalog")?.open ?? null,
        entryGuide: rect(".entry-guide"),
        thinkingTools: rect(".thinking-tools-entry"),
        coreRoutesSection: rect(".core-routes-section"),
        repairSection: rect(".repair-section"),
        routeStartLinks,
        routeHeadings: [...document.querySelectorAll(".route-stage-card h3")].map((el) => ({
          text: el.textContent.trim(),
          color: getComputedStyle(el).color,
          fontFamily: getComputedStyle(el).fontFamily,
          fontSize: getComputedStyle(el).fontSize,
          height: Math.round(el.getBoundingClientRect().height)
        })),
        coreHeading: (() => {
          const el = document.querySelector("#core-routes-heading");
          return el ? {
            text: el.textContent.trim(),
            color: getComputedStyle(el).color,
            fontFamily: getComputedStyle(el).fontFamily,
            fontSize: getComputedStyle(el).fontSize,
            height: Math.round(el.getBoundingClientRect().height)
          } : null;
        })(),
        internalTokens: [...new Set(internalTokens)]
      };
    }, state);
  }

  results.push({ mode: mode.name, ...(await measure("initial")) });
  await page.screenshot({ path: path.join(out, `index-${mode.name}-viewport.png`) });
  await page.screenshot({ path: path.join(out, `index-${mode.name}-initial.png`), fullPage: true });

  await page.locator(".core-route-details").first().locator("summary").click();
  results.push({ mode: mode.name, ...(await measure("core-open")) });
  await page.screenshot({ path: path.join(out, `index-${mode.name}-core-open.png`), fullPage: true });

  await page.locator(".core-route-details").first().locator("summary").click();
  await page.locator(".repair-catalog > summary").click();
  await page.locator(".repair-catalog .bundle-group").first().locator("summary").click();
  results.push({ mode: mode.name, ...(await measure("repair-open")) });
  await page.screenshot({ path: path.join(out, `index-${mode.name}-repair-open.png`), fullPage: true });

  await page.close();
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(out, "index-ux-audit.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
