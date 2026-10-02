# Core 99 Content Quality Audit

## Purpose

Core 99を実際の学習順で使ったときの本編品質を監査する。

負荷監査とは分け、主に以下を見る。

- 問題が曖昧すぎず、要求が明確か
- Phase内・Phase間で支援が減り、判断の自立度とWriting負荷が上がるか
- 解答一覧／設問解説／因果骨格・考え方／語法整理／Writing解説の役割が混線していないか
- Optional lessonを飛ばしてもCoreだけで自己完結するか
- 読解・語法が最終的な自由英作文へ接続しているか

原則として新規問題は追加せず、既存問題の削減・差し替え・順序調整・support調整で改善する。

## P1

### B001 — E001 / E002 / E006

#### E001

判定：**Keep with presentation refinement**

- P1入口として、比較対象と相違点を differ from / differ in で分ける狙いは明確
- Reading → Language Focus → 2〜3文Writing の接続も自然
- 難易度は入口として妥当で、問題追加は不要
- 解答確認と詳細解説が連続していたため、`解答一覧` と `設問解説` を分離
- 本文骨格・語法整理・Writing解説も見出しで分離

#### E002

判定：**Keep**

- 因果の強さを cause / lead to / result in / contribute to で扱い、E001よりreasoning負荷が上がる
- 「available ≠ usable」「単独原因と複数要因」の処理が後続Writingへ接続
- workload auditで既にanswer-side bloatを圧縮済み
- 内容追加は不要
- 設問解説／因果骨格／語法整理／Writing解説を見出しで分離

#### E006

判定：**Fix required — Core self-containment**

問題:
- Accelerated Coreは E001 → E002 → E006
- E003（suggest）とE005（rise / raise）はOptional
- それにもかかわらずE006冒頭が「新しい語法は導入しません」とし、suggest / rise・raiseを既習扱いしていた
- Core Routeの「OptionalのIntroduce lessonを飛ばした場合は最初のCore遭遇をFast Introduceにする」という原則と矛盾

修正:
- E006で suggest / rise・raise をFast Introduceと明示
- Referenceを4分→6分、Readingを22分→20分にして総時間60分を維持
- Targeted ReviewでE003/E005を先に使った場合だけ復習扱いにする
- 解答一覧を追加し、設問解説・語法整理・Writing解説を視覚的に分離
- P1 accelerated route側にもFast Introduce運用を明記

### B001 conclusion

B001のCore 3回は、内容を増やす必要はない。

修正後の勾配は、

**E001 比較の型 → E002 因果の強さ → E006 初見3資料で統合適用**

となり、Optionalを完走しなくてもCoreだけで成立する。


### B002 — E008 / E012

#### E008

判定：**Keep**

- privacy / convenienceを二択ではなくrisk levelとsafeguardへ分解する設計が明確
- may / can と should を分けることで、事実判断と規範判断を分離できる
- Writingは条件付き立場＋safeguardまで要求し、P1前半として十分

#### E012

判定：**Fix required — Core self-containment**

- E007のprovide / offer / grant、E010のinvestはTargeted Review
- 旧版はそれらを既習扱いしていた
- Core RouteではE012でFast Introduceする形へ変更
- Referenceを4分→6分、Readingを20分→18分にして60分総枠は維持

### B003 — E015 / E018

#### E015

判定：**Keep**

- efficiency / resilienceを同じ尺度として扱わず、buffer・alternative・response timeへ分解できる
- reduce / mitigate / alleviate / easeの語法がargument precisionへ接続している
- 「問題をなくす」と「impactを小さくする」を分ける点は後半でも再利用性が高い

#### E018

判定：**Fix required — Core self-containment**

- E014のThe number of / A number of、E017のcomplement / supplement / compensate forがTargeted Review
- Core RouteではE018でFast Introduceへ変更
- E015のmitigation系とE012のinvestはCore既習として残す
- Referenceを4分→6分、Readingを20分→18分

### B004 — E020 / E024

#### E020

判定：**Keep**

- resource limit → opportunity cost → dependence → priority の回路が明確
- 人数やequal spendingだけで結論を出さない設計が後続のpriority判断へつながる
- allocate / assign / distributeの違いも単なる語彙問題ではなくresourceの種類とdecisionを対応させている

#### E024

判定：**Fix required — Core self-containment**

- E023のcommunicate / convey / expressがTargeted Review
- Core RouteではE024でFast Introduceへ変更
- allocate系とB003までのmitigation / complement系はCore既習
- Referenceを4分→5分、Readingを20分→19分

### B005 — E027 / E030

#### E027

判定：**Keep**

- evidence strength → claim strength をP1で明示する重要回
- associationとcausation、sample / design、claim wordingを同じ回路で処理できる
- Writingも「重要性を残しつつ断定を弱める」方向で、後半のevidence-linked writingへの橋になっている

#### E030

判定：**Fix required — Core self-containment**

- E029のchoose / select / opt forがTargeted Review
- communicate系はE024、inform / notify / alertとevidence strengthはE027でCore既習
- choose / select / opt forだけをE030でFast Introduceへ変更
- Referenceを4分→5分、Readingを20分→19分

### B006 — E034 / E036

#### E034

判定：**Keep**

- uncertainty / limitation / errorを分ける設計が明確
- limitationを認めることとstudy全体を否定することを分離し、qualificationの基礎になっている
- P2以降の「限界を認めた上で結論を残す」書き方へ自然につながる

#### E036

判定：**Fix required — Core self-containment**

- E032のprefer / favor / prioritizeがTargeted Review
- choose系はE030、acknowledge系はE034でCore既習
- prefer / favor / prioritizeをE036でFast Introduceへ変更
- Referenceを4分→5分、Readingを20分→19分

### B007 — E038 / E042

#### E038

判定：**Keep**

- suggest / propose / recommendを単なる強弱ではなくdecision stageで分ける点が良い
- idea → concrete plan → evidence-based recommendation がそのままproposal writingの骨格になる
- P1終盤のLanguage FocusとしてP2への接続が明確

#### E042

判定：**Fix required — Core self-containment**

- E040のreject / refuse / decline / dismissがTargeted Review
- suggest / propose / recommendはE038、acknowledge系はE034でCore既習
- reject / refuse / decline / dismissをE042でFast Introduceへ変更
- Referenceを4分→5分、Readingを20分→19分

## P1 presentation standardization

Core 15本すべてで、解答面の読む順番を統一した。

1. **解答一覧** — 正答・解答例だけを最初に短く確認
2. **設問解説** — なぜその答えになるか
3. **語法・判断整理 / 因果骨格 / 本文骨格** — 問題固有の解説以外を分離
4. **Writing解説** — model answerと自己修正
5. **Core recap** — 次の問題へ持ち越す抽象化

これにより、「答えを確認したい時」と「理解を深めたい時」を同じ長い解説の中で探さなくてよくなる。

## P1 overall conclusion

P1 Core 15は**これ以上削らなくてよい**。

内容上の勾配は、

**comparison → causation → claim strength / trade-off → mitigation / resilience → allocation / opportunity cost → evidence strength / voluntary choice → qualification / priority → proposal / rejection**

とつながっている。

WritingはP1では2〜5文を中心に留め、各Checkpointで複数技能を統合する。ここで段落作文を重くしすぎず、P2へ入ってから本文依存Writingとparagraph constructionへ負荷を移す現在の役割分担が妥当。

今回の主要修正は、問題追加ではなく**圧縮後のCore Routeに合わせた前提知識の再配線**だった。


## P2

### Overall finding

P2 Core 30本の教材内容そのものは、P1からP3へつなぐBridgeとして妥当。

前半は
**sentence structure → retrieval / correctness → reference / cohesion → paragraph function / structure → stance / comparison / source integration**
へ進み、後半は
**inference / summary → 60–80語 → 80–100語 → 90–110語 → proposal / priority → Final Checkpoint**
へ移る。

問題は教材の不足ではなく、P1と同様に**圧縮後のCore Routeと、旧Bundle完走前提のCheckpoint記述がずれていたこと**だった。

### B008 — E043 / E045 / E046 / E048

判定：**Keep with self-containment repair**

- E043で節境界・有限動詞、E045でretrieval、E046でCorrectを順に導入しており、P1からP2への入口として妥当
- 旧E048はOptional側で正式導入するmain-clause処理とtimed processingまで「既習」として扱っていた
- main clauseはE043の有限動詞guide内で既に扱えるため、新規教材追加は不要
- timed processingだけE048のPlanでFast Introduceへ変更
- 「速読」ではなく、main claim / structure / question targetへ時間を配る技能として明示

### B009 — E050 / E053 / E054

判定：**Keep with self-containment repair**

- E050のreference tracking → E053のclaim / reason / evidenceとcohesionは自然な勾配
- 旧E054は文脈語義・lexical nuance・NaturalまでBundle内既習扱いしていたが、それらのdedicated lessonはTargeted Review
- E054のPlanで以下をFast Introduce:
  - contextから未知語の意味範囲を絞る
  - lexical choiceをmeaning / object / collocationで判断する
  - Correctを保ったままNaturalへ直す
- Planを3→5分、Reading / Questionsを各1分短縮して総60分は維持

### B010 — E055 / E058 / E060

判定：**Keep with self-containment repair**

- E055のparagraph functionとE058のlong NPはCoreで保持する価値が高い
- 旧E060はE055〜E059を全て履修済みと仮定していた
- E060でmain point compression / output switching / parallel & contrastをFast Introduce
- 段落機能から主旨へ進む回路を
  **function → main point → structure → Japanese output**
  として自己完結させた
- 専用Transfer教材を追加しなくてもCheckpointで最低限の操作は成立

### B011 — E061 / E066

判定：**Keep with self-containment repair**

- E061のclaim strengthはP1のevidence strengthをP2読解へ引き上げる重要回
- 旧E066はinformation structure・output switching・parallel processingをBundle完走前提で要求していた
- E066のPlanで以下をFast Introduce:
  - old information → new information
  - head noun / parallel / insertionを先に安定させてから日本語へ
- E058のlong-NPとE061のstanceを土台にするため、追加lessonなしでも成立

### B012 — E068 / E071 / E072

判定：**Keep with first-Core-encounter repair**

- E068で2本文比較を正式にCore化
- 旧E071はformat adaptationを「Transfer」と呼んでいたが、canonical introduceはTargeted Review
- E071をCore上のFast Introduceへ変更し、
  English short answer / Japanese explanation / translation
  の違いを明示
- E072では比較・claim strength・information flow・format adaptationを統合
- Core-onlyで順に進んでも前提抜けがなくなった

### B013 — E073 / E074 / E078

判定：**Keep**

- unknown topic → passage + table → checkpoint の流れが明確
- 背景知識を使わず definition → rule → evidence → conclusion へ進む設計はP3へ高い転用性がある
- E078は最大値探しではなくmandatory criteriaとtie-breakerを分けるため、資料統合として十分
- Optionalのtransfer反復を省いてもCoreだけで成立

### B014 — E079 / E080 / E081 / E084

判定：**Keep with source-set Fast Introduce**

- E079 compressed structure → E080 inference → E081 summary は非常に良い勾配
- E084はcontinuous text + Notice / Email / FAQを統合するが、非連続資料専用introはOptional
- E084のCheckpoint Planでsource-set readingをFast Introduce:
  source role → procedural fact source → limited inference
- Planを3→4分、Continuous Textを15→14分にして60分維持

### B015 — E085 / E086 / E087 / E090

判定：**Keep**

Writing勾配がP2で最もきれいな区間。

- E085: precisionを中心に60–80語
- E086: 本文のlogicを別題材へFree transfer、80–100語
- E087: Plan→Draft→Revise、90–110語
- E090: Summary + evidence-linked Writingを同一60分内で統合

語数だけでなく、
**support decrease / transfer independence / revision / source use**
が同時に上がっているため、一律短縮や問題追加は不要。

### B016 — E091 / E092 / E093 / E096

判定：**Keep**

- E091 problem→solution correspondence
- E092 proposal + mechanism + limitation
- E093 criteria → evaluation → priority
- E096 summary / Japanese output / table / proposal を統合

P2終盤では「自由に意見を書く」ではなく、
**problem definition → criteria → mechanism → limitation → next action**
へ収束しており、P3のevidence-linked judgmentへ自然につながる。

## P2 presentation standardization

Core 30本すべてに `## 解答一覧` を追加した。

原則:
- objective itemは `Q1｜B` のように正答だけ
- free responseは `解答例は設問解説参照`
- Summaryは `モデル要約はWriting解説参照`
- Writingは `モデル答案はWriting解説参照`

模範答案や長い解答例を一覧へ複製しない。

これにより、
**答え確認 → 詳細解説 → Writing / learning point**
の役割を分離しつつ、answer-side bloatを抑える。

## P2 overall conclusion

P2 Core 30は**維持**。

Core Routeの勾配は、

**structure / correctness
→ cohesion / paragraph function
→ stance / information flow / multi-text comparison
→ unknown topic / table integration
→ inference / summary
→ 60–110-word Writing
→ proposal / priority
→ Final Checkpoint**

となっている。

P1よりsupportは減り、P3ほどevidence evaluationを重くしない中間Phaseとして役割が明確。

今回の主要修正は、
1. 圧縮後に残ったBundle完走前提をFast Introduceへ置換
2. Core 30本の解答一覧を統一
3. 60分枠を維持したままsupportの置き場所を調整

であり、新規問題追加は不要。
