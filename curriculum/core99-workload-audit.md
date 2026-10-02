# Core 99 Workload Audit

## Purpose

Core 99を実際に順番に使ったとき、1回ごとの負荷が重すぎたり薄すぎたりしないかを確認する。

対象:
- P1 Core 15
- P2 Core 30
- P3 Core 54

見る項目:
- 想定時間
- problem-side文字量
- answer / explanation-side文字量
- 設問数
- Writing section数
- Writing語数
- Checkpoint / Final Gateかどうか

## Finding

### P1

平均総文字量は約 **6.5k**。

Checkpointは複数Text・6〜8問・Short Writingを含むため、60分枠として妥当。

通常回では **E002** が明確な外れ値だった。
- problem side: 5,323 chars
- answer / explanation side: **3,368 chars**
- total: 8,691 chars

原因は、解答一覧の後に設問解説・因果骨格・語法再説明・Why this word・Nuance Check・既習語法Review・モデル答案・別解・自己修正が重なっていたこと。

E002のanswer / explanation sideを **3,368 → 2,537 chars** に圧縮した。
設問解説、因果骨格、LEXG003、LEXG195、モデル答案、別解、Core recapは残した。

この監査では当初、P1全体を一律短縮しないとしていた。
ただし2026-10-03の **independent timing audit** で、既存の時間割を使わず問題量から再推定した結果、P1は現行平均49.5分に対して中央推定31.1分となった。

したがって「60分以内で完結すればよい」という運用上の単純さは、時間設定の根拠としては採用しない。
詳細は `curriculum/core99-independent-time-audit.md` を正とする。

### P2

平均総文字量は約 **5.4k**。

最大は:
- E054: 8,301 chars — Checkpoint
- E048: 8,240 chars — Checkpoint
- E055: 7,368 chars — paragraph-function intensive lesson
- E053: 7,342 chars — cohesion + Writing

後半はWriting語数が増える一方、problem-side説明が短くなっており、
E085 60–80 words → E086 80–100 → E087 90–110 の負荷移行は妥当。

P2も一律削減ではなく **lesson function別に再設定**する。
independent timing auditでは、現行平均54.9分に対して中央推定37.1分。regular lessonには余白が大きい一方、複数出力Checkpointは55〜60分が妥当なため、同じ時間規格を使わない。

### P3

平均総文字量は約 **5.2k**。

最大は:
- E204: 7,694 chars — Final Gate
- E192: 7,436 chars — Checkpoint
- E180: 7,177 chars — Checkpoint
- E102: 6,815 chars — Checkpoint

通常回の最大級はE145などで、未知概念を構築する目的に対応している。

後半は本文量を増やすのではなく、
English Summary + Evaluation / Proposal / Trade-off / linked Writing
へ処理負荷が移っている。

したがってP3も一律削減しない。
ただしindependent timing auditでは、regular lessonとCheckpointの差が大きいことが確認された。現行平均56.4分に対して中央推定45.9分で、複数出力Checkpointはほぼ現行維持、単一技能regularは短縮候補となった。

## Final rule

### Learner-facing timing

時間表示は **「問題を解く時間」と「答え・解説を読む時間」を分ける**。

ただし、2026-10-03 independent timing auditにより、phaseごとの一律レンジも粗すぎることが分かった。

今後の原則:
- regular lesson：技能導入・単一技能なら短く鋭く設定
- Checkpoint / Final Gate：複数技能統合のため50〜60分を許容
- 答え・解説・Post-solve：タイマー終了後
- P4：60分 / 90〜120分 / 120分の本番演習時間を維持

provisional target平均:
- P1：37.3分
- P2：41.7分
- P3：48.5分

これは「phase全体を同じ分数にする」という意味ではない。個々のtargetは `management/core99-independent-time-audit.csv` を参照する。

### Workload rule

「難しくする」ために説明・設問・資料を足し続けない。
難易度上昇は主に以下で作る:
- supportを減らす
- sourceを統合する
- reasoning independenceを上げる
- Writingを長くする
- 判断条件を増やす
- timed executionへ移す

単純な文字量増加は難易度勾配として扱わない。

## CI workload guardrails

文字数は教材品質そのものではないため、厳密な目標値ではなく**bloat detection**として使う。

| Phase | Regular problem | Regular answer | Checkpoint problem | Checkpoint answer |
|---|---:|---:|---:|---:|
| P1 | ≤ 5,900 | ≤ 2,900 | ≤ 6,000 | ≤ 2,600 |
| P2 | ≤ 5,800 | ≤ 3,500 | ≤ 6,500 | ≤ 3,000 |
| P3 | ≤ 4,300 | ≤ 3,600 | ≤ 4,500 | ≤ 4,300 |

加えて:
- Core 99は全てlearner-facingの演習時間を持ち、P1→P2→P3でtimed loadが上がる
- 上限超過はCI failure
- 上限を上げる前に、まず重複説明・過剰な設問・不要なsupportを疑う

## Conclusion

文字量監査だけでは、時間設定が妥当かは判断できなかった。

2026-10-03 independent timing auditの結論:
- **P1/P2のregular lessonは現行時間がかなりgenerous**
- P3はregularとCheckpointで分ける必要がある
- mixed-source + Summary + Writing型Checkpointは55〜60分を維持
- 単一技能regular lessonを同じ55〜60分枠へ入れる必要はない
- E204 Final Gateは60分capのstretch testとして維持し、時間を延ばさない

今後は「phaseごとの一律時間」ではなく、**lesson function + 実問題量**で設定する。
