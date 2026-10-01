# Transfer Speed Stress-Test Audit

## Purpose

Evaluate whether E001–E234 knowledge can be retrieved fast enough on unfamiliar free-writing prompts.

This is an execution/evaluation layer, not a new curriculum phase.

- New E IDs: **0**
- Existing lesson count: **234**
- Stress-test prompts: **24**
- Sets: **4**
- Each set: S1–S6 once
- Default session: 5 plan-only + 1 plan-and-write

## Why this targets speed

The curriculum already contains the knowledge and argument machinery.

The likely remaining speed cost is:
1. recognizing what kind of problem the prompt represents,
2. selecting one usable line rather than idea-shopping,
3. building the mechanism before writing.

Therefore the primary outcome is **valid-plan time**.

Raw speed does not count if the plan lacks:
- direct answer,
- reason,
- mechanism,
- support.

## Compression progression

- Baseline: cap 120 sec
- Stage 1: 90 sec
- Stage 2: 75 sec
- Stage 3: 60 sec
- Optional 45-sec stretch only after stable ≤60 performance

Promotion:
- 4/5 valid plans in two consecutive sessions

## Stress levels

- S1: new surface / familiar structure
- S2: new combination
- S3: competing reasoning axes
- S4: evidence conflict
- S5: full transfer with 90–110 word writing
- S6: shallow-answer trap

## Prompt design

Prompts deliberately avoid simply repeating existing lesson titles.

They use unfamiliar surfaces such as:
- orbital debris
- automated sports officiating
- digital legacy
- staff voice-analysis
- delivery robots
- public teacher rankings

The hidden admin key records plausible TH / EV paths.

The key is **not an answer key**.

A different route passes if it produces a coherent and defensible argument.

## Management surfaces

GitHub:
- `curriculum/transfer-speed-protocol.md`
- `management/transfer-stress-test.csv`
- `management/transfer-speed-log-schema.csv`

Google management spreadsheet:
- `速度・転移テスト`
  - learner-facing prompt columns visible
  - admin reasoning columns hidden
- `速度・転移記録`
  - recognition / commit / plan time
  - ARG viability checks
  - switches
  - full-writing time / word count
  - SA result
  - bottleneck / one fix
  - automatic timing status

## Interpretation rule

The core metric is:

> **time to a valid plan**

not:
- number of ideas generated,
- sophistication of vocabulary,
- resemblance to a model answer.

A student who reaches a simple but defensible plan in 60 seconds is performing the target skill better than a student who needs three minutes to find a more original reason.

## Relationship to existing systems

- TH / EV / Idea: retrieve usable content
- ARG: turn content into one line of reasoning
- WF / WP: execute the writing form
- SA: diagnose writing quality
- SET: diagnose full-set execution
- Transfer Speed: diagnose retrieval / planning automaticity

No existing grade axis is replaced.
