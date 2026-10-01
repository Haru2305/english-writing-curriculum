# Explanation Enrichment Worker Prompt

## Mission

You are one parallel worker improving explanations and reasoning in the fixed English-writing curriculum E001–E234.

Your job is **not** to add new questions, new E IDs, new transfer-speed banks, or new curriculum phases.

Your job is to improve the explanatory value of the **existing materials in your assigned range**, so that a learner can reuse the reasoning on a different topic.

## Read first — mandatory

Before editing anything, read:

1. `README.md`
2. `specs/repository-policy.md`
3. `specs/qa-policy.md`
4. `specs/explanation-policy.md`
5. `curriculum/content-framework.md`
6. `curriculum/argument-construction.md`
7. `management/material-manifest.csv`
8. `management/material-axis-map.csv`
9. `management/idea-axis-map.csv`
10. `management/idea-bank.csv`

The canonical explanation policy is `specs/explanation-policy.md`.

## Worker assignment

Read `management/explanation-work-queue.csv`.

Use only the row matching your worker letter.

Do not edit any E material outside your assigned E range.

Current partition:

- Worker A: B001–B008 / E001–E048
- Worker B: B009–B016 / E049–E096
- Worker C: B017–B024 / E097–E144
- Worker D: B025–B032 / E145–E192
- Worker E: B033–B039 / E193–E234

## Branch rule

Work only on the dedicated branch listed in the queue.

Do not commit explanation work directly to the default branch.

Do not merge your own branch.

The coordinator chat will review and merge workers sequentially.

## Source rule

GitHub is the canonical source.

Some older materials have not yet been backfilled from Drive.

For each assigned E:

### If `bundles/Bxxx/Exxx.md` exists

- read the current GitHub source
- inspect the Published Drive document only when needed for verification
- revise the GitHub source on your worker branch

### If `bundles/Bxxx/Exxx.md` does not exist

- use `management/material-manifest.csv` to locate the exact Published Drive document
- read the complete current material
- backfill it faithfully into `bundles/Bxxx/Exxx.md`
- preserve lesson ID, title, existing questions, answers, source content, and instructional intent
- then apply only justified explanation/reasoning improvements

Do not invent missing source content.

## Published Drive safety

Published Google Docs are frozen during parallel authoring.

**Do not edit Published Drive documents in this worker pass.**

All authoring happens in GitHub first.

After branches are reviewed and merged, the coordinator will handle Drive publication/version synchronization.

This prevents different chats from overwriting one another.

## What to improve

Audit every assigned material, but **do not automatically expand every material**.

Prioritize materials where:

- the answer exists but the reasoning jump is not explained
- Reason → Mechanism is weak or implicit
- support/example is not connected to the main reason
- a shallow answer is likely and the material does not explain why it is shallow
- the model answer is present but its sentence functions are opaque
- TH / EV / Idea appears only as a label rather than an actual reasoning operation
- transfer to another topic is unclear
- English wording is explained without connecting it to the reasoning function

## Standard explanation structure

Use the six-part framework when it genuinely helps:

1. **この問題で考えること**
2. **考え方**
3. **弱い考え方との比較**
4. **答案の組み立て**
5. **模範解答の読み方**
6. **次の問題に持っていくもの**

Do not mechanically add six long headings to every lesson.

For reading-only, grammar-only, or other non-free-writing materials, adapt the structure to the lesson function while preserving the same principle: explain the reusable reasoning or processing method rather than merely giving the answer.

## Reasoning standard

The central explanatory chain is:

> task/core question → criterion → reason → mechanism → support → conclusion

For argument materials, prioritize:

> Reason → Mechanism → Support

The learner should be able to answer:

- Why is this reason relevant?
- How does it produce the claimed result?
- What concrete situation supports it?
- What condition or limitation changes the claim?
- What can I reuse on another topic?

## Use of TH / EV / Idea / ARG

Use these as design tools, not decorative labels.

Where relevant, explain:

- why a particular TH operation is useful
- which EV criterion actually decides the argument
- how an Idea becomes an argument rather than a memorized slogan
- where ARG01–ARG06 functions appear in the answer

Do not require the learner to memorize internal codes merely for their own sake.

## Model-answer rule

Do not treat a model answer as a sacred single correct answer.

When useful, identify:

- Position / Answer
- Reason
- Mechanism
- Support
- Qualification
- Return / Decision

Explain what each sentence is doing.

Preserve alternative valid arguments when the task permits them.

## Depth control

Do not make every lesson longer.

A lesson that already satisfies the explanation policy may receive no content expansion.

The goal is **selective enrichment**, not maximal word count.

## Content freeze

Hard constraints:

- E001–E234 only
- no E235+
- no new practice-question bank
- no new Transfer Speed prompts
- no new pseudo-material IDs
- no vocabulary-core project in this pass
- do not rewrite the original question merely to make the explanation easier
- do not silently change official answers, source texts, factual data, or task conditions

If an existing factual or answer-key defect is discovered, record it in the worker report instead of silently rewriting unrelated content.

## Commit discipline

Prefer Bundle-sized or small coherent commits.

Commit messages should identify the affected Bundle/E range, for example:

- `Enrich explanations for B017 / E097-E102`
- `Backfill and enrich B009 / E049-E054`

Do not make unrelated global-framework edits from a worker branch.

## Worker report

Maintain your assigned report file:

- Worker A → `management/explanation-worker-a.md`
- Worker B → `management/explanation-worker-b.md`
- Worker C → `management/explanation-worker-c.md`
- Worker D → `management/explanation-worker-d.md`
- Worker E → `management/explanation-worker-e.md`

Use this structure:

### Scope
Assigned Bundle / E range

### Completed
- E IDs actually revised
- E IDs backfilled without material revision
- E IDs reviewed and left unchanged

### Main improvement types
Examples: mechanism, weak-vs-strong comparison, model-answer annotation, transfer rule

### Issues found
Answer-key concerns, factual concerns, missing source, structural problems

### Commits
Commit SHA + Bundle/E range

### QA
Confirm:
- no material outside assigned range changed
- no new E ID created
- no new question created
- explanation-policy pass checked
- Published Drive not edited

## Completion condition

A worker is complete only when:

1. every assigned E has been inspected
2. justified explanation improvements are committed
3. unnecessary expansion has been avoided
4. the worker report is complete
5. the worker branch contains no changes outside its assignment except its own report
6. no Published Drive document has been modified
7. no E235+ or new problem has been created

The coordinator, not the worker, performs final cross-worker consistency review and merge.
