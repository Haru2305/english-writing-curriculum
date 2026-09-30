# Priority B Selective Review

## Decision

Priority Bは自動的に全件Post-solveへ出さない。

12概念を実教材で監査した結果:
- **Transfer-only revision: 4**
- **No revision / keep implicit: 8**
- 新規教材: 0

選定基準は「概念が重要か」ではなく、**追加ブロックが既存本文にない転用価値を生むか**。

| Idea | Decision | Target | Rationale |
|---|---|---|---|
| IDEA0001 地域差は人材だけでなく制度・インフラにも左右される | Transfer-only | E113 | E001では複数要因がすでに明示。E113で医療アクセス→健診参加障壁へ構造要因の見方が移るため、転用接続だけ価値が高い |
| IDEA0003 技術はアクセスを改善しても対面サービスを完全代替しない | No revision | — | E002とE009がタイトル・本文ともreplace/complementを明示しており、追加ブロックは重複 |
| IDEA0018 高リスク領域ではhuman oversightが重要になる | Transfer-only | E149 | E009でhuman oversightは十分明示。E149では医療AI→公共AIへrisk-proportionate oversightが転用されるため接続価値が高い |
| IDEA0020 プライバシー保護と利便性には交換関係がある | No revision | — | E008の中心テーマそのもの。E070もprivacy/accountabilityの比較を本文内で十分処理している |
| IDEA0026 初期費用と長期便益を分ける | No revision | — | E010の題名・本文で時間軸が明示。E217はより精密にはcounterfactual prevention evaluationであり、旧ラベルを重ねると概念が粗くなる |
| IDEA0035 労働市場変化では職種よりtaskの変化を見る | No revision | — | E016がタイトルからtask/jobを明示。E061の主目的はevidence scopeであり、追加タグは焦点を分散させる |
| IDEA0041 公共予算は機会費用を伴う | No revision | — | E020でopportunity costを名称つきで直接教授。E032もselection criterionを明示しており追加説明は不要 |
| IDEA0042 参加と説明責任は制度への信頼に関係する | No revision | — | E039はaccountabilityを直接教授し、E189はcandor/accountability比較が主目的。legitimacyまで同一ラベルで束ねると転用がやや広すぎる |
| IDEA0043 保存と開発は完全な二者択一ではない | No revision | — | E028でadaptive reuseを明示し、E195も同じ対立軸を本文連動作文へ使うため、概念は既に可視 |
| IDEA0049 危機前の投資は成果が見えにくい | Transfer-only | E217 | E011でinvisible prevention benefitを明示済み。E217ではbridge/software maintenanceへ移り、counterfactualまで発展するため再会接続が有効 |
| IDEA0054 公的資金は便益の広がりと代替用途で評価する | No revision | — | E033でpublic benefitとopportunity costを明示。E093はcriteria-based prioritizationが主目的で、追加は重複 |
| IDEA0055 便益とリスクは別々でなく同じ判断枠で比較する | Transfer-only | E151 | E035でbenefit-risk frameは明示済み。E151でuncertaintyにreversibilityとdelay costを足すため、発展的転用として価値が高い |

## Selected four

### IDEA0001 → E113
E001で学んだ「単一要因ではなく複数の構造要因を見る」を、地域医療から健診参加障壁へ転用する。

### IDEA0018 → E149
E009のhigh-risk human oversightを、公共AIチャット窓口のtask boundary / human transferへ転用する。

### IDEA0049 → E217
E011の「成功した予防は見えにくい」を、インフラ・software maintenanceへ転用し、さらにcounterfactual評価へ発展させる。

### IDEA0055 → E151
E035のbenefit-risk frameへ、uncertainty下のreversibility / delay costを追加し、意思決定の枠を一段深くする。

## Non-revision principle

No revisionは「重要でない」という意味ではない。

以下のいずれかならPost-solveを増やさない:
1. 題名・今日の狙い・本文ですでに概念名と構造が十分見える
2. 後続教材の主目的が別にあり、追加概念が焦点を分散させる
3. より精密な後発Ideaが同じ現象を説明している
4. 他Coreとの重複が大きい

This review preserves the fixed E001–E234 corpus and minimizes learner-facing conceptual clutter.


## Status

**Completed 2026-10-01.**

- Reviewed: 12 / 12
- Transfer-only revisions published: 4
- No-revision decisions: 8
- Drive readback QA: **4 / 4 pass**
- New lesson IDs: 0

Selected revision ledger:
- `management/post-solve-priority-b-selected.csv`
- `curriculum/post-solve-priority-b.md`
