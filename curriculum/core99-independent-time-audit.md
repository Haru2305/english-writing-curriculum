# Core 99 Independent Timing Audit

## Purpose

Core 99の時間設定を、既存の「Core 60分」や各セクションの割当時間から逆算せず、**実際の問題量から独立に再見積もり**する。

対象:
- P1 Core 15
- P2 Core 30
- P3 Core 54
- 合計99回

全99回の数値は `management/core99-independent-time-audit.csv` に保存する。

## Important limitation

これは実受験生100人の実測時間ではない。  
**教材設計QA用のcontent-derived model** である。

したがって「中央推定31.1分なら必ず31分で終わる」という意味ではない。目的は、同じ基準で99回を比較し、

- 明らかに時間を与えすぎている回
- 本番型として妥当な回
- 60分に押し込むには重すぎる可能性がある回

を見つけること。

既存の時間設定は**推定式には入力しない**。推定が終わってから比較値としてのみ使う。

## Model

中央推定では、問題側の実データから以下を積み上げる。

### 1. Input load

問題側に存在する英語・日本語を読む負荷。

中央値:
- English input: **75 words/min**
- Japanese instruction / source text: **350 chars/min**

lower / upper rangeではそれぞれ速い処理・遅い処理を置く。

時間配分そのものの行は除外する。

### 2. Task solving

Q、Language task、構造確認、判断、説明などのactive taskを抽出する。

中央値:
- **1 task unit = 1.6 min**

選択肢を読むだけでなく、根拠確認・推論・短い説明を含む平均処理単位として扱う。

### 3. English output

語数指定を教材本文から直接取得する。

中央値:
- planning
- drafting: **9.5 words/min**
- revision

を別々に加える。

例:
- 60–80 words → target 70 words
- 90–110 words → target 100 words
- 100–120 words → target 110 words

English SummaryとWritingが両方ある場合は両方を数える。

### 4. Japanese output

字数指定を教材本文から直接取得する。

140–170字なら155字として、構想・圧縮・執筆を加える。

### 5. Multiple-source integration

Reading / Source A・B / Table / FAQ / Memo等のsourceが増えるほど、単純な読字時間とは別に統合コストを加える。

### 6. Guide / unfamiliar-concept complexity

Strategy / Guide / Plan、未知概念、高密度文、複数資料、因果、条件付き判断などは追加処理コストを加える。

### 7. Self-check

解答を見る前の自己確認のみ演習時間に含む。  
Post-solve / 答え・解説は含めない。

## Current vs independent estimate

| Phase | Core | Current timed mean | Independent central mean | Mean surplus |
| --- | ---: | ---: | ---: | ---: |
| P1 | 15 | **49.5 min** | **31.1 min** | **+18.4 min** |
| P2 | 30 | **54.9 min** | **37.1 min** | **+17.8 min** |
| P3 | 54 | **56.4 min** | **45.9 min** | **+10.5 min** |

結論は明確で、**現行時間は全体としてかなり generous**。

特にP1/P2は、「教材を60分枠に収める」設計が先にあり、実際の問題量に対して時間が余る回が多い。

P3は事情が違う。後半ほどEnglish Summary + Writing、複数資料、条件付き判断が重なり、現行55–60分が妥当な回が増える。

## Phase findings

### P1

15回すべてで、独立推定より現行時間が長い。

現行平均:
- 49.5分

中央推定:
- 31.1分

P1は基礎形成なので中央推定ぴったりまで削る必要はないが、**毎回約50分を標準にする根拠は弱い**。

provisional target:
- regular: 30–45分
- Checkpoint: 40–50分

平均 target:
- **37.3分**

特に大きな余白:
- E008: 51 → estimate 20.3
- E015: 51 → 22.1
- E027: 50 → 24.2

### P2

現行平均:
- 54.9分

中央推定:
- 37.1分

30回中:
- 大幅短縮候補: 21
- 軽度短縮候補: 6
- ほぼ維持: 3

P2は最も「全部ほぼ60分」に引っ張られている。

大きな余白:
- E043: 53 → estimate 21.1
- E079: 54 → 26.1
- E080: 54 → 19.8
- E091: 54 → 20.9

一方、出力統合が進んだ回は60分近くが妥当:
- E084: 57 → estimate 56.7
- E090: 58 → estimate 約60
- E096: 59 → estimate 約64

E096は50–65語summary + 日本語55–75字 + 90–110語Writingまで含む。  
**時間を延ばすのではなく、P2 Final Checkpointとして60分制約を維持するなら、意図的なstretch testとして明記するか、出力量を再検討する対象**。

### P3

現行平均:
- 56.4分

中央推定:
- 45.9分

54回中:
- 大幅短縮候補: 22
- 軽度短縮候補: 5
- ほぼ維持: 25
- overload review: 2

P3は一律短縮してはいけない。

Writing / Summary / mixed-sourceを統合するCheckpoint群は、現在の55–60分がかなり合理的。

維持寄りの例:
- E102: 59 → estimate 59.3
- E108: 59 → 57.0
- E113: 58 → 59.3
- E141: 55 → 55.9
- E150: 55 → 55.3
- E180: 58 → 57.0
- E198: 58 → 58.3

一方、単一技能を深く扱うregular lessonには余白が大きい:
- E104: 55 → estimate 26.7
- E190: 54 → 20.1
- E194: 56 → 18.6
- E201: 58 → 19.1

これは「簡単」という意味ではない。  
**一技能を精密に扱う教材を、複数出力型Checkpointと同じ60分近い時計で測っていた**ことが問題。

## Tight / overload review

### E144

current timed:
- 55分

central estimate:
- 60.1分

Passage A + Passage B/Table + questions + English summary + Writingを切り替えるため、60分級が妥当。

対応:
- **60分へ寄せる**
- 問題量は削らない

### E204 Final Gate

current timed:
- 58分

central estimate:
- 64.8分

70–85語English Summary + 100–120語Final Writing + 5 questions + Table/Memoを含む。

ここはP3 Final Gateなので、**時間を65分へ緩めない**。

対応:
- learner-facing targetは60分を維持
- 60分で完遂できること自体をexit criterionとする
- ただし実測で未完率が高い場合は、時間延長ではなく設問または出力条件を1つ削る

## Provisional retiming policy

このauditからそのまま「中央推定＝制限時間」にはしない。  
学習教材には考える余白が必要だからである。

そこで provisional target は以下で算出する。

### P1
regular:
- central + 5分
- 30〜45分に収める

Checkpoint:
- central + 4分
- 40〜50分

### P2
regular:
- central + 4分
- 30〜50分

Checkpoint:
- central + 3分
- 45〜60分

### P3
regular:
- central + 3分
- 35〜55分

Checkpoint / Final Gate:
- centralを基準
- 50〜60分
- 60分を超える推定でも原則60分cap。必要なら問題量を調整する

5分単位に丸める。

このpolicyでの平均target:

| Phase | Current mean | Provisional target mean |
| --- | ---: | ---: |
| P1 | 49.5 | **37.3** |
| P2 | 54.9 | **41.7** |
| P3 | 56.4 | **48.5** |

## Interpretation

今回の監査で分かったのは、

> P1 50分 → P2 55分 → P3 60分

という単純な時間勾配では不十分ということ。

必要なのは、

> **技能導入のregular lessonは短く鋭く**
>
> **複数技能を統合するCheckpointは長く本番型に**

という勾配。

P3でも、単一技能回を55分使わせる必要はない。  
逆に、Summary + Writing + mixed sourceを統合する回は55–60分を維持する。

## Decision

1. 現行の一律45–60分ルールは廃止候補
2. 時間はphaseだけでなく**lesson function**で決める
3. regular lessonはcontent-derived targetへ短縮
4. Checkpoint / Final Gateは50–60分で統合負荷を維持
5. E144は60分寄りへ
6. E204は60分capのstretch testとして維持
7. 次の変更では、CSVのprovisional targetを基に各Core教材の時間配分そのものを再配分する

## Files

- model: `site/scripts/audit-core99-time-model.mjs`
- all 99 rows: `management/core99-independent-time-audit.csv`
- existing broad workload audit: `curriculum/core99-workload-audit.md`
