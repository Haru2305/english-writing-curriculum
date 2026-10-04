#!/usr/bin/env python3
"""Extract model answers / alternative answers from bundles/B*/E*.md.

Output: CSV with lesson_id, kind (model|alt), text, word_count.

Heuristic: a block starts at a line that is exactly one of the markers below and
continues over the following lines while they are English-only (no Japanese
characters) and look like prose (>= 6 words).
Usage: python3 management/scripts/extract_model_answers.py [out.csv] [lesson_prefix]
"""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
JA = re.compile(r"[\u3040-\u30ff\u3400-\u9fff]")
# Heading variants seen in bundles: "Model answer (99 words)", "Model writing",
# "Model summary", "Model English summary", "モデル答案", "モデル", "別解", "別解：", "解答例：" ...
MODEL_HEADING = re.compile(
    r"^(?:#+\s*)?(?:Model\s+(?!Japanese)[A-Za-z ]{1,30}?(?:\s*\(\d+\s*words?\))?|モデル(?:答案)?|解答例)\s*[：:]?\s*$"
)
ALT_HEADING = re.compile(r"^(?:#+\s*)?(?:別解|Alternative answer)\s*[：:]?\s*$")


def heading_kind(line: str):
    s = line.strip()
    if ALT_HEADING.match(s):
        return "alt"
    if MODEL_HEADING.match(s):
        return "model"
    return None


def is_prose(line: str) -> bool:
    s = line.strip()
    return bool(s) and not JA.search(s) and len(s.split()) >= 6


def extract(path: Path):
    lines = path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        kind = heading_kind(lines[i])
        if kind:
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            block = []
            while j < len(lines) and is_prose(lines[j]):
                block.append(lines[j].strip())
                j += 1
            if block:
                yield kind, " ".join(block)
            i = j
        else:
            i += 1


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "management" / "model-answers-extracted.csv"
    prefix = sys.argv[2] if len(sys.argv) > 2 else ""
    rows = []
    for path in sorted(ROOT.glob("bundles/B*/E*.md")):
        if not path.stem.startswith(prefix):
            continue
        for kind, text in extract(path):
            rows.append({
                "lesson_id": path.stem,
                "kind": kind,
                "word_count": len(text.split()),
                "text": text,
            })
    with out.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["lesson_id", "kind", "word_count", "text"])
        w.writeheader()
        w.writerows(rows)
    lessons = {r["lesson_id"] for r in rows}
    print(f"{len(rows)} blocks from {len(lessons)} lessons -> {out}")


if __name__ == "__main__":
    main()
