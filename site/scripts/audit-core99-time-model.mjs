import fs from "node:fs";
import {
  getLessonCatalog
} from "../src/lib/lesson-catalog.js";
import { parseGenericLesson } from "../src/lib/generic-lesson.js";
import { P1_ACCELERATED_IDS } from "../src/data/p1-accelerated-route.js";
import { P2_ACCELERATED_IDS } from "../src/data/p2-accelerated-route.js";
import { P3_ACCELERATED_IDS } from "../src/data/p3-accelerated-route.js";

const coreIds = [...P1_ACCELERATED_IDS, ...P2_ACCELERATED_IDS, ...P3_ACCELERATED_IDS];
const catalog = new Map(getLessonCatalog().map((lesson) => [lesson.id, lesson]));

function splitRaw(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  for (const marker of ["解答・解説・自己修正", "解答・解説", "Answers and Explanations"]) {
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

function flattenSection(section) {
  const lines = [];
  for (const unit of section?.units ?? []) {
    if (unit.type === "subgroup") {
      for (const block of unit.blocks ?? []) lines.push(...(block.lines ?? []));
    } else {
      lines.push(...(unit.lines ?? []));
    }
  }
  return lines;
}

function sectionText(section) {
  return flattenSection(section).join("\n");
}

function englishWords(text = "") {
  return (String(text).match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g) ?? []).length;
}

function japaneseChars(text = "") {
  return (String(text).match(/[\u3040-\u30ff\u3400-\u9fff]/g) ?? []).length;
}

function actionableLines(text = "") {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) =>
      /^(?:Q\d+|Language\s*\d+|Nuance\s*\d+|Choice\s*\d+|Task\s*\d+|\d+[.．]|[-□])/.test(line)
      || /(?:explain|write|choose|identify|compare|summari[sz]e|translate|decide|evaluate|propose|complete|insert|order|答え|説明|要約|訳|選び|書き|比較|判断|提案)/i.test(line)
    ).length;
}

function questionCount(problem = "") {
  const keys = new Set();
  for (const match of problem.matchAll(/(?:^|\n)\s*(Q\d+)\b/g)) keys.add(match[1]);
  for (const match of problem.matchAll(/(?:^|\n)\s*(Language\s*\d+)\b/gi)) keys.add(match[1].toLowerCase());
  for (const match of problem.matchAll(/(?:^|\n)\s*(Nuance\s*\d+)\b/gi)) keys.add(match[1].toLowerCase());
  return keys.size;
}

function explicitTimedMinutes(problem = "") {
  const line = problem
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /Post-solve\s*\d+\s*分/i.test(line) && /Core\s*\d+\s*分/i.test(line));

  if (line) {
    const total = Number(line.match(/Core\s*(\d+)\s*分/i)?.[1] ?? 0) || null;
    const post = Number(line.match(/Post-solve\s*(\d+)\s*分/i)?.[1] ?? 0);
    return {
      total,
      post,
      exercise: total == null ? null : total - post
    };
  }

  const meta = problem.match(/目安\s*(\d+)\s*分/i);
  return {
    total: meta ? Number(meta[1]) : null,
    post: 0,
    exercise: meta ? Number(meta[1]) : null
  };
}

function targetWords(text = "") {
  const targets = [];
  for (const match of String(text).matchAll(/(\d+)\s*[–—-]\s*(\d+)\s*words?/gi)) {
    targets.push((Number(match[1]) + Number(match[2])) / 2);
  }
  for (const match of String(text).matchAll(/(?:about|approximately)\s*(\d+)\s*words?/gi)) {
    targets.push(Number(match[1]));
  }
  for (const match of String(text).matchAll(/約\s*(\d+)\s*語/g)) {
    targets.push(Number(match[1]));
  }
  return targets;
}

function targetJapaneseChars(text = "") {
  const targets = [];
  for (const match of String(text).matchAll(/(\d+)\s*[–—-]\s*(\d+)\s*字/g)) {
    targets.push((Number(match[1]) + Number(match[2])) / 2);
  }
  for (const match of String(text).matchAll(/(?:約|以内|程度)?\s*(\d+)\s*字/g)) {
    targets.push(Number(match[1]));
  }
  return targets;
}

function isReadingLike(title = "") {
  return /^(?:Reading|Passage|Text\s+[A-Z]|Source\s+[A-Z]|Article|Context|Dense Sentence|Candidate Sentence)/i.test(title);
}

function isDataLike(title = "") {
  return /(?:Data Table|Table|FAQ|Memo|Protocol|Guide|Source Set|Evidence|Option Table)/i.test(title);
}

function isQuestionLike(title = "") {
  return /(?:Questions?|Check|Ordering|Insertion|Syntax Audit|Language Focus|Nuance|Choice)/i.test(title);
}

function isSummaryLike(title = "") {
  return /Summary/i.test(title);
}

function isWritingLike(title = "") {
  return /Writing|Composition|Prompt|Short Output|Final Writing|Judgment|Evaluation|Proposal|Trade-off/i.test(title);
}

function estimateWritingSection(section) {
  const title = section.title ?? "";
  const text = sectionText(section);
  const wordTargets = targetWords(text);
  const jpTargets = targetJapaneseChars(text);

  if (wordTargets.length) {
    const words = Math.max(...wordTargets);
    const summary = isSummaryLike(title);
    const planning = summary ? [1.5, 2.0, 3.0] : [2.0, 3.0, 4.0];
    const revision = summary ? [1.5, 2.0, 3.0] : [2.0, 3.0, 4.0];
    const rates = summary ? [12, 10, 8] : [11, 9, 7.5];
    return {
      low: planning[0] + words / rates[0] + revision[0],
      central: planning[1] + words / rates[1] + revision[1],
      high: planning[2] + words / rates[2] + revision[2],
      targetWords: words,
      targetChars: null
    };
  }

  if (jpTargets.length) {
    const chars = Math.max(...jpTargets);
    return {
      low: 1.5 + chars / 24 + 1.0,
      central: 2.0 + chars / 19 + 1.5,
      high: 2.5 + chars / 15 + 2.0,
      targetWords: null,
      targetChars: chars
    };
  }

  let central = 7;
  if (/Mini Writing/i.test(title)) central = 7;
  else if (/Guided Writing/i.test(title)) central = 8;
  else if (/Short Writing/i.test(title)) central = 7;
  else if (/English Summary/i.test(title)) central = 9;
  else if (/Short Output/i.test(title)) central = 7;
  else if (/Writing Task|Final Writing|Judgment|Evaluation|Proposal|Trade-off|Composition|Prompt/i.test(title)) central = 15;

  return {
    low: Math.max(4, central - 3),
    central,
    high: central + 4,
    targetWords: null,
    targetChars: null
  };
}

function estimateLesson(id) {
  const entry = catalog.get(id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const lesson = parseGenericLesson(raw, id);
  const timed = explicitTimedMinutes(split.problem);

  // The estimate deliberately ignores the existing allocation line and Core minute total.
  const setupSections = lesson.groups.setup.filter((section) =>
    !/^(?:今日の狙い|時間配分)$/i.test(section.title)
  );
  const challengeSections = lesson.groups.challenge;
  const writingSections = lesson.groups.writing;
  const supportSections = lesson.groups.support;

  const setupText = setupSections.map(sectionText).join("\n");
  const setupEn = englishWords(setupText);
  const setupJa = japaneseChars(setupText);
  const setupActions = actionableLines(setupText);

  const readingText = challengeSections
    .filter((section) => isReadingLike(section.title))
    .map(sectionText)
    .join("\n");
  const otherChallengeText = challengeSections
    .filter((section) => !isReadingLike(section.title))
    .map(sectionText)
    .join("\n");

  const readingEn = englishWords(readingText);
  const readingJa = japaneseChars(readingText);
  const otherEn = englishWords(otherChallengeText);
  const otherJa = japaneseChars(otherChallengeText);

  const qCount = questionCount(split.problem);
  const otherActions = challengeSections
    .filter((section) => !isReadingLike(section.title))
    .reduce((sum, section) => sum + actionableLines(sectionText(section)), 0);

  const dataSections = challengeSections.filter((section) => isDataLike(section.title)).length;
  const questionSections = challengeSections.filter((section) => isQuestionLike(section.title)).length;
  const sourceSections = challengeSections.filter((section) =>
    /^(?:Reading|Passage|Text\s+[A-Z]|Source\s+[A-Z]|Data Table|Table|FAQ|Memo|Protocol)/i.test(section.title)
  ).length;

  const setup = {
    low: setupEn / 125 + setupJa / 400 + setupActions * 0.15,
    central: setupEn / 95 + setupJa / 280 + setupActions * 0.25,
    high: setupEn / 70 + setupJa / 200 + setupActions * 0.4
  };

  const reading = {
    low: readingEn / 105 + readingJa / 500,
    central: readingEn / 82 + readingJa / 360,
    high: readingEn / 65 + readingJa / 260
  };

  const challengeInput = {
    low: otherEn / 150 + otherJa / 520,
    central: otherEn / 120 + otherJa / 400,
    high: otherEn / 95 + otherJa / 300
  };

  const taskUnits = Math.max(qCount, Math.ceil(otherActions * 0.55), questionSections);
  const questions = {
    low: taskUnits * 0.9,
    central: taskUnits * 1.35,
    high: taskUnits * 1.9
  };

  const integrationUnits = Math.max(0, sourceSections - 1) + dataSections;
  const integration = {
    low: integrationUnits * 0.45,
    central: integrationUnits * 0.9,
    high: integrationUnits * 1.4
  };

  const complexityText = `${entry.title}\n${split.problem}`;
  const conceptHits = [
    /未知概念|unknown concept/i,
    /高密度|dense/i,
    /複数資料|mixed-format|integration/i,
    /因果|causal|confound/i,
    /条件付き|conditional/i
  ].filter((pattern) => pattern.test(complexityText)).length;
  const complexity = {
    low: Math.min(1.5, conceptHits * 0.25),
    central: Math.min(3.0, conceptHits * 0.65),
    high: Math.min(5.0, conceptHits * 1.0)
  };

  const outputs = writingSections.map(estimateWritingSection);
  const writing = outputs.reduce(
    (acc, item) => ({
      low: acc.low + item.low,
      central: acc.central + item.central,
      high: acc.high + item.high
    }),
    { low: 0, central: 0, high: 0 }
  );

  const supportText = supportSections.map(sectionText).join("\n");
  const supportItems = Math.max(
    1,
    supportText.split("\n").filter((line) => line.trim() && !/^[-_]+$/.test(line.trim())).length
  );
  const selfCheck = supportSections.length
    ? {
        low: Math.max(1.0, Math.min(2.5, supportItems * 0.22)),
        central: Math.max(1.5, Math.min(3.5, supportItems * 0.32)),
        high: Math.max(2.0, Math.min(4.5, supportItems * 0.45))
      }
    : { low: 0, central: 0, high: 0 };

  const low = setup.low + reading.low + challengeInput.low + questions.low + integration.low + complexity.low + writing.low + selfCheck.low;
  const central = setup.central + reading.central + challengeInput.central + questions.central + integration.central + complexity.central + writing.central + selfCheck.central;
  const high = setup.high + reading.high + challengeInput.high + questions.high + integration.high + complexity.high + writing.high + selfCheck.high;

  const allocated = timed.exercise;
  const delta = allocated == null ? null : allocated - central;
  let status = "balanced";
  if (allocated != null) {
    if (allocated > high + 3 || delta >= 8) status = "loose";
    else if (allocated > high || delta >= 5) status = "soft";
    else if (allocated < low - 3 || delta <= -8) status = "too-tight";
    else if (allocated < low || delta <= -5) status = "tight";
  }

  return {
    id,
    phase: entry.phase,
    title: entry.title,
    allocated,
    low,
    central,
    high,
    delta,
    status,
    metrics: {
      setupEn,
      setupJa,
      readingEn,
      readingJa,
      otherEn,
      otherJa,
      qCount,
      taskUnits,
      dataSections,
      sourceSections,
      writingSections: writingSections.length,
      writingTargets: outputs.map((item) => item.targetWords).filter(Boolean)
    }
  };
}

const rows = coreIds.map(estimateLesson);

function round(value) {
  return value == null ? null : Math.round(value * 10) / 10;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

console.log("[time-model] methodology=independent content model; existing timing used only as comparison");
console.log("[time-model] rates=input close-reading 82 wpm central; setup 95 wpm; drafting 9 wpm; task solving 1.35 min/unit");
console.log("[time-model] row format=id|phase|allocated|low|central|high|delta|status|readingWords|taskUnits|writingTargets");

for (const row of rows) {
  console.log(
    [
      "[time-model-row]",
      row.id,
      row.phase,
      round(row.allocated),
      round(row.low),
      round(row.central),
      round(row.high),
      round(row.delta),
      row.status,
      row.metrics.readingEn,
      row.metrics.taskUnits,
      row.metrics.writingTargets.join(",") || "-"
    ].join("|")
  );
}

for (const phase of ["P1", "P2", "P3"]) {
  const phaseRows = rows.filter((row) => row.phase === phase);
  const allocated = phaseRows.map((row) => row.allocated).filter((value) => value != null);
  const central = phaseRows.map((row) => row.central);
  const deltas = phaseRows.map((row) => row.delta).filter((value) => value != null);
  const statuses = Object.fromEntries(
    ["loose", "soft", "balanced", "tight", "too-tight"].map((status) => [
      status,
      phaseRows.filter((row) => row.status === status).length
    ])
  );
  console.log(
    `[time-model-summary] ${phase} count=${phaseRows.length} allocatedMean=${round(allocated.reduce((a,b)=>a+b,0)/allocated.length)} estimatedMean=${round(central.reduce((a,b)=>a+b,0)/central.length)} deltaMean=${round(deltas.reduce((a,b)=>a+b,0)/deltas.length)} medianDelta=${round(median(deltas))} status=${JSON.stringify(statuses)}`
  );
}

const rankedLoose = rows
  .filter((row) => row.delta != null)
  .sort((a, b) => b.delta - a.delta)
  .slice(0, 12);
const rankedTight = rows
  .filter((row) => row.delta != null)
  .sort((a, b) => a.delta - b.delta)
  .slice(0, 12);

console.log("[time-model] largest positive deltas (allocated more generous than model)");
for (const row of rankedLoose) {
  console.log(`[time-model-outlier] loose|${row.id}|${row.phase}|allocated=${round(row.allocated)}|estimate=${round(row.central)}|range=${round(row.low)}-${round(row.high)}|delta=${round(row.delta)}|${row.title}`);
}
console.log("[time-model] largest negative deltas (allocated tighter than model)");
for (const row of rankedTight) {
  console.log(`[time-model-outlier] tight|${row.id}|${row.phase}|allocated=${round(row.allocated)}|estimate=${round(row.central)}|range=${round(row.low)}-${round(row.high)}|delta=${round(row.delta)}|${row.title}`);
}

const severe = rows.filter((row) => ["loose", "too-tight"].includes(row.status));
console.log(`[time-model] severe=${severe.length}/99`);
