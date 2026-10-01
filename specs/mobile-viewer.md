# Mobile Viewer Specification

## Purpose

弟が**スマートフォンだけで問題セットを見やすく読む**ための learner-facing viewer。

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

## Learner flow

1. Bundle / lesson listを見る
2. 教材を開く
3. 問題セットを縦1カラムで読む
4. 解き終わったら「解答・解説を見る」をタップ
5. 同じページ内で解答・解説を読む
6. 一覧 / 前後教材へ移動

## Mobile UI rules

- vertical single-column layout
- body text is readable without zoom
- no horizontal two-pane layout
- no wide navigation table
- answer/explanation hidden initially
- tap target for answer reveal must be large
- safe-area padding for mobile browsers
- long English passages use normal wrapping, not fixed-width preformatted text
- visual hierarchy should prioritize:
  1. lesson identity
  2. problem
  3. questions / writing task
  4. answer reveal
  5. explanation

## Platform

Initial implementation:

- Astro static build
- Cloudflare Pages
- no Cloudflare Functions required

Cloudflare Pages configuration:

- Production branch: `main`
- Root directory: `site`
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`

## Prototype gate

First implement E001 only.

Do not expand automatically to E001–E234 until the E001 smartphone presentation has been reviewed for:

- readability
- heading hierarchy
- passage density
- question visibility
- answer reveal behavior
- explanation density
- navigation

After UI approval, generalize the renderer and generate all existing lessons from the canonical `bundles/` tree.

## Content freeze

The viewer project must not:

- create E235+
- create new exercises
- modify questions merely for display convenience
- modify official answers
- rewrite lesson content as part of frontend work

Frontend defects and curriculum-content defects must remain separate concerns.
