export function stripFrontMatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

export function splitAtMarker(raw, marker) {
  const index = raw.indexOf(marker);
  if (index < 0) throw new Error(`Answer marker not found: ${marker}`);
  return {
    problem: raw.slice(0, index),
    answer: raw.slice(index + marker.length)
  };
}

export function cleanLine(line) {
  return line.replace(/^#{2,3}\s+/, "").replace(/\*\*/g, "").trim();
}

export function takeHeader(text, fallbackId = "Lesson") {
  const lines = text.split("\n");
  const nonEmpty = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter((item) => item.line);

  const titleItem = nonEmpty[0] ?? { line: fallbackId, index: 0 };
  const metaItem = nonEmpty[1] ?? { line: "", index: titleItem.index };

  return {
    titleLine: titleItem.line,
    metaLine: metaItem.line,
    bodyLines: lines.slice(metaItem.index + 1)
  };
}

export function parseSections(lines, { sectionNames = [], sectionMatcher, subgroupMatcher } = {}) {
  const names = new Set(sectionNames);
  const sections = [];
  let section = { title: "", units: [] };
  let subgroup = null;
  let block = [];

  const isSection = (line) =>
    line.startsWith("## ")
    || names.has(line)
    || Boolean(sectionMatcher?.(line));

  const isSubgroup = (line) =>
    line.startsWith("### ")
    || Boolean(subgroupMatcher?.(line));

  const flushBlock = () => {
    if (!block.length) return;
    const unit = { type: "block", lines: block.map(cleanLine) };
    if (subgroup) subgroup.blocks.push(unit);
    else section.units.push(unit);
    block = [];
  };

  const flushSubgroup = () => {
    flushBlock();
    if (!subgroup) return;
    section.units.push(subgroup);
    subgroup = null;
  };

  const flushSection = () => {
    flushSubgroup();
    if (section.title || section.units.length) sections.push(section);
    section = { title: "", units: [] };
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || /^_+$/.test(line)) {
      flushBlock();
      continue;
    }

    if (isSection(line)) {
      flushSection();
      section.title = cleanLine(line);
      continue;
    }

    if (isSubgroup(line)) {
      flushSubgroup();
      subgroup = { type: "subgroup", title: cleanLine(line), blocks: [] };
      continue;
    }

    block.push(line);
  }

  flushSection();
  return sections;
}

export function findSection(sections, title) {
  return sections.find((section) => section.title === title);
}

export function withoutTitle(section) {
  return section ? { ...section, title: "" } : null;
}

export function flatSectionLines(section) {
  if (!section) return [];
  const lines = [];
  for (const unit of section.units) {
    if (unit.type === "subgroup") {
      for (const block of unit.blocks) lines.push(...block.lines);
    } else {
      lines.push(...unit.lines);
    }
  }
  return lines;
}

export function sectionBlocks(section) {
  if (!section) return [];
  return section.units
    .filter((unit) => unit.type === "block")
    .map((unit) => [...unit.lines]);
}
