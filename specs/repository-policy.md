# Repository Policy

## Source of truth

GitHubを**教材原稿・仕様・履歴の正本**とする。

Google Driveは**Published / learner-facing surface**として維持する。

## Workflow

1. GitHub上でDRAFT原稿を作る
2. QAを実施
3. QA Passした教材をDriveへPublished
4. Drive Published URLをmanagement manifestへ同期
5. learner IndexへPublishedのみ追加
6. GitHubへ最終状態をcommit

## Immutability

Drive上のPublished教材は原則freezeする。

修正が必要な場合:
- GitHubで変更履歴を残す
- 必要ならversionを上げる
- Publishedを無断で上書きしない

## File layout

- `curriculum/`: Phase / sequence design
- `specs/`: template / compiler / QA policy
- `bundles/Bxxx/`: lesson source
- `management/`: manifests / dependency exports

## Lesson filenames

`bundles/B030/E180.md`

教材IDを主キーとする。題名変更でpathを変えない。

## Commit style

例:
- `Add B031 draft materials`
- `QA B031 and prepare publish`
- `Publish B031 / E181-E186`
- `Revise P4 Tsukuba timing plan`

Bundle単位の変更を基本とし、細かな修正でも教材IDをcommit messageに含める。
