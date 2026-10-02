export const P2_ACCELERATED_ROUTE = [
  { id: "E043", focus: "節境界・有限動詞｜長い文の骨格" },
  { id: "E045", focus: "表現認識→想起｜使える語法へ" },
  { id: "E046", focus: "Correct｜主語・動詞・数・前置詞" },
  { id: "E048", focus: "B008 Checkpoint｜構造・想起・正確性・速度" },

  { id: "E050", focus: "照応｜this / they / such を追う" },
  { id: "E053", focus: "4文段落｜cohesion" },
  { id: "E054", focus: "B009 Checkpoint｜文脈・照応・自然さ・cohesion" },

  { id: "E055", focus: "段落機能｜各文の役割を読む" },
  { id: "E058", focus: "長い名詞句｜構造をほどいて説明" },
  { id: "E060", focus: "B010 Checkpoint｜段落機能・主旨・日本語出力・構造処理" },

  { id: "E061", focus: "筆者態度・確信度｜claim strength" },
  { id: "E066", focus: "B011 Checkpoint｜確信度・情報構造・日本語出力" },

  { id: "E068", focus: "複数本文比較｜同じ評価軸で読む" },
  { id: "E071", focus: "2本文→複数形式へ変換" },
  { id: "E072", focus: "B012 Checkpoint｜複数本文比較・形式適応・情報構造" },

  { id: "E073", focus: "未知題材耐性｜本文から組み立てる" },
  { id: "E074", focus: "本文＋表｜複数資料統合" },
  { id: "E078", focus: "B013 Checkpoint｜未知題材・本文＋表・複数資料判断" },

  { id: "E079", focus: "名詞化・圧縮構造｜高密度文" },
  { id: "E080", focus: "推論｜本文からどこまで言えるか" },
  { id: "E081", focus: "要約｜全文コピーせず圧縮する" },
  { id: "E084", focus: "B014 Checkpoint｜推論・圧縮構造・要約・非連続資料" },

  { id: "E085", focus: "60–80語｜evidence strengthに合わせて書く" },
  { id: "E086", focus: "80–100語｜本文論理を別提案へ転用" },
  { id: "E087", focus: "90–110語｜読み手に届く段落へ" },
  { id: "E090", focus: "B015 Checkpoint｜要約→本文連動英作文" },

  { id: "E091", focus: "problem→solution｜問題に対応する策を読む" },
  { id: "E092", focus: "提案作文｜問題に合うsolutionを書く" },
  { id: "E093", focus: "評価・優先順位｜複数基準で決める" },
  { id: "E096", focus: "P2 Final Checkpoint｜複数資料・要約・英作文" }
];

export const P2_OPTIONAL_BY_BUNDLE = {
  B008: ["E044", "E047"],
  B009: ["E049", "E051", "E052"],
  B010: ["E056", "E057", "E059"],
  B011: ["E062", "E063", "E064", "E065"],
  B012: ["E067", "E069", "E070"],
  B013: ["E075", "E076", "E077"],
  B014: ["E082", "E083"],
  B015: ["E088", "E089"],
  B016: ["E094", "E095"]
};

export const P2_ACCELERATED_IDS = P2_ACCELERATED_ROUTE.map((item) => item.id);
