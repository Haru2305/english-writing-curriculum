import { chromium } from "playwright";

const base = process.env.UX_BASE_URL ?? "http://127.0.0.1:4321";
const patterns = [
  ["bundle-code", /\bB\d{3}\b/gi],
  ["phase-code", /\bP[1-4]\b/gi],
  ["bundle-word", /\bBundle\s*\d*\b/gi],
  ["checkpoint", /\bCheckpoint\b/gi],
  ["final-gate", /\bFinal\s+Gate\b/gi],
  ["internal-family", /\b(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)\d{1,4}\b/gi]
];

function matchedKinds(text) {
  return patterns.filter(([, re]) => {
    re.lastIndex = 0;
    return re.test(text);
  }).map(([name]) => name);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

const findings = [];
const pageCounts = new Map();

for (let n = 1; n <= 234; n += 1) {
  const id = "E" + String(n).padStart(3, "0");
  const slug = id.toLowerCase();
  await page.goto(base + "/" + slug + "/", { waitUntil: "domcontentloaded" });
  await page.locator("details").evaluateAll((items) => {
    for (const item of items) item.open = true;
  });

  const result = await page.evaluate(() => {
    const title = document.title;
    const h1 = document.querySelector("h1")?.innerText?.trim() ?? "";
    const meta = document.querySelector(".lesson-meta")?.innerText?.trim() ?? "";
    const headings = [...document.querySelectorAll("h2,h3,summary")]
      .filter((el) => {
        const style = getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      })
      .map((el) => el.innerText.trim())
      .filter(Boolean);
    const visibleText = document.body.innerText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return { title, h1, meta, headings, visibleText };
  });

  const zones = [
    ["document-title", [result.title]],
    ["h1", [result.h1]],
    ["meta", [result.meta]],
    ["heading", result.headings],
    ["visible-line", result.visibleText]
  ];

  const seen = new Set();
  for (const [zone, texts] of zones) {
    for (const text of texts) {
      const kinds = matchedKinds(text);
      if (!kinds.length) continue;
      const key = zone + "\u0000" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({ id, zone, kinds, text });
      pageCounts.set(id, (pageCounts.get(id) ?? 0) + 1);
    }
  }
}

await browser.close();

console.log(`[rendered-label-audit] pages=234 affected=${pageCounts.size} findings=${findings.length}`);
for (const item of findings) {
  console.log(`[rendered-label-audit][hit] ${item.id} | ${item.zone} | ${item.kinds.join(",")} | ${item.text}`);
}
