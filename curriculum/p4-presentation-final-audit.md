# P4 Presentation Final Audit — 2026-10-02

## Scope

E205–E234 learner-facing REVIEW presentation only.

This pass does not add exercises or change the P4 curriculum sequence. It checks whether a learner can immediately distinguish:

1. compact answer key
2. question-by-question explanation
3. model writing / Writing explanation
4. reusable reasoning notes
5. self-correction / attainment / exam procedure

## Findings

### 1. Compact answer lists were incomplete

Before this pass, only E210, E216, and E234 had the generic compact `解答一覧` structure.

All P4 canonical lessons now have a compact answer list at the top of REVIEW.

Rule:
- Japanese constructed response → `解答例は設問解説参照`
- objective choice / ordering → show the actual answer
- Q3A word order → show designated 3rd / 5th chunks directly
- Q3B → `モデル答案はWriting解説参照`

Long Japanese responses and full model essays are not duplicated inside the compact list.

### 2. Word-order answer lists are synchronized

A first automated pass exposed a real failure mode: when generating a compact list, a later item's 3rd / 5th positions could be picked up accidentally.

The corrected generator stops as soon as both designated positions for the current item are found.

CI now compares every P4 `n 完成` section against its compact answer-list row and fails if the two disagree.

### 3. Model writing now has its own visual category

Previously, model essays were classified visually as ordinary `設問解説`.

They are now classified as:

**Writing解説**

The generic viewer gives model-writing blocks their own review style, separate from:
- direct question explanation
- reusable learning notes
- attainment / exam-procedure blocks

This preserves the distinction the learner needs:
**answer → why that answer → how a full piece of writing works → what to reuse next time**.

### 4. E208 dedicated viewer bug

E208's canonical model is `Model answer (99 words)`.

The dedicated E208 page was still looking for `Model answer (95 words)`, which could leave the model-answer display out of sync.

The dedicated renderer now detects `Model answer (N words)` dynamically and shows the actual current word-count label.

### 5. Dedicated pages

E205 already has a dedicated staged REVIEW:
- answer overview
- problem-by-problem explanation
- next-step notes

E208 already has a dedicated model-writing view:
- model answer
- sentence-role map
- reasoning
- next-step notes

Their canonical Markdown now also carries the common `解答一覧` invariant, while the dedicated UI may present that information in its more specialized layout.

## Final hierarchy

For generic P4 lessons:

**解答一覧**
→ **設問解説**
→ **Writing解説**
→ **思考・転用 / 振り返り / 到達判定 / 本番手順**

This is the final learner-facing hierarchy for P4 REVIEW.

No new lesson content is required.
