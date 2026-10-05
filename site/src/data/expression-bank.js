import fs from "node:fs";
import path from "node:path";

// Reads management/expression-bank.csv (canonical data) at build time.
// Same cwd-relative convention as lesson-catalog.js (cwd = site/).
function bankPath() {
  return path.resolve(process.cwd(), "../management/expression-bank.csv");
}

// Minimal RFC4180-style parser (quoted fields, escaped quotes, newlines in fields).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

export const expressionGroups = [
  { id: "ANSWER", title: "答える・主張する", lead: "最初の一文で、問いへの答えと理由を出す" },
  { id: "STRENGTH", title: "主張の強さを調整する", lead: "本文や根拠以上に言い切らない" },
  { id: "REASON", title: "理由・結果をつなぐ", lead: "原因から結果・提案へ、一本の筋でつなぐ" },
  { id: "LIMIT", title: "限定・譲歩・対比する", lead: "認めたうえで、範囲や反対を示す" },
  { id: "COMPARE", title: "比較する", lead: "二つ以上を同じ観点で並べる" },
  { id: "SUPPORT", title: "具体化・条件・付け足し", lead: "例・条件・根拠を足して答えを支える" }
];

export function loadExpressions() {
  const [header, ...body] = parseCsv(fs.readFileSync(bankPath(), "utf8"));
  const items = body.map((cells) =>
    Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""]))
  );
  return expressionGroups.map((group) => ({
    ...group,
    items: items.filter((item) => item.function === group.id)
  }));
}
