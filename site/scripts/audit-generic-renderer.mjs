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


const p1AllIds = Array.from({ length: 42 }, (_, index) =>
  `E${String(index + 1).padStart(3, "0")}`
);
const p1OptionalIds = Object.values(P1_OPTIONAL_BY_BUNDLE).flat();
const p1RouteSet = new Set(P1_ACCELERATED_IDS);
const p1OptionalSet = new Set(p1OptionalIds);
const p1Combined = new Set([...P1_ACCELERATED_IDS, ...p1OptionalIds]);
const p1CheckpointIds = ["E006", "E012", "E018", "E024", "E030", "E036", "E042"];

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
  const split = splitRaw(raw);
  const model = p4Models.get(id) ?? "";
  if (!model || !split.answer.includes(`Writing｜${model}`)) {
    failures.push(`${id}: answer-list Writing is not synchronized with model answer`);
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
  ["解説補強｜考え方を再利用する", "learning", "思考・転用"]
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

const p4PresentationChecks = {
  E210: [
    ["1｜解答例", "question", "設問解説"],
    ["Model writing (103 words)", "question", "設問解説"],
    ["B035 Checkpoint", "learning", "実戦チェック"],
    ["自己修正", "learning", "振り返り"],
    ["到達目安", "learning", "到達判定"],
    ["思考の再利用", "learning", "思考・転用"]
  ],
  E216: [
    ["9 完成", "question", "設問解説"],
    ["Model answer (104 words)", "question", "設問解説"],
    ["B036 Checkpoint", "learning", "実戦チェック"],
    ["自己修正", "learning", "振り返り"],
    ["到達目安", "learning", "到達判定"],
    ["思考の再利用", "learning", "思考・転用"]
  ],
  E234: [
    ["10 完成", "question", "設問解説"],
    ["Model answer (101 words)", "question", "設問解説"],
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


function sectionText(section) {
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

const p1p3ModelInventory = [];

for (const entry of catalog.filter((item) => Number(item.id.slice(1)) <= 204)) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const lesson = parseGenericLesson(raw, entry.id);
  const models = lesson.groups.review.filter((section) =>
    /^(?:Model answer|Model output|Model short output|Model writing|Model summary|モデル答案)/i.test(section.title)
  );

  for (const section of models) {
    const text = sectionText(section);
    if (!text) continue;
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = (text.match(/[.!?](?=\s|$)/g) ?? []).length;
    const features = {
      reason: /\bbecause\b|\bsince\b|\btherefore\b|\bso that\b/i.test(text),
      contrast: /\bhowever\b|\bwhile\b|\balthough\b|\bwhereas\b|\bbut\b/i.test(text),
      qualification: /\bmay\b|\bmight\b|\bunless\b|\bonly if\b|\bdepends? on\b|\bnot necessarily\b/i.test(text),
      example: /\bfor example\b|\bfor instance\b|\bsuch as\b/i.test(text)
    };
    p1p3ModelInventory.push({
      id: entry.id,
      phase: entry.phase,
      title: section.title,
      words,
      sentences,
      features,
      text: text.slice(0, 900)
    });
  }
}


const earlyModelInventory = [];

for (const entry of catalog.filter((item) => Number(item.id.slice(1)) <= 204)) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const split = splitRaw(raw);
  const matches = [...split.answer.matchAll(
    /(?:^|\n)(モデル答案|モデル)\s*\n+([^\n]+(?:\n(?!\s*\n|別解|自己修正|WQ\d+|到達目安|思考の再利用|解説補強)[^\n]+)*)/g
  )];

  for (const match of matches) {
    const model = match[2].replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    if (!/[A-Za-z]/.test(model)) continue;
    const words = model.split(/\s+/).filter(Boolean).length;
    const sentences = (model.match(/[.!?](?=\s|$)/g) ?? []).length;
    earlyModelInventory.push({
      id: entry.id,
      phase: entry.phase,
      title: match[1],
      words,
      sentences,
      reason: /\bbecause\b|\bsince\b|\btherefore\b|\bso that\b/i.test(model),
      contrast: /\bhowever\b|\bwhile\b|\balthough\b|\bwhereas\b|\bbut\b/i.test(model),
      qualification: /\bmay\b|\bmight\b|\bunless\b|\bonly if\b|\bdepends? on\b|\bnot necessarily\b/i.test(model),
      example: /\bfor example\b|\bfor instance\b|\bsuch as\b/i.test(model),
      text: model.slice(0, 900)
    });
  }
}

console.log(`[model-gradient][early] total=${earlyModelInventory.length}`);
for (const record of earlyModelInventory) {
  console.log(`[model-gradient][early-item] ${JSON.stringify(record)}`);
}

console.log(`[model-gradient] total=${p1p3ModelInventory.length}`);
for (const record of p1p3ModelInventory) {
  console.log(`[model-gradient][item] ${JSON.stringify(record)}`);
}

const samples = ["E002", "E042", "E086", "E120", "E204", "E207", "E210", "E216", "E234"];
console.log(`[generic-audit] corpus=${catalog.length}, dedicated=8, generic=${generic.length}`);
console.log(`[generic-audit] p1Accelerated=${P1_ACCELERATED_IDS.length}, p1Optional=${p1OptionalIds.length}`);
console.log(`[generic-audit] p4Writing=${p4WritingPromptCount}, modes=${[...p4WritingModes].join(",")}, doYouThink=${p4DoYouThinkCount}, legacyFormula=${p4LegacyWritingFormulaCount}`);
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
