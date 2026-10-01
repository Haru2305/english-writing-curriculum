import { stripFrontMatter, cleanLine } from "./lesson-source.js";

const ANSWER_MARKERS = [
  "解答・解説・自己修正",
  "解答・解説",
  "Answers and Explanations"
];

function normalize(raw) {
  return raw.replace(/\r\n/g, "\n");
}

function splitAnswer(raw) {
  for (const marker of ANSWER_MARKERS) {
    const index = raw.indexOf(marker);
    if (index >= 0) {
      return {
        problem: raw.slice(0, index),
        answer: raw.slice(index + marker.length)
      };
    }
  }
  return { problem: raw, answer: "" };
}

function isHeading(line, side = "problem") {
  const text = cleanLine(line);
  if (!text) return false;
  if (/^#{2,3}\s+/.test(line)) return true;
  if (text.length > 110) return false;

  // A time-allocation line can begin with a section name (e.g. "Reading 20分 / ...")
  // but is content of 時間配分, not a new heading.
  if (/\d+\s*分/.test(text) && /\s\/\s|＝/.test(text)) return false;

  if (side === "answer") {
    if (/^(?:Q\d+|\d+)\s*(?:[｜:：.]\s*|\s+)(?:解答例|解答|完成|[A-D](?:\b|\s)|[A-D]\s+.+)/i.test(text)) return true;
  }

  if (side === "answer" && /^(?:本文の(?:因果骨格|骨格|Why this word\?)|P\d Final Gate|Pass standard|30日間の最終固定)/i.test(text)) {
    return true;
  }

  return /^(?:(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)\d{1,4}(?:\s*[｜:：]|\s+)|今日の狙い|この回のルール|時間配分|まず確認|Reference(?: card)?|Pre-solve|Gloss(?:\s*\/|\b)|Transfer Guide|P\d Strategy|Strategy|Unknown-concept strategy|Reading(?:\s|$)|Passage(?:\s|$)|Context(?:\s|$)|Ordering(?:\s|$)|解答方法|Syntax Audit|Text\s+[A-Z](?:\s*[｜:])|Part\s+(?:\d+|[A-Z])(?:\s*[｜:])|Questions?(?:\s|$)|Mixed Questions|Context Check|Claim Check|Nuance Check|Language Focus|Candidate Sentence|Data Table|Table$|Internal Memo|Dense Sentence|Prompt|Planning|Plan→Draft→Revise|Revision Check|Self-check|Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing|Model answer|Model output|Model short output|Model writing|Model summary|Reading answers|Self-correction|自己修正|到達目安|構成|論証の共通回路|自己採点|思考の再利用|解説補強|Bundle\s*\d+(?:で確認したこと)?|P4 Final Gate Check|B\d{3} Checkpoint)/i.test(text);
}

function sectionRole(title, side = "problem") {
  const text = cleanLine(title);

  if (side === "answer") return "review";

  if (/^(?:今日の狙い|この回のルール|時間配分|Reference(?: card)?|Pre-solve|Gloss|Transfer Guide|P\d Strategy|Strategy|Unknown-concept strategy)/i.test(text)) {
    return "setup";
  }

  if (/^(?:Prompt|Planning|Plan→Draft→Revise|Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing)/i.test(text)
      || /(?:Q3B|Writing|Composition)/i.test(text) && /^Part\s+/i.test(text)) {
    return "writing";
  }

  if (/^(?:Self-check|Revision Check|P4 Final Gate Check)/i.test(text)) {
    return "support";
  }

  return "challenge";
}

function parseSectionLines(bodyLines, side = "problem") {
  const sections = [];
  let section = { title: "", role: side === "answer" ? "review" : "challenge", units: [] };
  let block = [];

  const flushBlock = () => {
    if (!block.length) return;
    section.units.push({ type: "block", lines: block.map(cleanLine).filter(Boolean) });
    block = [];
  };

  const flushSection = () => {
    flushBlock();
    if (section.title || section.units.length) sections.push(section);
    section = { title: "", role: side === "answer" ? "review" : "challenge", units: [] };
  };

  for (const rawLine of bodyLines) {
    const line = rawLine.trim();

    if (!line || line === "---" || /^_+$/.test(line)) {
      flushBlock();
      continue;
    }

    if (isHeading(line, side)) {
      flushSection();
      section.title = cleanLine(line);
      section.role = sectionRole(line, side);
      continue;
    }

    block.push(line);
  }

  flushSection();
  return sections;
}

function parseProblemBody(text) {
  const lines = text.split("\n");
  const nonEmpty = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter((item) => item.line && item.line !== "---" && !/^_+$/.test(item.line));

  if (!nonEmpty.length) {
    return { titleLine: "", metaLine: "", sections: [] };
  }

  const titleItem = nonEmpty[0];
  const metaItem = nonEmpty[1] ?? { line: "", index: titleItem.index };
  return {
    titleLine: titleItem.line,
    metaLine: metaItem.line,
    sections: parseSectionLines(lines.slice(metaItem.index + 1), "problem")
  };
}

function inferTime(metaLine, sections) {
  const meta = metaLine.match(/(?:Core|目安)\s*(\d+)\s*分?/i)?.[1];
  if (meta) return Number(meta);

  const timeSection = sections.find((section) => section.title === "時間配分");
  const line = timeSection?.units?.flatMap((unit) => unit.lines ?? [])[0] ?? "";
  const core = line.match(/Core\s*(\d+)分/i)?.[1];
  return core ? Number(core) : null;
}

export function parseGenericLesson(raw, fallbackId = "Lesson") {
  const body = stripFrontMatter(normalize(raw));
  const split = splitAnswer(body);
  const problem = parseProblemBody(split.problem.trim());
  const answerSections = split.answer.trim()
    ? parseSectionLines(split.answer.trim().split("\n"), "answer")
    : [];

  const id = problem.titleLine.match(/^(E\d{3})/)?.[1] ?? fallbackId;
  const title = problem.titleLine.replace(new RegExp("^" + id + "｜?"), "").trim() || id;

  const groups = {
    setup: problem.sections.filter((section) => section.role === "setup"),
    challenge: problem.sections.filter((section) => section.role === "challenge"),
    writing: problem.sections.filter((section) => section.role === "writing"),
    support: problem.sections.filter((section) => section.role === "support"),
    review: answerSections
  };

  return {
    id,
    title,
    metaLine: problem.metaLine,
    minutes: inferTime(problem.metaLine, problem.sections),
    groups,
    hasWriting: groups.writing.length > 0,
    hasReview: groups.review.length > 0
  };
}
