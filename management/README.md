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
- `argument-construction-audit.md`: 思考部品→論証→英作文の橋渡し監査
- `content-axis-audit.md`: E001–E234 content-axis coverage audit
- 将来追加: `dependencies.csv`
- 将来追加: `bundle-manifest.csv`

Google Sheetsは日常運用UIとして継続利用するが、GitHub側にも復元可能なexportを置く。

Current Drive management sheet:
https://docs.google.com/spreadsheets/d/1PFCTuZm8o0O65d2ru957EjBw1s2Zf4PAiqJYS4w_YCo/edit
