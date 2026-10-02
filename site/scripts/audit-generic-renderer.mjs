import fs from "node:fs";
import {
  getLessonCatalog,
  getGenericLessonCatalog
} from "../src/lib/lesson-catalog.js";
import { parseGenericLesson } from "../src/lib/generic-lesson.js";
import {
  containsInternalCode,
  toLearnerText
} from "../src/lib/learner-text.js";
import { reviewPresentation } from "../src/lib/review-presentation.js";
import {
  P1_ACCELERATED_IDS,
  P1_OPTIONAL_BY_BUNDLE
} from "../src/data/p1-accelerated-route.js";
import {
  P2_ACCELERATED_IDS,
  P2_OPTIONAL_BY_BUNDLE
} from "../src/data/p2-accelerated-route.js";
import {
  P3_ACCELERATED_IDS,
  P3_OPTIONAL_BY_BUNDLE
} from "../src/data/p3-accelerated-route.js";

const answerMarkers = [
  "解答・解説・自己修正",
  "解答・解説",
  "Answers and Explanations"
];

const writingCue = /^(?:Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing|Judgment Writing|Evaluation Writing|Proposal Writing|Trade-off Writing|Summary-linked Writing|Text-linked Writing|Prompt|Planning|Plan→Draft→Revise|Part\s+(?:\d+|[A-Z])\s*[｜:：].*(?:Q3B|Writing|Composition))/im;
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
const summaries = new Map();

function isStrictlyIncreasingLessonIds(ids) {
  return ids.every((id, index) =>
    index === 0 || Number(id.slice(1)) > Number(ids[index - 1].slice(1))
  );
}


const p1AllIds = Array.from({ length: 42 }, (_, index) =>
  `E${String(index + 1).padStart(3, "0")}`
);
const p1OptionalIds = Object.values(P1_OPTIONAL_BY_BUNDLE).flat();
const p1RouteSet = new Set(P1_ACCELERATED_IDS);
const p1OptionalSet = new Set(p1OptionalIds);
const p1Combined = new Set([...P1_ACCELERATED_IDS, ...p1OptionalIds]);
const p1CheckpointIds = ["E006", "E012", "E018", "E024", "E030", "E036", "E042"];

if (!isStrictlyIncreasingLessonIds(P1_ACCELERATED_IDS)) {
  failures.push("P1 accelerated route should preserve increasing lesson order");
}
if (P1_ACCELERATED_IDS.length !== 15 || p1RouteSet.size !== 15) {
  failures.push(`P1 accelerated route must contain 15 unique lessons: ${P1_ACCELERATED_IDS.join(", ")}`);
}
if (p1OptionalIds.length !== 27 || p1OptionalSet.size !== 27) {
  failures.push(`P1 targeted review must contain 27 unique lessons: count=${p1OptionalIds.length}`);
}
if (P1_ACCELERATED_IDS.some((id) => p1OptionalSet.has(id))) {
  failures.push("P1 accelerated and optional routes overlap");
}
if (p1Combined.size !== 42 || p1AllIds.some((id) => !p1Combined.has(id))) {
  failures.push("P1 accelerated + optional routes do not partition E001–E042");
}
for (const id of p1CheckpointIds) {
  if (!p1RouteSet.has(id)) failures.push(`P1 accelerated route missing checkpoint ${id}`);
}

let p1CoreReviewTailChars = 0;

for (const id of P1_ACCELERATED_IDS) {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const marker = "\n自己修正\n";
  const index = split.answer.indexOf(marker);

  if (index < 0) {
    failures.push(`${id}: compact P1 Core self-correction section missing`);
    continue;
  }

  const tail = split.answer.slice(index);
  p1CoreReviewTailChars += tail.length;

  if (tail.length > 550) {
    failures.push(`${id}: P1 Core review tail is too long (${tail.length} chars)`);
  }
  if (/AC0[2-5]|任意Escalation/.test(tail)) {
    failures.push(`${id}: legacy long-form P1 self-assessment returned`);
  }
  for (const required of [
    "解説補強｜Core recap",
    "### 核",
    "### 模範解答の読み方",
    "### 次へ"
  ]) {
    if (!tail.includes(required)) {
      failures.push(`${id}: compact P1 Core review missing ${required}`);
    }
  }
}

if (p1CoreReviewTailChars > 6500) {
  failures.push(`P1 Core review tails have grown too large in aggregate: ${p1CoreReviewTailChars} chars`);
}


const p2AllIds = Array.from({ length: 54 }, (_, index) =>
  `E${String(index + 43).padStart(3, "0")}`
);
const p2OptionalIds = Object.values(P2_OPTIONAL_BY_BUNDLE).flat();
const p2RouteSet = new Set(P2_ACCELERATED_IDS);
const p2OptionalSet = new Set(p2OptionalIds);
const p2Combined = new Set([...P2_ACCELERATED_IDS, ...p2OptionalIds]);
const p2CheckpointIds = ["E048", "E054", "E060", "E066", "E072", "E078", "E084", "E090", "E096"];

if (!isStrictlyIncreasingLessonIds(P2_ACCELERATED_IDS)) {
  failures.push("P2 accelerated route should preserve increasing lesson order");
}
if (P2_ACCELERATED_IDS.length !== 30 || p2RouteSet.size !== 30) {
  failures.push(`P2 accelerated route must contain 30 unique lessons: ${P2_ACCELERATED_IDS.join(", ")}`);
}
if (p2OptionalIds.length !== 24 || p2OptionalSet.size !== 24) {
  failures.push(`P2 targeted review must contain 24 unique lessons: count=${p2OptionalIds.length}`);
}
if (P2_ACCELERATED_IDS.some((id) => p2OptionalSet.has(id))) {
  failures.push("P2 accelerated and optional routes overlap");
}
if (p2Combined.size !== 54 || p2AllIds.some((id) => !p2Combined.has(id))) {
  failures.push("P2 accelerated + optional routes do not partition E043–E096");
}
for (const id of p2CheckpointIds) {
  if (!p2RouteSet.has(id)) failures.push(`P2 accelerated route missing checkpoint ${id}`);
}
for (const id of ["E043", "E053", "E061", "E068", "E073", "E074", "E079", "E080", "E081", "E085", "E086", "E087", "E091", "E092", "E093", "E096"]) {
  if (!p2RouteSet.has(id)) failures.push(`P2 accelerated route missing milestone ${id}`);
}
if (P1_ACCELERATED_IDS.length + P2_ACCELERATED_IDS.length !== 45) {
  failures.push("P1+P2 accelerated route should reach P3 in 45 Core lessons");
}


const p3AllIds = Array.from({ length: 108 }, (_, index) =>
  `E${String(index + 97).padStart(3, "0")}`
);
const p3OptionalIds = Object.values(P3_OPTIONAL_BY_BUNDLE).flat();
const p3RouteSet = new Set(P3_ACCELERATED_IDS);
const p3OptionalSet = new Set(p3OptionalIds);
const p3Combined = new Set([...P3_ACCELERATED_IDS, ...p3OptionalIds]);
const p3CheckpointIds = Array.from({ length: 18 }, (_, index) =>
  `E${String(102 + index * 6).padStart(3, "0")}`
);

if (!isStrictlyIncreasingLessonIds(P3_ACCELERATED_IDS)) {
  failures.push("P3 accelerated route should preserve increasing lesson order");
}
if (P3_ACCELERATED_IDS.length !== 54 || p3RouteSet.size !== 54) {
  failures.push(`P3 accelerated route must contain 54 unique lessons: count=${P3_ACCELERATED_IDS.length}`);
}
if (p3OptionalIds.length !== 54 || p3OptionalSet.size !== 54) {
  failures.push(`P3 targeted review must contain 54 unique lessons: count=${p3OptionalIds.length}`);
}
if (P3_ACCELERATED_IDS.some((id) => p3OptionalSet.has(id))) {
  failures.push("P3 accelerated and optional routes overlap");
}
if (p3Combined.size !== 108 || p3AllIds.some((id) => !p3Combined.has(id))) {
  failures.push("P3 accelerated + optional routes do not partition E097–E204");
}
for (const id of p3CheckpointIds) {
  if (!p3RouteSet.has(id)) failures.push(`P3 accelerated route missing checkpoint ${id}`);
}

for (const id of [
  "E097", "E104", "E109", "E117", "E122", "E127", "E133",
  "E141", "E145", "E147", "E153", "E157", "E159", "E163", "E165",
  "E169", "E170", "E175", "E183", "E185", "E189", "E190",
  "E194", "E195", "E197", "E201", "E202", "E204"
]) {
  if (!p3RouteSet.has(id)) failures.push(`P3 accelerated route missing milestone ${id}`);
}

if (P1_ACCELERATED_IDS.length + P2_ACCELERATED_IDS.length + P3_ACCELERATED_IDS.length !== 99) {
  failures.push("P1+P2+P3 accelerated route should contain 99 Core lessons before P4");
}


const core99Ids = [...P1_ACCELERATED_IDS, ...P2_ACCELERATED_IDS, ...P3_ACCELERATED_IDS];
const allP1P3Ids = [...p1AllIds, ...p2AllIds, ...p3AllIds];

function rawCodesFor(id) {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  return new Set(split.problem.match(/\b(?:A|RQ|RF|WF|WT|WQ|D|SS)\d{2}\b/g) ?? []);
}

const core99Output = core99Ids.map((id) => {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const lesson = parseGenericLesson(raw, id);
  const split = splitRaw(raw);
  return {
    id,
    hasWriting: lesson.groups.writing.length > 0,
    substantialWriting: lesson.groups.writing.some((section) =>
      /Writing Task|Judgment Writing|Evaluation Writing|Proposal Writing|Trade-off Writing|Summary-linked Writing|Text-linked Writing|Final Writing|Part .*Writing/i.test(section.title)
    ),
    summaryOutput:
      /^Summary Task$|^Japanese Summary Task$/m.test(split.problem)
      || lesson.groups.writing.some((section) => /English Summary/i.test(section.title))
  };
});

const core99WritingCount = core99Output.filter((item) => item.hasWriting).length;
const core99SubstantialWritingCount = core99Output.filter((item) => item.substantialWriting).length;
const core99SummaryOutputCount = core99Output.filter((item) => item.summaryOutput).length;

if (core99Ids.length !== 99) {
  failures.push(`Core route changed from 99 lessons: ${core99Ids.length}`);
}
if (core99WritingCount < 65) {
  failures.push(`Core 99 Writing density too low: ${core99WritingCount}/99`);
}
if (core99SubstantialWritingCount < 40) {
  failures.push(`Core 99 substantial-Writing coverage too low: ${core99SubstantialWritingCount}/99`);
}
if (core99SummaryOutputCount < 30) {
  failures.push(`Core 99 summary-output coverage too low: ${core99SummaryOutputCount}/99`);
}

const allRawCodes = new Set(allP1P3Ids.flatMap((id) => [...rawCodesFor(id)]));
const core99RawCodes = new Set(core99Ids.flatMap((id) => [...rawCodesFor(id)]));
const core99RawMissing = [...allRawCodes].filter((code) => !core99RawCodes.has(code)).sort();
const allowedOptionalOnlyCodes = new Set(["A04", "A10"]);
const unexpectedMissingCodes = core99RawMissing.filter((code) => !allowedOptionalOnlyCodes.has(code));

if (core99RawCodes.size < 70 || unexpectedMissingCodes.length) {
  failures.push(
    `Core 99 skill coverage regressed: ${core99RawCodes.size}/${allRawCodes.size}; unexpected missing=${unexpectedMissingCodes.join(",") || "none"}`
  );
}

for (const id of ["E157", "E170", "E175", "E185", "E194", "E197"]) {
  if (!p3RouteSet.has(id)) {
    failures.push(`P3 Core missing high-transfer evidence concept introduction: ${id}`);
  }
}

const learnerConceptPath = new URL("../../curriculum/learner-facing-concepts.md", import.meta.url);
const learnerConceptText = fs.readFileSync(learnerConceptPath, "utf8");
if (!learnerConceptText.includes("## Accelerated-route override")) {
  failures.push("Accelerated-route concept override is missing");
}

const learnerConceptRows = learnerConceptText
  .split("\n")
  .filter((line) => /^\| IDEA\d+ /.test(line))
  .map((line) => {
    const cells = line.split("|").map((cell) => cell.trim());
    const introduce = cells[2]?.match(/E\d{3}/)?.[0] ?? "";
    const recall = [...(cells[3]?.matchAll(/E\d{3}/g) ?? [])].map((match) => match[0]);
    const transfer = [...(cells[4]?.matchAll(/E\d{3}/g) ?? [])].map((match) => match[0]);
    return { introduce, recall, transfer };
  });

for (const row of learnerConceptRows) {
  if (!row.introduce || core99Ids.includes(row.introduce)) continue;
  const downstreamCore = [...row.recall, ...row.transfer].filter((id) => core99Ids.includes(id));
  for (const id of downstreamCore) {
    const entry = catalog.find((item) => item.id === id);
    const raw = fs.readFileSync(entry.filePath, "utf8");
    if (raw.includes(row.introduce)) {
      failures.push(`${id}: Core lesson explicitly assumes Optional concept-introduction lesson ${row.introduce}`);
    }
  }
}



const coreCheckpointSet = new Set([
  ...p1CheckpointIds,
  ...p2CheckpointIds,
  ...p3CheckpointIds
]);

const workloadCaps = {
  P1: {
    regular: { problemChars: 5900, answerChars: 2900 },
    checkpoint: { problemChars: 6000, answerChars: 2600 }
  },
  P2: {
    regular: { problemChars: 5800, answerChars: 3500 },
    checkpoint: { problemChars: 6500, answerChars: 3000 }
  },
  P3: {
    regular: { problemChars: 4300, answerChars: 3600 },
    checkpoint: { problemChars: 4500, answerChars: 4300 }
  }
};

for (const id of core99Ids) {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const problemLines = split.problem.split("\n").map((line) => line.trim()).filter(Boolean);
  const allocationLine = problemLines.find((line) =>
    /(?:＝\s*Core\s*\d+\s*分|\bCore\s*\d+\s*分|目安\s*\d+\s*分|\b\d+\s*min(?:utes?)?\b)/i.test(line)
  ) ?? "";
  const explicitMinutes =
    Number(allocationLine.match(/(?:＝\s*Core\s*|\bCore\s*|目安\s*)(\d+)\s*分/i)?.[1] ?? 0)
    || Number(allocationLine.match(/\b(\d+)\s*min(?:utes?)?\b/i)?.[1] ?? 0)
    || null;

  const problemText = split.problem.replace(/^---[\s\S]*?---\s*/m, "");
  const kind = coreCheckpointSet.has(id) ? "checkpoint" : "regular";
  const caps = workloadCaps[entry.phase]?.[kind];

  if (explicitMinutes == null || explicitMinutes < 45 || explicitMinutes > 60) {
    failures.push(`${id}: Core workload target should stay within 45–60 minutes, found ${explicitMinutes ?? "none"}`);
  }
  if (!caps) {
    failures.push(`${id}: no workload cap configured for ${entry.phase}/${kind}`);
    continue;
  }
  if (problemText.length > caps.problemChars) {
    failures.push(`${id}: Core problem-side workload grew too large (${problemText.length} > ${caps.problemChars} chars)`);
  }
  if (split.answer.length > caps.answerChars) {
    failures.push(`${id}: Core answer/explanation workload grew too large (${split.answer.length} > ${caps.answerChars} chars)`);
  }
}


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
    failures.push(`${entry.id}: compact answer headings not split for ${[...new Set(missingAnswerKeys)].join(", ")}`);
  }

  for (const text of [lesson.title, ...allParsedText(lesson)]) {
    const rendered = toLearnerText(text);
    if (containsInternalCode(rendered)) {
      failures.push(`${entry.id}: internal code survives learner sanitizer: ${rendered}`);
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



function normalizeOrderText(text) {
  return text
    .toLowerCase()
    .replace(/[“”"'.,!?;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function longestIncreasingSubsequenceLength(values) {
  const tails = [];
  for (const value of values) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < value) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = value;
  }
  return tails.length;
}

let p4WordOrderCount = 0;

for (const entry of generic.filter((item) => {
  const n = Number(item.id.slice(1));
  return n >= 205 && n <= 234;
})) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const answerLines = lines(split.answer);
  const prompts = [...split.problem.matchAll(/\(([^()\n]{10,220})\)/g)]
    .map((match) => match[1])
    .filter((inner) => /\s\/\s/.test(inner));


  const weakTargetWords = new Set([
    "a", "an", "the", "and", "or", "but", "if", "when", "while", "because",
    "whether", "than", "from", "to", "of", "in", "on", "at", "for", "by",
    "with", "without", "as", "only", "not", "also", "rather", "more", "less",
    "so", "that", "what", "which", "who", "how"
  ]);

  const completedItems = [...split.answer.matchAll(
    /(?:^|\n)(\d+)\s*完成\s*\n(?:\s*\n)*([^\n]+)\n(?:\s*\n)*3番目[:：]\s*([^\n]+)\n(?:\s*\n)*5番目[:：]\s*([^\n]+)/g
  )];

  for (const match of completedItems) {
    const number = match[1];
    for (const [position, target] of [["3番目", match[3]], ["5番目", match[4]]]) {
      const tokens = normalizeOrderText(target).split(" ").filter(Boolean);
      const hasContentWord = tokens.some((token) => !weakTargetWords.has(token));
      if (!hasContentWord) {
        failures.push(`${entry.id} #${number}: ${position} can be answered with function words alone: ${target.trim()}`);
      }
    }
  }

  for (const inner of prompts) {
    p4WordOrderCount += 1;
    const chunks = inner.split(/\s*\/\s*/).map((chunk) => chunk.trim()).filter(Boolean);

    if (chunks.length !== 8) {
      failures.push(`${entry.id}: word-order item should have 8 chunks, found ${chunks.length}`);
      continue;
    }

    const oversized = chunks.filter((chunk) => normalizeOrderText(chunk).split(" ").length > 4);
    if (oversized.length) {
      failures.push(`${entry.id}: oversized word-order chunk(s): ${oversized.join(" | ")}`);
    }

    const normalizedChunks = chunks.map(normalizeOrderText);
    const answerLine = answerLines.find((line) => {
      const normalized = normalizeOrderText(line);
      return normalizedChunks.every((chunk) => normalized.includes(chunk));
    });

    if (!answerLine) {
      failures.push(`${entry.id}: no completed answer sentence found for word-order item: (${inner})`);
      continue;
    }

    const normalizedAnswer = normalizeOrderText(answerLine);
    const positions = normalizedChunks.map((chunk) => normalizedAnswer.indexOf(chunk));
    if (positions.some((position) => position < 0)) {
      failures.push(`${entry.id}: could not map all word-order chunks to completed answer`);
      continue;
    }

    const ranked = positions
      .map((position, index) => ({ position, index }))
      .sort((a, b) => a.position - b.position)
      .reduce((ranks, item, rank) => {
        ranks[item.index] = rank;
        return ranks;
      }, []);

    const lisRatio = longestIncreasingSubsequenceLength(ranked) / ranked.length;
    const preservedAdjacentPairs = ranked.slice(0, -1)
      .filter((rank, index) => ranked[index + 1] === rank + 1).length;
    const adjacentRatio = preservedAdjacentPairs / Math.max(1, ranked.length - 1);

    if (lisRatio >= 0.72) {
      failures.push(`${entry.id}: word-order prompt remains too close to answer order (LIS ${lisRatio.toFixed(2)}): (${inner})`);
    }

    if (adjacentRatio >= 0.34) {
      failures.push(`${entry.id}: too many answer-order adjacencies remain (${preservedAdjacentPairs}/${ranked.length - 1}): (${inner})`);
    }
  }
}

if (p4WordOrderCount < 60) {
  failures.push(`P4 word-order coverage unexpectedly low: ${p4WordOrderCount}`);
}


let p4WritingPromptCount = 0;
let p4DoYouThinkCount = 0;
let p4LegacyWritingFormulaCount = 0;
let p4CrossSectionWritingDependencyCount = 0;
const p4WritingModes = new Set();

for (const entry of catalog.filter((item) => {
  const n = Number(item.id.slice(1));
  return n >= 205 && n <= 234;
})) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const writeMatches = [...split.problem.matchAll(/Write about 100 English words\./g)];
  const promptWindows = writeMatches.map((match) => {
    const start = Math.max(0, match.index - 900);
    return split.problem.slice(start, match.index + match[0].length);
  });

  p4WritingPromptCount += promptWindows.length;

  if (/use at least one idea from the reading(?:s)?|problem described in the reading|discussed in the reading/i.test(split.problem)) {
    p4CrossSectionWritingDependencyCount += 1;
    failures.push(`${entry.id}: P4 Q3B should not require evidence from Q1/Q2`);
  }

  for (const prompt of promptWindows) {
    if (/Do you think/i.test(prompt)) p4DoYouThinkCount += 1;
    if (/State your position, explain your reason/i.test(prompt)) {
      p4LegacyWritingFormulaCount += 1;
    }

    if (/priority over|address first|Which one of these problems/i.test(prompt)) {
      p4WritingModes.add("priority");
    }
    if (/Under what conditions|conditions should/i.test(prompt)) {
      p4WritingModes.add("conditional");
    }
    if (/Design |How should|What policy should|What .* rule should|What should the .* require/i.test(prompt)) {
      p4WritingModes.add("design");
    }
    if (/Which design|Which system|Which kinds|compare at least two|better than another/i.test(prompt)) {
      p4WritingModes.add("comparison");
    }
    if (/Where should .* draw the line|when attendance should|when .* should affect/i.test(prompt)) {
      p4WritingModes.add("boundary");
    }
  }
}


let p4ModelAnswerCount = 0;
let p4ModelIThinkCount = 0;
const p4Models = new Map();

for (const entry of catalog.filter((item) => {
  const n = Number(item.id.slice(1));
  return n >= 205 && n <= 234;
})) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const matches = [...split.answer.matchAll(
    /Model (?:answer|writing) \((\d+) words\)\s*\n+([\s\S]*?)(?=\n\n(?:B\d{3}|P4|自己修正|到達目安|---|構成|Planning|Route|3A補正|本番|Final Gate|30日間|解説補強))/g
  )];

  for (const match of matches) {
    p4ModelAnswerCount += 1;
    const declared = Number(match[1]);
    const model = match[2].trim();
    const actual = model.split(/\s+/).filter(Boolean).length;
    p4Models.set(entry.id, model);

    if (/^I think\b/i.test(model)) p4ModelIThinkCount += 1;
    if (declared !== actual) {
      failures.push(`${entry.id}: model word-count label ${declared} does not match actual ${actual}`);
    }
    if (actual < 90 || actual > 110) {
      failures.push(`${entry.id}: model answer length ${actual} is outside 90–110 words`);
    }
  }
}

if (p4ModelAnswerCount !== 23) {
  failures.push(`P4 model answer count changed: ${p4ModelAnswerCount} (expected 23)`);
}
if (p4ModelIThinkCount > 1) {
  failures.push(`P4 model answers reverted toward I-think openings: ${p4ModelIThinkCount}`);
}

for (const [id, required] of Object.entries({
  E208: ["Long commuting time", "lack of sleep"],
  E210: ["ranges", "change behavior", "conditional"],
  E212: ["Design B", "original notice", "omit"],
  E216: ["common exam", "practical assignment", "different forms of evidence"],
  E218: ["System B", "system A", "system C"],
  E225: ["acceptable", "Submitting AI-generated paragraphs", "disclose"],
  E231: ["What caused your most important error", "what will you change", "credit"],
  E234: ["educational purpose", "alternatives or exemptions", "health survey"]
})) {
  const model = p4Models.get(id) ?? "";
  for (const phrase of required) {
    if (!model.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${id}: revised model answer missing required feature: ${phrase}`);
    }
  }
}

for (const id of ["E210", "E216", "E234"]) {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const lesson = parseGenericLesson(raw, id);
  const answerList = lesson.groups.review[0];
  const answerListLines = answerList?.units.flatMap((unit) => unit.lines ?? []) ?? [];
  if (!answerListLines.includes("Writing｜モデル答案はWriting解説参照")) {
    failures.push(`${id}: compact answer-list Writing pointer is missing`);
  }
}

if (p4WritingPromptCount !== 23) {
  failures.push(`P4 writing prompt count changed: ${p4WritingPromptCount} (expected 23)`);
}
if (p4DoYouThinkCount > 1) {
  failures.push(`P4 writing reverted toward Do-you-think repetition: ${p4DoYouThinkCount} prompts`);
}
if (p4LegacyWritingFormulaCount > 1) {
  failures.push(`P4 writing reverted toward position/reason/example boilerplate: ${p4LegacyWritingFormulaCount} prompts`);
}
if (p4WritingModes.size < 5) {
  failures.push(`P4 writing prompt-mode diversity too low: ${[...p4WritingModes].join(", ")}`);
}

for (const entry of catalog.filter((item) => {
  const n = Number(item.id.slice(1));
  return n >= 223 && n <= 234;
})) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const timingArea = split.problem.slice(0, 1800);
  const reviewMinutes = [...timingArea.matchAll(/(?:Final review|Review)\s+(\d+)分/g)]
    .map((match) => Number(match[1]));

  if (!reviewMinutes.length) {
    failures.push(`${entry.id}: full-set timing is missing a final review allocation`);
    continue;
  }

  if (reviewMinutes.some((minutes) => minutes < 5)) {
    failures.push(`${entry.id}: full-set final review fell below 5 minutes: ${reviewMinutes.join("/")}`);
  }
}

const sentinels = {
  E002: {
    review: ["Q1. B", "Q3. C"]
  },
  E210: {
    challenge: ["Part A｜Reading", "Part B｜Word Order"],
    writing: ["Part C｜Writing"],
    review: ["4 完成"]
  },
  E216: {
    challenge: ["Part 1｜Reading A", "Part 2｜Reading B", "Part 3｜Q3A Word Order"],
    writing: ["Part 4｜Q3B Writing"],
    review: ["9 完成", "10 完成", "11 完成"]
  },
  E234: {
    challenge: ["Part 1｜Reading A", "Part 2｜Reading B", "Part 3｜Q3A Word Order"],
    writing: ["Part 4｜Q3B Writing"],
    review: ["10 完成", "11 完成", "12 完成"]
  }
};

for (const [id, roles] of Object.entries(sentinels)) {
  const entry = generic.find((item) => item.id === id);
  if (!entry) {
    failures.push(`${id}: sentinel lesson missing from generic catalog`);
    continue;
  }

  const raw = fs.readFileSync(entry.filePath, "utf8");
  const lesson = parseGenericLesson(raw, entry.id);

  for (const [role, expectedTitles] of Object.entries(roles)) {
    const actualTitles = lesson.groups[role].map((section) => section.title);
    for (const title of expectedTitles) {
      if (!actualTitles.includes(title)) {
        failures.push(`${id}: sentinel ${role} heading not split/classified: ${title}`);
      }
    }
  }
}


const e002Entry = generic.find((item) => item.id === "E002");
if (e002Entry) {
  const e002Lesson = parseGenericLesson(fs.readFileSync(e002Entry.filePath, "utf8"), "E002");
  const answerKey = e002Lesson.groups.review.find((section) => section.title === "解答一覧");
  const answerKeyLines = answerKey?.units.flatMap((unit) => unit.lines ?? []) ?? [];

  if (e002Lesson.groups.review[0]?.title !== "解答一覧") {
    failures.push("E002: answer list is not first in REVIEW");
  }
  if (!answerKey || !answerKeyLines.length) {
    failures.push("E002: answer list is empty");
  }

  for (const prefix of ["Q1｜B", "Q2｜", "Q3｜C", "Q4｜B", "Nuance 1｜from", "Nuance 2｜in", "Nuance 3｜contribute to", "Guided Writing｜"]) {
    if (!answerKeyLines.some((line) => line.startsWith(prefix))) {
      failures.push(`E002: answer list missing ${prefix}`);
    }
  }
}


const e002ReviewKinds = new Map(
  parseGenericLesson(fs.readFileSync(e002Entry.filePath, "utf8"), "E002").groups.review
    .map((section) => [section.title, reviewPresentation(section.title)])
);

for (const [title, expectedKind, expectedLabel] of [
  ["Q1. B", "question", "設問解説"],
  ["Q4. B", "question", "設問解説"],
  ["本文の因果骨格", "learning", "本文整理"],
  ["LEXG003｜Pre-solveの整理と本文での因果の強さ", "learning", "表現整理"],
  ["LEXG195 Review", "learning", "表現整理"],
  ["解説補強｜Core recap", "learning", "思考・転用"]
]) {
  const actual = e002ReviewKinds.get(title);
  if (!actual || actual.kind !== expectedKind || actual.label !== expectedLabel) {
    failures.push(`E002: review presentation mismatch for ${title}: ${JSON.stringify(actual)}`);
  }
}


for (const [id, expectedPrefixes] of Object.entries({
  E210: ["1｜", "2｜", "3｜A", "4｜3番目 because publishing it / 5番目 the behavior", "Writing｜"],
  E216: ["1｜", "4｜C → B → D → A", "9｜3番目 prior preference / 5番目 what the system", "10｜3番目 when people learn / 5番目 the metric", "11｜3番目 a metric rises / 5番目 the learning", "Writing｜"],
  E234: ["1｜", "5｜B → D → A → C", "10｜3番目 treatment-driven changes / 5番目 reliably predict", "11｜3番目 from an average level / 5番目 the timing of exposure", "12｜3番目 what a measure represents / 5番目 what important information", "Writing｜"]
})) {
  const entry = generic.find((item) => item.id === id);
  const lesson = parseGenericLesson(fs.readFileSync(entry.filePath, "utf8"), id);
  const answerList = lesson.groups.review[0];
  const answerListLines = answerList?.units.flatMap((unit) => unit.lines ?? []) ?? [];

  if (answerList?.title !== "解答一覧") {
    failures.push(`${id}: answer list is not first in REVIEW`);
    continue;
  }

  for (const prefix of expectedPrefixes) {
    if (!answerListLines.some((line) => line.startsWith(prefix))) {
      failures.push(`${id}: answer list missing ${prefix}`);
    }
  }
}


const p4PresentationIds = Array.from({ length: 30 }, (_, index) =>
  `E${String(index + 205).padStart(3, "0")}`
);

for (const id of p4PresentationIds) {
  const entry = catalog.find((item) => item.id === id);
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const lesson = parseGenericLesson(raw, id);
  const answerList = lesson.groups.review[0];
  const answerListLines = answerList?.units.flatMap((unit) => unit.lines ?? []) ?? [];

  if (answerList?.title !== "解答一覧") {
    failures.push(`${id}: P4 answer list is not first in REVIEW`);
    continue;
  }

  const completedItems = [...split.answer.matchAll(
    /(?:^|\n)(\d+)\s*完成\s*\n(?:\s*\n)*[^\n]+\n(?:\s*\n)*3番目[:：]\s*([^\n]+)\n(?:\s*\n)*5番目[:：]\s*([^\n]+)/g
  )];

  for (const match of completedItems) {
    const expected = `${match[1]}｜3番目 ${match[2].trim()} / 5番目 ${match[3].trim()}`;
    if (!answerListLines.includes(expected)) {
      failures.push(`${id}: answer-list word-order key is not synchronized: ${expected}`);
    }
  }

  const modelSections = lesson.groups.review.filter((section) =>
    /^(?:Model answer|Model writing|Model output|モデル答案|モデル$)/i.test(section.title)
  );

  if (modelSections.length && !answerListLines.includes("Writing｜モデル答案はWriting解説参照")) {
    failures.push(`${id}: P4 answer list is missing Writing explanation pointer`);
  }

  for (const model of modelSections) {
    const presentation = reviewPresentation(model.title);
    if (presentation.kind !== "writing" || presentation.label !== "Writing解説") {
      failures.push(`${id}: model writing presentation mismatch: ${JSON.stringify(presentation)}`);
    }
  }
}

const e208PageText = fs.readFileSync(
  new URL("../src/pages/e208.astro", import.meta.url),
  "utf8"
);
if (e208PageText.includes('Model answer (95 words)')) {
  failures.push("E208 dedicated viewer hard-codes a stale 95-word model-answer heading");
}

const p4PresentationChecks = {
  E210: [
    ["1｜解答例", "question", "設問解説"],
    ["Model writing (103 words)", "writing", "Writing解説"],
    ["B035 Checkpoint", "learning", "実戦チェック"],
    ["自己修正", "learning", "振り返り"],
    ["到達目安", "learning", "到達判定"],
    ["思考の再利用", "learning", "思考・転用"]
  ],
  E216: [
    ["9 完成", "question", "設問解説"],
    ["Model answer (104 words)", "writing", "Writing解説"],
    ["B036 Checkpoint", "learning", "実戦チェック"],
    ["自己修正", "learning", "振り返り"],
    ["到達目安", "learning", "到達判定"],
    ["思考の再利用", "learning", "思考・転用"]
  ],
  E234: [
    ["10 完成", "question", "設問解説"],
    ["Model answer (101 words)", "writing", "Writing解説"],
    ["P4 Final Gate 判定", "learning", "到達判定"],
    ["30日間の最終固定", "learning", "本番手順"],
    ["自己修正", "learning", "振り返り"],
    ["Final Gate｜Q3Bの読み方", "question", "設問解説"],
    ["考え方", "learning", "思考・転用"],
    ["思考の再利用", "learning", "思考・転用"]
  ]
};

for (const [id, checks] of Object.entries(p4PresentationChecks)) {
  const entry = generic.find((item) => item.id === id);
  const lesson = parseGenericLesson(fs.readFileSync(entry.filePath, "utf8"), id);
  const reviewKinds = new Map(
    lesson.groups.review.map((section) => [section.title, reviewPresentation(section.title)])
  );

  for (const [title, expectedKind, expectedLabel] of checks) {
    const actual = reviewKinds.get(title);
    if (!actual || actual.kind !== expectedKind || actual.label !== expectedLabel) {
      failures.push(`${id}: review presentation mismatch for ${title}: ${JSON.stringify(actual)}`);
    }
  }
}



function parsedLesson(id) {
  const entry = catalog.find((item) => item.id === id);
  if (!entry) throw new Error(`missing lesson ${id}`);
  return parseGenericLesson(fs.readFileSync(entry.filePath, "utf8"), id);
}

function writingBody(section) {
  return [
    section?.title ?? "",
    ...(section?.units ?? []).flatMap((unit) => [
      unit.title ?? "",
      ...(unit.lines ?? []),
      ...(unit.blocks ?? []).flatMap((block) => block.lines ?? [])
    ])
  ].filter(Boolean).join(" ");
}

function reviewBody(section) {
  return (section?.units ?? [])
    .flatMap((unit) => [
      unit.title ?? "",
      ...(unit.lines ?? []),
      ...(unit.blocks ?? []).flatMap((block) => block.lines ?? [])
    ])
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function englishWordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text) {
  return (text.match(/[.!?](?=\s|$)/g) ?? []).length;
}

function reviewSection(id, titles) {
  const wanted = Array.isArray(titles) ? titles : [titles];
  return parsedLesson(id).groups.review.find((section) => wanted.includes(section.title));
}

// P1 should stay compact after the October route compression: complete arguments,
// but not P2/P3-length model essays.
for (const id of P1_ACCELERATED_IDS) {
  const model = reviewSection(id, ["モデル答案", "モデル"]);
  const text = reviewBody(model);
  const words = englishWordCount(text);
  if (!model) {
    failures.push(`${id}: accelerated P1 lesson has no model answer section`);
  } else if (words < 20 || words > 65) {
    failures.push(`${id}: P1 model answer length ${words} is outside compact 20–65-word range`);
  }
}

// Representative staircase from paragraph writing to entrance-exam-length writing.
{
  const e053 = reviewSection("E053", "モデル");
  const text = reviewBody(e053);
  const words = englishWordCount(text);
  const sentences = sentenceCount(text);
  if (!e053 || words < 45 || words > 80 || sentences !== 4) {
    failures.push(`E053: expected a four-sentence transitional model (words=${words}, sentences=${sentences})`);
  }
}

for (const [id, title, minWords, maxWords] of [
  ["E085", "Model answer", 60, 80],
  ["E086", "Model answer", 80, 100],
  ["E087", "Model answer", 90, 110],
  ["E097", "Model answer", 100, 120]
]) {
  const model = reviewSection(id, title);
  const words = englishWordCount(reviewBody(model));
  if (!model || words < minWords || words > maxWords) {
    failures.push(`${id}: model-gradient milestone ${words} words, expected ${minWords}–${maxWords}`);
  }
}

{
  const e096Titles = parsedLesson("E096").groups.review.map((section) => section.title);
  if (!e096Titles.includes("Japanese Output｜解答例")) {
    failures.push("E096: Japanese Output is still merged into Model summary");
  }
}

for (const title of ["モデル答案", "モデル", "Model English summary", "Model judgment", "Model evaluation"]) {
  const presentation = reviewPresentation(title);
  if (presentation.kind !== "writing" || presentation.label !== "Writing解説") {
    failures.push(`review presentation mismatch for model heading ${title}: ${JSON.stringify(presentation)}`);
  }
}

for (const [id, title, requiredText] of [
  ["E001", "Mini Writing", "2〜3文"],
  ["E053", "Short Writing", "4-sentence paragraph"],
  ["E085", "Writing Task", "60–80 English words"],
  ["E086", "Writing Task", "80–100 English words"],
  ["E087", "Writing Task", "90–110 English words"],
  ["E097", "Writing Task", "100–120 English words"]
]) {
  const lesson = parsedLesson(id);
  const section = lesson.groups.writing.find((item) => item.title === title);
  const body = writingBody(section);
  if (!section || !body.includes(requiredText)) {
    failures.push(`${id}: writing-gradient milestone missing ${title} / ${requiredText}`);
  }
}

const advancedWritingPairs = {
  E141: "Judgment Writing",
  E144: "Proposal Writing",
  E147: "Evaluation Writing",
  E150: "Proposal Writing",
  E153: "Evaluation Writing",
  E156: "Proposal Writing",
  E159: "Evaluation Writing",
  E162: "Proposal Writing",
  E165: "Evaluation Writing",
  E168: "Proposal Writing",
  E171: "Evaluation Writing",
  E174: "Proposal Writing",
  E177: "Evaluation Writing",
  E180: "Proposal Writing",
  E183: "Trade-off Writing",
  E186: "Trade-off Writing",
  E189: "Evaluation Writing",
  E192: "Evaluation Writing",
  E195: "Summary-linked Writing",
  E198: "Text-linked Writing",
  E202: "Evaluation Writing",
  E204: "Final Writing"
};

for (const [id, secondTitle] of Object.entries(advancedWritingPairs)) {
  const titles = parsedLesson(id).groups.writing.map((section) => section.title);
  if (!titles.includes("English Summary") || !titles.includes(secondTitle)) {
    failures.push(`${id}: advanced P3 dual-output structure not split: ${titles.join(" / ")}`);
  }
}

// Late P3 should visibly model two different output operations:
// compress the source, then make a judgment/proposal/evaluation.
for (const [id, secondTask] of Object.entries(advancedWritingPairs)) {
  const lesson = parsedLesson(id);
  const summary = lesson.groups.review.find((section) =>
    ["Model English summary", "Model summary"].includes(section.title)
  );
  const expectedSecondTitle =
    secondTask === "Judgment Writing"
      ? "Model judgment"
      : secondTask === "Evaluation Writing"
        ? "Model evaluation"
        : "Model writing";
  const second = lesson.groups.review.find((section) => section.title === expectedSecondTitle);
  const summaryWords = englishWordCount(reviewBody(summary));
  const secondWords = englishWordCount(reviewBody(second));

  if (!summary || summaryWords < 50 || summaryWords > 85) {
    failures.push(`${id}: late-P3 model summary not independently calibrated (words=${summaryWords})`);
  }
  if (!second || secondWords < 70 || secondWords > 110) {
    failures.push(`${id}: late-P3 second model not independently calibrated: ${expectedSecondTitle} / ${secondWords} words`);
  }
}


const p4PlanningLessons = ["E208", "E212", "E218"];
for (const id of p4PlanningLessons) {
  const titles = parsedLesson(id).groups.writing.map((section) => section.title);
  if (!titles.includes("Planning")) {
    failures.push(`${id}: expected explicit P4 planning scaffold missing`);
  }
}

for (const id of ["E219", "E222", "E228", "E234"]) {
  const titles = parsedLesson(id).groups.writing.map((section) => section.title);
  if (titles.includes("Planning")) {
    failures.push(`${id}: late P4 should not regain explicit Planning scaffold`);
  }
}



const p4CompactAnswerJapanese = /[ぁ-んァ-ヶ一-龯]/;
for (const id of p4PresentationIds) {
  const entry = catalog.find((item) => item.id === id);
  const lesson = parseGenericLesson(fs.readFileSync(entry.filePath, "utf8"), id);
  const answerList = lesson.groups.review[0];
  const answerListLines = answerList?.units.flatMap((unit) => unit.lines ?? []) ?? [];

  for (const line of answerListLines) {
    const match = line.match(/^(\d+)｜(.+)$/);
    if (!match) continue;
    const value = match[2].trim();
    if (
      p4CompactAnswerJapanese.test(value)
      && value.length > 34
      && !/^3番目(?:\s|$)/.test(value)
      && !/設問解説参照/.test(value)
    ) {
      failures.push(`${id}: P4 compact answer list contains a long Japanese response instead of a pointer: ${line}`);
    }
  }
}

const dedicatedNavigation = {
  e001: ["/", "/e002/"],
  e049: ["/e048/", "/", "/e050/"],
  e087: ["/e086/", "/", "/e088/"],
  e097: ["/e096/", "/", "/e098/"],
  e145: ["/e144/", "/", "/e146/"],
  e193: ["/e192/", "/", "/e194/"],
  e205: ["/e204/", "/", "/e206/"],
  e208: ["/e207/", "/", "/e209/"]
};

for (const [page, expectedHrefs] of Object.entries(dedicatedNavigation)) {
  const pageText = fs.readFileSync(
    new URL(`../src/pages/${page}.astro`, import.meta.url),
    "utf8"
  );
  const nav = pageText.match(/<nav class="nav-row" aria-label="教材ナビゲーション">([\s\S]*?)<\/nav>/)?.[1] ?? "";
  const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  if (JSON.stringify(hrefs) !== JSON.stringify(expectedHrefs)) {
    failures.push(`${page}: dedicated navigation should be adjacent lessons: ${hrefs.join(" | ")}`);
  }
}

const genericViewText = fs.readFileSync(
  new URL("../src/components/GenericLessonView.astro", import.meta.url),
  "utf8"
);
for (const required of [
  "review-cluster-question",
  "review-cluster-writing",
  "review-cluster-learning"
]) {
  if (!genericViewText.includes(required)) {
    failures.push(`generic viewer progressive REVIEW disclosure missing ${required}`);
  }
}
if (genericViewText.includes("<LessonSections sections={groups.review} answer />")) {
  failures.push("generic viewer reverted to fully expanded REVIEW");
}
if (!genericViewText.includes("toLearnerLessonNumber")) {
  failures.push("generic viewer does not sanitize learner-facing lesson numbers");
}
if (
  !genericViewText.includes("learnerTimingMeta")
  || genericViewText.includes('class="lesson-meta">目安{minutes}分')
) {
  failures.push("generic viewer reverted to vague total-minute timing");
}

const lessonSectionsText = fs.readFileSync(
  new URL("../src/components/LessonSections.astro", import.meta.url),
  "utf8"
);
if (
  !lessonSectionsText.includes("toLearnerTimingText")
  || !lessonSectionsText.includes("答え・解説はタイマーを止めてから")
) {
  failures.push("lesson timing no longer separates timed practice from review");
}
if (
  genericViewText.includes("<strong>{id}</strong>")
  || genericViewText.includes("{previous.id}</a>")
  || genericViewText.includes("{next.id} →")
) {
  failures.push("generic viewer exposes internal E lesson codes");
}

const globalCssText = fs.readFileSync(
  new URL("../src/styles/global.css", import.meta.url),
  "utf8"
);
if (!globalCssText.includes('"BIZ UDPMincho", sans-serif')) {
  failures.push("UI font stack lost Japanese webfont fallback");
}


const indexPageText = fs.readFileSync(
  new URL("../src/pages/index.astro", import.meta.url),
  "utf8"
);
for (const required of [
  "初見の入試問題に、自力で対応できるようになる",
  "長い英文を読み、必要な情報を選び、問いに合わせて考え",
  "読む",
  "考える",
  "まとめる",
  "書く",
  "教材番号から開く",
  "問題の考え方を見る",
  "1回 約45〜50分",
  "1回 約50〜55分",
  "1回 約55〜60分",
  "本編",
  "99回で、初見問題に対応する力を作る",
  "読む・考える土台を作る",
  "読んだ情報から答案を作る",
  "初見問題でも使い切る",
  "ここまでで本編完成",
  "志望校対策｜必要な人だけ",
  "筑波大医学類を受けるなら、最後の30日で形式に合わせる",
  "筑波大医学類 30日仕上げ",
  "追加練習を探す",
  "全教材を見る",
  "教材1〜234"
]) {
  if (!indexPageText.includes(required)) {
    failures.push(`index learner entry is missing: ${required}`);
  }
}
for (const forbidden of [
  "学習を始める",
  "4段階で仕上げる",
  "文の論理をつくる",
  "まとまりのある英文を書く",
  "資料を読み取って書く",
  "筑波大形式で仕上げる",
  "まず1回やる",
  "初めて使う",
  "初めて使うなら",
  "E001から始める",
  "最初の教材を開く",
  "途中から続ける",
  "教材一覧",
  "学習段階から教材を開く",
  "補修・全教材",
  "E001〜E234",
  "E205から始める",
  "例：E086",
  "学習ロードマップ",
  "教材はこの順に進む",
  "各段階の教材を見る",
  "30日対策へ",
  "筑波30日",
  "本番形式を120分で回す",
  "P1短縮ルート",
  "P2短縮ルート",
  "P3短縮ルート",
  "Representative lessons",
  "代表教材",
  "Mobile lesson viewer",
  "canonical教材",
  "全234教材。bundle",
  "October accelerated route"
]) {
  if (indexPageText.includes(forbidden)) {
    failures.push(`index learner entry exposes authoring language: ${forbidden}`);
  }
}
if (/<details class="core-route-details"[^>]*\sopen(?:\s|=|>)/.test(indexPageText)) {
  failures.push("index core routes should be collapsed initially");
}

if (
  !indexPageText.includes('class="core-route-stage"')
  || !indexPageText.includes("route.practice")
  || !indexPageText.includes("route.goal")
  || !indexPageText.includes("通常ルート {route.count}回")
  || !indexPageText.includes("できるようになる")
) {
  failures.push("index learning-stage summaries lost practice/outcome context");
}
if (
  !indexPageText.includes("routes = [")
  || !indexPageText.includes("tsukubaSpecialization")
  || !indexPageText.includes("[...routes, tsukubaSpecialization]")
) {
  failures.push("index no longer separates general curriculum from school-specific specialization");
}
if (!globalCssText.includes("grid-template-columns: 34px minmax(0, 1fr) auto 18px;")) {
  failures.push("index learning-stage summary layout can wrap the disclosure icon into a stray row");
}
if (/<details class="repair-catalog"[^>]*\sopen(?:\s|=|>)/.test(indexPageText)) {
  failures.push("index repair catalog should be collapsed initially");
}

if ((indexPageText.match(/class="entry-primary(?:-button)?"/g) ?? []).length !== 0) {
  failures.push("index should not restore the oversized first-time E001 entry");
}
if (
  !indexPageText.includes("const tsukubaSpecialization")
  || !indexPageText.includes("tsukubaSpecialization.route.map")
) {
  failures.push("index optional Tsukuba specialization is missing");
}
if (
  !indexPageText.includes('id="lesson-jump-form"')
  || !indexPageText.includes("教材1〜234")
  || !indexPageText.includes('placeholder="例：86"')
) {
  failures.push("index learner-facing lesson-number control is missing");
}

const baseLayoutText = fs.readFileSync(
  new URL("../src/layouts/BaseLayout.astro", import.meta.url),
  "utf8"
);
if (!baseLayoutText.includes('<a class="brand" href="/">自由英作文</a>')) {
  failures.push("site header lost learner-facing series identity");
}
if (!baseLayoutText.includes('href="/thinking-tools/">問題の考え方</a>')) {
  failures.push("site header thinking help is not learner-facing");
}
for (const forbidden of ["prototype", "English Curriculum"]) {
  if (baseLayoutText.includes(forbidden)) {
    failures.push(`site header exposes development label: ${forbidden}`);
  }
}

const thinkingToolsPageText = fs.readFileSync(
  new URL("../src/pages/thinking-tools.astro", import.meta.url),
  "utf8"
);
for (const required of [
  "問題の考え方",
  "どの問題でも、5つの順番で考える",
  "今どこで止まった？",
  "困り方から開く",
  "考え方を全部見る"
]) {
  if (!thinkingToolsPageText.includes(required)) {
    failures.push(`thinking help is missing learner-first guidance: ${required}`);
  }
}
for (const forbidden of [
  "各Eで実際に使った考え方",
  "全部を毎回使う必要はありません"
]) {
  if (thinkingToolsPageText.includes(forbidden)) {
    failures.push(`thinking help reverted to abstract tool-library framing: ${forbidden}`);
  }
}

for (const page of Object.keys(dedicatedNavigation)) {
  const pageText = fs.readFileSync(
    new URL(`../src/pages/${page}.astro`, import.meta.url),
    "utf8"
  );
  if (!pageText.includes("learnerTimingMeta")) {
    failures.push(`${page}: dedicated page reverted to vague total-minute timing`);
  }
}

const samples = ["E002", "E042", "E086", "E120", "E204", "E207", "E210", "E216", "E234"];
console.log(`[generic-audit] corpus=${catalog.length}, dedicated=8, generic=${generic.length}`);
console.log(`[generic-audit] p1Accelerated=${P1_ACCELERATED_IDS.length}, p1Optional=${p1OptionalIds.length}`);
console.log(`[generic-audit] p2Accelerated=${P2_ACCELERATED_IDS.length}, p2Optional=${p2OptionalIds.length}, p1p2Core=${P1_ACCELERATED_IDS.length + P2_ACCELERATED_IDS.length}`);
console.log(`[generic-audit] p3Accelerated=${P3_ACCELERATED_IDS.length}, p3Optional=${p3OptionalIds.length}, preP4Core=${P1_ACCELERATED_IDS.length + P2_ACCELERATED_IDS.length + P3_ACCELERATED_IDS.length}`);
console.log(`[generic-audit] core99Writing=${core99WritingCount}, substantial=${core99SubstantialWritingCount}, summaries=${core99SummaryOutputCount}, rawSkills=${core99RawCodes.size}/${allRawCodes.size}`);
console.log("[generic-audit] core99 workload guardrails=PASS");
console.log(`[generic-audit] p1CoreReviewTailChars=${p1CoreReviewTailChars}`);
console.log(`[generic-audit] p4Writing=${p4WritingPromptCount}, modes=${[...p4WritingModes].join(",")}, doYouThink=${p4DoYouThinkCount}, legacyFormula=${p4LegacyWritingFormulaCount}, crossSectionDeps=${p4CrossSectionWritingDependencyCount}`);
console.log("[generic-audit] p4 full-set review floor=PASS");
console.log("[generic-audit] p4 presentation hierarchy=PASS");
console.log("[generic-audit] viewer UX guardrails=PASS");
console.log("[generic-audit] index entry UX guardrails=PASS");
console.log(`[generic-audit] p4Models=${p4ModelAnswerCount}, iThinkOpenings=${p4ModelIThinkCount}`);
for (const id of samples) {
  console.log(`[generic-audit] ${id} ${JSON.stringify(summaries.get(id) ?? null)}`);
}

if (failures.length) {
  console.error(`[generic-audit] failures=${failures.length}`);
  for (const failure of failures) console.error(`[generic-audit][fail] ${failure}`);
  process.exit(1);
}

console.log("[generic-audit] PASS");
