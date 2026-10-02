const INTERNAL_FAMILY = "(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)";
const INTERNAL_PREFIX = new RegExp(
  "^" + INTERNAL_FAMILY + "\\d{1,4}(?:\\s*[｜:：]\\s*|\\s+)",
  "i"
);
const INTERNAL_CODE_ANY = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "i");
const INTERNAL_CODE_GLOBAL = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "gi");
const SHORT_INTERNAL_PREFIX = /^(?:P|G|A|B|D)\d{2,4}\s*[｜:：]\s*/i;

function learnerCurriculumLabels(text = "") {
  return String(text)
    // Checkpoint / gate labels in lesson titles and REVIEW headings.
    .replace(/筑波\s*P4\s+Final\s+Gate/gi, "筑波 最終チェック")
    .replace(/筑波\s*B\d{3}\s+Checkpoint/gi, "筑波 チェック回")
    .replace(/P[1-4]\s+Final\s+Checkpoint/gi, "最終チェック")
    .replace(/P[1-4]\s+Final\s+Gate(?:\s+Check)?/gi, "最終チェック")
    .replace(/P2\s+Bridge\s+\d+\s+Checkpoint/gi, "チェック回")
    .replace(/Bundle\s+\d+\s+Checkpoint/gi, "チェック回")
    .replace(/B\d{3}\s+Checkpoint/gi, "チェック回")
    .replace(/Bundle\s+\d+で確認したこと/gi, "このチェック回までに確認したこと")
    .replace(/P3\s+Strategy/gi, "実戦の方針")
    .replace(/Final\s+Gate/gi, "最終チェック")
    .replace(/\bCheckpoint\b/gi, "チェック回")

    // Bundle codes are authoring structure, never learner identity.
    .replace(/With\s+B\d{3}\s*:/gi, "ここまでの内容と合わせて：")
    .replace(/B\d{3}\s*\+\s*B\d{3}/gi, "ここまでの2段階")
    .replace(/B\d{3}で扱った/g, "これまでに扱った")
    .replace(/B\d{3}で導入した/g, "ここまでで導入した")
    .replace(/B\d{3}以降/g, "次の段階以降")
    .replace(/B\d{3}へ/g, "次の段階へ")
    .replace(/B\d{3}より/g, "それまでより")
    .replace(/B\d{3}最終日/g, "この段階の最終日")
    .replace(/B\d{3}の/g, "この段階の")
    .replace(/B\d{3}では/g, "この段階では")
    .replace(/B\d{3}\s*\/\s*(Day\s*\d+)/gi, "$1")
    .replace(/\bB\d{3}\b/g, "この段階")
    .replace(/Bundle\s+\d+/gi, "この段階")

    // Phase codes are replaced only in contexts that clearly refer to curriculum stages.
    // Plain P1/P2/P3/P4 paragraph locators remain untouched.
    .replace(/\bP1(?=で|では|へ|の|以降|完了|序盤|本体|最初|移行)/g, "基礎")
    .replace(/\bP2(?=で|では|へ|の|以降|完了|序盤|本体|最初|移行)/g, "構成・要約")
    .replace(/\bP3(?=で|では|へ|の|以降|完了|序盤|本体|最初|移行)/g, "実戦")
    .replace(/\bP4(?=で|では|へ|の|以降|完了|序盤|本体|最初|移行)/g, "筑波30日対策")
    .replace(/\bP1\s+Repair\b/gi, "基礎の補修")
    .replace(/\bP2\s+Repair\b/gi, "構成・要約の補修")
    .replace(/\bP3\s+Repair\b/gi, "実戦の補修")
    .replace(/\bP4\s+Repair\b/gi, "筑波30日対策の補修")
    .replace(/\bP2\s+lexical nuance/gi, "この段階の lexical nuance")
    .replace(/\bP[1-4]\s+Final\s+Plan/gi, "最終プラン");
}

export function toLearnerText(text = "") {
  const cleaned = learnerCurriculumLabels(text)
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
