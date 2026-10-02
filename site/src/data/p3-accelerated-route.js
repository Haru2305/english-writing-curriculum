export const P3_ACCELERATED_ROUTE = [
  { id: "E097", focus: "P3入口｜複数基準で優先順位を決める100–120語Writing" },
  { id: "E100", focus: "記事＋表＋案内を英語要約へ統合" },
  { id: "E102", focus: "B017 Checkpoint｜混合資料・要約・比較・判断" },

  { id: "E104", focus: "高密度英文｜並列・挿入・名詞化をほどく" },
  { id: "E105", focus: "二つの立場を比較し、条件付きで判断" },
  { id: "E108", focus: "B018 Checkpoint｜高密度文・二本文・混合資料" },

  { id: "E109", focus: "未知概念を本文だけで組み立てる" },
  { id: "E113", focus: "本文＋FAQ＋表から参加障壁を特定" },
  { id: "E114", focus: "B019 Checkpoint｜未知概念・照応・断定度・自然さ" },

  { id: "E117", focus: "因果連鎖を切らずに説明する" },
  { id: "E119", focus: "複数資料から譲歩と中心主張を再構成" },
  { id: "E120", focus: "B020 Checkpoint｜譲歩・一般化・因果" },

  { id: "E122", focus: "複数段落を英語で要約する" },
  { id: "E125", focus: "例外条件を混合資料から判断" },
  { id: "E126", focus: "B021 Checkpoint｜例外・限定・英語要約" },

  { id: "E127", focus: "問いを立てて原因を見抜く" },
  { id: "E131", focus: "記事＋FAQ＋表を日本語で統合" },
  { id: "E132", focus: "B022 Checkpoint｜問い→答え・日本語要約・日英切替" },

  { id: "E133", focus: "文の役割から挿入位置を決める" },
  { id: "E137", focus: "二本文をまたいで挿入根拠を説明" },
  { id: "E138", focus: "B023 Checkpoint｜空所・文挿入・段落機能" },

  { id: "E141", focus: "二案を比較→英語要約→判断Writing" },
  { id: "E143", focus: "混合資料から提案を書く" },
  { id: "E144", focus: "B024 Checkpoint｜複数形式を60分で切替" },

  { id: "E145", focus: "未知のscoreを定義し限界を説明" },
  { id: "E147", focus: "二制度を比較→英語要約→評価" },
  { id: "E150", focus: "B025 Checkpoint｜初見概念・表・要約・提案" },

  { id: "E152", focus: "高密度文＋表＋因果連鎖" },
  { id: "E153", focus: "二案を比較→要約→評価" },
  { id: "E156", focus: "B026 Checkpoint｜未知概念・因果・複数資料・作文" },

  { id: "E157", focus: "自己選択バイアス｜誰の声を拾うか" },
  { id: "E159", focus: "一律支援と対象支援を比較評価" },
  { id: "E162", focus: "B027 Checkpoint｜未知概念・複数資料・要約・提案" },

  { id: "E163", focus: "平均への回帰｜改善＝介入効果とは限らない" },
  { id: "E165", focus: "授業録画の二制度を比較評価" },
  { id: "E168", focus: "B028 Checkpoint｜初見概念・高密度文・複数資料・作文" },

  { id: "E169", focus: "基準率｜目立つ事例だけで確率判断しない" },
  { id: "E171", focus: "研究データ公開の二案を比較評価" },
  { id: "E174", focus: "B029 Checkpoint｜初見概念・表・要約・提案" },

  { id: "E175", focus: "可視事例の偏り｜見えている例だけで判断しない" },
  { id: "E177", focus: "学習支援の二制度を比較評価" },
  { id: "E180", focus: "B030 Checkpoint｜高密度文・表・要約・提案" },

  { id: "E182", focus: "測定値の精密さと信頼性を分ける" },
  { id: "E183", focus: "二つの調査設計を比較する" },
  { id: "E186", focus: "B031 Checkpoint｜言い換え・複数資料・比較作文" },

  { id: "E189", focus: "匿名／公開フィードバックを比較評価" },
  { id: "E190", focus: "旧説→新説の更新を読む" },
  { id: "E192", focus: "B032 Checkpoint｜主旨・例外・旧説更新・評価" },

  { id: "E194", focus: "代理指標｜measureとgoalを分ける" },
  { id: "E195", focus: "二本文要約→本文連動Writing" },
  { id: "E198", focus: "B033 Checkpoint｜高密度文・要約・本文連動作文" },

  { id: "E201", focus: "平均値の改善と分布を分けて読む" },
  { id: "E202", focus: "二本文要約→条件付き評価Writing" },
  { id: "E204", focus: "P3 Final Gate｜複数資料・要約・記述・英作文" }
];

export const P3_OPTIONAL_BY_BUNDLE = {
  B017: ["E098", "E099", "E101"],
  B018: ["E103", "E106", "E107"],
  B019: ["E110", "E111", "E112"],
  B020: ["E115", "E116", "E118"],
  B021: ["E121", "E123", "E124"],
  B022: ["E128", "E129", "E130"],
  B023: ["E134", "E135", "E136"],
  B024: ["E139", "E140", "E142"],
  B025: ["E146", "E148", "E149"],
  B026: ["E151", "E154", "E155"],
  B027: ["E158", "E160", "E161"],
  B028: ["E164", "E166", "E167"],
  B029: ["E170", "E172", "E173"],
  B030: ["E176", "E178", "E179"],
  B031: ["E181", "E184", "E185"],
  B032: ["E187", "E188", "E191"],
  B033: ["E193", "E196", "E197"],
  B034: ["E199", "E200", "E203"]
};

export const P3_ACCELERATED_IDS = P3_ACCELERATED_ROUTE.map((item) => item.id);
