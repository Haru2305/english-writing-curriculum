import { toLearnerLabel } from "./learner-text.js";

const QUESTION_HEADING = /^(?:Q\d+|\d+)\s*(?:[｜:：.]|\s+)/i;
const MODEL_WRITING_REVIEW = /^(?:Model answer|Model output|Model short output|Model writing|Model summary|Model English summary|Model judgment|Model evaluation|モデル答案|モデル$)/i;
const WRITING_REVIEW = /^(?:Nuance Check|Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing|別解|Japanese Output)/i;

export function reviewPresentation(title = "") {
  const raw = String(title).trim();
  const text = toLearnerLabel(raw);

  if (["答えだけ", "解答一覧"].includes(text)) {
    return { kind: "answer-list", label: "" };
  }

  if (text === "まず確認") {
    return { kind: "intro", label: "" };
  }

  if (/^(?:自己修正|Self-correction)$/i.test(text)) {
    return { kind: "learning", label: "振り返り" };
  }

  if (/^(?:B\d{3} Checkpoint|P\d Final Gate Check|チェック回|筑波 チェック回|最終チェック|筑波 最終チェック|Pass standard)$/i.test(text)) {
    return { kind: "learning", label: "実戦チェック" };
  }

  if (/^(?:到達目安|P\d Final Gate 判定|最終チェック\s*判定|筑波 最終チェック\s*判定)$/i.test(text)) {
    return { kind: "learning", label: "到達判定" };
  }

  if (/^30日間の最終固定$/i.test(text)) {
    return { kind: "learning", label: "本番手順" };
  }

  if (/^(?:思考の再利用|思考転用|思考再会)/i.test(text)) {
    return { kind: "learning", label: "思考・転用" };
  }

  if (/^(?:Final Gate|最終チェック)｜Q3Bの読み方/i.test(text)) {
    return { kind: "question", label: "設問解説" };
  }

  if (MODEL_WRITING_REVIEW.test(text) || /^Writing解説$/i.test(text)) {
    return { kind: "writing", label: "Writing解説" };
  }

  if (/^Reading answers$/i.test(text)) {
    return { kind: "question", label: "設問解説" };
  }

  if (QUESTION_HEADING.test(text) || WRITING_REVIEW.test(text)) {
    return { kind: "question", label: "設問解説" };
  }

  if (/^本文の(?:因果骨格|骨格)/i.test(text)) {
    return { kind: "learning", label: "本文整理" };
  }

  if (
    /^(?:LEXG\d+|Language Focus|Pre-solve|Why this word\?|本文でのWhy this word\?|Review\b)/i.test(raw)
    || /(?:Why this word\?|cause|lead to|result in|contribute to|differ from|differ in)/i.test(text)
  ) {
    return { kind: "learning", label: "表現整理" };
  }

  if (
    /^解説補強/i.test(text)
    || /^(?:この問題で考えること|考え方|弱い考え方との比較|答案の組み立て|模範解答の読み方|次の問題に持っていくもの)/i.test(text)
  ) {
    return { kind: "learning", label: "思考・転用" };
  }

  return { kind: "learning", label: "学習ポイント" };
}
