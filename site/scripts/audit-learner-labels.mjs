import fs from "node:fs";
import { getLessonCatalog, REPRESENTATIVE_IDS } from "../src/lib/lesson-catalog.js";
import { parseGenericLesson } from "../src/lib/generic-lesson.js";
import { toLearnerLabel, toLearnerText } from "../src/lib/learner-text.js";

const catalog = getLessonCatalog();

const labelPatterns = [
  ["lesson-code", /\bE\d{3}\b/i],
  ["bundle-code", /\bB\d{3}\b/i],
  ["phase-authoring", /\bP[1-4]\b/i],
  ["bundle-word", /\bBundle\b/i],
  ["checkpoint", /\bCheckpoint\b/i],
  ["final-gate", /\bFinal\s+Gate\b/i],
  ["bridge", /\bBridge\b/i],
  ["internal-family", /\b(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)\d{1,4}\b/i]
];

const bodyPatterns = [
  ["lesson-code", /\bE\d{3}\b/i],
  ["bundle-code", /\bB\d{3}\b/i],
  ["phase-authoring", /\bP[1-4](?=\s+(?:Final|Bridge|Strategy|Repair)|(?:で|では|へ|の|以降|完了|序盤|本体|最初|移行))/i],
  ["bundle-word", /\bBundle\s*\d*\b/i],
  ["checkpoint", /\bCheckpoint\b/i],
  ["final-gate", /\bFinal\s+Gate\b/i],
  ["bridge-authoring", /(?:\bBridge\s+\d+\b|次のBridge|\bBridge complete\b)/i],
  ["internal-family", /\b(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)\d{1,4}\b/i]
];

function matches(patterns, text = "") {
  return patterns.filter(([, re]) => re.test(String(text))).map(([name]) => name);
}

const failures = [];

function check(id, zone, text, patterns) {
  const hit = matches(patterns, text);
  if (!hit.length) return;
  failures.push({ id, zone, hit, text });
}

for (const entry of catalog) {
  const raw = fs.readFileSync(entry.filePath, "utf8").replace(/\r\n/g, "\n");
  const lesson = parseGenericLesson(raw, entry.id);

  check(entry.id, "title", toLearnerLabel(lesson.title), labelPatterns);

  for (const [groupName, sections] of Object.entries(lesson.groups)) {
    for (const section of sections) {
      check(entry.id, `heading:${groupName}`, toLearnerLabel(section.title), labelPatterns);

      for (const unit of section.units ?? []) {
        if (unit.type === "subgroup") {
          check(entry.id, `subheading:${groupName}`, toLearnerLabel(unit.title), labelPatterns);
          for (const block of unit.blocks ?? []) {
            for (const line of block.lines ?? []) {
              check(entry.id, `line:${groupName}`, toLearnerText(line), bodyPatterns);
            }
          }
        } else {
          for (const line of unit.lines ?? []) {
            check(entry.id, `line:${groupName}`, toLearnerText(line), bodyPatterns);
          }
        }
      }
    }
  }
}

// Dedicated pages must use the same learner-facing title sanitizer.
for (const id of REPRESENTATIVE_IDS) {
  const path = new URL(`../src/pages/${id.toLowerCase()}.astro`, import.meta.url);
  const source = fs.readFileSync(path, "utf8");
  if (
    !source.includes("toLearnerLabel")
    || !source.includes("toLearnerLessonNumber")
    || !/const title\s*=\s*toLearnerLabel\(/.test(source)
  ) {
    failures.push({
      id,
      zone: "dedicated-renderer",
      hit: ["missing-title-sanitizer"],
      text: "Dedicated page does not sanitize its learner-facing title/lesson number."
    });
  }

  for (const [name, pattern] of [
    ["literal-header-code", /<strong>E\d{3}<\/strong>/],
    ["literal-nav-code", />[^<{]*E\d{3}[^<{]*<\/a>/],
    ["literal-meta-code", /(?:pageTitle\s*=\s*"E\d{3}|description="E\d{3})/]
  ]) {
    if (pattern.test(source)) {
      failures.push({
        id,
        zone: "dedicated-renderer",
        hit: [name],
        text: "Dedicated page still exposes an E-code to learners."
      });
    }
  }
}

console.log(`[learner-label-audit] corpus=${catalog.length} dedicated=${REPRESENTATIVE_IDS.size}`);

if (failures.length) {
  console.error(`[learner-label-audit] failures=${failures.length}`);
  for (const item of failures) {
    console.error(
      `[learner-label-audit][fail] ${item.id} | ${item.zone} | ${item.hit.join(",")} | ${item.text}`
    );
  }
  process.exit(1);
}

console.log("[learner-label-audit] learner-facing authoring labels=0");
console.log("[learner-label-audit] PASS");
