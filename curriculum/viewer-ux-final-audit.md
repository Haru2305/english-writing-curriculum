# Viewer Final UX Audit — 2026-10-02

## Scope

Learner-facing Viewer UX was tested as an actual built site, not only by source inspection.

Browser matrix:
- Chromium
- mobile viewport: 390 × 844
- desktop viewport: 1440 × 1000
- representative lessons: E002 / E086 / E204 / E208 / E234
- both REVIEW closed and REVIEW opened states

The browser test captured full-page screenshots and measured document width, page length, REVIEW trigger size, answer-list size, and lesson navigation.

## Baseline findings

### 1. No page-level horizontal overflow

Across all five representative lessons:
- mobile document width stayed exactly 390 px
- desktop document width stayed exactly 1440 px

Some sticky REVIEW internals intentionally have scrollable/negative-margin geometry, but they did not expand the document viewport or create page-level horizontal scrolling.

### 2. REVIEW tap target is large enough

The REVIEW reveal control measured 65 px high in the representative lessons.

This is comfortably above a normal mobile tap-target floor.

### 3. Generic REVIEW was too long

Before this audit, opening REVIEW expanded all explanations at once.

Mobile page length, in viewport-heights:

| Lesson | REVIEW closed | REVIEW opened before | REVIEW opened after |
| --- | ---: | ---: | ---: |
| E002 | 6.86 | 11.94 | 7.93 |
| E086 | 3.82 | 9.18 | 4.40 |
| E204 | 5.48 | 11.86 | 6.26 |
| E234 | 9.54 | 17.05 | 10.70 |

The fix uses progressive disclosure:

**解答一覧**
→ collapsed **設問解説**
→ collapsed **Writing解説**
→ collapsed **思考・振り返り**

The learner can therefore check answers immediately without expanding every explanation.

### 4. E234 answer list was still too long

E234 retained full Japanese constructed-response model answers inside its compact answer list.

That made the answer list alone 1026 px high on the 390 px mobile viewport.

The Japanese constructed-response rows now point to:
`解答例は設問解説参照`

Objective items and Q3A designated positions still show direct answers.

After the repair, E234's answer list fell from 1026 px to 676 px.

The same legacy duplication was removed from E210 and E216.

### 5. Dedicated-page navigation was stale

The eight dedicated Viewer pages still used an old representative-page navigation chain instead of adjacent lessons.

Examples:
- E208 linked backward to E205 instead of E207
- E205 linked backward to E193

All dedicated pages now use the actual lesson sequence:

- E001 → E002
- E049: E048 ← / → E050
- E087: E086 ← / → E088
- E097: E096 ← / → E098
- E145: E144 ← / → E146
- E193: E192 ← / → E194
- E205: E204 ← / → E206
- E208: E207 ← / → E209

This restores uninterrupted lesson-by-lesson navigation across dedicated and generic pages.

### 6. Japanese UI fallback was fragile

In the Linux Chromium browser audit, textbook Japanese rendered correctly through BIZ UDPMincho, but UI labels using only platform sans-serif fallbacks displayed as missing-glyph boxes.

Examples included:
- 答え・解説を見る
- 書き終わったら確認
- 一覧へ
- REVIEW classification labels

The UI font stacks now retain the native system sans fonts first, but use the already-loaded BIZ UDPMincho as the final Japanese-capable fallback before generic `sans-serif`.

This does not change normal macOS/iOS/Windows rendering when a Japanese system sans font is available; it prevents missing Japanese glyphs on thinner Linux environments.

## Final learner flow

For generic lessons:

**START**
→ **CHALLENGE**
→ optional **WRITE**
→ **REVIEW**
→ compact **解答一覧**
→ open only the explanation category needed
→ adjacent previous / index / next navigation

Dedicated lessons preserve their richer task-specific layouts while using the same adjacent-lesson navigation.

## Permanent regression guards

The generic audit now fails if:
- a P4 compact answer list regains a long Japanese constructed-response answer instead of a pointer
- any dedicated page loses adjacent previous/next navigation
- generic REVIEW loses the three progressive-disclosure clusters
- generic REVIEW reverts to rendering the entire review body fully expanded
- the Japanese-capable UI fallback is removed

## Decision

No curriculum-content change is needed.

The remaining Viewer architecture is suitable for learner use on both mobile and desktop.
