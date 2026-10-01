import fs from "node:fs";
import {
  getLessonCatalog,
  getGenericLessonCatalog
} from "../src/lib/lesson-catalog.js";
import { parseGenericLesson } from "../src/lib/generic-lesson.js";
import {
  startsWithInternalCode,
  toLearnerText
} from "../src/lib/learner-text.js";

const answerMarkers = [
  "解答・解説・自己修正",
  "解答・解説",
  "Answers and Explanations"
];

const writingCue = /^(?:Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing|Prompt|Planning|Plan→Draft→Revise|Part\s+(?:\d+|[A-Z])\s*[｜:：].*(?:Q3B|Writing|Composition))/im;
const supportCue = /^(?:Self-check|Revision Check|P4 Final Gate Check)/im;
const answerItem = /^(?:Q\d+|\d+)\s*(?:[｜:：.]\s*|\s+)(?:解答例|解答|完成|[A-D](?:\b|\s)|[A-D]\s+.+)/i;

function splitRaw(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  for (const marker of answerMarkers) {
    const index = normalized.indexOf(marker);
    if (index >= 0) {
      return {
        problem: normalized.slice(0, index),
        answer: normalized.slice(index + marker.length)
      };
    }
  }
  return { problem: normalized, answer: "" };
}

function lines(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function answerKeys(text) {
  return lines(text)
    .filter((line) => answerItem.test(line))
    .map((line) => line.match(/^(Q\d+|\d+)/i)?.[1])
    .filter(Boolean);
}

function parsedAnswerKeys(review) {
  return review
    .map((section) => section.title)
    .filter((title) => answerItem.test(title))
    .map((title) => title.match(/^(Q\d+|\d+)/i)?.[1])
    .filter(Boolean);
}

function allParsedText(lesson) {
  const output = [];
  for (const sections of Object.values(lesson.groups)) {
    for (const section of sections) {
      if (section.title) output.push(section.title);
      for (const unit of section.units ?? []) {
        if (unit.title) output.push(unit.title);
        for (const line of unit.lines ?? []) output.push(line);
        for (const block of unit.blocks ?? []) {
          for (const line of block.lines ?? []) output.push(line);
        }
      }
    }
  }
  return output;
}

const catalog = getLessonCatalog();
const generic = getGenericLessonCatalog();
const failures = [];
const warnings = [];
const summaries = new Map();

if (catalog.length !== 234) failures.push(`catalog count: ${catalog.length}`);
if (generic.length !== 226) failures.push(`generic count: ${generic.length}`);

for (const entry of generic) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const lesson = parseGenericLesson(raw, entry.id);

  if (lesson.id !== entry.id) failures.push(`${entry.id}: parsed id ${lesson.id}`);
  if (!lesson.title) failures.push(`${entry.id}: empty title`);
  if (!lesson.groups.challenge.length) failures.push(`${entry.id}: no CHALLENGE sections`);
  if (!lesson.hasReview) failures.push(`${entry.id}: no REVIEW sections`);

  const expectsWriting = writingCue.test(split.problem);
  if (expectsWriting && !lesson.hasWriting) {
    failures.push(`${entry.id}: writing cue exists but WRITE was not classified`);
  }

  const expectsSupport = supportCue.test(split.problem);
  if (expectsSupport && !lesson.groups.support.length) {
    failures.push(`${entry.id}: support cue exists but support was not classified`);
  }

  for (const section of [
    ...lesson.groups.setup,
    ...lesson.groups.challenge,
    ...lesson.groups.writing,
    ...lesson.groups.support
  ]) {
    if (/\d+\s*分/.test(section.title) && (/\s\/\s/.test(section.title) || /＝\s*Core/i.test(section.title))) {
      failures.push(`${entry.id}: time-allocation content misclassified as heading: ${section.title}`);
    }
  }

  const expectedAnswerKeys = answerKeys(split.answer);
  const actualAnswerKeys = parsedAnswerKeys(lesson.groups.review);
  const missingAnswerKeys = expectedAnswerKeys.filter((key) => !actualAnswerKeys.includes(key));
  if (missingAnswerKeys.length) {
    warnings.push(`${entry.id}: compact answer headings not split for ${[...new Set(missingAnswerKeys)].join(", ")}`);
  }

  for (const text of allParsedText(lesson)) {
    if (startsWithInternalCode(text) && startsWithInternalCode(toLearnerText(text))) {
      failures.push(`${entry.id}: internal code survives learner sanitizer: ${text}`);
      break;
    }
  }

  summaries.set(entry.id, {
    setup: lesson.groups.setup.map((section) => section.title || "(untitled)"),
    challenge: lesson.groups.challenge.map((section) => section.title || "(untitled)"),
    writing: lesson.groups.writing.map((section) => section.title || "(untitled)"),
    support: lesson.groups.support.map((section) => section.title || "(untitled)"),
    reviewCount: lesson.groups.review.length
  });
}

const samples = ["E002", "E042", "E086", "E120", "E204", "E210", "E216", "E234"];
console.log(`[generic-audit] corpus=${catalog.length}, dedicated=8, generic=${generic.length}`);
for (const id of samples) {
  console.log(`[generic-audit] ${id} ${JSON.stringify(summaries.get(id) ?? null)}`);
}

if (warnings.length) {
  console.log(`[generic-audit] warnings=${warnings.length}`);
  for (const warning of warnings.slice(0, 80)) console.log(`[generic-audit][warn] ${warning}`);
}

if (failures.length) {
  console.error(`[generic-audit] failures=${failures.length}`);
  for (const failure of failures) console.error(`[generic-audit][fail] ${failure}`);
  process.exit(1);
}

console.log("[generic-audit] PASS");
