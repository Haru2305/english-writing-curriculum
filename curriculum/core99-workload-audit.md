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

P1全体を45分へ一律短縮する変更はしない。
15回へのルート圧縮と解説軽量化がすでに効いており、Checkpointを含めて1回60分以内で完結する方が運用が単純なため。

### P2

平均総文字量は約 **5.4k**。

最大は:
- E054: 8,301 chars — Checkpoint
- E048: 8,240 chars — Checkpoint
- E055: 7,368 chars — paragraph-function intensive lesson
- E053: 7,342 chars — cohesion + Writing

後半はWriting語数が増える一方、problem-side説明が短くなっており、
E085 60–80 words → E086 80–100 → E087 90–110 の負荷移行は妥当。

P2は一律削減しない。

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

## Final rule

Core lessonは原則 **45–60分以内**に収める。

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
- Core 99は全て45–60分の明示的な時間枠を持つ
- 上限超過はCI failure
- 上限を上げる前に、まず重複説明・過剰な設問・不要なsupportを疑う

## Conclusion

Core 99は、現時点では全体をさらに短くする必要はない。

調整すべきなのは「重い回を一律に削る」ことではなく、
**通常回の異常なbloatだけを見つけて削ること**。

今回の実修正はE002のみ。
P2/P3の最大値はCheckpoint / Final Gateに集中しており、意図された実戦負荷として維持する。
