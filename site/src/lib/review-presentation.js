import { toLearnerText } from "./learner-text.js";

const QUESTION_HEADING = /^(?:Q\d+|\d+)\s*(?:[｜:：.]|\s+)/i;
const WRITING_REVIEW = /^(?:Nuance Check|Guided Writing|Short Writing|Mini Writing|Writing Task|Short Output|English Summary|Final Writing|Model answer|Model output|Model short output|Model writing|Model summary|モデル答案|別解|自己修正|Self-correction)/i;

export function reviewPresentation(title = "") {
  const raw = String(title).trim();
  const text = toLearnerText(raw);

  if (["答えだけ", "解答一覧"].includes(text)) {
    return { kind: "answer-list", label: "" };
  }

  if (text === "まず確認") {
    return { kind: "intro", label: "" };
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
