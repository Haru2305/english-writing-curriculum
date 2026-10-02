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
  const lines = problem.split("\n").map((line) => line.trim());
  const allocationLine = lines.find((line) => /Post-solve\s*\d+\s*分/i.test(line)) ?? "";
  const directExercise = Number(allocationLine.match(/[＝=]\s*演習\s*(\d+)\s*分/i)?.[1] ?? 0) || null;
  const coreTotal = Number(allocationLine.match(/Core\s*(\d+)\s*分/i)?.[1] ?? 0) || null;
  const metaTotal = Number(problem.match(/目安\s*(\d+)\s*分/i)?.[1] ?? 0) || null;
  const post = Number(allocationLine.match(/Post-solve\s*(\d+)\s*分/i)?.[1] ?? 0);

  if (directExercise != null) {
    return {
      total: directExercise,
      post,
      exercise: directExercise
    };
  }

  const total = coreTotal ?? metaTotal;
  return {
    total,
    post,
    exercise: total == null ? null : total - post
  };
}

function targetWords(text = "") {
  const targets = [];
  const value = String(text);
  for (const match of value.matchAll(/(\d+)\s*[–—\-〜~]\s*(\d+)\s*(?:English\s*)?words?/gi)) {
    targets.push((Number(match[1]) + Number(match[2])) / 2);
  }
  for (const match of value.matchAll(/(\d+)\s*[–—\-〜~]\s*(\d+)\s*語/g)) {
    targets.push((Number(match[1]) + Number(match[2])) / 2);
  }
  for (const match of value.matchAll(/(?:about|approximately)\s*(\d+)\s*(?:English\s*)?words?/gi)) {
    targets.push(Number(match[1]));
  }
  for (const match of value.matchAll(/約\s*(\d+)\s*語/g)) {
    targets.push(Number(match[1]));
  }
  return [...new Set(targets)];
}

function targetJapaneseChars(text = "") {
  const targets = [];
  const value = String(text);
  const rangePattern = /(\d+)\s*[–—\-〜~]\s*(\d+)\s*字/g;
  for (const match of value.matchAll(rangePattern)) {
    targets.push((Number(match[1]) + Number(match[2])) / 2);
  }
  const withoutRanges = value.replace(rangePattern, "");
  for (const match of withoutRanges.matchAll(/(?:約\s*)?(\d+)\s*字(?:以内|程度)?/g)) {
    targets.push(Number(match[1]));
  }
  return [...new Set(targets)];
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

function problemForIndependentModel(problem = "") {
  const lines = String(problem).replace(/^---\n[\s\S]*?\n---\n+/m, "").split("\n");
  return lines
    .filter((line, index) => {
      const text = line.trim();
      if (!text) return false;
      if (index <= 1 && /^E\d{3}|^P[1-4]\b/.test(text)) return false;
      if (text === "時間配分") return false;
      if (/\d+\s*分\s*\/.*Post-solve\s*\d+\s*分/i.test(text)) return false;
      return true;
    })
    .join("\n");
}

function sourceCount(text = "") {
  const hits = new Set();
  const patterns = [
    [/(?:^|\n)\s*(?:Reading|Passage)(?:\s|$)/gim, "main"],
    [/(?:^|\n)\s*(?:Source|Text|Passage)\s+([A-Z])(?:\s|$)/gim, "letter"],
    [/(?:^|\n)\s*(?:Data Table|Table)(?:\s|$)/gim, "table"],
    [/(?:^|\n)\s*FAQ(?:\s|$)/gim, "faq"],
    [/(?:^|\n)\s*(?:Internal Memo|Memo|Protocol|Notice|Email)(?:\s|$)/gim, "aux"]
  ];
  for (const [pattern, kind] of patterns) {
    let index = 0;
    for (const match of String(text).matchAll(pattern)) {
      hits.add(kind === "letter" ? `${kind}-${match[1]}-${index++}` : `${kind}-${index++}`);
    }
  }
  return Math.max(1, hits.size);
}

function defaultOutputCount(lesson, explicitTargets) {
  const outputSections = lesson.groups.writing.filter((section) =>
    /Writing|Summary|Output|Prompt|Composition|Judgment|Evaluation|Proposal|Trade-off/i.test(section.title)
  ).length;
  return Math.max(0, outputSections - explicitTargets);
}

function estimateLesson(id) {
  const entry = catalog.get(id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const lesson = parseGenericLesson(raw, id);
  const timed = explicitTimedMinutes(split.problem);
  const modelText = problemForIndependentModel(split.problem);

  // Independent content inputs. No assigned section minutes are used below.
  const enWords = englishWords(modelText);
  const jaChars = japaneseChars(modelText);
  const qCount = questionCount(modelText);
  const actionCount = actionableLines(modelText);
  const taskUnits = Math.max(qCount, Math.ceil(actionCount * 0.60));

  const wordTargets = targetWords(modelText);
  const jpTargets = targetJapaneseChars(modelText);
  const explicitTargetCount = wordTargets.length + jpTargets.length;
  const extraOutputCount = defaultOutputCount(lesson, explicitTargetCount);

  const inputs = {
    low: enWords / 95 + jaChars / 500,
    central: enWords / 75 + jaChars / 350,
    high: enWords / 60 + jaChars / 250
  };

  const tasks = {
    low: taskUnits * 1.0,
    central: taskUnits * 1.6,
    high: taskUnits * 2.2
  };

  const wordOutput = wordTargets.reduce(
    (acc, words) => {
      const summaryLike = /Summary/i.test(modelText) && wordTargets.length === 1;
      const low = summaryLike ? 2.0 + words / 12 + 1.5 : 2.5 + words / 12 + 2.0;
      const central = summaryLike ? 2.5 + words / 10 + 2.0 : 3.0 + words / 9.5 + 2.5;
      const high = summaryLike ? 3.0 + words / 8 + 2.5 : 4.0 + words / 7.5 + 3.5;
      return { low: acc.low + low, central: acc.central + central, high: acc.high + high };
    },
    { low: 0, central: 0, high: 0 }
  );

  const jpOutput = jpTargets.reduce(
    (acc, chars) => ({
      low: acc.low + 2.0 + chars / 28 + 1.0,
      central: acc.central + 2.5 + chars / 22 + 1.5,
      high: acc.high + 3.0 + chars / 17 + 2.0
    }),
    { low: 0, central: 0, high: 0 }
  );

  const extraOutputs = {
    low: extraOutputCount * 4.5,
    central: extraOutputCount * 7.0,
    high: extraOutputCount * 10.0
  };

  const sources = sourceCount(modelText);
  const integrationUnits = Math.max(0, sources - 1);
  const integration = {
    low: integrationUnits * 0.8,
    central: integrationUnits * 1.5,
    high: integrationUnits * 2.2
  };

  const guideHits = (modelText.match(/(?:^|\n)\s*(?:Quick Guide|Guide|Strategy|Plan→Draft→Revise|Checkpoint Plan|Mixed-source Plan|Concept Build|Transfer Guide)/gim) ?? []).length;
  const guide = {
    low: Math.min(2.0, guideHits * 0.5),
    central: Math.min(4.0, guideHits * 1.25),
    high: Math.min(6.0, guideHits * 2.0)
  };

  const conceptHits = [
    /未知概念|unknown concept/i,
    /高密度|dense/i,
    /複数資料|mixed-source|mixed-format|integration/i,
    /因果|causal|confound/i,
    /条件付き|conditional/i
  ].filter((pattern) => pattern.test(`${entry.title}\n${modelText}`)).length;
  const complexity = {
    low: Math.min(2.0, conceptHits * 0.35),
    central: Math.min(4.0, conceptHits * 0.8),
    high: Math.min(6.0, conceptHits * 1.2)
  };

  const selfCheckMatch = modelText.match(/(?:^|\n)Self-check\s*\n([\s\S]*?)(?=\n(?:[A-Z][A-Za-z -]{2,}|#{1,3}\s|_{3,}|$))/i);
  const selfCheckItems = selfCheckMatch
    ? selfCheckMatch[1].split("\n").filter((line) => line.trim()).length
    : 0;
  const selfCheck = selfCheckItems
    ? {
        low: Math.max(1.0, Math.min(2.5, selfCheckItems * 0.25)),
        central: Math.max(1.5, Math.min(3.5, selfCheckItems * 0.4)),
        high: Math.max(2.0, Math.min(4.5, selfCheckItems * 0.55))
      }
    : { low: 1.0, central: 1.5, high: 2.0 };

  const low = inputs.low + tasks.low + wordOutput.low + jpOutput.low + extraOutputs.low + integration.low + guide.low + complexity.low + selfCheck.low;
  const central = inputs.central + tasks.central + wordOutput.central + jpOutput.central + extraOutputs.central + integration.central + guide.central + complexity.central + selfCheck.central;
  const high = inputs.high + tasks.high + wordOutput.high + jpOutput.high + extraOutputs.high + integration.high + guide.high + complexity.high + selfCheck.high;

  const allocated = timed.exercise;
  const delta = allocated == null ? null : allocated - central;
  let status = "balanced";
  if (allocated != null) {
    if (allocated > high + 5 || delta >= 12) status = "loose";
    else if (allocated > high || delta >= 7) status = "soft";
    else if (allocated < low - 4 || delta <= -10) status = "too-tight";
    else if (allocated < low || delta <= -6) status = "tight";
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
      enWords,
      jaChars,
      qCount,
      taskUnits,
      sources,
      writingSections: lesson.groups.writing.length,
      writingTargets: wordTargets,
      japaneseTargets: jpTargets,
      extraOutputCount
    }
  };
}
const rows = coreIds.map(estimateLesson);

const timingPlanPath = new URL("../../management/core99-independent-time-audit.csv", import.meta.url);
const timingPlan = new Map();
for (const line of fs.readFileSync(timingPlanPath, "utf8").split(/\r?\n/)) {
  const id = line.match(/^(E\d{3}),/)?.[1];
  const target = line.match(/,(\d+),-?\d+,(?:shorten|shorten-slightly|keep-or-minor-adjust|review-overload)$/)?.[1];
  if (id && target) timingPlan.set(id, Number(target));
}
if (timingPlan.size !== 99) {
  throw new Error(`Expected 99 retiming targets, found ${timingPlan.size}`);
}

const timingMismatches = rows.filter((row) => row.allocated !== timingPlan.get(row.id));
if (timingMismatches.length) {
  throw new Error(
    "Core 99 timing does not match the approved retiming plan: "
    + timingMismatches.map((row) => `${row.id}=${row.allocated} expected ${timingPlan.get(row.id)}`).join(", ")
  );
}

function round(value) {
  return value == null ? null : Math.round(value * 10) / 10;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

console.log("[time-model] methodology=independent content model; existing timing used only as comparison");
console.log("[time-model] rates=all problem input 75 English wpm + 350 Japanese chars/min central; task solving 1.6 min/unit; English drafting 9.5 wpm plus planning/revision");
console.log("[time-model] row format=id|phase|allocated|low|central|high|delta|status|inputWords|taskUnits|sources|writingTargets|japaneseTargets");

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
      row.metrics.enWords,
      row.metrics.taskUnits,
      row.metrics.sources,
      row.metrics.writingTargets.join(",") || "-",
      row.metrics.japaneseTargets.join(",") || "-"
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
