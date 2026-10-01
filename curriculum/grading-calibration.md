# Grading Calibration Framework

## Purpose

Keep learner judgments consistent across E001–E234 without pretending to reproduce an official university scoring rubric.

## 1. Writing diagnosis

### SA-A — Ready
Task is fulfilled, the required argument route is traceable, and meaning is stable.

### SA-B — Repairable
The answer basically works, but one high-impact weakness remains.

### SA-C — Rebuild
Task, argument, meaning, or completion fails in a way that requires structural repair.

This inherits SA00–SA04:
Task → Argument → Meaning/Correctness → Precision → Naturalness.

## 2. Full-set diagnosis

P4 full-set A/B/C is a different axis.

### SET-A
All sections completed within the intended route and review process.

### SET-B
All sections completed, but one timing / route / review condition is unstable.

### SET-C
An unfinished section or route breakdown occurs.

## 3. Model-answer standard

A Model answer must:
1. satisfy explicit prompt conditions,
2. fall inside an explicit word-count range,
3. demonstrate the intended WF / ARG route,
4. avoid implying that its wording is the only valid answer.

## 4. Cross-phase rule

Do not compare P1 AC bands, P2/P3 SA bands, and P4 SET bands as if they were one numerical scale.

They answer different diagnostic questions.

## 5. Feedback rule

Feedback should identify:
- diagnosis axis,
- highest-impact weakness,
- one concrete repair action.

Example:

> SA-B: the position and example are clear, but the mechanism is missing. Add one sentence explaining how the policy changes behavior.

or:

> SET-B: all sections were completed, but Q1 exceeded the stop-time and reduced final review. Keep the same route and enforce the Q1 stop-time next attempt.
