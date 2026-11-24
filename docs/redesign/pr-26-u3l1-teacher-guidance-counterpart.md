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

### 2.3 Audit rule A13 — `src/utils/audit.ts` (bound to the ORIGINAL ledger)

`auditCurriculum(curriculum, tests, teacherGuides, guidanceRegistries)`.

The registry is **not trusted on its own word**. Every registry carries a
`source: TeacherGuidanceSource` handle back to the lesson's authoritative
records:

```ts
interface TeacherGuidanceSource {
  activityIds(): string[];                              // the real ledger
  record(activityId): DisclosureBearingRecord | null;   // the real record
  sourceActivityId(activityId): string | undefined;     // the printed task id
}
```

A13 then re-derives every claim through `compareGuidanceToSource()`:

| Rule | Severity | Rejects |
|---|---|---|
| A13.1 | error | two guidance registries for one lesson |
| A13.2 | error | a registry with no registered solutions record |
| A13.3 | error | duplicate/empty activity id, missing `sourceRef`, unknown classification |
| A13.4 | error | a displayed item with no notice |
| A13.5 | error | recorded counts ≠ counts re-derived from the links |
| A13.6 | error | **a record with no link (incomplete coverage)**, a link to a non-existent record (**extra**), a classification that contradicts the record's `disclosure`, a `sourceRef` that is not the record's own reference, or a `sourceActivityId` that is **missing or** points at the wrong printed task |
| A13.7 | error | any record the **learner can reveal** (decided by the same `toStudentReveal` the student surface uses) with no usable teacher counterpart |
| A13.8 | error | `activityIds` that omits an original id, lists a foreign id, repeats one, or has a different length than the original ledger |
| A13.9 | error | `approved_key > 0` inside a `declared_absence` (laundering a suggestion) |
| A13.10 | error | student-visible guidance without the documented `studentGuidanceNote` |
| A13.11 | error | a documented `studentGuidanceNote` with **no** registry |

A13 reads **only** ids, classifications, `sourceRef`s, source-lock ids and
counts — never text — so it cannot become a second data source.

### 2.3.1 U3L1 source adapter — `src/data/unit3Lesson1/guidanceRegistry.ts`

```ts
const U3L1_GUIDANCE_SOURCE = {
  activityIds: () => U3L1_ACTIVITIES.map((a) => a.id),
  record: (id) => U3L1_ACTIVITY_BY_ID[id] ? u3l1RevealRecord(U3L1_ACTIVITY_BY_ID[id]) : null,
  sourceActivityId: (id) => U3L1_ACTIVITY_BY_ID[id]?.sourceActivityId,
};
```

It is a live handle, not a copy: the records and their text stay in
`activities.ts` / `guidance.ts`.

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

## 3. The mandatory triple gate (automatic over the registered ledger)

The gate is no longer a hand-maintained list of lessons. It walks
`curriculumRegistry` and resolves each lesson's ORIGINAL records through a
registered adapter, so expectations are **derived from the data**:

```
GATE 1 — student      disclosure decides: approved_key/guidance_only reveal,
                      teacher_only/no_approved_content never do; no text ⇒ no
                      payload; the resolver is the only decision point.
GATE 2 — teacher      for every lesson: approved guide ⇒ one solution per source
                      record (1:1); declared absence ⇒ a registry is REQUIRED as
                      soon as anything is revealable, and it must cover every
                      record with matching classification and sourceRef.
GATE 3 — supervision  counts re-derived from links equal the declared counts;
                      the four classifications add to the total; inside a
                      declared absence approved_key must be 0. Status, counts and
                      gaps are shown without repeating any guidance text.
```

### Automatic coverage, and how a new lesson is caught

`src/test/teacherGuidanceCounterpart.test.tsx` iterates
`curriculumRegistry.units.flatMap(u => u.lessons)` — **every registered lesson**,
with no per-lesson test edit. A lesson added to the registry is picked up
immediately:

- if its record adapter is missing, the test fails loudly
  (`no record adapter registered for lesson …`) instead of skipping it;
- if it is an approved guide, its solutions must cover its records 1:1;
- if it is a declared absence with anything revealable, it must ship a
  source-bound registry that matches record-for-record;
- if nothing is revealable (like U2L3), no registry is needed and A13 stays silent.

`expectTripleGate({ label, records, registry, guide })` remains the reusable
per-lesson assertion; the automatic loop above is the guarantee that no lesson is
forgotten.

### Negative tests (the gap this revision closes)

Each of these fails the audit, and each is a test:

| Mutation | Caught by |
|---|---|
| delete one link | A13.6 missing + A13.5 (declared count vs links) |
| delete the link of a *revealable* activity | A13.6 missing, and the record is still revealable from the source |
| change a classification (`guidance_only` → `approved_key`) | A13.6 drift + A13.9 laundering |
| change a `sourceRef` | A13.6 reference drift |
| change a `sourceActivityId` | A13.6 printed-task drift |
| **remove** a `sourceActivityId` (the record has one) | A13.6 printed-task drift — omission fails exactly like a wrong id |
| add a dangling link | A13.6 extra |
| shrink `activityIds` | A13.8 omission |
| add a revealable activity to the ledger with no counterpart | A13.6 missing (the regression case) |
| drop the `source` adapter | A13.6 no-source |

## 4. Verification

| Check | Result |
|---|---|
| `npx tsc -b` | pass, no errors |
| `npx vitest run` | **421 tests / 27 files, all pass** (43 in the guidance suite) |
| `npm run build` | pass (`dist` built; only the pre-existing chunk-size warning) |
| Other lessons | untouched: no change to their data files; audit gains no issue for lesson1/2/3, U2L1, U2L2, U2L3 (asserted) |
| Student surface | 52 payloads with heading «إرشادات للإجابة», 5 nulls (u3l1-a-45…49) |
| Teacher surface | 57 items under the mandated heading; zero `.guide-solution-card`, zero «الحل النموذجي:» |
| Supervision | status + ٥٢/٥ per lesson, mismatches surfaced, no text duplication |

## 5. Remaining limitations

1. **Front-end gate only.** The teacher area password is still a client-side
   check in a static bundle — unchanged by this PR, and documented since PR #24.
2. **A new lesson needs a one-line adapter.** A13 verifies any registry it is
   given against that registry's own source handle, and the automatic loop fails
   if a registered lesson has no adapter — but the adapter (four lines: ids,
   record, source-lock id) must be written when the lesson is registered. That is
   a data-authoring step, not a test edit.
3. **U2L2 comparison is built in the test, not shipped.** Its registry is
   constructed inside the test to prove the contract is reusable; shipping one for
   every approved lesson is deferred (it would add teacher-visible projection where
   the approved guide already covers the record).
4. **A13 does not compare answer wording** against the original record (by
   design — that would make it a data source and would need an exact-text
   contract). It proves the counterpart exists, is classified and is counted.
