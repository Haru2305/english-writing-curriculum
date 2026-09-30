# English Writing Curriculum

東京科学大学医学部の学習支援プロジェクトとして設計している、大学受験英語の長期カリキュラム管理リポジトリです。

## Canonical source policy

- **GitHub = 正本**
  - 教材原稿
  - Phase設計
  - テンプレート仕様
  - QA / Compilerルール
  - Bundle構成
  - 管理用CSV/Markdown
  - 変更履歴
- **Google Drive = Published / learner-facing**
  - 実際に解くGoogle Docs教材
  - 教材Index
  - 日常の進捗確認
  - 人間向けの閲覧・配布

GitHubで編集・監査した内容をQA通過後にDriveへPublishedする。

## Current status

- Published: **B001–B034**
- Materials: **E001–E204**
- Current phase: **P3 completed / P4 Tsukuba next**
- P3 final section: **B031–B034**
- Planned P3 end: **E204前後**
- P3 Final Gate: **B034**
- P4 target: **筑波大学 医学群 医学類**
- P4 period: **2027-01-26 – 2027-02-24**
- P4 materials: **B035–B039 / E205–E234**
- P4 schedule:
  - Day 1–8: 60 min / 筑波型パーツ演習
  - Day 9–18: 90–120 min / 準フルセット
  - Day 19–30: 120 min / フルセット中心

## Repository layout

```text
english-writing-curriculum/
├── README.md
├── curriculum/
│   ├── phase-design.md
│   └── p4-tsukuba.md
├── bundles/
│   └── README.md
├── management/
│   ├── README.md
│   └── material-manifest.csv
└── specs/
    ├── repository-policy.md
    └── qa-policy.md
```

Bundle本文は順次 `bundles/Bxxx/Exxx.md` へ移行する。

## Drive surfaces

- Root Drive folder  
  https://drive.google.com/drive/folders/1hyfiyB2nhtPeGy_xGOYiw8GW_reUt6FW
- Learner Index  
  https://docs.google.com/document/d/1xYE7GPuKAKgnEVRHHLYEcnsIH4FKbsOrX82Z6HbhWDg/edit
- Management spreadsheet  
  https://docs.google.com/spreadsheets/d/1PFCTuZm8o0O65d2ru957EjBw1s2Zf4PAiqJYS4w_YCo/edit

## Status vocabulary

- `DRAFT`: authoring / QA前
- `Published`: Driveで学習用に固定
- `Pass`: QA通過
- `Valid`: learner-facing indexに載せてよい
- `Checkpoint`: 累積技能を本番条件で確認する教材
