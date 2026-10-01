import fs from "node:fs";
import path from "node:path";

const REPRESENTATIVE_IDS = new Set([
  "E001",
  "E049",
  "E087",
  "E097",
  "E145",
  "E193",
  "E205",
  "E208"
]);

function bundleRoot() {
  return path.resolve(process.cwd(), "../bundles");
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n+/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) continue;
    data[pair[1]] = pair[2].trim();
  }
  return data;
}

function stripFrontMatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

function lessonFiles() {
  const root = bundleRoot();
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^B\d{3}$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((bundle) => {
      const dir = path.join(root, bundle.name);
      return fs
        .readdirSync(dir)
        .filter((name) => /^E\d{3}\.md$/.test(name))
        .sort()
        .map((name) => path.join(dir, name));
    });
}

function summaryFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const frontMatter = parseFrontMatter(raw);
  const body = stripFrontMatter(raw);
  const nonEmpty = body.split("\n").map((line) => line.trim()).filter(Boolean);
  const titleLine = nonEmpty[0] ?? "";
  const metaLine = nonEmpty[1] ?? "";
  const id = frontMatter.id || titleLine.match(/^(E\d{3})/)?.[1] || path.basename(filePath, ".md").toUpperCase();
  const title = titleLine.replace(new RegExp("^" + id + "｜?"), "").trim() || id;
  const phase = frontMatter.phase || metaLine.match(/\b(P[1-4])\b/)?.[1] || "";
  const bundle = frontMatter.bundle || path.basename(path.dirname(filePath));
  const minutes =
    Number(frontMatter.core_minutes || 0)
    || Number(metaLine.match(/Core\s*(\d+)/i)?.[1] || 0)
    || Number(metaLine.match(/目安\s*(\d+)分/)?.[1] || 0)
    || null;

  return {
    id,
    slug: id.toLowerCase(),
    title,
    phase,
    bundle,
    minutes,
    filePath,
    representative: REPRESENTATIVE_IDS.has(id)
  };
}

export function getLessonCatalog() {
  return lessonFiles()
    .map(summaryFromFile)
    .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
}

export function getGenericLessonCatalog() {
  return getLessonCatalog().filter((lesson) => !lesson.representative);
}

export function getLessonBySlug(slug) {
  return getLessonCatalog().find((lesson) => lesson.slug === String(slug).toLowerCase()) ?? null;
}

export { REPRESENTATIVE_IDS };
