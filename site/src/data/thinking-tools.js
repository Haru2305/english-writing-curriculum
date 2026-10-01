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
        firstLesson: "E097"
      },
      {
        id: "mandatory-concern",
        label: "外せない条件",
        english: "mandatory concern",
        question: "結論を出すとき、必ず満たすべき条件は何か。",
        firstLesson: "E097"
      },
      {
        id: "decision",
        label: "最後の判断",
        english: "decision",
        question: "最終的に、何を選ぶ・勧める・説明する問題なのか。",
        firstLesson: "E097"
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
        firstLesson: "E097"
      },
      {
        id: "same-axis",
        label: "同じ軸で比較",
        english: "same axes",
        question: "候補ごとに都合のいい基準へ途中で変えていないか。",
        firstLesson: "E097"
      },
      {
        id: "trade-off",
        label: "トレードオフ",
        english: "trade-off",
        question: "この案で得るものと、弱くなるものは何か。",
        firstLesson: "E097"
      },
      {
        id: "measurability",
        label: "確かめられるか",
        english: "measurability",
        question: "効果が出たかどうかを、何で確認できるか。",
        firstLesson: "E097"
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
        firstLesson: "E145"
      },
      {
        id: "nearby-concepts",
        label: "近い概念と分ける",
        english: "contrast",
        question: "似ているが別物の概念は何か。",
        firstLesson: "E145"
      },
      {
        id: "limitation",
        label: "限界",
        english: "limitation",
        question: "この指標・データだけでは分からないことは何か。",
        firstLesson: "E145"
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
        firstLesson: "E145"
      },
      {
        id: "components",
        label: "構成要素",
        english: "components",
        question: "その概念は、どんな要素からできているか。",
        firstLesson: "E145"
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
        firstLesson: "E049"
      },
      {
        id: "context-clues",
        label: "周囲の手掛かり",
        english: "context clues",
        question: "対比・具体例・定義・結果の手掛かりはないか。",
        firstLesson: "E049"
      },
      {
        id: "logic-fit",
        label: "論理に合うか",
        english: "logic fit",
        question: "その意味を入れたとき、段落全体の流れが自然につながるか。",
        firstLesson: "E049"
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
        firstLesson: "E001"
      },
      {
        id: "necessary-condition",
        label: "必要条件",
        english: "necessary condition",
        question: "その失敗を防ぐには、何が成立している必要があるか。",
        firstLesson: "E001"
      }
    ]
  }
];

export const thinkingTools = thinkingToolGroups.flatMap((group) =>
  group.tools.map((tool) => ({ ...tool, groupId: group.id, groupTitle: group.title }))
);

export const lessonThinkingToolIds = {
  E001: ["remaining-failure", "necessary-condition"],
  E049: ["word-role", "context-clues", "logic-fit"],
  E097: ["goal", "mandatory-concern", "trade-off", "decision"],
  E145: ["definition", "components", "nearby-concepts", "scope-limit", "limitation"]
};

export function toolsForLesson(lessonId) {
  const ids = lessonThinkingToolIds[lessonId] ?? [];
  return ids
    .map((id) => thinkingTools.find((tool) => tool.id === id))
    .filter(Boolean);
}
