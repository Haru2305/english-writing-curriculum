# Mobile Lesson Viewer

E001–E234をスマホで読みやすく表示するための静的ビューア。

## Prototype scope

現在はE001のみ。

- 閲覧専用
- ログインなし
- DBなし
- 答案入力なし
- 進捗保存なし
- 問題を先に表示
- 解答・解説は `details` で開閉
- 教材本文は `bundles/` を正本としてbuild時に直接読む

## Local

```bash
cd site
npm install
npm run dev
```

## Build

```bash
cd site
npm install
npm run build
```

生成物は `site/dist/`。

## Cloudflare Workers Static Assets

Git連携時:

- Production branch: `main`
- Root directory: `site`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`site/wrangler.jsonc` の `assets.directory` が `./dist` を配信対象として指定する。

静的サイトなのでWorkerコードやDBは不要。

## Expansion

E001のUI確認後に、同じrendererをE001–E234へ展開する。
教材本文を `site/` 側へ複製せず、GitHubの `bundles/Bxxx/Exxx.md` を読み取る構成を維持する。
