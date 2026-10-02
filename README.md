# English Writing Curriculum

大学受験英作文に特化した教材作成リポジトリです。

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

- Published: **B001–B039**
- Materials: **E001–E234**
- Current phase: **P4 Tsukuba / B039 completed (Day 1–30 / P4 complete)**
- Material count: **frozen at E234**
- Current content work: **curriculum compression and cross-corpus QA / no new lesson IDs**
- P1 default route (2026-10 onward): **15 Core lessons + 27 Targeted Review lessons**; full E001–E042 corpus remains available
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
│   ├── p1-accelerated-route.md
│   ├── content-framework.md
│   ├── argument-construction.md
│   ├── argument-bridge-revisions.md
│   ├── self-assessment.md
│   ├── self-assessment-revisions.md
│   ├── grading-calibration.md
│   ├── learner-facing-concepts.md
│   ├── priority-b-review.md
│   ├── post-solve-priority-b.md
│   ├── priority-c-review.md
│   └── p4-tsukuba.md
├── bundles/
│   └── README.md
├── management/
│   ├── README.md
│   ├── material-manifest.csv
│   ├── idea-bank.csv
│   ├── idea-axis-map.csv
│   ├── material-axis-map.csv
│   ├── idea-learning-path.csv
│   ├── post-solve-priority-a.csv
│   ├── priority-b-review.csv
│   ├── post-solve-priority-b-selected.csv
│   ├── priority-c-review.csv
│   ├── writing-type-argument-map.csv
│   ├── argument-bridge-selected.csv
│   ├── self-assessment-map.csv
│   ├── self-assessment-selected.csv
│   ├── self-assessment-metadata-fix.csv
│   ├── self-assessment-audit.md
│   ├── grading-calibration-audit.md
│   ├── model-answer-wordcount-fixes.csv
│   ├── explanation-work-queue.csv
│   ├── explanation-worker-a.md ... explanation-worker-e.md
│   ├── argument-construction-audit.md
│   └── content-axis-audit.md
└── specs/
    ├── repository-policy.md
    ├── qa-policy.md
    ├── explanation-policy.md
    ├── explanation-worker-prompt.md
    └── mobile-viewer.md
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


## Content architecture

E001–E234 are now treated as a fixed corpus. The curriculum-wide content system is defined in:

- `curriculum/content-framework.md`
  - TH01–TH10: reusable thinking operations
  - EV01–EV10: evaluation criteria
  - relationship to Topic family / Idea Bank / WF / WT / WQ
  - tagging and selective revision rules
- `management/idea-bank.csv`
  - canonical Idea Bank export, IDEA0001–IDEA0078
- `management/idea-axis-map.csv`
  - canonical mapping of IDEA0001–IDEA0078 onto TH / EV
- `management/material-axis-map.csv`
  - E001–E234 → Idea / TH / EV
- `curriculum/learner-facing-concepts.md`
  - 27 Learner-facing Core concepts and Introduce / Recall / Transfer rules
- `management/idea-learning-path.csv`
  - machine-readable learning paths for the 27 Core ideas
- `curriculum/argument-construction.md`
  - ARG01–ARG06: thought → reason → mechanism → support → qualification → decision
- `management/writing-type-argument-map.csv`
  - WF01–WF07 → recommended argument-function routes
- `management/argument-construction-audit.md`
  - audit of the bridge from idea generation to written argument
- `management/argument-bridge-selected.csv`
  - four selected bridge revisions: E087 / E117 / E119 / E208
- `curriculum/self-assessment.md`
  - SA00–SA04: Task → Argument → Meaning → Precision → Naturalness
- `management/self-assessment-audit.md`
  - audit of self-check / WQ / WR / AC alignment
- `curriculum/grading-calibration.md`
  - SA-A/B/C vs SET-A/B/C and cross-phase calibration rules
- `management/grading-calibration-audit.md`
  - phase-wide calibration audit
- `management/model-answer-wordcount-fixes.csv`
  - 38 corrected model-answer word-count mismatches
- `specs/explanation-policy.md`
  - canonical six-part explanation / reasoning framework for selective E001–E234 enrichment
  - emphasizes problem core → reasoning path → weak-vs-strong comparison → ARG build → model-answer reading → transfer
- `specs/explanation-worker-prompt.md`
  - reproducible instructions for parallel worker chats
- `management/explanation-work-queue.csv`
  - five non-overlapping worker ranges covering B001–B039 / E001–E234

The material remap, Core review, argument-construction layer, self-assessment alignment, and grading calibration are complete. Self-check follows Task → Argument → Meaning/Correctness → Precision → Naturalness. Writing diagnosis (SA) is separated from P4 full-set execution diagnosis (SET). A model-answer audit corrected 38 explicit word-count mismatches and passed 38/38 Drive readback QA. No E235+.


## Mobile learner viewer

A read-only smartphone viewer prototype lives under `site/`.

Canonical UI constraints are defined in `specs/mobile-viewer.md`:
- smartphone-first
- no login / DB / input / progress tracking
- lesson content remains canonical under `bundles/`
- answer/explanation is hidden until the learner opens it
- initial prototype is E001 only
- intended static host: Cloudflare Workers Static Assets
