# Core 99 Content Quality Audit

## Purpose

Core 99を実際の学習順で使ったときの本編品質を監査する。

負荷監査とは分け、主に以下を見る。

- 問題が曖昧すぎず、要求が明確か
- Phase内・Phase間で支援が減り、判断の自立度とWriting負荷が上がるか
- 解答一覧／設問解説／因果骨格・考え方／語法整理／Writing解説の役割が混線していないか
- Optional lessonを飛ばしてもCoreだけで自己完結するか
- 読解・語法が最終的な自由英作文へ接続しているか

原則として新規問題は追加せず、既存問題の削減・差し替え・順序調整・support調整で改善する。

## P1

### B001 — E001 / E002 / E006

#### E001

判定：**Keep with presentation refinement**

- P1入口として、比較対象と相違点を differ from / differ in で分ける狙いは明確
- Reading → Language Focus → 2〜3文Writing の接続も自然
- 難易度は入口として妥当で、問題追加は不要
- 解答確認と詳細解説が連続していたため、`解答一覧` と `設問解説` を分離
- 本文骨格・語法整理・Writing解説も見出しで分離

#### E002

判定：**Keep**

- 因果の強さを cause / lead to / result in / contribute to で扱い、E001よりreasoning負荷が上がる
- 「available ≠ usable」「単独原因と複数要因」の処理が後続Writingへ接続
- workload auditで既にanswer-side bloatを圧縮済み
- 内容追加は不要
- 設問解説／因果骨格／語法整理／Writing解説を見出しで分離

#### E006

判定：**Fix required — Core self-containment**

問題:
- Accelerated Coreは E001 → E002 → E006
- E003（suggest）とE005（rise / raise）はOptional
- それにもかかわらずE006冒頭が「新しい語法は導入しません」とし、suggest / rise・raiseを既習扱いしていた
- Core Routeの「OptionalのIntroduce lessonを飛ばした場合は最初のCore遭遇をFast Introduceにする」という原則と矛盾

修正:
- E006で suggest / rise・raise をFast Introduceと明示
- Referenceを4分→6分、Readingを22分→20分にして総時間60分を維持
- Targeted ReviewでE003/E005を先に使った場合だけ復習扱いにする
- 解答一覧を追加し、設問解説・語法整理・Writing解説を視覚的に分離
- P1 accelerated route側にもFast Introduce運用を明記

### B001 conclusion

B001のCore 3回は、内容を増やす必要はない。

修正後の勾配は、

**E001 比較の型 → E002 因果の強さ → E006 初見3資料で統合適用**

となり、Optionalを完走しなくてもCoreだけで成立する。
