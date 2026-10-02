import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = process.env.UX_BASE_URL ?? "http://127.0.0.1:4321";
const outputDir = path.resolve("ux-audit-output");
fs.mkdirSync(outputDir, { recursive: true });

const lessons = ["e002", "e086", "e204", "e208", "e234"];
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

  for (const lesson of lessons) {
    const page = await context.newPage();
    await page.goto(`${base}/${lesson}/`, { waitUntil: "networkidle" });

    const before = await page.evaluate(() => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
      };

      const overflow = [...document.querySelectorAll("body *")]
        .filter(visible)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            cls: el.className || "",
            text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth
          };
        })
        .filter((x) => x.right > window.innerWidth + 2 || x.left < -2 || x.scrollWidth > x.clientWidth + 2)
        .slice(0, 20);

      const review = document.querySelector(".review-trigger");
      const reviewRect = review?.getBoundingClientRect();
      const navLinks = [...document.querySelectorAll(".nav-row .nav-link")].map((a) => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href")
      }));
      const bodyStyle = getComputedStyle(document.body);

      return {
        title: document.title,
        innerWidth: window.innerWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        screens: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(2),
        bodyFontSize: bodyStyle.fontSize,
        bodyLineHeight: bodyStyle.lineHeight,
        reviewTrigger: reviewRect ? {
          width: Math.round(reviewRect.width),
          height: Math.round(reviewRect.height),
          top: Math.round(reviewRect.top + scrollY)
        } : null,
        navLinks,
        overflow
      };
    });

    await page.screenshot({
      path: path.join(outputDir, `${lesson}-${mode.name}-closed.png`),
      fullPage: true
    });

    const trigger = page.locator(".review-trigger");
    if (await trigger.count()) {
      await trigger.click();
      await page.waitForTimeout(150);
    }

    const after = await page.evaluate(() => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
      };

      const overflow = [...document.querySelectorAll("body *")]
        .filter(visible)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            cls: el.className || "",
            text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth
          };
        })
        .filter((x) => x.right > window.innerWidth + 2 || x.left < -2 || x.scrollWidth > x.clientWidth + 2)
        .slice(0, 20);

      const reviewBody = document.querySelector(".generic-review-body, .answer-flow");
      const firstReviewChild = reviewBody?.querySelector(".content-group, .answer-stage");
      const firstTitle = firstReviewChild?.querySelector(".content-group-title, summary strong")?.textContent?.trim() ?? "";
      const firstClass = firstReviewChild?.className ?? "";
      const answerList = document.querySelector(".answer-key-group, .compact-answer-list, .exam-answer-list");
      const answerRect = answerList?.getBoundingClientRect();
      const nav = document.querySelector(".nav-row");
      const navRect = nav?.getBoundingClientRect();

      return {
        open: document.querySelector("details.answer-details")?.open ?? null,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        screens: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(2),
        docScrollWidth: document.documentElement.scrollWidth,
        firstReviewTitle: firstTitle,
        firstReviewClass: firstClass,
        answerList: answerRect ? {
          top: Math.round(answerRect.top + scrollY),
          height: Math.round(answerRect.height),
          width: Math.round(answerRect.width)
        } : null,
        navTop: navRect ? Math.round(navRect.top + scrollY) : null,
        overflow
      };
    });

    await page.screenshot({
      path: path.join(outputDir, `${lesson}-${mode.name}-review.png`),
      fullPage: true
    });

    results.push({ lesson, mode: mode.name, before, after });
    await page.close();
  }

  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outputDir, "ux-audit.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
