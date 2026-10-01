# Generic Viewer Renderer

## Purpose

E001–E234の固定corpusを、教材ごとの手書きページを234個作らずに表示する。

canonicalは引き続き `bundles/Bxxx/Exxx.md`。viewerは表示のためにcanonicalを複製しない。

## Corpus invariant

- E001–E234 = 234教材で固定
- E235+を作らない
- 代表教材8件は専用rendererを維持
  - E001
  - E049
  - E087
  - E097
  - E145
  - E193
  - E205
  - E208
- 残り226教材は共通dynamic routeで表示する
- build時に234件・ID重複・E001/E234境界を検査する

## Architecture

### 1. Catalog

`site/src/lib/lesson-catalog.js`

build時に `bundles/` を走査し、ID / title / phase / bundle / time / canonical pathを取得する。

indexもこのcatalogから生成する。

### 2. Role parser

`site/src/lib/generic-lesson.js`

canonicalの見出しを完全一致のtemplateへ押し込まず、learner-facing roleへ分類する。

- setup
- challenge
- writing
- support
- review

代表例:

- 今日の狙い / 時間配分 / Pre-solve / Strategy → setup
- Reading / Passage / Text / Questions / Part 1–3 → challenge
- Guided Writing / Short Writing / Writing Task / Q3B Writing / Planning → writing
- Self-check / Revision Check → support
- answer marker以降 → review

未知見出しは消さず、challengeまたはreviewのfallbackとして保持する。

### 3. Generic route

`site/src/pages/[lesson].astro`

代表8件を除く226教材をstatic generationする。

learner-facing rhythm:

- START
- CHALLENGE
- optional WRITE
- REVIEW

WRITEが存在しない教材では空のWRITEを作らない。

## Internal codes

generic rolloutでは broad regex で learner text を削らない。

- LEXG / IDEA / ARG / TH / EV / RQ / RF / WF / WQ / WP / WT 等はinternal prefixとして処理
- A / B / D / P / G の短いprefixはdelimiter付きの場合だけinternal codeとして処理
- ordinary learner text beginning with A1 / B1 等を不用意に削らない

## Current scope

このfoundationの目的は、234教材すべてに到達可能な安全なread-only表示を与えること。

代表教材で実装済みの高度な機能、特に:

- task-scoped REFERENCE
- Data Table専用表示
- Candidate Sentence専用表示
- sentence-role model review
- lesson-specific KEYS / WRITE MAP

は、generic rendererへ段階的に吸収する。

generic fallbackのためにcanonical内容を書き換えない。

## Next QA

1. 234ページのbuild成功
2. P1 / P2 / P3 / P4から非代表教材を抽出して表示監査
3. writingあり / なしの両方を確認
4. P4 full-setのPart 1–4分類を確認
5. internal code漏れを確認
6. task-scoped REVIEW / REFERENCEの共通化へ進む
