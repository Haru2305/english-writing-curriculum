# P4 — 筑波大学医学類 30-Day Plan

## Goal

P3で作った汎用力を、筑波大学医学群医学類の英語で安定して得点できる処理手順へ変換する。

## 30-day architecture

### Days 1–8 — Part drills / 60 min

狙い:
- 筑波型の長文処理
- 設問形式への適応
- 記述の粒度
- 英作文の構成→執筆→見直し
- 時間配分の初期固定

1日1教材、Core約60分。

### Days 9–18 — Semi-full / 90–120 min

狙い:
- 複数セクションを連結
- 前半の個別処理をセット内で切替
- 本番時間への漸近
- 後半失速の検出とRepair

### Days 19–30 — Full / 120 min

狙い:
- 原則120分通し
- 本番と同じ順序選択・時間管理
- 読解→記述→英作文→見直しを一回で完結
- 過去問または形式忠実な模試型を中心化

## Bundle allocation

- B035: Days 1–6
- B036: Days 7–12
- B037: Days 13–18
- B038: Days 19–24
- B039: Days 25–30

B038–B039は原則フルセット中心。

## Authoring gate

P4本文の本格作成前に必ず確認:
1. 2027年度公式募集要項
2. 英語の試験時間
3. 大問構成
4. 記述形式
5. 英作文の有無・字数・要求
6. 過去問での近年傾向

公式条件と教材設計が衝突した場合、公式条件を優先する。


## Verified format basis

As of 2026-09-30:

- University of Tsukuba official 2026 general-selection schedule: foreign language 10:00–12:00 (120 minutes) for the medical program on the first examination day.
- University FAQ: no listening test in the second-stage examination.
- University 2027 selection outline is published, but the detailed 2027 general-selection application guidelines are not yet available.
- Akahon / Kyogakusha trend summary: typically three major questions; Questions 1–2 are long reading passages; Question 3 since 2020 combines reading-based word-order/grammar work and English composition; written Japanese explanation and other constructed responses are common; composition tasks are generally in roughly the 50–100-word range.

Sources:
- https://ac.tsukuba.ac.jp/apply/application-guidelines/
- https://ac.tsukuba.ac.jp/wp/wp-content/uploads/2025/10/R8_kobetu_sec.pdf
- https://ac.tsukuba.ac.jp/consultation/faq/
- https://akahon.net/university/tendency_countermeasure/tsukuba

### Revalidation gate

Before the learner actually enters P4, re-check the 2027 official detailed guidelines and any newly available 2026/2027 exam evidence. If official conditions differ, update P4 materials before use.

## P4 design version

`TPL-v4-P4-TSK`

B035 Days 1–6:
1. Q1-style long reading / 30–60-character Japanese explanation / cloze / heading / order
2. Q2-style long reading / 40–80-character Japanese explanation / cloze / sentence insertion
3. Q3A-style three word-order items / designated 3rd and 5th positions
4. Q3B-style about-100-word free composition
5. 30/50/60/90-character Japanese explanation packing
6. 60-minute mixed-format Tsukuba checkpoint

B036 Days 7–12:
7. final 60-minute Q1-style speed drill / strict Japanese explanation / cloze / heading / order
8. final 60-minute Q3 integration / three word-order items + about-100-word free composition
9. 90-minute Semi-full A / Q1-style reading + Q3A + Q3B
10. 100-minute Semi-full B / Q2-style science reading + Q3A + Q3B
11. 110-minute Semi-full C / Q1-style reading + Q2-style reading
12. 120-minute B036 Checkpoint / Q1 + Q2 + Q3A + Q3B

B037 Days 13–18:
13. 100-minute Semi-full D / Q1 + Q2 + Q3A; protect designated-position accuracy after reading fatigue
14. 110-minute Semi-full E / Q1 + Q2 + Q3B; protect about-100-word composition after reading fatigue
15. 120-minute Semi-full F / first stabilized Q1 + Q2 + Q3A + Q3B run
16. 120-minute Semi-full G / heavier front half; preserve Q3A/Q3B accuracy
17. 120-minute Semi-full H / overrun-recovery drill with absolute section stop-times
18. 120-minute B037 Checkpoint / final semi-full gate with protected review time

B038 Days 19–24:
19. 120-minute Full A / first full-set transition with hard section stop-times
20. 120-minute Full B / denser Q1 reading while preserving late-section accuracy
21. 120-minute Full C / high-density strict-character Japanese responses + Q3B
22. 120-minute Full D / compare stable answer-order routes under fixed budgets
23. 120-minute Full E / difficult-item stop-loss and recovery without dropping later sections
24. 120-minute B038 Checkpoint / full-set gate with strict timing and protected final review


## Recent-paper matrix (2023–2026)

### 2023
- Q1 / Q2: long reading with multiple Japanese content-explanation questions.
- Japanese answer examples include roughly 24–67 characters.
- Q3A: 3 word-order questions.
- Q3B: free composition; third-party model answer 83 words.

### 2024
- 120 minutes, 3 major questions.
- Q1: approximately 980 words; Japanese explanation (30 / 50 / 30 characters), cloze, heading matching, chronological ordering.
- Q2: approximately 600 words; Japanese explanation and cloze-centered comprehension.
- Q3A: 3 word-order questions.
- Q3B: research-related free composition.
- Direct translation was not the central output; short Japanese explanation was.

### 2025
- Q1: predictive-processing passage; several 30–50-character Japanese explanation / summary items.
- Q2: creativity-research history; includes a high-load 89-character three-stage summary.
- Q3A: 3 word-order items; designated 3rd / 5th words.
- Q3B: opinion writing; published third-party model answer 82 words.

### 2026
- Q1: animal-reference / “who” vs “that” passage; Japanese 50–60-character explanation, cloze, content choice.
- Q2: rogue-planet science passage; Japanese 40–60-character explanation, cloze, sentence insertion.
- Q3A: 3 word-order items with designated word positions.
- Q3B: identify the health challenge with the greatest effect on one’s generation, explain why, and give a concrete example in about 100 words.

## P4 priority after paper review

1. Strict-character-limit Japanese content explanation
2. Long-passage logical structure and reference tracking
3. Contextual cloze / heading / chronology / sentence insertion
4. Word-order reconstruction and designated-position accuracy
5. Roughly 80–100-word free composition with direct answer, reason, and concrete example

B035 was recalibrated on 2026-09-30 to reflect this matrix. Generic T/F-heavy practice and artificial “use two source ideas” constraints were removed from the priority design.

## Source-access note

The University of Tsukuba does not publish the main English front-exam paper on its official past-question page because the front-exam papers are supplied to publishers and include third-party copyrighted material. The format matrix above is cross-checked against:
- University official schedule / FAQ
- 2027 Akahon listing for 2023–2026 English coverage
- detailed 2024 question commentary
- detailed 2025 question commentary based on Obunsha / exam material
- detailed 2026 multi-year paper analysis


## Current authoring status

- B035 / E205–E210: Published
- B036 / E211–E216: Published
- B037 / E217–E222: Published
- B038 / E223–E228: Published
- Coverage: Days 1–24
- Status date: 2026-09-30
- Next: B039 / Days 25–30 — final 120-minute full-set repetition and weak-point correction
- Revalidation of 2027 detailed official guidelines required before learner use.
