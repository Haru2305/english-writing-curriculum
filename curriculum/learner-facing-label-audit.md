# Learner-facing label audit — E001–E234

## Scope

E001–E234 全234教材について、学習者が実際に見るページ上へ制作・QA用の内部表記が漏れていないかを監査した。

対象:
- document title
- lesson `h1`
- learner-facing meta
- problem / support / REVIEW の見出し
- REVIEWを展開した後の本文行
- generic 226教材
- dedicated 8教材（E001 / E049 / E087 / E097 / E145 / E193 / E205 / E208）

教材本文・E番号・教材数は変更しない。

## Internal labels treated as authoring-only

主な対象:
- `B017` などの bundle ID
- `Bundle 1`
- `P2 Bridge`
- `P2 Final Checkpoint`
- `P3 Strategy`
- `P3 Final Gate`
- `P4 Final Gate`
- `Checkpoint`
- `Final Gate`
- `LEXG195`, `WF06`, `RQ12`, `ARG01` などの内部スキルコード

`E001`〜`E234` は learner-facing lesson ID として許可する。

## Important false positive

`P1`〜`P4` は制作phase IDとして使われる一方、一部教材では **Paragraph 1–4 の略記**として問題・解答に正当に使われる。

そのため `P[1-4]` を全面削除する実装は採用しない。

phase IDとしての文脈:
- `P2では`
- `P3 Strategy`
- `P3 Final Gate`
- `P4へ`
- `P4完了`

paragraph labelとして保持する文脈:
- `P1:`
- `P1〜P4について`
- `P2 explains ...`

## Baseline

source-level diagnostic:
- corpus: 234
- dedicated: 8
- source hit count: 704
- title hits: 39
- REVIEW heading hits: 402
- meta-source hits: 234

source hit はそのまま learner-facing leak を意味しない。既存の `toLearnerText()` が `LEXGxxx` / `WFxx` 等を表示時に除去していたため、実ブラウザ監査を追加した。

initial rendered browser audit:
- pages: 234
- affected pages: **55**
- findings: **309**

代表例:
- E006: `Bundle 1 Checkpoint`
- E048: `P2 Bridge 1 Checkpoint`
- E060: `B010 Checkpoint`
- E097: `P3 Strategy`
- E102: `B017 Checkpoint`
- E204: `P3 Final Gate`
- E210: `筑波B035 Checkpoint`
- E234: `筑波P4 Final Gate`

## Fix

表示層を2種類に分けた。

### `toLearnerLabel()`

title / heading 専用。

例:
- `Bundle 1 Checkpoint｜...` → `チェック回｜...`
- `B017 Checkpoint：...` → `チェック回｜...`
- `P2 Final Checkpoint：...` → `最終チェック｜...`
- `P3 Final Gate：...` → `最終チェック｜...`
- `筑波B035 Checkpoint：...` → `筑波 チェック回｜...`
- `筑波P4 Final Gate：...` → `筑波 最終チェック｜...`
- `P3 Strategy` → `実戦の進め方`

### `toLearnerText()`

本文行専用。

既存の skill-code stripping に加え、制作bundle / phaseを参照する説明文だけを learner-facing wording へ変換する。

例:
- `B018で再訪した...` → `ここまでで再確認した...`
- `P2では...` → `この段階では...`
- `P3で扱った...` → `ここまでで扱った...`
- `P4へ移行可` → `筑波対策へ進める`
- `Checkpoint Plan` → `確認回の時間配分`
- `Final Gate` → `最終確認`

canonical bundle sourceは保持し、表示時だけ変換する。

## Dedicated pages

dedicated 8教材も generic renderer と同じ `toLearnerLabel()` を title に使用するよう統一した。

learner-facing description からも `prototype`, `代表教材`, `P4実戦` などの制作語を除いた。

## Final rendered audit

修正後に mobile viewport 390×844 で全234ページを実ブラウザ走査し、すべての `details` を開いた状態で以下を確認した。

- document title
- h1
- learner meta
- h2 / h3 / summary
- body visible text

結果:
- pages: **234**
- affected pages: **0**
- findings: **0**

## Permanent guardrail

一時的な Playwright 全件監査は削除した。

通常CIでは `site/scripts/audit-learner-labels.mjs` が、
- 全234教材の learner-facing title / heading / body text を表示変換後に監査
- dedicated 8教材が `toLearnerLabel()` を使っていることを監査
- bundle ID / Bundle / Checkpoint / Final Gate / internal skill code の再流入を fail
- P1–P4 は paragraph label と phase ID を文脈で区別

する。

目標は **canonical authoring metadataを保持しながら、学習者にはE番号と学習上必要な表記だけを見せること**。
