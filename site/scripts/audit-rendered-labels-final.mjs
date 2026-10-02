import { chromium } from "playwright";

const base = process.env.UX_BASE_URL ?? "http://127.0.0.1:4321";
const patterns = [
  ["bundle-code", /\bB\d{3}\b/gi],
  ["phase-authoring", /\bP[1-4](?=\s+(?:Final|Bridge|Strategy|Repair|最終確認)|(?:で|では|へ|の|以降|完了|序盤|本体|最初|移行))/gi],
  ["bundle-word", /\bBundle\s*\d*\b/gi],
  ["checkpoint", /\bCheckpoint\b/gi],
  ["final-gate", /\bFinal\s+Gate\b/gi],
  ["bridge", /\bBridge(?:\s+\d+)?\b/gi],
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
const affected = new Set();

for (let n = 1; n <= 234; n += 1) {
  const id = "E" + String(n).padStart(3, "0");
  await page.goto(base + "/" + id.toLowerCase() + "/", { waitUntil: "domcontentloaded" });
  await page.locator("details").evaluateAll((items) => {
    for (const item of items) item.open = true;
  });

  const zones = await page.evaluate(() => ({
    title: [document.title],
    h1: [document.querySelector("h1")?.innerText?.trim() ?? ""],
    meta: [document.querySelector(".lesson-meta")?.innerText?.trim() ?? ""],
    heading: [...document.querySelectorAll("h2,h3,summary")].map((el) => el.innerText.trim()).filter(Boolean),
    line: document.body.innerText.split("\n").map((line) => line.trim()).filter(Boolean)
  }));

  const seen = new Set();
  for (const [zone, texts] of Object.entries(zones)) {
    for (const text of texts) {
      const kinds = matchedKinds(text);
      if (!kinds.length) continue;
      const key = zone + "\u0000" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      affected.add(id);
      findings.push({ id, zone, kinds, text });
    }
  }
}

await browser.close();

console.log(`[rendered-label-final] pages=234 affected=${affected.size} findings=${findings.length}`);
for (const item of findings) {
  console.log(`[rendered-label-final][hit] ${item.id} | ${item.zone} | ${item.kinds.join(",")} | ${item.text}`);
}
if (findings.length) process.exit(1);
console.log("[rendered-label-final] PASS");
