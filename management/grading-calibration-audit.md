# Grading Calibration Audit — E001–E234

## Scope

This audit checks whether Model answers, Self-check, and A/B/C attainment labels are calibrated consistently across phases.

This is a learner-facing diagnostic system, not an official admissions scoring rubric.

## Phase findings

### P1
Writing materials: 42.
P1 generally uses short guided output and local acceptability checks rather than full A/B/C attainment bands. This is intentional.

### P2 Bridge
Early Bridge materials such as E048 / E052 / E053 / E054 use AC02–AC05 or local checkpoint bands. These are prerequisite / acceptability diagnostics, not the same scale as later A/B/C writing diagnosis.

### P2 main + P3
A/B/C is generally calibrated as:
- A = task completed with the target reasoning operation intact
- B = basically valid answer with one high-impact weakness
- C = task/argument structure fails or requested transfer is not achieved

### P4
P4 has two different assessment layers:
1. Writing quality: WQ00–WQ04 / SA00–SA04 / ARG01–ARG06 / word-count and content conditions
2. Full-set execution: 120-minute completion / stop-times / Q3A / review / unfinished sections

From E210 onward, most A/B/C labels primarily evaluate full-set execution. Interpret them as SET-A / SET-B / SET-C rather than a writing-quality grade.

## Calibration invariants

- CAL01: Model answers must satisfy their own prompt conditions, including explicit word-count ranges.
- CAL02: Model answers are worked examples, not wording keys.
- CAL03: A means ready, not perfect.
- CAL04: B means repairable with one high-impact fix.
- CAL05: C means rebuild: task miss, missing required element, broken argument, meaning failure, or incomplete answer.
- CAL06: Full-set execution and writing quality are separate axes.

## Model-answer word-count audit

A real calibration defect was found.

Where an explicit writing range and a detected model answer could be directly compared:
- P2 main: 9 model answers below the stated lower bound
- P3: 29 model answers below the stated lower bound
- P4: no confirmed word-count defect after direct paragraph recheck

Confirmed corrections: **38 model answers**.

The task requirements are not relaxed. Model answers are corrected instead.

Correction policy:
- preserve stance and argument structure,
- append only a short supporting or returning sentence when under-length,
- shorten only non-essential modifiers when over-length,
- do not alter question text or answer keys.

See:
- management/model-answer-wordcount-fixes.csv

## Final interpretation

Writing diagnosis:
- SA-A / Ready
- SA-B / Repairable
- SA-C / Rebuild

Full-set diagnosis:
- SET-A / Stable completion
- SET-B / Completed with execution weakness
- SET-C / Incomplete / route breakdown

Do not convert these labels into predicted university scores.


## Implementation result

Completed 2026-10-01.

### Word-count correction

Confirmed defects:
- P2: 9
- P3: 29
- P4: 0 after direct paragraph recheck

Total corrected: **38**.

Drive readback:
- **38 / 38 inside the explicit target range**

GitHub lesson bodies:
- existing Markdown among the 38 corrected materials: **9**
- synchronized: **9 / 9**
- remaining 29 are represented by manifest + Drive because their lesson-body Markdown has not yet been migrated

### False-positive check

E226 was initially flagged by a parser that accidentally included text beyond the model paragraph. Direct paragraph inspection showed the original model answer was **102 words** and already valid. The temporary edit and version bump were fully reverted.

### Management surfaces

- `採点キャリブレーション` tab added to the management spreadsheet
- `management/model-answer-wordcount-fixes.csv` is the correction ledger
- `curriculum/grading-calibration.md` is the normative interpretation

### Final calibration state

- P1 AC: local prerequisite / acceptability band
- P2/P3 SA: writing-quality / transfer diagnosis
- P4 SET: full-set execution diagnosis
- Model answer: worked example that must satisfy the task itself

No official admissions-score prediction is implied.
