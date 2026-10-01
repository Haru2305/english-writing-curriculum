# Representative Viewer Audit

## Purpose

E001で固めた learner-facing viewer を E002–E234 へ一般化する前に、形式の異なる代表教材で崩れないかを確認する。

共通化の対象は「同じ見た目」ではなく、次の学習リズム。

- START
- CHALLENGE
- optional WRITE
- REVIEW
- 問題単位の解説
- 必要箇所をすぐ参照できる REFERENCE
- 内部コードを見せない

教材固有の課題形式は残す。

## Implementation status

- E001: interaction baseline
- E049: implemented; optional WRITE and multiple task groups verified
- E097: implemented in representative viewer; multi-source REFERENCE (Reading + Data Table) and lesson-specific WRITE MAP under verification
- E145 / E193 / E205: pending implementation

## Representative lessons

### E049 / P2 / context vocabulary

Source: `bundles/B009/E049.md`

特徴:
- Strategy
- Reading
- Context Check 1–4
- Questions Q1–Q2
- WRITEなし
- 文脈語義の解説が中心

Viewer mapping:
- START: 今日の狙い + Strategy + optional Gloss
- CHALLENGE: Reading + Context Check + Questions
- WRITE: 省略
- REVIEW: Context Check 1–4 と Q1–Q2 を別の task group として問題単位で表示

必要なREFERENCE:
- passage全文だけでなく、Context Checkでは該当文を短く参照できること

### E097 / P3 / passage + data table + writing

Source: `bundles/B017/E097.md`

特徴:
- P3 Strategy
- Reading
- Data Table
- Questions
- 100–120 word Writing Task
- criteria / trade-off / evidence integration

Viewer mapping:
- START: 今日の狙い + P3 Strategy
- CHALLENGE: Reading + Data Table + Questions
- WRITE: Writing Task
- REVIEW: Q1 / Q2 / Writing を分ける

必要なREFERENCE:
- Readingだけでなく Data Table も参照対象
- REVIEWのREFERENCEは単一本文固定ではなく複数sourceを扱える必要がある

### E145 / P3 / unknown concept + claim check + short output

Source: `bundles/B025/E145.md`

特徴:
- Reading
- Questions Q1–Q4
- Claim Check
- Short Output
- unknown-concept strategy

Viewer mapping:
- START: 今日の狙い
- CHALLENGE: Reading + Questions + Claim Check
- WRITE: Short Output
- REVIEW: Q1–Q4 / Claim Check / Short Output を別task groupとして表示

注意:
- WRITE MAPを常に Answer → Reason → Mechanism → Support に固定しない
- この教材では definition → components → limitation の方が学習内容に合う
- WRITE MAPはlesson contentから導くか、authoring metadataとして管理する

### E193 / P3 / paragraph function + sentence insertion

Source: `bundles/B033/E193.md`

特徴:
- paragraph labels [1]–[6]
- Candidate Sentence
- paragraph function
- sentence insertion
- Questions Q1–Q5
- Short Output

Viewer mapping:
- CHALLENGE: Reading + Candidate Sentence + Questions
- WRITE: Short Output
- REVIEW: Q1–Q5 / Short Output

必要なREFERENCE:
- paragraph番号を保持する
- Candidate Sentenceを本文参照から落とさない
- insertion問題では直前・直後の段落をすぐ比較できること

### E205 / P4 / exam-style long reading

Source: `bundles/B035/E205.md`

特徴:
- Passage
- 日本語30 / 50 / 60字記述
- 見出し
- 空所
- 並べ替え
- WRITEなし
- 深いpost-solve解説より試験処理が主役

Viewer mapping:
- START: 今日の狙い + 時間配分
- CHALLENGE: Passage + Questions
- WRITE: 省略
- REVIEW: 1–6を問題単位で表示 + 自己修正

注意:
- 問題IDは必ずしも Q1 形式ではない
- 日本語記述もtaskとして扱える必要がある
- P4へE001の6-part explanationを強制しない

## Generalization requirements

### 1. Source headings and learner roles must be separated

sourceの見出し名をそのままUI構造にしない。

renderer内部では最低限:

- setup
- source material
- task group
- writing task
- support
- answer group
- reasoning
- takeaway

のような learner role へ変換する。

### 2. WRITE is optional

英語を作る課題がない教材ではWRITEを表示しない。

空のWRITEをシリーズ統一のためだけに作らない。

### 3. Task groups are first-class

REVIEWは「Answer section」「Explanation section」を縦に並べるのではなく、原則としてtask単位で対応づける。

対応対象は:

- Q1 / Q2...
- 1 / 2 / 3...
- Context Check
- Claim Check
- Language Focus
- Writing Task
- Short Output

など。

### 4. REFERENCE supports multiple source types

REFERENCEをReading本文専用にしない。

参照対象になり得るもの:

- Reading / Passage
- Data Table
- Candidate Sentence
- 図表・資料
- 問題文そのもの

mobileではbottom sheet、desktopではsplit viewという操作原則は維持する。

### 5. Preserve source locators

参照に必要なlocatorを失わない。

例:
- paragraph [1]–[7]
- table row / option name
- Candidate Sentence
- question number

### 6. Orientation cues are not globally hardcoded

KEYSやWRITE MAPをE001のようにページコードへ手書きしたまま全234教材へ展開しない。

優先順位:
1. canonical lesson中の明示的なstrategy / explanationから抽出
2. 既存metadataから導出
3. 必要なら小さいauthoring metadataを追加

viewer独自の学習内容を大量に持たない。

### 7. Do not force one explanation depth

P1–P3の論証教材では思考導出を厚くしてよい。

P4の試験演習では:
- 問題処理
- 根拠
- 時間内での判断
を優先し、6-part explanationを機械的に足さない。

## Gate before E002–E234 expansion

少なくとも E049 / E097 / E145 / E193 / E205 で以下を確認する。

- lesson role mappingが破綻しない
- optional WRITEが正しく消える
- task groupごとにREVIEWが対応する
- REFERENCEが複数sourceを扱える
- paragraph / table等のlocatorが保たれる
- internal codeがlearner-facingに漏れない
- KEYS / WRITE MAPがlesson-specificに生成できる
- source contentをdisplay convenienceのために書き換えていない

このgateを通過してから全教材rendererへ一般化する。
