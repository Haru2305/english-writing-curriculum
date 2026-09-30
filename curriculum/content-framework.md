# Curriculum-wide Content Framework

## 0. Purpose

This framework defines the **content architecture** that runs across the existing curriculum **E001–E234**.

The curriculum is complete in material count. **Do not create E235 or later as part of this framework.**  
The next stage is to make the intellectual content already distributed across E001–E234 visible, reusable, and transferable.

The learner should not finish a lesson thinking only:

> I learned about telemedicine / transport / AI / climate.

The intended endpoint is:

> I learned a reusable way to think: identify a trade-off, separate average effects from distribution, test causality, add implementation conditions, and then express that reasoning in English.

---

## 1. Architecture

The curriculum now uses five distinct layers.

| Layer | Question | Existing / new system |
|---|---|---|
| Topic family | **What is the issue about?** | Existing TF01–TF19 |
| Thinking axis | **How should I reason about it?** | New TH01–TH10 |
| Evaluation axis | **By what criterion should I judge it?** | New EV01–EV10 |
| Idea bank | **What reusable proposition can I retrieve?** | Existing IDEA0001–IDEA0057, to be remapped |
| Writing/output system | **How do I express the reasoning?** | Existing WF / WT / WQ / WP |

Existing `TL01–TL06` thinking lenses remain valid, but they have a different role.  
TL is an optional broad philosophical question. TH is a concrete reasoning operation that should transfer across topics.

### Example

Topic:
- TF06 AI・自動化・技術導入

Reusable idea:
- IDEA0018 高リスク領域では human oversight が重要になる

Thinking:
- TH06 Implementation & Safeguards
- TH08 Uncertainty & Risk

Evaluation:
- EV06 Safety
- EV07 Autonomy / Rights where human responsibility or consent matters

Output:
- WF01 opinion/reason or WF05 evaluation
- WT03 free transfer
- WQ00–WQ04 for task fulfillment → correctness → naturalness → precision → effectiveness

---

# 2. Thinking Axes — TH01–TH10

## TH01 — Cause & Mechanism｜原因・機序

**Core question:**  
What actually causes the outcome, and through what mechanism?

Use this axis to:
- separate a single apparent cause from multiple structural causes
- distinguish correlation from causation
- identify confounding or self-selection
- build a causal chain rather than jump from X to Y
- ask what else changed at the same time

Typical learner prompts:
- 「本当にXが原因か」
- 「XからYまでの途中に何があるか」
- 「他の要因でも説明できないか」

Canonical pattern:

> apparent cause → competing causes / mechanism → justified causal claim

Examples already present:
- IDEA0001 multiple structural factors
- IDEA0011 individual + structural causes
- E157 self-selection bias
- E163 regression to the mean
- E185 correlation vs causation

Boundary:
- Use TH07 when the main question is whether a **measurement or dataset** is valid.
- Use TH01 when the main question is whether a claimed **causal explanation** is valid.

---

## TH02 — Trade-off & Opportunity Cost｜交換関係・機会費用

**Core question:**  
What do we gain, what do we give up, and compared with what alternative?

Use this axis to:
- avoid one-sided “X is good” arguments
- compare benefits and costs on the same dimension
- identify opportunity cost
- distinguish overall benefit from a cost imposed elsewhere

Typical learner prompts:
- 「何を得る代わりに何を失うか」
- 「その資源を別の用途に使ったらどうか」
- 「メリットだけを見ていないか」

Canonical pattern:

> benefit → corresponding cost / alternative use → conditional judgment

Examples:
- IDEA0020 data utility vs privacy
- IDEA0028 efficiency vs resilience
- IDEA0041 public spending → opportunity cost
- IDEA0054 public benefit vs alternative use of funds

---

## TH03 — Distribution & Equity｜分布・公平

**Core question:**  
Who benefits, who bears the cost, and does the average hide important differences?

Use this axis to:
- distinguish average effects from subgroup effects
- compare equal treatment with equitable support
- identify concentrated costs and dispersed benefits
- ask whether access differs across groups

Typical learner prompts:
- 「平均ではなく誰が変わるか」
- 「全員を同じに扱えば公平か」
- 「負担が特定の人に集中していないか」

Canonical pattern:

> average / uniform rule → subgroup differences → equity-sensitive judgment

Examples:
- IDEA0010 equal inputs ≠ equal opportunity
- IDEA0012 targeted support and eligibility costs
- IDEA0039 aggregate benefit vs concentrated cost
- IDEA0051 equal aid vs need-based aid
- E170 / E201 average vs distribution

---

## TH04 — Time Horizon & Dynamics｜時間軸・変化

**Core question:**  
Does the conclusion change between the short term and the long term?

Use this axis to:
- distinguish immediate effects from delayed effects
- consider adaptation and behavioral change over time
- compare upfront cost with long-term benefit
- identify whether an intervention solves attraction but not retention

Typical learner prompts:
- 「今と数年後で同じ結論か」
- 「効果が出るまでの遅れはあるか」
- 「短期の成功が長期でも続くか」

Canonical pattern:

> short-term effect → delayed / adaptive effect → time-sensitive judgment

Examples:
- IDEA0002 short-term attraction vs long-term retention
- IDEA0015 educational investment
- IDEA0026 upfront cost → long-term benefit
- IDEA0049 preparedness → avoided future loss

---

## TH05 — Behavior & Incentives｜行動・インセンティブ

**Core question:**  
How will people change their behavior when the rule, price, information, or default changes?

Use this axis to:
- model incentive effects
- recognize unintended behavioral responses
- analyze choice architecture and defaults
- distinguish individually rational from collectively harmful behavior
- separate information provision from actual uptake

Typical learner prompts:
- 「制度を変えたら人はどう反応するか」
- 「良い意図が別の行動を誘発しないか」
- 「知識が増えれば行動も変わるのか」

Canonical pattern:

> policy / signal / incentive → behavioral response → system-level consequence

Examples:
- IDEA0005 information + trust + access → uptake
- IDEA0029 behavior shaped by incentives/options
- IDEA0030 individual rationality vs collective outcome
- E197 default effects

---

## TH06 — Implementation & Safeguards｜実装条件・安全策

**Core question:**  
Under what conditions would the idea actually work safely and reliably?

Use this axis to:
- move from abstract approval to conditions
- consider staffing, training, compliance, monitoring, exceptions, and oversight
- distinguish a technology’s capability from its implementation
- formulate “yes, but only if …” arguments

Typical learner prompts:
- 「賛成するとして、何が必要か」
- 「運用で失敗するとしたらどこか」
- 「例外や監督をどう設計するか」

Canonical pattern:

> potential benefit → implementation condition → safeguard / exception

Examples:
- IDEA0016 technology + implementation → outcome
- IDEA0018 high stakes → human oversight
- IDEA0023 conservation + local livelihoods
- compliance / governance themes throughout P3–P4

---

## TH07 — Evidence & Measurement｜証拠・測定

**Core question:**  
What does this evidence actually measure, and what does it fail to establish?

Use this axis to:
- distinguish construct from proxy
- examine sampling and representativeness
- identify measurement error and bias
- separate association from proof
- evaluate whether a number answers the intended question

Typical learner prompts:
- 「この数字は何を測っているのか」
- 「代理指標を目的そのものとして扱っていないか」
- 「このサンプルは誰を代表しているか」
- 「示しているのか、証明しているのか」

Canonical pattern:

> observed measure → validity / limitation → appropriately bounded claim

Examples:
- E157 self-selection
- E182 precision vs reliability
- E194 proxy ≠ goal
- E196 replication
- E199 evidence strength → claim strength
- E225 causal inference
- E234 surrogate endpoints

This axis is a major curriculum-wide pillar that emerged strongly in P3–P4 and must be made explicit in the remapping.

---

## TH08 — Uncertainty & Risk｜不確実性・リスク

**Core question:**  
How certain is the claim, what could go wrong, and how should uncertainty affect the decision?

Use this axis to:
- distinguish probability from certainty
- use base rates and ranges
- consider false positives / false negatives
- calibrate the strength of a conclusion
- separate known, unknown, and action
- weigh magnitude, probability, and reversibility of harm

Typical learner prompts:
- 「どこまで断言できるか」
- 「外れた場合の損失は何か」
- 「不確実でも行動すべき条件は何か」

Canonical pattern:

> evidence / estimate → uncertainty and consequence → calibrated action

Examples:
- IDEA0050 known / unknown / action
- IDEA0055 benefit vs probability / magnitude / uncertainty of harm
- IDEA0057 evidence strength → claim strength
- E169 base-rate reasoning
- E227 ensemble forecasts / calibration

Boundary:
- TH07 asks whether evidence is valid.
- TH08 asks what to do or claim **given remaining uncertainty**.

---

## TH09 — Governance, Rights & Responsibility｜統治・権利・責任

**Core question:**  
Who should decide, who is responsible, and what rights or procedural constraints matter?

Use this axis to:
- analyze autonomy and informed consent
- distinguish legitimate goals from proportionate restrictions
- consider accountability and transparency
- ask who controls personal information
- identify responsibility when decisions are shared between people and systems

Typical learner prompts:
- 「誰が決めるべきか」
- 「本人の選択をどこまで尊重するか」
- 「誰が説明責任を負うか」
- 「目的が正しくても手段は広すぎないか」

Canonical pattern:

> legitimate objective → rights / responsibility / procedure → justified boundary

Examples:
- IDEA0040 legitimate aim → necessity → proportionality
- IDEA0042 participation/accountability → legitimacy
- IDEA0056 meaningful consent
- privacy and human-oversight problems across TF06 / TF07 / TF19

---

## TH10 — Alternatives & System Design｜代替案・制度設計

**Core question:**  
Is this really an either-or choice, or can the system combine, target, sequence, or diversify options?

Use this axis to:
- reject false dichotomies
- compare replacement with supplementation
- design hybrid or targeted approaches
- use diversification for resilience
- create exceptions or staged implementation

Typical learner prompts:
- 「全部置き換える必要があるか」
- 「併用・部分導入はできないか」
- 「対象を限定したらどうなるか」
- 「一つに依存せず分散できないか」

Canonical pattern:

> false binary → alternative architecture → reasoned design choice

Examples:
- IDEA0003 technology improves access without full replacement
- IDEA0009 public support complements family care
- IDEA0024 individual action + system design
- IDEA0027 diversification → resilience
- IDEA0043 preserve vs adapt

---

# 3. Evaluation Axes — EV01–EV10

Evaluation axes are **criteria**, not reasoning processes.  
A lesson may use one TH with several EVs, or may use TH07/TH08 without any explicit EV when the task is purely evidential.

## EV01 — Access & Participation｜アクセス・参加

Ask:
- Who can actually use, reach, join, or understand the service/opportunity?

Typical language:
- access, availability, barriers, participation, inclusion

---

## EV02 — Quality & Effectiveness｜質・有効性

Ask:
- Does it achieve the outcome that actually matters?

Typical language:
- effectiveness, learning outcomes, clinical outcomes, service quality

Important distinction:
- access ≠ quality
- proxy ≠ real outcome

---

## EV03 — Efficiency & Productivity｜効率・生産性

Ask:
- How much useful output is achieved with the available time, labor, or resources?

Typical language:
- efficiency, productivity, time-saving, coordination

Do not confuse efficiency with low cost or resilience.

---

## EV04 — Cost & Feasibility｜費用・実行可能性

Ask:
- Can the proposal realistically be financed, staffed, maintained, and scaled?

Typical language:
- cost, resources, staffing, feasibility, maintenance

---

## EV05 — Fairness & Equity｜公平・衡平

Ask:
- Are opportunities, benefits, burdens, and support distributed justifiably?

Typical language:
- fairness, equity, equal opportunity, targeted support

---

## EV06 — Safety & Harm｜安全・害

Ask:
- What harms can occur, how severe are they, and can they be prevented or reversed?

Typical language:
- safety, harm, risk, error, adverse effects

---

## EV07 — Autonomy & Rights｜自律・権利

Ask:
- Does the policy respect meaningful choice, consent, expression, and other relevant rights?

Typical language:
- autonomy, consent, freedom, rights, voluntary choice

---

## EV08 — Privacy & Data Control｜プライバシー・データ統制

Ask:
- What information is collected, who can access it, and does the user retain meaningful control?

Typical language:
- privacy, personal data, consent, data retention, access control

---

## EV09 — Resilience & Reliability｜強靱性・信頼性

Ask:
- Does the system continue to function under disruption, error, demand spikes, or component failure?

Typical language:
- resilience, reliability, redundancy, diversification, robustness

Important distinction:
- efficiency may increase while resilience decreases.

---

## EV10 — Sustainability & Long-term Viability｜持続可能性・長期維持

Ask:
- Can the benefit be maintained socially, environmentally, financially, or institutionally over time?

Typical language:
- sustainability, long-term viability, maintenance, environmental burden

---

# 4. How the layers differ

## Topic family is not a thinking axis

“AI” is not a way of thinking.  
“Medical access” is not a way of thinking.

The same TH must appear across unrelated topics.

Example:

TH10 Alternatives & System Design:
- telemedicine: supplement rather than replace face-to-face care
- online education: hybrid rather than all-online
- machine translation: low-risk automation + human review for high-risk use
- cultural preservation: preserve core elements while adapting use

This cross-topic reuse is the core of transfer.

## Idea Bank is not the final taxonomy

The existing IDEA0001–IDEA0057 records are valuable concrete propositions.  
They should be retained and mapped onto TH / EV rather than replaced.

Example:

- IDEA0028 efficiency vs resilience
  - TH02 Trade-off
  - EV03 Efficiency
  - EV09 Resilience

- IDEA0056 meaningful consent
  - TH09 Governance, Rights & Responsibility
  - EV07 Autonomy & Rights

- IDEA0057 evidence strength → claim strength
  - TH07 Evidence & Measurement
  - TH08 Uncertainty & Risk
  - no EV required

## TL thinking lenses remain optional

TL01–TL06 ask broad reflective questions such as fairness or freedom vs public good.  
They may coexist with TH, but they do not replace it.

## WF / WT / WQ remain output systems

- WF = what form of writing is produced
- WT = how far language/reasoning is transferred
- WQ = quality of the final English
- WP = planning/drafting/revision process

TH / EV operate **before and during idea formation**.

---

# 5. Tagging rules for E001–E234

The remapping must not create new lesson IDs.

For each existing material:

### Required
- **Primary TH:** exactly 1
- **Secondary TH:** 0–2
- **EV:** 0–3
- **Topic family:** retain / repair existing TF assignment
- **Idea links:** retain existing IDEA IDs and add missing links when the lesson clearly instantiates an existing idea

### Optional
- add a new Idea Bank record only if the lesson contains a genuinely reusable proposition not represented by IDEA0001–IDEA0057
- do not create a new idea merely to describe the lesson topic

### Selection rule

Choose the primary TH by asking:

> What reasoning operation would we most want the learner to reuse on a completely different topic?

Not:

> What is the passage mainly about?

### Evidence-focused exception

A lesson centered on measurement, causal inference, sampling, or uncertainty may have:
- TH07 / TH08
- **zero EV tags**

because the learner is judging evidence rather than a social policy.

---

# 6. Learner-facing Post-solve pattern

Do not add a new lesson.  
Where revision is pedagogically justified, strengthen the existing Post-solve section using a compact transfer block.

Recommended form:

### 今回の思考部品
`TH02 Trade-off｜efficiency ≠ resilience`

### この教材での形
A single supplier may be efficient in normal conditions but fragile during disruption.

### 別テーマへの転用
energy / hospital staffing / data backup / public transport

### 自分への問い
「効率化によって失われる余裕はないか？」

The block should be brief. Its purpose is **compression and transfer**, not another explanation chapter.

---

# 7. Curriculum-wide learner routine

When facing an unfamiliar free-writing prompt:

1. **Identify the task**
   - What exactly must I decide or explain?

2. **Scan evaluation criteria**
   - Access?
   - Quality?
   - Efficiency?
   - Cost?
   - Fairness?
   - Safety?
   - Autonomy?
   - Privacy?
   - Resilience?
   - Sustainability?

3. **Apply one or two thinking axes**
   - Cause?
   - Trade-off?
   - Distribution?
   - Time?
   - Behavior?
   - Implementation?
   - Evidence?
   - Uncertainty?
   - Governance?
   - Alternatives?

4. **Choose one claim worth developing**
   - Do not list many shallow reasons.

5. **Add a condition, consequence, or example**
   - This converts an opinion into an argument.

6. **Write using the existing WF / WT / WQ process**
   - task fulfillment first
   - then correctness, naturalness, precision, effectiveness

---

# 8. Examples of cross-topic transfer

## Pattern A — TH02 Trade-off

Source lesson:
- food supply: efficiency vs redundancy

Transfer:
- hospital staffing
- energy supply
- public transport
- cloud/data backup

Reasoning:
> Removing spare capacity can improve efficiency under normal conditions but reduce resilience during disruption.

## Pattern B — TH03 Distribution

Source lesson:
- average heat reduction

Transfer:
- education policy
- transport redesign
- public subsidies
- health intervention

Reasoning:
> An improvement in the average does not show whether every group benefits.

## Pattern C — TH07 Evidence

Source lesson:
- surrogate endpoint

Transfer:
- test scores as educational quality
- download counts as engagement
- GDP as well-being
- publication counts as research quality

Reasoning:
> A useful proxy should not be confused with the outcome it is intended to represent.

## Pattern D — TH06 + TH10

Source lesson:
- technology adoption

Transfer:
- AI
- telemedicine
- online education
- machine translation

Reasoning:
> The useful question is often not whether technology should replace people, but which tasks can be delegated and where human oversight should remain.

---

# 9. Current audit finding

The existing curriculum already contains the substance needed for this framework.

Current management data show:
- 19 Topic families
- 57 canonical Idea Bank records
- E001–E234 complete
- explicit idea tagging is concentrated mainly in P1
- P2–P4 contain substantial reasoning content that is not yet represented in the Idea columns
- P3–P4 especially developed evidence reasoning: bias, causal inference, base rates, measurement validity, proxies, averages/distributions, replication, uncertainty, and calibration

Therefore the next content task is **remapping and selective revision**, not lesson expansion.

---

# 10. Next audit sequence

1. Freeze material count at E234.
2. Map IDEA0001–IDEA0057 to TH / EV.
3. Remap E001–E234 with Primary TH / Secondary TH / EV.
4. Identify reasoning content in P2–P4 that requires new canonical Idea Bank entries.
5. Measure over-concentration and gaps across TH / EV / Topic family.
6. Revise only lessons whose Post-solve does not make the reusable reasoning visible.
7. Preserve Published lesson immutability and version revisions according to repository policy.

The final curriculum should allow 234 individual experiences to compress into a small set of reusable intellectual operations.
