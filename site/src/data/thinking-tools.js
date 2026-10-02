export const thinkingToolGroups = [
  {
    id: "frame",
    title: "何を決める問題か",
    description: "まず、問題の目的・外せない条件・最後の判断を固定する。",
    tools: [
      {
        id: "goal",
        label: "目的",
        english: "goal",
        question: "この問題では、何を達成したいのか。",
        exampleLesson: "E097"
      },
      {
        id: "mandatory-concern",
        label: "外せない条件",
        english: "mandatory concern",
        question: "結論を出すとき、必ず満たすべき条件は何か。",
        exampleLesson: "E097"
      },
      {
        id: "decision",
        label: "最後の判断",
        english: "decision",
        question: "最終的に、何を選ぶ・勧める・説明する問題なのか。",
        exampleLesson: "E097"
      }
    ]
  },
  {
    id: "compare",
    title: "どう比べるか",
    description: "候補を思いつきで選ばず、同じ判断軸で比べる。",
    tools: [
      {
        id: "criteria",
        label: "判断基準",
        english: "criteria",
        question: "目的に照らすと、何を基準に比べるべきか。",
        exampleLesson: "E097"
      },
      {
        id: "same-axis",
        label: "同じ軸で比較",
        english: "same axes",
        question: "候補ごとに都合のいい基準へ途中で変えていないか。",
        exampleLesson: "E097"
      },
      {
        id: "trade-off",
        label: "トレードオフ",
        english: "trade-off",
        question: "この案で得るものと、弱くなるものは何か。",
        exampleLesson: "E097"
      },
      {
        id: "measurability",
        label: "確かめられるか",
        english: "measurability",
        question: "効果が出たかどうかを、何で確認できるか。",
        exampleLesson: "E097"
      }
    ]
  },
  {
    id: "scope",
    title: "どこまで言えるか",
    description: "指標や根拠の射程を越えて結論を広げない。",
    tools: [
      {
        id: "scope-limit",
        label: "射程",
        english: "scope",
        question: "この情報が直接示しているのは、どこまでか。",
        exampleLesson: "E145"
      },
      {
        id: "nearby-concepts",
        label: "近い概念と分ける",
        english: "contrast",
        question: "似ているが別物の概念は何か。",
        exampleLesson: "E145"
      },
      {
        id: "limitation",
        label: "限界",
        english: "limitation",
        question: "この指標・データだけでは分からないことは何か。",
        exampleLesson: "E145"
      }
    ]
  },
  {
    id: "build-concept",
    title: "知らない概念を組み立てる",
    description: "背景知識ではなく、本文から概念の中身を作る。",
    tools: [
      {
        id: "definition",
        label: "定義",
        english: "definition",
        question: "本文では、その概念を何として扱っているか。",
        exampleLesson: "E145"
      },
      {
        id: "components",
        label: "構成要素",
        english: "components",
        question: "その概念は、どんな要素からできているか。",
        exampleLesson: "E145"
      }
    ]
  },
  {
    id: "context",
    title: "文脈から意味を決める",
    description: "知らない語を訳語当てにせず、周囲の論理から絞る。",
    tools: [
      {
        id: "word-role",
        label: "文中の役割",
        english: "role",
        question: "その語は、この文の中で何の仕事をしているか。",
        exampleLesson: "E049"
      },
      {
        id: "context-clues",
        label: "周囲の手掛かり",
        english: "context clues",
        question: "対比・具体例・定義・結果の手掛かりはないか。",
        exampleLesson: "E049"
      },
      {
        id: "logic-fit",
        label: "論理に合うか",
        english: "logic fit",
        question: "その意味を入れたとき、段落全体の流れが自然につながるか。",
        exampleLesson: "E049"
      }
    ]
  },
  {
    id: "argument-writing",
    title: "自由英作文を組み立てる",
    description: "理由を増やすより、問いへの答えから一つの理由を最後まで発展させる。",
    tools: [
      {
        id: "direct-answer",
        label: "問いに答える",
        english: "direct answer",
        question: "最初の一文だけで、設問への自分の答えが分かるか。",
        exampleLesson: "E087"
      },
      {
        id: "strongest-reason",
        label: "理由を1つ選ぶ",
        english: "strongest reason",
        question: "理由を増やす前に、一番強い理由を一つ選べているか。",
        exampleLesson: "E087"
      },
      {
        id: "reason-mechanism",
        label: "なぜ成り立つか",
        english: "mechanism",
        question: "その理由が結論につながる途中の『なぜ』を説明できるか。",
        exampleLesson: "E208"
      },
      {
        id: "concrete-support",
        label: "具体例",
        english: "concrete example",
        question: "その理由が実際に起きる場面を、一つ具体的に示せるか。",
        exampleLesson: "E208"
      },
      {
        id: "useful-qualification",
        label: "必要な限定",
        english: "qualification",
        question: "主張を正確にするために、条件・限界を一つ置く必要があるか。",
        exampleLesson: "E087"
      },
      {
        id: "return-to-answer",
        label: "問いへ戻る",
        english: "return",
        question: "最後に、理由や限定を踏まえた結論へ戻れているか。",
        exampleLesson: "E087"
      }
    ]
  },
  {
    id: "exam-response",
    title: "字数制限で説明する",
    description: "訳してから削るのではなく、設問が要求する論理要素を先に決めて圧縮する。",
    tools: [
      {
        id: "required-elements",
        label: "要求要素",
        english: "required elements",
        question: "この設問で、字数内に必ず入れるべき要素は何か。",
        exampleLesson: "E205"
      },
      {
        id: "logic-compression",
        label: "論理を圧縮",
        english: "logic compression",
        question: "原因・結果・対比のどの関係を残せば、短くしても意味が崩れないか。",
        exampleLesson: "E205"
      }
    ]
  },
  {
    id: "paragraph-logic",
    title: "段落どうしの論理を追う",
    description: "段落の役割と、接続語・指示語が作る前後関係を追う。",
    tools: [
      {
        id: "paragraph-function",
        label: "段落の役割",
        english: "paragraph function",
        question: "この段落は、主張・理由・例・限定のうち何の仕事をしているか。",
        exampleLesson: "E193"
      },
      {
        id: "connector-reference",
        label: "接続語・指示語",
        english: "logic & reference",
        question: "接続語や指示語は、直前のどの内容を受けているか。",
        exampleLesson: "E193"
      },
      {
        id: "insertion-fit",
        label: "前後につながるか",
        english: "insertion fit",
        question: "その文は前の内容を受け、次の展開へ自然につながる位置にあるか。",
        exampleLesson: "E193"
      }
    ]
  },
  {
    id: "failure",
    title: "一つ改善しても何が残るか",
    description: "完成した分類を暗記せず、残る失敗から必要条件を逆算する。",
    tools: [
      {
        id: "remaining-failure",
        label: "残る失敗",
        english: "remaining failure",
        question: "この対策をしても、まだ失敗するとしたらどんな場合か。",
        exampleLesson: "E001"
      },
      {
        id: "necessary-condition",
        label: "必要条件",
        english: "necessary condition",
        question: "その失敗を防ぐには、何が成立している必要があるか。",
        exampleLesson: "E001"
      }
    ]
  }
];

export const thinkingTools = thinkingToolGroups.flatMap((group) =>
  group.tools.map((tool) => ({ ...tool, groupId: group.id, groupTitle: group.title }))
);

export const thinkingRoutine = [
  {
    step: 1,
    title: "何を答えるか決める",
    prompt: "設問を一文で言い換える。何を答えれば、この問題に答えたことになるか。"
  },
  {
    step: 2,
    title: "使う根拠を選ぶ",
    prompt: "本文・図表・自分の知識から、答えに本当に必要なものだけを拾う。"
  },
  {
    step: 3,
    title: "理由を一本つなぐ",
    prompt: "なぜそう言える？ どうしてその結果になる？ 具体例は？ を順につなぐ。"
  },
  {
    step: 4,
    title: "条件・限界を確かめる",
    prompt: "いつでも成り立つのか。例外・反対要素・言いすぎがないかを見る。"
  },
  {
    step: 5,
    title: "答案の形にする",
    prompt: "字数・語数・設問形式に合わせて、必要な要素だけを残して書く。"
  }
];

export const thinkingQuickRoutes = [
  {
    id: "writing-stuck",
    title: "自由英作文で、何を書けばいいか分からない",
    lead: "理由を増やす前に、答えを決めて一つの理由を最後まで伸ばす。",
    toolIds: [
      "direct-answer",
      "strongest-reason",
      "reason-mechanism",
      "concrete-support",
      "useful-qualification"
    ]
  },
  {
    id: "response-stuck",
    title: "本文は読めたのに、記述・要約の答えが作れない",
    lead: "設問が要求する要素と、本文が直接言っている範囲を先に固定する。",
    toolIds: ["required-elements", "scope-limit", "logic-compression"]
  },
  {
    id: "decision-stuck",
    title: "比較・評価・提案で、何を基準に決めればいいか分からない",
    lead: "目的を決め、同じ基準で比べ、得るものと失うものを確認する。",
    toolIds: ["goal", "criteria", "trade-off", "mandatory-concern", "decision"]
  },
  {
    id: "unknown-stuck",
    title: "知らない語・概念が出ると止まる",
    lead: "訳語や背景知識を当てにせず、本文の定義・役割・周囲の手掛かりから作る。",
    toolIds: ["context-clues", "definition", "components", "nearby-concepts"]
  },
  {
    id: "structure-stuck",
    title: "文挿入・段落の流れが分からない",
    lead: "一文だけで見ず、段落の役割と前後の接続を追う。",
    toolIds: ["paragraph-function", "connector-reference", "insertion-fit"]
  }
];

export const lessonThinkingToolIds = {
  E001: ["remaining-failure", "necessary-condition"],
  E049: ["word-role", "context-clues", "logic-fit"],
  E097: ["goal", "mandatory-concern", "trade-off", "decision"],
  E145: ["definition", "components", "nearby-concepts", "limitation"],
  E193: ["paragraph-function", "connector-reference", "insertion-fit"],
  E205: ["required-elements", "logic-compression", "paragraph-function"],
  E087: ["direct-answer", "strongest-reason", "useful-qualification", "return-to-answer"],
  E208: ["direct-answer", "strongest-reason", "reason-mechanism", "concrete-support"]
};

export function toolsForLesson(lessonId) {
  const ids = lessonThinkingToolIds[lessonId] ?? [];
  return ids
    .map((id) => thinkingTools.find((tool) => tool.id === id))
    .filter(Boolean);
}
