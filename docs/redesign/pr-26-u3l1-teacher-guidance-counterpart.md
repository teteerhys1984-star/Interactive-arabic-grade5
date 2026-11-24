# PR #26 — U3L1 Teacher Guidance Counterpart + Mandatory Triple Gate

**Branch:** `arena/10cca02f-interactive-arabic-grade5`
**Base:** `a8155ca` (PR #25 merge on `main`)
**Scope:** unit 3 lesson 1 (العُلَماءُ الصِّغار, ص٧٣–٨٣) + a reusable per-lesson gate
**Status:** independent PR — `main` untouched, not merged.

---

## 1. The gap this fixes

Before this change, U3L1 was correct-but-asymmetric:

| Surface | What existed | Problem |
|---|---|---|
| Student | 52 platform suggestions behind «أظهر الجواب», 5 calligraphy gaps with no button | worked |
| Teacher | `declared_absence` record: reason, source, date, deferred task, 57-record ledger, `studentGuidanceNote` | the teacher **could not see** the 52 suggestions the learner sees |
| Supervision | audit A1–A12, error-free | **nothing** checked that student-visible guidance has a teacher counterpart |

The learner was reading wording the teacher could not audit. That is a
governance defect, not a rendering bug: `declared_absence` is correct (there is
no approved key), but it must not mean "invisible to the teacher".

## 2. What was built

### 2.1 Link-only registry — `src/data/guidanceRegistry.ts`

A generic contract, applied by lessons:

```ts
interface TeacherGuidanceLink {
  activityId; sourceActivityId?; pageNumber?; section?; printedNumber?;
  sourceRef;          // the record's own declared reference
  classification;     // copied from record.disclosure.kind — never re-decided
  notice;             // per-item honesty notice
  gapReason?;         // declared source gap only
}
interface TeacherGuidanceRegistry {
  lessonId; unitId; lessonTitle; recordLocation;
  declaredActivityCount; activityIds; links; counts;
  readRecord(activityId): DisclosureBearingRecord | null;  // the ORIGINAL record
}
```

**Link-only guarantees**

- The registry holds **no** answer text, explanation or copied wording. It holds
  ids, page numbers, section names, `sourceRef`, classification and notice.
- The text is read at render time from the **original** record through the
  single resolver: `resolveAnswerReveal(record, 'teacher')`.
- It is not a second data source: `buildTeacherGuidanceRegistry()` derives the
  classification from `record.disclosure.kind`; if the disclosure is unknown it
  falls back to `no_approved_content` (fail closed) and A13 reports it.
- A test asserts that no link's serialized form contains any suggestion text.

U3L1 projection: `src/data/unit3Lesson1/guidanceRegistry.ts`
(`U3L1_GUIDANCE_REGISTRY`) — built from `U3L1_ACTIVITIES` + `u3l1RevealRecord`.

### 2.2 Teacher portal section — `TeacherGuidanceSection.tsx`

Rendered **inside** the declared-absence view as its own advisory block, with the
mandated heading:

> **إرشادات مقترحة من المنصة — ليست حلولًا معتمدة**

Each item carries:

- **المصدر** — source activity id (e.g. `U3L1-73-01`) and printed page,
- **سجل الإرشاد** — the registry `sourceRef`,
- **التصنيف** — «إرشاد مقترح (غير معتمد)» / «لا محتوى معتمد» / …,
- **التنبيه** — the same notice the learner reads,
- the suggestion itself, read through `resolveAnswerReveal(..., 'teacher')`.

Counts are shown above the list (total / guidance_only / approved_key /
no_approved_content / teacher_only). The five calligraphy items appear under
**«فجوات معلنة بلا محتوى معتمد (لا إجابة مخترعة)»** with their gap reason and
no answer body.

Navigation: in the unit view, a declared-absence lesson now shows a control
labelled «عرض الإرشادات المقترحة للدرس …» — **not** «عرض حلول الدرس …». The
solutions view stays unreachable, and no `.guide-solution-card` or
«الحل النموذجي:» text exists anywhere in this lesson.

### 2.3 Audit rule A13 — `src/utils/audit.ts`

`auditCurriculum(curriculum, tests, teacherGuides, guidanceRegistries)`.

| Rule | Severity | Rejects |
|---|---|---|
| A13.1 | error | two guidance registries for one lesson |
| A13.2 | error | a registry with no registered solutions record |
| A13.3 | error | duplicate/empty activity id, missing `sourceRef`, unknown classification |
| A13.4 | error | a displayed item with no notice |
| A13.5 | error | recorded counts ≠ counts re-derived from the links; `declaredActivityCount` ≠ link count |
| A13.6 | error | `approved_key > 0` inside a `declared_absence` (laundering a suggestion) |
| A13.7 | error | student-visible guidance without the documented `studentGuidanceNote` |
| A13.8 | error | a documented `studentGuidanceNote` with **no** registry (student sees what the teacher cannot audit) |

A13 reads **only** ids, classifications, `sourceRef`s and counts — never text — so
it cannot become a second data source either.

### 2.4 Supervision panel — `GuidanceSupervisionPanel.tsx`

Added to the audit tab (not a new tab). Per lesson: solutions status, and the
classification counts plus a supervision note; the header summarises how many
lessons have a registry and how many carry a finding. **No guidance text is
repeated** — a test asserts every suggestion string is absent from the panel.

### 2.5 Preserved PR #24 decisions (unchanged)

- `AnswerDisclosure` — untouched.
- `TeacherSolutionsModel` / `ApprovedLessonSolutions` / `DeclaredAbsenceLessonSolutions` — untouched.
- `declared_absence` still carries **no** solutions, objectives or keys (A6/A7/A8 intact).
- No `guidance_only` record became `approved_key`; U3L1 counts stay **0 approved / 52 guidance / 5 no approved content**.
- The 5 calligraphy activities still have no invented answer and no button.
- No lesson content file was modified (`src/data/**` changes are additions only).

## 3. The mandatory triple gate (for every future lesson)

Every lesson must now satisfy three gates that are checked together, from the
same data, by `src/test/teacherGuidanceCounterpart.test.tsx`:

```
GATE 1 — student      disclosure decides: approved_key/guidance_only reveal,
                      teacher_only/no_approved_content never do; no text ⇒ no
                      payload; the resolver is the only decision point.
GATE 2 — teacher      every record the learner can reveal has a teacher link in
                      the same lesson; a declared-absence lesson that shows
                      guidance must carry studentGuidanceNote; and that note
                      without a registry is an error (A13.8).
GATE 3 — supervision  counts re-derived from links match the declared counts;
                      the four classifications add to the total; inside a
                      declared absence approved_key must be 0. Status, counts and
                      gaps are shown without repeating any guidance text.
```

`expectTripleGate({ label, records, registry, guide })` is the reusable helper.
It is executed against:

- **U3L1** (declared absence, 52 + 5) — must pass,
- **U2L2** (a previously working approved lesson, 22 approved + 29 guidance) — the
  comparison lesson, proving the gate is not special-cased to U3L1,
- **U2L3** (43 × `no_approved_content`, nothing revealable) — the contrast case
  where no counterpart is required and A13 stays silent.

### Applying the gate to a new lesson

1. Build the registry: `buildTeacherGuidanceRegistry({ lessonId, unitId, lessonTitle, recordLocation, items })`
   where each item holds the **original** record (via the lesson's existing
   adapter such as `fromKeyedLesson` / `u3l1RevealRecord`).
2. Register it in `App.tsx` → `TEACHER_GUIDANCE_REGISTRIES`.
3. Add it to `expectTripleGate` in the test. A13 then blocks any lesson that shows
   the learner guidance with no teacher counterpart.

If a lesson has nothing revealable (like U2L3), no registry is needed — A13.8 only
fires when a `studentGuidanceNote` promises guidance that has no registry.

## 4. Verification

| Check | Result |
|---|---|
| `npx tsc -b` | pass, no errors |
| `npx vitest run` | **402 tests / 27 files, all pass** (24 new) |
| `npm run build` | pass (`dist` built; only the pre-existing chunk-size warning) |
| Other lessons | untouched: no change to their data files; audit gains no issue for lesson1/2/3, U2L1, U2L2, U2L3 (asserted) |
| Student surface | 52 payloads with heading «إرشادات للإجابة», 5 nulls (u3l1-a-45…49) |
| Teacher surface | 57 items under the mandated heading; zero `.guide-solution-card`, zero «الحل النموذجي:» |
| Supervision | status + ٥٢/٥ per lesson, mismatches surfaced, no text duplication |

## 5. Remaining limitations

1. **Front-end gate only.** The teacher area password is still a client-side
   check in a static bundle — unchanged by this PR, and documented since PR #24.
2. **Counts are per registered lesson.** A13 validates the registries it is given
   against the guides it is given. A lesson that shows guidance to the learner
   *and* is missing from both lists would only be caught once its registry is
   added; the gate prevents the shipped configuration from drifting, not a future
   omission at authoring time.
3. **U2L2 comparison is built in the test, not shipped.** Its registry is
   constructed inside the test to prove the contract is reusable; shipping one for
   every approved lesson is deferred (it would add teacher-visible projection where
   the approved guide already covers the record).
4. **A13 does not compare answer wording** against the original record (by
   design — that would make it a data source and would need an exact-text
   contract). It proves the counterpart exists, is classified and is counted.
