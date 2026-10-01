# Learner-facing Series System

## Purpose

E001–E234を、管理上の教材群ではなく**解く側から見て一つのシリーズとして感じられる教材**にするための表示規約。

シリーズ性は、内部コードや同じカードを繰り返すことで作らない。
毎回同じ学習リズム・同じ重要度の階層・同じ言葉を使うことで作る。

## Learner-facing rhythm

原則として、各教材の最上位構造は次の4つだけにする。

1. **START**
   - 何を意識して解くか
   - 必要なら短い事前確認
   - 時間・Gloss・補助情報はここに従属させる

2. **CHALLENGE**
   - その回の中心課題
   - Reading / Questions / 資料読解 / 文法判断など、教材形式に応じた主問題
   - 1教材の視覚的な主役

3. **WRITE**
   - 自分で英語を作る課題がある場合に使う
   - 自由英作文・短文記述・要約など
   - Self-checkはWRITEの補助として折りたたむ
   - 書く課題がない教材では省略可能

4. **REVIEW**
   - 解答・解説
   - 内部は **答え → 考え方 → 持ち帰り** の3段階
   - 「持ち帰り」は次の問題でも使える学びを優先する

## Importance gradient

同じデザインを全項目へ適用しない。

### Primary — 主役
- CHALLENGE
- WRITE
- 正答 / モデル答案
- 今回の中心となる問い

表現:
- 大きい見出し
- 強い罫線
- 十分な余白
- 常時表示

### Secondary — 補助
- Pre-solve
- Language Focus
- 語法・本文構造
- 思考の補助説明

表現:
- 小さめ見出し
- 左罫線や薄い背景
- Primaryより視覚的に弱くする

### Tertiary — メモ
- 時間配分
- Gloss
- Self-check
- 自己評価
- AI / 先生への相談方法

表現:
- 小さい文字
- 薄い色
- 原則として折りたたみ

## Fixed learner-facing vocabulary

シリーズを通して優先して使う語:

- START
- CHALLENGE
- WRITE
- REVIEW
- 答え
- 考え方
- 持ち帰り

教材制作者向けの細かい見出しは必要に応じてこの下へ配置する。

## Internal-code rule

次のような内部管理コードは learner-facing UI に表示しない。

- Bxxx
- P1 / P2 / P3 / P4
- LTxx
- LEXGxxx
- Gxx
- THxx
- EVxx
- ARGxx
- IDEAxxxx
- ACxx
- その他、解く側が意味を知らなくても学習に支障がない分類コード

コードは canonical source と内部ロジックでは保持してよい。

 learner-facing で教材識別に使うのは原則 **Exxx** のみ。

## Series identity

各教材の冒頭では、同じ形式で:

- シリーズ名: **自由英作文**
- Lesson ID: **Exxx**
- 教材タイトル
- 必要なら目安時間

を表示する。

シリーズ名は小さく固定し、教材タイトルを主役にする。

## Density rule

- 最上位の見出しを増やしすぎない
- 1画面に同じ強さのカードを連続させない
- 補助情報を主問題と同じ視覚強度で表示しない
- 「仕様上存在する項目」をそのまま全部 learner-facing に露出しない
- 内容を削らずに、順番・階層・折りたたみで密度を制御する

## E001 prototype gate

E001で以下を確認してから全教材へ一般化する。

- START / CHALLENGE / WRITE / REVIEW の流れが自然か
- CHALLENGEが視覚的な主役になっているか
- 補助情報がノイズになっていないか
- 内部コードが露出していないか
- REVIEWで「答え → 考え方 → 持ち帰り」が追いやすいか
- 同じシリーズを続けて解きたいと感じる統一感があるか
