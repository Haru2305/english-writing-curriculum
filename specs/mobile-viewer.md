# Mobile Viewer Specification

## Purpose

**解く側がスマートフォンだけで問題セットを見やすく読む**ための learner-facing viewer。

これは答案入力・採点・進捗管理アプリではない。

## Hard constraints

- smartphone-first
- read-only
- no account / login
- no database
- no answer submission
- no text input
- no progress tracking
- no Supabase
- no server-side application requirement
- no duplicate canonical lesson content under `site/`

## Source of truth

教材本文の正本はGitHubの:

`bundles/Bxxx/Exxx.md`

viewerはbuild時にこの原稿を読み取る。

サイト表示のために教材本文を別コピーとして保守しない。

## Learner-facing series

共通のシリーズ文法・重要度・表示語彙は `specs/learner-series.md` を正本とする。

viewerは教材制作者向けの内部分類を見せるのではなく、解く側が毎回同じ学習リズムを認識できることを優先する。

## Learner flow

1. Bundle / lesson listを見る
2. 教材を開く
3. 問題セットを縦1カラムで読む
4. 解き終わったら「解答・解説を見る」をタップ
5. まずコンパクトな解答一覧を確認する
6. 必要な「設問解説 / Writing解説 / 思考・振り返り」だけ開く
7. 一覧 / 隣接する前後教材へ移動

## Mobile UI rules

- vertical single-column layout
- body text is readable without zoom
- no horizontal two-pane layout
- no wide navigation table
- answer/explanation hidden initially
- REVIEWを開いた直後はcompact answer listだけを直接表示し、詳細解説は段階開示する
- generic REVIEWは「設問解説 / Writing解説 / 思考・振り返り」を別々の折りたたみにする
- dedicated rendererでも前後ナビは代表教材チェーンではなく、実際の隣接lessonを使う
- tap target for answer reveal must be large
- safe-area padding for mobile browsers
- long English passages use normal wrapping, not fixed-width preformatted text
- visual hierarchy should prioritize:
  1. lesson identity
  2. problem
  3. questions / writing task
  4. answer reveal
  5. explanation


## Problem printing

各lesson pageに learner-facing の「問題を印刷」操作を置く。

印刷時:
- browser / OS標準のprint dialogを使う
- A4を基本とする
- lesson identity と問題側（START / CHALLENGE / optional WRITE）だけを出す
- REVIEW / 解答 / 解説 / REFERENCE UI / navigation / print button は出さない
- 問題側の折りたたみ補助要素は、画面上の開閉状態に依存せず印刷内容へ含める
- question blockなど短い意味単位は可能な範囲でpage breakを避ける
- canonical lesson contentから別PDFを生成・保守しない

この機能は印刷用の第二の教材本文を作るものではなく、同じviewer DOMのprint stylesheetとして実装する。

## Platform

Initial implementation:

- Astro static build
- Cloudflare Workers Static Assets
- no Worker application code required

Cloudflare Workers Builds configuration:

- Production branch: `main`
- Root directory: `site`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Static asset directory is defined in `site/wrangler.jsonc` as `./dist`.

## Prototype and representative gate

E001 is the primary interaction prototype.

After E001 approval, do not jump directly to all E001–E234. First validate the renderer against the representative set defined in `specs/representative-viewer-audit.md`:

- E049
- E097
- E145
- E193
- E205

The representative gate checks variation in:
- optional WRITE
- multiple task groups
- tables and other source material
- sentence insertion / paragraph locators
- Japanese descriptive answers
- P4 exam-style lessons

Only after that gate passes should the renderer be generalized to all canonical lessons under `bundles/`.

## Content freeze

The viewer project must not:

- create E235+
- create new exercises
- modify questions merely for display convenience
- modify official answers
- rewrite lesson content as part of frontend work

Frontend defects and curriculum-content defects must remain separate concerns.
