# Self-assessment Audit — E001–E234

## Scope

Question:

> Does learner self-check evaluate the same things the curriculum teaches through ARG01–ARG06?

This is a curriculum diagnostic, not an official university scoring model.

## Existing strengths

The current system already has strong components:
- WQ00 Task fulfillment
- WQ01 Correct
- WQ02 Natural
- WQ03 Precise
- WQ04 Effective
- WR01 Self-check
- WR02 Revision ladder
- AC01–AC05 acceptability bands

Representative lesson evidence:

- E087: every sentence must have a role; conclusion must follow from reason and condition
- E093: same criteria across options; recommendation must follow from criteria; trade-off retained
- E117: every causal arrow explicit; condition can break mechanism
- E119: all sources integrated; conceded benefit retained; qualified language
- E208: direct answer; one focused reason; concrete example; safe grammar

## Main mismatch

WR01 currently describes revision roughly as:

> major errors → naturalness → precision → logic

This is not ideal under exam time pressure.

Argument construction now shows that the higher-impact order is:

> **Task → Argument → Meaning/Correctness → Precision → Naturalness**

A learner should not polish collocation while:
- the prompt is not answered,
- the mechanism is missing,
- or the conclusion does not follow.

## Metadata finding

Among materials with a WF writing type:

| Phase | Writing materials | WQ00 tagged |
|---|---:|---:|
| P1 | 42 | 7 |
| P2 | 14 | 14 |
| P3 | 57 | 57 |
| P4 | 23 | 23 |

WQ00 itself is defined as **all writing / always Gate**.

Therefore the P1 gap is a legacy metadata inconsistency, not an intended pedagogical distinction.

## AC interpretation

AC01–AC05 are useful sentence-level acceptability categories.

They should not be treated as whole-answer grades.

A response can contain AC04-quality English but still fail SA01 if:
- the reason is not developed,
- the example is irrelevant,
- the criteria change halfway through,
- the conclusion does not follow.

## Recommended implementation

1. define SA00–SA04 as the common self-check order,
2. update WR01 to reflect exam-mode repair priority,
3. clarify WR02: learning-mode ladder vs exam-mode repair order,
4. add WQ00 metadata to all P1 writing materials,
5. make only two learner-facing bridge revisions:
   - E087: introduce the common self-assessment order
   - E208: compress final check for exam use
6. do not mass-edit other lessons whose local Self-check already matches the task.

No new lesson IDs.


## Implementation result

Completed 2026-10-01.

### Management design

- SA00–SA04 defined
- `自己採点設計` tab added
- WR01 updated
- WR02 updated

### WQ00 metadata repair

Before:
- P1: 7 / 42 writing materials tagged WQ00

After:
- P1: **42 / 42**
- P2: **14 / 14**
- P3: **57 / 57**
- P4: **23 / 23**

Repair ledger:
- `management/self-assessment-metadata-fix.csv`

### Learner-facing revisions

Only two materials were changed:
- E087 — common self-assessment order
- E208 — exam-time final check

Both are **v1.2**.

Drive readback QA:
- E087: pass
- E208: pass

Source:
- `management/self-assessment-selected.csv`
- `curriculum/self-assessment-revisions.md`

### Additional sync repair

E208 GitHub frontmatter contained a stale Drive document reference. It was corrected to the current Published document:
- `1hTNeb3W47oUYdqx8c0Nf6cUWf6v7sHBRdDjNxE5APqc`

## Final conclusion

The curriculum's self-assessment system is now aligned with its argument-construction system.

The learner should repair in this order:

> **問い → 論理 → 意味 → 範囲 → 自然さ**

AC01–AC05 remain sentence-level acceptability bands and are not treated as whole-answer grades.

No mass lesson rewrite is needed.
