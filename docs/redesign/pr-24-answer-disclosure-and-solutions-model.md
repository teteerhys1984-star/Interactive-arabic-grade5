# Answer disclosure & teacher solutions — unified mechanism (spec v2 implementation)

Status: implemented on `arena/28ac6cb2-interactive-arabic-grade5`, based on owner-approved spec v2 and decisions D1–D15.
Scope: the **technical mechanism** and the **honest states** only. Authoring solutions, guidance or objectives is a separate content task requiring source approval (D7).

---

## 1. Two problems, one root cause

| Reported symptom | Root cause before this change |
| --- | --- |
| Teacher portal showed no solutions for Unit 3 Lesson 1 | The portal joined `curriculumRegistry` lessons to a hard-coded `TEACHER_GUIDES` array (App.tsx). U3L1 had **no guide object at all**, so it fell into the generic «لا توجد حلول معتمدة» card. The portal had only two states (guide / missing) and no way to say *"this lesson is registered, and its absence is documented"*. |
| No «أظهر الجواب» next to the questions | Each renderer built its own reveal payload from whatever text it found (`solution`, `answerKey`, `checkExplanation`, `teacher.answerOrGuidance`). A renderer with no such field simply had no button; some surfaces showed a button whose key was inferred from mere text presence. The decision was **implicit and duplicated per lesson**. |

The fix is a single decision point plus a single registration point, both fail-closed.

---

## 2. Reveal mechanism (student surface)

`src/components/common/answerDisclosure.ts` is the **only** place the reveal decision is made.

```ts
resolveAnswerReveal(record: DisclosureBearingRecord, scope: 'student' | 'teacher')
```

- `approved_key`, `guidance_only` → reveal for students.
- `teacher_only` → `null` for students, solution object for teachers.
- `no_approved_content` / missing / malformed disclosure → `null` (no button, no wording, nothing in the DOM).
- `sourceRef` is mandatory on every kind; a disclosure without it is treated as invalid.

Data-driven per answer type, with **no third copy** of the key:

| Lesson | Adapter | Where the approved key lives |
| --- | --- | --- |
| lesson1 | `fromLesson1()` | `interaction` field keys (`acceptedAnswers`, `correctId(s)`, `correctCategoryId`) + `solution` |
| lesson2, lesson3, unit2Lesson1, unit2Lesson2 | `fromKeyedLesson()` | `answerKey` / `checkExplanation` / `teacher.answerOrGuidance` (located, never re-authored) |
| platform drills | inline record in the renderer | the drill's own `correct` option / `correctId` |
| unit2Lesson3 | — | no key exists ⇒ every record declares `no_approved_content` |
| unit3Lesson1 | `u3l1RevealRecord()` (`data/unit3Lesson1/guidance.ts`) | platform-authored suggested answers, declared `guidance_only` — never `approved_key` (see §6) |

Every lesson activity carries an explicit, mandatory `disclosure { kind, sourceRef }`.
Coverage is enforced by `src/test/disclosureCoverage.test.ts` (339 records + platform drills); behavioural equivalence with the previous per-lesson adapters is proven by `src/test/revealParity.test.ts`.

### Lesson 1 duplicate resolved (D4)

Lesson 1 had **two** reveal surfaces: the shared `AnswerReveal` button *and* a legacy «اعرض الإجابة النموذجية (بعد المحاولة)» button gated on `attempted`, rendering `.l1-model-answer`.
The legacy button and panel are removed. The single remaining surface is `AnswerReveal` («أظهر الجواب»), available without an attempt, showing the approved per-field keys, the model answer and the rationale under the existing heading «الجواب المعتمد» (unchanged wording, unchanged content). `lesson1Rebuild.test.tsx` was updated accordingly.

---

## 3. Registration mechanism (teacher surface)

`TeacherSolutionsModel` (`src/types/curriculum.ts`) has exactly two members:

```ts
{ kind: 'approved', … exerciseSolutions: TeacherExerciseSolution[] (non-empty), lessonTestAnswerKeyRef }
{ kind: 'declared_absence', declaration: { reason, sourceRef, declaredOn, deferredContentTask },
  sourceRecords: { sourceActivityId, lessonStepId, pageNumber }[] }
```

`TeacherLessonGuide` is now an alias of the approved member — one shape, no duplicate contract, and `kind` is mandatory so approval is never inferred from non-empty text.

Registered today (App.tsx, one record per lesson, all 7 lessons):

| Record | State | Content |
| --- | --- | --- |
| lesson1 / lesson2 / lesson3 / unit2-lesson1 / unit2-lesson2 | `approved` | 39 / 53 / 51 / 45 / 51 solutions (unchanged) |
| unit2-lesson3 | `declared_absence` | 43 audited source records, no solutions |
| unit3-lesson1 | `declared_absence` | 57 audited source records, no solutions |

Each declared absence asserts at module load that its ledger mirrors `*_ACTIVITIES` exactly, so a future activity cannot leave the declaration silently stale.

### Teacher portal: three honest states

`TeacherSolutionsBrowser` (unit → lesson) now renders:

1. **approved** — solution cards, coverage ledger, open button.
2. **declared absence** — «غياب معلن وموثَّق»: reason, `sourceRef`, declaration date, deferred content task, audited source count, all inline. **No open button** — there is no solutions view to open and nothing to reveal.
3. **not registered** — the legacy message (now unused by the shipped registry), still fail-closed.

Unit cards count only approved solutions and additionally show how many lessons carry a declared absence.

### Audit A1–A12 (`src/utils/audit.ts`)

Errors (not warnings): unregistered lesson (A1), wrong unit (A2), two records for one lesson (A3), missing `kind` (A4), incomplete declaration (A5), declared absence carrying solutions/objectives/notes/keys (A8), empty or duplicate source ledger (A9), approved guide with no solutions or no objectives (A10), incomplete solution (A11). Info: a registered lesson with no record at all (A12). The 25 pre-existing `source_traceability` warnings are unchanged; `errorsCount` remains 0 on the shipped registry.

---

## 3.b Owner review round 1 (2026-11-23)

**D14 corrected.** `U2L1-46-07` («أَكْتُبُ مَا يُمْلِيهِ عَلَيَّ الْمُعَلِّمُ») is now `teacher_only`, not `no_approved_content`: the printed instruction makes the teacher the source of the dictated text, and the record carries the approved grading basis. Student scope yields nothing; teacher scope keeps the basis. Evidence and consequence are documented in the record itself and covered by `disclosureCoverage.test.ts` + a new UI test in `unit2Lesson1.test.tsx`.

**D8 — evidence, not renderer behaviour.** The former annotation rule leaned on `availability`/renderer behaviour. A new per-record report (`docs/redesign/pr-24-d8-classification-report.md`) lists, for all 347 answer records: id, proposed classification, the data evidence behind it, the exact source reference, and whether it is **confirmed** (312) or **needs an owner decision** (35).

The audit lesson adopted from D14: a missing *printed* key does not prove the absence of approved content (a teacher-dictated task is teacher-sourced). The blanket "gap ⇒ no_approved_content" rule now allows only that one documented, tested exception.

**Round 2 — the 35 are resolved.** The owner applied three rules (proven single answer ⇒ `approved_key`; examples/alternatives ⇒ `guidance_only`; teacher procedure/grading/dictation ⇒ `teacher_only`). Result: 20 → `guidance_only`, 12 → `teacher_only`, 3 confirmed unchanged, **0 left pending**, and no content touched. Final table and per-record reasons: `docs/redesign/pr-24-d35-ruling.md`.

One linked fix: lesson 1's heading override is now restricted to `approved_key`, so a relabelled guidance record shows «إرشادات للإجابة» instead of claiming to be «الجواب المعتمد».

## 4. What is deliberately *not* done

- No solution, guidance, objective, test key or answer text was authored, derived or inferred for unit2-lesson3 / unit3-lesson1.
- No answer was removed from, or changed in, the five approved guides.
- The declared absences are real gaps awaiting a content task with an approved source (`declaration.deferredContentTask`).

---

## 5. Verification

- `npm test` — 347 passed / 24 files.
- `npm run typecheck` — clean.
- `npm run build` — clean.
- New: `src/test/teacherSolutionsModel.test.tsx` (contract + A1–A11 negative cases + portal three states, including a lesson with no approved solutions).

---

## 6. Follow-up after this PR — Unit 3 Lesson 1 gets educational answers (not a key)

The declared absence is a **teacher-side** statement (there is no approved key,
so the portal shows no «solutions»). It was never meant to leave the learner
without any help, and the owner rejected an answer-less lesson.

`src/data/unit3Lesson1/guidance.ts` now carries a platform-authored, grade-5
answer for **52** of the 57 activities, built from the printed task plus the book
content the lesson already reproduces (poem, رفع/نصب/جزم rules, hamza rule,
dictation passage, letter model) and the platform's image descriptions. Every
one of those records is declared `guidance_only`:

- heading «إرشادات للإجابة» — never «الحل النموذجي المعتمد»;
- an explicit on-screen notice that the answer is platform-suggested and is
  **not** attributed to the textbook or to a teacher guide;
- revealed only through the unchanged `resolveAnswerReveal()` + `<AnswerReveal>`.

**5** calligraphy activities on ص٨٠–٨١ stay `no_approved_content` (hand-drawn
Ruq'ah models a machine font cannot reproduce faithfully): no answer is invented
and no button is rendered.

The three listening items on ص٧٣ were revisited in the owner's review: the
recording still does not exist and the poem is still NOT claimed to be the
listening text, but the poem IS printed on ص٧٤, so each item is now answered
only from that printed text — the two blanks of U3L1-73-06 and «لن يغلبنا
الجهل» are literal, «واثق» is an inference labelled as such, and the titles are
declared open. Every one of them carries the mandated notice: «إرشادات مقترحة
استنادًا إلى القصيدة المطبوعة، وليست تفريغًا للتسجيل الصوتي أو إجابة مؤكدة لما
ورد فيه».

`U3L1-81-03` (sender position) is no longer answered by a guess: the printed
letter model settles *top / bottom* (date first, signature last) and does not
settle *right / left*, so none of the four printed options is presented as the
answer and the ambiguity is named instead.

The teacher portal record stays `declared_absence` (zero approved solutions) and
gains `declaration.studentGuidanceNote`, which tells the teacher that student
guidance exists and is not an approved solution. Audit A8 still forbids any
solution field on that record, and `approved_key` remains **0** for this lesson.
