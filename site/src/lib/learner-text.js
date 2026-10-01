const INTERNAL_FAMILY = "(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)";
const INTERNAL_PREFIX = new RegExp(
  "^" + INTERNAL_FAMILY + "\\d{1,4}(?:\\s*[｜:：]\\s*|\\s+)",
  "i"
);
const INTERNAL_CODE_ANY = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "i");
const INTERNAL_CODE_GLOBAL = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "gi");
const SHORT_INTERNAL_PREFIX = /^(?:P|G|A|B|D)\d{2,4}\s*[｜:：]\s*/i;

export function toLearnerText(text = "") {
  const cleaned = String(text)
    .replace(/^(Q\d+)[｜:：]\s*(?:RQ|RF|WF|SS|TF)\d+\s*$/i, "$1")
    .replace(INTERNAL_PREFIX, "")
    .replace(INTERNAL_CODE_GLOBAL, "")
    .replace(SHORT_INTERNAL_PREFIX, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (cleaned === "弱い考え方との比較") return "弱い例";
  if (cleaned === "次の問題に持っていくもの") return "次へのポイント";
  return cleaned;
}

export function startsWithInternalCode(text = "") {
  const value = String(text).trim();
  return INTERNAL_PREFIX.test(value) || SHORT_INTERNAL_PREFIX.test(value);
}

export function containsInternalCode(text = "") {
  return INTERNAL_CODE_ANY.test(String(text));
}
