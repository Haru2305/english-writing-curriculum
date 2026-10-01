# Management

GitHubでは、人間・AI双方が監査しやすい軽量な管理データを保持する。

Primary files:
- `material-manifest.csv`: 教材ID / 題名 / Phase / Bundle / Published URL / QA
- `idea-bank.csv`: Canonical Idea Bank（IDEA0001–IDEA0078）
- `idea-axis-map.csv`: IDEA0001–IDEA0078 → TH / EV
- `material-axis-map.csv`: E001–E234 → Primary TH / Secondary TH / EV
- `idea-learning-path.csv`: 27 Learner-facing CoreのIntroduce / Recall / Transfer経路・反映状況
- `post-solve-priority-a.csv`: Priority A 10概念 / 33教材のPost-solve改訂台帳
- `priority-b-review.csv`: Priority B 14概念の選別監査
- `post-solve-priority-b-selected.csv`: Priority Bで選択した4教材の改訂台帳
- `priority-c-review.csv`: Priority C 3概念の改訂不要監査
- `writing-type-argument-map.csv`: WF01–WF07 → ARG01–ARG06の推奨route
- `argument-bridge-selected.csv`: 論証生成の共通回路を見せる4教材の改訂台帳
- `self-assessment-map.csv`: SA00–SA04自己採点順序と既存WQ/ARG/ACの対応
- `self-assessment-selected.csv`: E087/E208の自己採点改訂台帳
- `self-assessment-metadata-fix.csv`: P1作文35教材のWQ00タグ補修台帳
- `self-assessment-audit.md`: 自己採点・添削体系の監査
- `grading-calibration-audit.md`: Phase横断のA/B/C・AC・SET校正監査
- `model-answer-wordcount-fixes.csv`: モデル答案38件の語数校正台帳
- `argument-construction-audit.md`: 思考部品→論証→英作文の橋渡し監査
- `content-axis-audit.md`: E001–E234 content-axis coverage audit
- `explanation-work-queue.csv`: 解説充実の並列作業担当表（A–E）
- `explanation-worker-a.md` – `explanation-worker-e.md`: 各workerの進捗・QA・commit報告
- 将来追加: `dependencies.csv`
- 将来追加: `bundle-manifest.csv`

Google Sheetsは日常運用UIとして継続利用するが、GitHub側にも復元可能なexportを置く。

Current Drive management sheet:
https://docs.google.com/spreadsheets/d/1PFCTuZm8o0O65d2ru957EjBw1s2Zf4PAiqJYS4w_YCo/edit
