export const P1_ACCELERATED_ROUTE = [
  { id: "E001", focus: "比較の土台｜differ from / differ in" },
  { id: "E002", focus: "因果の強さ｜cause / lead to / result in / contribute to" },
  { id: "E006", focus: "B001 Checkpoint｜比較・因果・提案・増減" },
  { id: "E008", focus: "主張の強さ｜argue / may / can / should" },
  { id: "E012", focus: "B002 Checkpoint｜立場・便益・投資・危機対応" },
  { id: "E015", focus: "問題をなくす vs 緩和する｜resilience" },
  { id: "E018", focus: "B003 Checkpoint｜効率・補完・主語動詞一致" },
  { id: "E020", focus: "資源配分｜allocate / opportunity cost" },
  { id: "E024", focus: "B004 Checkpoint｜配分・情報伝達・調整" },
  { id: "E027", focus: "証拠の強さ → 結論の強さ" },
  { id: "E030", focus: "B005 Checkpoint｜情報・選択・同意" },
  { id: "E034", focus: "限界を認めて結論を精密化する" },
  { id: "E036", focus: "B006 Checkpoint｜選択・優先順位・benefit-risk" },
  { id: "E038", focus: "提案の強さ｜suggest / propose / recommend" },
  { id: "E042", focus: "B007 Checkpoint｜提案・判断・異議" }
];

export const P1_OPTIONAL_BY_BUNDLE = {
  B001: ["E003", "E004", "E005"],
  B002: ["E007", "E009", "E010", "E011"],
  B003: ["E013", "E014", "E016", "E017"],
  B004: ["E019", "E021", "E022", "E023"],
  B005: ["E025", "E026", "E028", "E029"],
  B006: ["E031", "E032", "E033", "E035"],
  B007: ["E037", "E039", "E040", "E041"]
};

export const P1_ACCELERATED_IDS = P1_ACCELERATED_ROUTE.map((item) => item.id);
