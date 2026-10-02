import fs from "node:fs";
import { getLessonCatalog, REPRESENTATIVE_IDS } from "../src/lib/lesson-catalog.js";
import { parseGenericLesson } from "../src/lib/generic-lesson.js";
import { stripFrontMatter, cleanLine } from "../src/lib/lesson-source.js";

const catalog = getLessonCatalog();

const patterns = [
  ["bundle-code", /\bB\d{3}\b/i],
  ["phase-code", /\bP[1-4]\b/i],
  ["bundle-word", /\bBundle\b/i],
  ["checkpoint", /\bCheckpoint\b/i],
  ["final-gate", /\bFinal\s+Gate\b/i],
  ["bridge", /\bBridge\b/i],
  ["internal-prefix", /\b(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)\d{1,4}\b/i]
];

function hits(text = "") {
  return patterns.filter(([, re]) => re.test(text)).map(([name]) => name);
}

const findings = [];
const zoneCounts = new Map();

function record(id, zone, text) {
  const matched = hits(text);
  if (!matched.length) return;
  findings.push({ id, zone, matched, text });
  zoneCounts.set(zone, (zoneCounts.get(zone) ?? 0) + 1);
}

for (const entry of catalog) {
  const raw = fs.readFileSync(entry.filePath, "utf8").replace(/\r\n/g, "\n");
  const lesson = parseGenericLesson(raw, entry.id);
  const body = stripFrontMatter(raw);
  const nonEmpty = body.split("\n").map((x) => x.trim()).filter(Boolean);

  record(entry.id, "title", lesson.title);
  record(entry.id, "meta-source", lesson.metaLine);

  for (const [groupName, sections] of Object.entries(lesson.groups)) {
    for (const section of sections) {
      record(entry.id, `heading:${groupName}`, section.title);
      for (const unit of section.units ?? []) {
        if (unit.type === "subgroup") {
          record(entry.id, `subheading:${groupName}`, unit.title);
        }
      }
    }
  }

  // Raw markdown headings can reveal headings the generic parser may not classify.
  for (const line of nonEmpty) {
    if (/^#{2,3}\s+/.test(line)) {
      record(entry.id, "raw-heading", cleanLine(line));
    }
  }
}

console.log(`[learner-label-audit] corpus=${catalog.length} dedicated=${REPRESENTATIVE_IDS.size}`);
for (const [zone, count] of [...zoneCounts.entries()].sort()) {
  console.log(`[learner-label-audit] zone=${zone} findings=${count}`);
}
console.log(`[learner-label-audit] total-findings=${findings.length}`);

for (const item of findings) {
  console.log(`[learner-label-audit][hit] ${item.id} | ${item.zone} | ${item.matched.join(",")} | ${item.text}`);
}
