const INTERNAL_FAMILY = "(?:LEXG|IDEA|ARG|AC|TH|EV|LT|RQ|RF|WF|WQ|WP|WT|SS|TF)";
const INTERNAL_PREFIX = new RegExp(
  "^" + INTERNAL_FAMILY + "\\d{1,4}(?:\\s*[｜:：]\\s*|\\s+)",
  "i"
);
const INTERNAL_CODE_ANY = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "i");
const INTERNAL_CODE_GLOBAL = new RegExp(INTERNAL_FAMILY + "\\d{1,4}", "gi");
const SHORT_INTERNAL_PREFIX = /^(?:P|G|A|B|D)\d{2,4}\s*[｜:：]\s*/i;

function stripAuthoringBodyLabels(text = "") {
  return String(text)
    // Bundle IDs are authoring references, never learner-facing lesson IDs.
    .replace(/\bWith B\d{3}:/gi, "前段階との接続:")
    .replace(/\bB\d{3}\s*\+\s*B\d{3}で/g, "ここまでで")
    .replace(/\bB\d{3}で扱った/g, "以前扱った")
    .replace(/\bB\d{3}で導入した/g, "以前導入した")
    .replace(/\bB\d{3}で再訪した/g, "ここまでで再確認した")
    .replace(/\bB\d{3}で作った/g, "ここまでで作った")
    .replace(/\bB\d{3}の最終日として/g, "この段階の最終日として")
    .replace(/\bB\d{3}のGate/g, "この段階の到達条件")
    .replace(/\bB\d{3}の合格条件/g, "この段階の合格条件")
    .replace(/\bB\d{3}以降/g, "次の段階以降")
    .replace(/\bB\d{3}より/g, "前段階より")
    .replace(/\bB\d{3}では/g, "この段階では")
    .replace(/\bB\d{3}統合/g, "統合確認")
    .replace(/\bB\d{3}最終Gate/g, "この段階の最終確認")
    .replace(/\bB\d{3}\s+Final Check/g, "最終確認")
    .replace(/\bB039\s*\/\s*Day25〜30では/g, "Day25〜30では")
    .replace(/\bB\d{3}\b/g, "")
    // Phase names are removed only in authoring contexts. Bare P1–P4 can mean paragraph numbers.
    .replace(/\bP1で作った/g, "これまでに作った")
    .replace(/\bP2で導入した/g, "前段階で導入した")
    .replace(/\bP2で育てた/g, "ここまでで育てた")
    .replace(/\bP2での/g, "この段階での")
    .replace(/\bP2では/g, "この段階では")
    .replace(/\bP2以降は/g, "ここからは")
    .replace(/\bP2のspeed/g, "ここでのspeed")
    .replace(/\bP2 lexical nuance asks:/g, "Lexical nuance asks:")
    .replace(/次はP2本体で/g, "次は本編で")
    .replace(/\bP2 Final Plan/g, "最終確認の時間配分")
    .replace(/\bP2 Repair/g, "この段階の補修")
    .replace(/\bP3序盤/g, "次の実戦段階")
    .replace(/\bP3移行可能/g, "次の実戦段階へ進める")
    .replace(/\bP3へ進みつつ/g, "次へ進みつつ")
    .replace(/\bP3 Strategy/g, "実戦の進め方")
    .replace(/\bP3では/g, "実戦では")
    .replace(/\bP3最初の/g, "実戦最初の")
    .replace(/\bP3で扱った/g, "ここまでで扱った")
    .replace(/\bP3の最終目標/g, "この段階の最終目標")
    .replace(/\bP3の該当軸/g, "該当する実戦軸")
    .replace(/\bP3 Final Gateで使った/g, "直前の最終確認で使った")
    .replace(/\bP4へ移行可/g, "筑波対策へ進める")
    .replace(/\bP4へ/g, "筑波対策へ")
    .replace(/\bP4完了/g, "筑波30日対策完了")
    // Authoring checkpoint/gate wording.
    .replace(/\bCheckpoint Plan\b/g, "確認回の時間配分")
    .replace(/\bCheckpoint判定\b/g, "到達判定")
    .replace(/\bCheckpoint 解説ルート\b/g, "確認回の解説ルート")
    .replace(/\bCheckpointでは\b/g, "確認回では")
    .replace(/\bこのCheckpoint\b/g, "この確認回")
    .replace(/\bCheckpointの\b/g, "確認回の")
    .replace(/\bCheckpoint\b/g, "確認回")
    .replace(/\bFinal Gate Plan\b/g, "最終確認の時間配分")
    .replace(/\bFinal Gate後\b/g, "最終確認後")
    .replace(/\bこのFinal Gate\b/g, "この最終確認")
    .replace(/\b明日のFinal Gate\b/g, "明日の最終確認")
    .replace(/\bFinal Gate\b/g, "最終確認")
    .replace(/最終Gate/g, "最終確認");
}

export function toLearnerText(text = "") {
  const cleaned = stripAuthoringBodyLabels(text)
    .replace(/^(Q\d+)[｜:：]\s*(?:RQ|RF|WF|SS|TF)\d+\s*$/i, "$1")
    .replace(INTERNAL_PREFIX, "")
    .replace(INTERNAL_CODE_GLOBAL, "")
    .replace(SHORT_INTERNAL_PREFIX, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([｜:：])/g, "$1")
    .trim();

  if (cleaned === "弱い考え方との比較") return "弱い例";
  if (cleaned === "次の問題に持っていくもの") return "次へのポイント";
  return cleaned;
}

export function toLearnerLabel(text = "") {
  const normalized = String(text)
    .replace(/^筑波B\d{3}\s+Checkpoint\s*[：:｜]\s*/i, "筑波 チェック回｜")
    .replace(/^筑波P4\s+Final Gate\s*[：:｜]\s*/i, "筑波 最終チェック｜")
    .replace(/^P\d+\s+Bridge\s+\d+\s+Checkpoint\s*[：:｜]\s*/i, "チェック回｜")
    .replace(/^P\d+\s+Final Checkpoint\s*[：:｜]\s*/i, "最終チェック｜")
    .replace(/^P\d+\s+Final Gate\s*[：:｜]\s*/i, "最終チェック｜")
    .replace(/^B\d{3}\s+Checkpoint\s*[：:｜]\s*/i, "チェック回｜")
    .replace(/^Bundle\s+\d+\s+Checkpoint\s*[：:｜]\s*/i, "チェック回｜")
    .replace(/^Bundle\s+\d+で確認したこと$/i, "ここまでで確認したこと")
    .replace(/^P3 Strategy$/i, "実戦の進め方")
    .replace(/^P4 Final Gate Check$/i, "最終チェック")
    .replace(/^P4 Final Gate 判定$/i, "最終チェック判定")
    .replace(/^Final Gate[｜:：]\s*/i, "最終チェック｜")
    .replace(/^Final Gate 解説$/i, "最終チェック解説")
    .replace(/^Checkpoint 解説ルート$/i, "チェック回の解説ルート")
    .replace(/^Checkpoint$/i, "チェック回");

  return toLearnerText(normalized)
    .replace(/^筑波\s*確認回\s*[：:｜]\s*/i, "筑波 チェック回｜")
    .replace(/^確認回\s*[：:｜]\s*/i, "チェック回｜")
    .replace(/^最終確認\s*[：:｜]\s*/i, "最終チェック｜")
    .replace(/^最終確認$/i, "最終チェック")
    .replace(/｜{2,}/g, "｜")
    .trim();
}

export function startsWithInternalCode(text = "") {
  const value = String(text).trim();
  return INTERNAL_PREFIX.test(value) || SHORT_INTERNAL_PREFIX.test(value);
}

export function containsInternalCode(text = "") {
  return INTERNAL_CODE_ANY.test(String(text));
}
