# QA Policy

## Required lesson structure

P3 v3教材では原則:
- Title
- metadata / subtitle
- 今日の狙い
- 時間配分
- source / reading
- task / questions
- Self-check
- exactly one page break in Drive Published
- 解答・解説・自己修正
- 到達目安

P4は本番形式を優先し、時間規格と構成は筑波仕様に合わせて変更可能。

## Publish Gate

Published前に確認:
- exact lesson ID
- exact title
- required sections
- no previous-Bundle residue
- time budget consistency
- prerequisite satisfaction
- answer-key consistency
- no unsupported factual claims
- Index link = Published artifact
- management state = Published / Pass / OK / Valid


## Multiple-choice answer-position QA

選択肢問題では、正答内容だけでなく**正答位置の偏り**もQA対象にする。

注意:
- A / B / C / D を機械的に完全均等へそろえる必要はない
- ただし、同一セット内で同じ正答記号が不自然に連続・集中していないか確認する
- とくに「全問A」「ほぼ全問同じ位置」など、内容を見ずに推測できる並びは避ける
- 正答位置を調整するときは、**選択肢の順番だけ**を変え、設問の意図・難度・誤答選択肢の質を壊さない
- 並べ替え後は、問題側と解答・解説側の記号が一致しているか再確認する
- 位置分散のために正答そのものを変更しない

Passの目安は、**正答記号の並びが解答の手掛かりにならないこと**。

## Regression

過去Published教材はfreeze。
新規Bundle作成時にテンプレートを再利用する場合、旧教材ID・旧Bundle ID・旧題材が残っていないことを確認する。

## Current P3 rules

- NB1中心
- major new Focusを原則追加しない
- LT04は累積Checkpoint
- 4–8 non-checkpoint materialsごとにCheckpointを置く
- ENV02 Desk only

## P4 exception

P4では「Core 60分」を絶対条件にしない。
Day 19–30は原則120分のフルセットを優先する。


## Explanation / reasoning QA

既存E001–E234の解説改訂は `specs/explanation-policy.md` を正本とする。

解説は原則として以下を確認する:
- この問題で考えること
- 考え方の一本道
- 弱い考え方との比較
- ARGに基づく答案の組み立て
- 模範解答の機能別の読み方
- 次の問題に持っていく再利用可能な思考ルール

全教材を一律に長文化しない。
既に十分な教材は維持し、思考経路・mechanism・transferが弱い教材を選択的に改訂する。

解説改訂のPass基準は、模範解答を再生できることではなく、**別題材で同じ思考回路を再利用できること**。
新規問題やE235+をこの作業で追加しない。
