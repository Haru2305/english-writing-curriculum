# Learner Entry UX Final Audit — 2026-10-02

## Scope

トップページから「今日どれをやるか」を決めるまでの learner-facing UX を、実際にbuildしたViewerで確認した。

Browser matrix:
- Chromium
- mobile: 390 × 844
- desktop: 1440 × 1000
- initial state
- first basic route opened
- repair catalog + first repair group opened

## Baseline problem

旧トップページは、教材制作者には分かりやすい一方、解く側には内部構造が前面に出ていた。

表示されていたもの:
- P1 / P2 / P3
- Bxxx
- 短縮ルート
- Representative lessons / 代表教材
- canonical
- prototype
- 全234教材の一覧

その結果、「教材がどう管理されているか」は分かるが、「今日は何を解けばよいか」が主役になっていなかった。

## Final entry model

入口は4段階だけを最初に見せる。

1. **基礎｜15回**
   - 比較・因果・主張を固める
   - E001から開始
2. **構成・要約｜30回**
   - 文から段落、要約、英作文へ
   - E043から開始
3. **実戦｜54回**
   - 初見資料から判断して書く
   - E097から開始
4. **筑波対策｜30日**
   - 30日で本番形式へ
   - E205から開始

各カードには:
- この段階の役割
- 回数
- E範囲
- 最初の教材への直接リンク
- ルート一覧へのリンク

を置く。

## Main line vs repair

### 基本ルート

4段階のルートは、初期状態では閉じる。

学習者は必要な段階だけを開き、上から1回ずつ進める。

### 補修・全教材

E001–E234の全教材は削除しない。

ただしトップページでは主線から分離し、

**必要なときだけ → 補修・全教材**

として折りたたむ。

チェック回で弱点が出たときにだけ使う。

## Internal-code cleanup

トップページでは次をlearner-facingに出さない。

- P1 / P2 / P3 / P4
- Bxxx
- Bundle
- Representative lessons / 代表教材
- canonical
- prototype

教材タイトルにこれらが含まれる場合も、トップページ表示時だけ:
- Checkpoint → チェック回
- Final Checkpoint / Final Gate → 最終チェック

へ変換する。

canonical lesson title自体は変更しない。

## Site identity

ヘッダー:
- before: `English Curriculum / 思考ツール / prototype`
- after: `自由英作文 / 思考ツール`

シリーズ名と教材ページ上のidentityを一致させた。

## Browser results

### Initial page

| Measure | Mobile 390×844 | Desktop 1440×1000 |
| --- | ---: | ---: |
| document width | 390 px | 1440 px |
| page-level horizontal overflow | 0 | 0 |
| page length | 2.56 screens | 1.58 screens |
| stage cards | 4 | 4 |
| basic routes initially open | 0 | 0 |
| repair catalog initially open | no | no |
| start-button height | 42 px | 42 px |
| exposed P/B internal tokens | 0 | 0 |

The mobile first viewport shows:
- page purpose
- 「どこから始める？」
- the first two stage cards completely
- the start of the third stage

The whole closed entry page remains 2.56 screens tall.

### Expanded states

Mobile:
- first basic route opened: 3.97 screens
- repair catalog + first repair group opened: 5.17 screens

Desktop:
- first basic route opened: 2.63 screens
- repair catalog + first repair group opened: 2.83 screens

The full corpus therefore remains reachable without making the default page a 234-item wall.

## Font/rendering finding

Browser screenshots exposed an index-specific rendering problem: navigation headings using the textbook Mincho stack could fail to paint some Japanese strings even though their DOM text and layout existed.

Affected examples included:
- どこから始める？
- 比較・因果・主張を固める
- 文から段落、要約、英作文へ
- 上から1回ずつ進める

These are navigation UI, not textbook body text.

They now use the stable UI Japanese font stack. The textbook font remains in lesson content.

A second browser pass confirmed the headings display normally.

## Permanent regression guards

CI now requires:
- 「今日の教材を選ぶ」
- the four learner-facing stage names
- 基本ルート
- 補修・全教材
- basic routes initially collapsed
- repair catalog initially collapsed
- site header identity = 自由英作文

CI fails if the index reintroduces:
- P1短縮ルート / P2短縮ルート / P3短縮ルート
- Representative lessons / 代表教材
- Mobile lesson viewer
- canonical教材
- bundle-oriented full-corpus copy
- October accelerated route
- prototype
- English Curriculum

## Decision

The learner entry should remain:

**現在の段階を選ぶ**
→ **その段階の基本ルートを上から1回ずつ**
→ **弱点が出たときだけ補修**
→ **最後に筑波30日**

No progress tracking, login, new lesson IDs, or curriculum-content changes are required.
