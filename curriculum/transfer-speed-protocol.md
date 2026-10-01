# Transfer Speed Protocol

## Purpose

This is **not a new lesson phase** and creates no E235+.

It is an execution / evaluation layer for the fixed E001–E234 corpus.

The goal is to reduce the time needed to convert an unfamiliar prompt into a viable argument without lowering argument quality.

---

# 1. What is being trained

The target sequence is:

> Prompt → TH / EV recognition → one usable Idea → position → ARG plan → writing

Speed is not defined as “write English faster.”

The main target is reducing:
- idea-shopping,
- repeated position switching,
- searching for the “best” reason,
- starting to write before the mechanism is clear.

---

# 2. Timed planning routine

## Step 1 — Recognize｜20–30 sec

Ask:
- What kind of problem is this?
- Which one or two TH operations matter most?
- Which EV criterion could decide the answer?

Do not generate five ideas.

## Step 2 — Commit｜within the planning window

Choose:
- position,
- one main reason,
- one relevant qualification if necessary.

Commit once a reason can be developed safely.

Do not keep searching for a more interesting reason.

## Step 3 — Build｜ARG notes

Minimum viable plan:

- ARG01 Answer
- ARG02 Reason
- ARG03 Mechanism
- ARG04 Support
- ARG06 Return

ARG05 Qualification is added only when it improves accuracy.

Compressed internal questions:

> 答えは？ → なぜ？ → どうして？ → 具体的には？ → 例外は？ → だから？

---

# 3. Compression stages

Do not start at an arbitrarily fast target.

## BASELINE

- 5 unseen prompts
- maximum 120 sec per plan
- record natural planning time
- no pressure to reach 60 sec

Purpose:
- find the actual bottleneck

## STAGE 1 — 90 sec

Hard stop: 90 sec.

Move on only when the learner can produce a viable plan rather than continue idea-shopping.

Promotion rule:
- 4 / 5 viable plans in two consecutive sessions

## STAGE 2 — 75 sec

Same quality requirement.

Promotion rule:
- 4 / 5 viable plans in two consecutive sessions

## STAGE 3 — 60 sec

Target state.

Do not shorten further merely for speed.

A 60-second plan counts only if it contains:
- direct answer,
- one reason,
- mechanism,
- usable support.

If one of these is missing, the attempt is not a successful speed gain.

## OPTIONAL STRETCH — 45 sec

Use only after five consecutive valid plans at 60 sec or faster.

This is recognition / compression practice, not the default exam target.

---

# 4. Session design

Default session:

- 6 unseen prompts
- 5 planning-only
- 1 plan + full writing

Planning-only work gives many more retrieval repetitions than writing every answer in full.

For the full-writing prompt:
- use the completed plan,
- write 90–110 words,
- record writing time,
- run SA00–SA04 afterward.

Do not compress full-writing time until planning is stable.

---

# 5. Viable-plan gate

A plan is **VALID** only if all four are present:

1. direct answer / position
2. one main reason
3. mechanism: how the reason leads to the result
4. concrete support or scenario

Qualification is optional.

A plan is **REPAIR** if:
- position is vague,
- reason is merely “good / useful / convenient,”
- mechanism is missing,
- example introduces a different reason,
- learner changes direction after the time limit.

---

# 6. Metrics

Record:

- recognition_sec
  - time until a plausible TH / EV direction is identified

- commit_sec
  - time until position + main reason are fixed

- plan_sec
  - time until the minimum viable ARG plan is complete

- switches
  - number of times the learner abandons a chosen main reason

- valid_plan
  - yes / no

- bottleneck
  - recognition / selection / mechanism / example / qualification / language

- full_write_sec
  - only for the selected writing prompt

- SA result
  - SA-A / SA-B / SA-C

The most useful speed metric is:

> **valid-plan time**

not raw time.

---

# 7. Interpretation

### ≤60 sec VALID
Target performance.

### 61–90 sec VALID
Usable, but retrieval / selection can still be compressed.

### >90 sec VALID
Quality exists, but automaticity is not yet sufficient.

### REPAIR
Do not count the speed result.

First identify the missing function.

---

# 8. Anti-patterns

## Idea shopping

Bad:
- generate four reasons,
- compare them,
- search for something more original,
- start writing after three minutes.

Better:
- choose the first defensible reason that supports a mechanism and example.

## Theme memorization

Bad:
- “AI topic = privacy”
- “environment topic = climate”
- “education topic = equality”

Better:
- run TH / EV on the actual prompt.

## Empty labels

Bad:
- fairness
- efficiency
- safety

Better:
- “This is fairer because students with the largest access barrier receive additional support.”

EV words are criteria, not finished reasons.

## Speed without mechanism

A fast plan that says only:

> agree → convenient → example

does not pass.

---

# 9. Stress-test levels

## S1 — New surface, familiar structure

Topic wording is unfamiliar, but one familiar reasoning structure is enough.

## S2 — New combination

Two previously separate structures must be combined.

## S3 — Competing axes

Several reasonable TH / EV routes exist. The learner must select rather than list them.

## S4 — Evidence conflict

A short data pattern complicates the intuitive answer.

## S5 — Full transfer

Unseen topic + 60–90 sec plan + 90–110 word answer.

## S6 — Shallow-answer trap

The prompt strongly invites a generic reason such as “convenient,” “safe,” “healthy,” or “transparent.”

The learner passes only by developing a mechanism, trade-off, evidence limit, incentive, distribution effect, or implementation condition.

---

# 10. Use with the curriculum

This protocol comes **after** enough TH / EV / Idea / ARG exposure to make retrieval meaningful.

It does not replace:
- E001–E234,
- P4 full-set practice,
- SA00–SA04,
- SET-A/B/C.

It measures whether the learned system has become fast enough to use on a genuinely unfamiliar prompt.

The stress-test prompt bank is:
- `management/transfer-stress-test.csv`

The result schema is:
- `management/transfer-speed-log-schema.csv`

Google management surfaces:
- `速度・転移テスト`
- `速度・転移記録`
