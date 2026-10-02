# Core 99 Final Audit

## Scope

2026-10 accelerated route:

- P1 Core: 15 lessons
- P2 Core: 30 lessons
- P3 Core: 54 lessons
- Pre-P4 Core total: **99 lessons**

This audit asks whether the compressed route is still a coherent writing curriculum rather than merely a shorter list.

## Final decision

**Keep the route at 99 lessons. Do not compress it further.**

The 99-lesson route has enough output density, preserves the major reading-to-writing transitions, keeps all phase Checkpoints, and reaches P4 without requiring the learner to complete all 204 pre-P4 materials.

Optional lessons remain Targeted Review rather than unfinished homework.

## Output density

Parser-based audit after route refinement:

| Phase | Core lessons | Lessons with a Writing-classified section | Longest run without a Writing-classified section |
|---|---:|---:|---:|
| P1 | 15 | 12 | 1 |
| P2 | 30 | 15 | 5 |
| P3 | 54 | 41 | 5 |
| Total | 99 | 68 | — |

Across Core 99:

- **40 lessons** contain substantial Writing such as Writing Task / Judgment / Evaluation / Proposal / Trade-off / source-linked writing
- **32 lessons** contain summary output
- some P2 Summary Tasks are not classified by the generic parser as Writing, so the 68/99 count understates total learner output

The five-lesson gaps in P2/P3 are not empty reading stretches:

- P2 E078–E084 concentrates inference, compression, and Summary Task work
- P3 E131–E138 deliberately concentrates Japanese summary and sentence-insertion / paragraph-function work before the curriculum returns to heavy English Writing at E141

Therefore no route swap is needed merely to make the Writing count look smoother.

## P3 evidence-concept correction

The first P3 compression over-weighted repeated two-system evaluation and under-weighted high-transfer evidence reasoning.

Earlier refinement had already restored E170, E185, and E197 to Core. The end-to-end pass found one remaining repetition pattern: E147 → E153 → E159 → E165 → E171 placed a near-identical **two-option comparison → summary → evaluation** lesson in the second Core slot of five consecutive bundles.

The final route therefore makes one additional swap without changing the 54-lesson P3 total:

| Moved to Core | Moved to Targeted Review | Reason |
|---|---|---|
| E169 — base-rate reasoning | E171 — repeated two-system evaluation | base rate adds a distinct evidence operation; comparison/evaluation is already heavily represented |
| E185 — association / confounding / causation | E182 — measurement precision | confounding is a canonical Priority A concept; measurement precision remains exercised elsewhere |
| E197 — prediction/recommendation feedback loop | E177 — repeated two-system evaluation | feedback loops are highly transferable and directly support later P4 |

E170 remains Core as the first explicit **aggregate average vs peak/subgroup** lesson. E201 later makes the stronger **average ≠ individual distribution** distinction explicit.

This keeps Writing density high while reducing template repetition and broadening the evidence repertoire.

## Skill coverage

Scanning the complete problem text, not only the front metadata, Core 99 directly contains **70 of 72** pre-P4 internal skill codes.

The only dedicated codes left Optional are:

- A04, appearing explicitly in E047's timed logical-processing lesson
- A10, appearing explicitly in E110's register / claim-strength calibration lesson

These do not justify adding lessons back to Core:

- E048 and later timed Checkpoints preserve the logical-processing-under-time function associated with E047
- claim-strength calibration is already Core in E061, E085, E097+ evidence work, and multiple P3 evaluation tasks

The route therefore does not need to chase 72/72 code-label coverage.

## Learner-facing concept continuity

The full corpus has 27 canonical Learner-facing Core concepts with Introduce / Recall / Transfer paths.

Compression intentionally moves some early Introduce lessons to Targeted Review. The accelerated-route rule is therefore:

- if the canonical Introduce lesson is Optional, the learner's first Core encounter becomes **Fast Introduce**
- Core text must remain understandable without the skipped Optional lesson
- a Core lesson must not explicitly assume that the learner completed an Optional lesson
- advanced Priority A evidence concepts used directly in P4 should retain their canonical Introduce lesson in Core where practical

Audit found one explicit dependency in Core:

- E020 explicitly referred to optional E014

E020 was rewritten to explain the fixed-cost / low-use-service idea directly, so the Core route is now self-contained at that point.

## Transition check

The three phase boundaries remain pedagogically coherent:

- P1 ends with E042: proposal / judgment / objection handling
- P2 begins at E043 by deliberately returning to sentence structure and processing; E043 now states explicitly that this is a speed/accuracy reset, not a drop in curriculum level. P2 then builds to E085–E087 at 60–80 / 80–100 / 90–110 words and E096 Final Checkpoint
- P3 begins at E097 with 100–120-word evidence-linked prioritization and ends at E204 Final Gate with mixed sources, summary, written explanation, and free writing

The route therefore increases both linguistic load and reasoning independence instead of merely increasing word count.

## End-to-end route integrity

The final pass found one implementation mismatch: the learner-facing P3 route data had E185 before E183, while the canonical curriculum document used E183 → E185 → E186. The site route was corrected to preserve canonical lesson order.

A renderer audit now requires each accelerated route to keep lesson IDs strictly increasing. This prevents a future route-data edit from silently changing the intended teaching sequence.

The same pass also confirmed:
- no further Core reduction is warranted
- P1 → P2 is the only boundary that can feel like a temporary difficulty reset; the learner-facing bridge now explains why
- P2 → P3 is already smooth because E097 explicitly transfers the E093/E096 criteria-based decision structure into 100–120-word evidence-linked writing
- E204 remains an appropriate pre-P4 gate: it integrates mixed sources, summary, causal limitation, and conditional recommendation before P4 switches to university-specific formats

## Operating rule

Use the 99 Core lessons in order.

Do not add a second skip system inside Core.

Use Optional lessons only when a Checkpoint reveals a specific weakness.

This keeps the curriculum simple:

**Core = main line. Optional = repair.**
