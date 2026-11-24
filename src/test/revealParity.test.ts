import { describe, expect, it } from 'vitest';
import { AnswerRevealEntry } from '../components/common/AnswerReveal';
import {
  entriesFromAnswerKey,
  resolveAnswerReveal,
  toStudentReveal,
} from '../components/common/answerDisclosure';
import { TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import { U2L1_ACTIVITIES } from '../data/unit2Lesson1/activities';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { u3l1RevealRecord } from '../data/unit3Lesson1/guidance';
import { LESSON2_PLATFORM_EXERCISES } from '../data/lesson2/platformExplanations';
import { GRAMMAR_PLATFORM_EXPLANATION, SPELLING_PLATFORM_EXPLANATION } from '../data/lesson1/platformExplanations';

/**
 * Parity harness — LEGACY BEHAVIOUR vs. the OWNER'S CLASSIFICATION.
 *
 * These are two DIFFERENT comparisons and they are kept apart on purpose:
 *
 *  1. LEGACY BASELINE (`b774c3d`, pre-annotation). The five per-renderer
 *     «أظهر الجواب» adapters were transcribed here exactly as they behaved, and
 *     the lesson-1 id sets below are the OLD hard-coded model-answer lists. This
 *     baseline is frozen: it is never edited to match current data.
 *
 *  2. OWNER CLASSIFICATION (2026-11-23). Where the owner ruled that a record is
 *     an example (`guidance_only`) or a teacher procedure (`teacher_only`), the
 *     resolver intentionally DIFFERS from the legacy baseline. Those divergences
 *     are enumerated explicitly in `APPLIED_RULINGS`, so a difference can only
 *     exist because the owner decided it — not because the code drifted.
 *
 * Content parity is verified independently and non-circularly in
 * `goldenBaseline.test.ts` (every instruction, input, answer, explanation and
 * the activity order are byte-identical to `b774c3d`).
 */

/* ---------------- legacy behaviour, transcribed ---------------- */

/*
 * LEGACY baseline (frozen) — transcribed from the renderers as they stood at
 * `b774c3d`, NOT derived from the current data.
 *
 * Note the shapes that prove the baseline is the old one:
 *  - lesson 2 hides only L2-14-01 / L2-19-07 (L2-18-04 was still shown).
 *  - lesson 3 hides nothing at all, and treats L3-27-01 / L3-27-05 / L3-31-03 as
 *    guidance rather than keys.
 *  - unit 2 lesson 1 treats U2L1-42-04 as a key and hides U2L1-44-04.
 * Every difference from these sets is one of the owner's rulings (APPLIED_RULINGS).
 */
const LEGACY_L2_MODEL_ANSWER_IDS = new Set(['L2-14-02','L2-17-02','L2-17-03','L2-17-04','L2-17-05','L2-18-01','L2-18-02','L2-19-01','L2-19-02','L2-19-03','L2-19-04','L2-19-05','L2-24-01','L2-24-02']);
const LEGACY_L2_TEACHER_ONLY_IDS = new Set(['L2-14-01','L2-19-07']);
const LEGACY_L3_MODEL_ANSWER_IDS = new Set(['L3-25-02','L3-25-04','L3-25-05','L3-27-03','L3-27-04','L3-27-06','L3-27-07','L3-28-03','L3-28-04','L3-28-05','L3-28-06','L3-29-01','L3-29-02','L3-30-01','L3-30-02','L3-30-03','L3-30-04','L3-31-01','L3-31-02','L3-31-04','L3-32-01','L3-32-02','L3-34-01','L3-34-02']);
const LEGACY_L3_TEACHER_ONLY_IDS = new Set<string>();
const LEGACY_U2L1_MODEL_ANSWER_IDS = new Set(['U2L1-40-01','U2L1-40-02','U2L1-40-04','U2L1-40-05','U2L1-42-01','U2L1-42-03','U2L1-43-01','U2L1-44-01','U2L1-44-06','U2L1-45-01','U2L1-45-02','U2L1-45-03','U2L1-45-04','U2L1-45-05','U2L1-45-06','U2L1-46-05','U2L1-48-02']);
const LEGACY_U2L1_TEACHER_ONLY_IDS = new Set(['U2L1-44-04']);
const LEGACY_U2L2_TEACHER_ONLY_IDS = new Set<string>();
const LEGACY_U2L2_MODEL_ANSWER_IDS = new Set(['U2L2-50-04','U2L2-50-05','U2L2-52-01','U2L2-52-04','U2L2-54-01','U2L2-54-02','U2L2-54-03','U2L2-54-04','U2L2-54-05','U2L2-54-06','U2L2-55-01','U2L2-55-02','U2L2-55-03','U2L2-55-04','U2L2-55-05','U2L2-55-06','U2L2-56-01','U2L2-56-02','U2L2-56-03','U2L2-57-01','U2L2-57-02','U2L2-59-01']);

type LegacyPayload = {
  entries?: AnswerRevealEntry[];
  modelAnswer?: string;
  explanation?: string;
  unavailableNote?: string;
  heading: string;
} | null;

/** L1: buildLesson1Reveal (transcribed) */
function legacyLesson1(activity: (typeof TEXTBOOK_ACTIVITIES)[number]): LegacyPayload {
  if (activity.status === 'pending') return null;
  const interaction = activity.interaction;
  const entries: AnswerRevealEntry[] = [];
  switch (interaction.kind) {
    case 'choose': {
      const correct = interaction.choices.find((choice) => choice.id === interaction.correctId);
      if (correct) entries.push({ label: 'الاختيار الصحيح', value: correct.text });
      break;
    }
    case 'multi': {
      const texts = interaction.choices
        .filter((choice) => interaction.correctIds.includes(choice.id))
        .map((choice) => choice.text);
      if (texts.length > 0) entries.push({ label: 'الاختيارات الصحيحة', value: texts.join(' + ') });
      break;
    }
    case 'classify':
      interaction.items.forEach((item) => {
        const category = interaction.categories.find((entry) => entry.id === item.correctCategoryId);
        if (category) entries.push({ label: item.text, value: category.label });
      });
      break;
    case 'text_inputs':
      interaction.fields.forEach((field) => {
        if (!field.pending && field.acceptedAnswers && field.acceptedAnswers.length > 0) {
          entries.push({ label: field.label, value: field.acceptedAnswers.join(' / ') });
        }
      });
      break;
    case 'table_fill':
      interaction.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, cellIndex) => {
          const column = interaction.columns[cellIndex];
          if (!column) return;
          if ('fieldId' in cell && !cell.pending && cell.acceptedAnswers && cell.acceptedAnswers.length > 0) {
            entries.push({ label: `${column} — صف ${(rowIndex + 1).toLocaleString('ar-EG')}`, value: cell.acceptedAnswers.join(' / ') });
          }
        });
      });
      break;
    case 'diagram_fill': {
      let blankNumber = 0;
      interaction.boxes.forEach((box) => {
        if (!box.fieldId) return;
        blankNumber += 1;
        if (!box.pending && box.acceptedAnswers && box.acceptedAnswers.length > 0) {
          entries.push({ label: `فارغ ${blankNumber.toLocaleString('ar-EG')}`, value: box.acceptedAnswers.join(' / ') });
        }
      });
      break;
    }
    default:
      break;
  }
  return {
    entries,
    modelAnswer: activity.solution.answer,
    explanation: activity.solution.explanation,
    unavailableNote:
      activity.status === 'partial_pending'
        ? activity.pendingNote ?? 'بعض الإجابات معلّقة بقرار صاحب المشروع ولا تُعرض لها إجابة.'
        : undefined,
    heading: 'الجواب المعتمد',
  };
}

/** lesson2/lesson3/u2l1/u2l2: build*Reveal (transcribed) */
function legacyKeyedReveal(
  activity: { availability: string; sourceActivityId: string; answerKey?: Record<string, string>; interaction: never; teacher: { answerOrGuidance: string }; checkExplanation?: string },
  modelIds: Set<string>,
  teacherOnly: Set<string>,
): LegacyPayload {
  if (activity.availability !== 'available') return null;
  if (teacherOnly.has(activity.sourceActivityId)) return null;
  const entries = activity.answerKey ? entriesFromAnswerKey(activity.interaction, activity.answerKey) : [];
  return {
    entries,
    modelAnswer: activity.teacher.answerOrGuidance,
    explanation: (activity as { checkExplanation?: string }).checkExplanation,
    heading: modelIds.has(activity.sourceActivityId) ? 'الحل النموذجي المعتمد' : 'إرشادات للإجابة',
  };
}

/* ---------------- record adapters used by the new code ---------------- */

const normalize = (payload: LegacyPayload | ReturnType<typeof toStudentReveal>) => {
  if (!payload) return null;
  const entries = (payload.entries ?? []).filter((entry) => entry.value.trim().length > 0);
  return {
    heading: payload.heading,
    modelAnswer: payload.modelAnswer?.trim() ? payload.modelAnswer : undefined,
    explanation: payload.explanation?.trim() ? payload.explanation : undefined,
    unavailableNote: payload.unavailableNote,
    entries,
  };
};

/**
 * THE OWNER'S RULINGS, ENUMERATED.
 *
 * Each entry says: "at the legacy baseline this record revealed X; the owner
 * decided it is Y". The resolver may differ from the legacy baseline ONLY for a
 * record listed here — so a divergence is always attributable to a decision, not
 * to code drift. The three records the owner confirmed as ALREADY correct are
 * listed separately in `CONFIRMED_UNCHANGED` and must keep matching the baseline.
 */
type Ruling = { from: 'shown' | 'hidden'; to: 'approved_key' | 'guidance_only' | 'teacher_only' };
const APPLIED_RULINGS: Record<string, Record<string, Ruling>> = {
  lesson1: {
    'a-p4-5': { from: 'shown', to: 'guidance_only' },
    'a-p5-1': { from: 'shown', to: 'guidance_only' },
    'a-p5-2': { from: 'shown', to: 'guidance_only' },
    'a-p5-3': { from: 'shown', to: 'guidance_only' },
    'a-p6-7': { from: 'shown', to: 'guidance_only' },
    'a-p6-8': { from: 'shown', to: 'guidance_only' },
    'a-p7-1': { from: 'shown', to: 'guidance_only' },
    'a-p7-2': { from: 'shown', to: 'guidance_only' },
    'a-p8-6': { from: 'shown', to: 'guidance_only' },
    'a-p8-7': { from: 'shown', to: 'guidance_only' },
    'a-p9-6': { from: 'shown', to: 'guidance_only' },
    'a-p10-1': { from: 'shown', to: 'guidance_only' },
    'a-p10-3': { from: 'shown', to: 'guidance_only' },
    'a-p11-2': { from: 'shown', to: 'guidance_only' },
    'a-p11-3': { from: 'shown', to: 'guidance_only' },
    'a-p11-4': { from: 'shown', to: 'guidance_only' },
  },
  lesson2: {
    'L2-18-04': { from: 'shown', to: 'teacher_only' },
  },
  lesson3: {
    'L3-26-01': { from: 'shown', to: 'teacher_only' },
    'L3-27-01': { from: 'shown', to: 'guidance_only' },
    'L3-27-02': { from: 'shown', to: 'teacher_only' },
    'L3-27-05': { from: 'shown', to: 'guidance_only' },
    'L3-28-02': { from: 'shown', to: 'teacher_only' },
    'L3-29-05': { from: 'shown', to: 'teacher_only' },
    'L3-29-06': { from: 'shown', to: 'teacher_only' },
    'L3-31-03': { from: 'shown', to: 'guidance_only' },
    'L3-32-03': { from: 'shown', to: 'teacher_only' },
    'L3-32-04': { from: 'shown', to: 'teacher_only' },
    'L3-33-01': { from: 'shown', to: 'teacher_only' },
    'L3-33-02': { from: 'shown', to: 'teacher_only' },
    'L3-33-03': { from: 'shown', to: 'teacher_only' },
    'L3-35-03': { from: 'shown', to: 'teacher_only' },
  },
  unit2Lesson1: {
    'U2L1-42-04': { from: 'shown', to: 'guidance_only' },
  },
};

/** Records the owner examined and confirmed already classified correctly. */
const CONFIRMED_UNCHANGED: Record<string, Ruling[]> = {
  lesson2: [
    { from: 'hidden', to: 'teacher_only' }, // L2-14-01 — keyed below
    { from: 'hidden', to: 'teacher_only' }, // L2-19-07
  ],
  unit2Lesson1: [{ from: 'hidden', to: 'teacher_only' }], // U2L1-44-04
};

type Loose = {
  id: string;
  sourceActivityId?: string;
  sourceRecordIds?: string[];
  disclosure?: { kind: string; sourceRef: string };
  answerKey?: Record<string, string>;
  interaction?: never;
  teacher?: never;
  checkExplanation?: string;
};

/** The stable key a parity assertion identifies a record by. */
const keyOf = (activity: Loose) => activity.sourceActivityId ?? activity.id;

/** Resolver payload for one record, built exactly the way its renderer builds it. */
const studentPayload = (lesson: string, raw: Loose) => {
  const activity = raw as unknown as (typeof TEXTBOOK_ACTIVITIES)[number];
  if (lesson === 'lesson1') {
    const legacy = legacyLesson1(activity);
    return toStudentReveal({
      id: raw.id,
      disclosure: raw.disclosure as never,
      entries: legacy?.entries,
      modelAnswer: legacy?.modelAnswer,
      explanation: legacy?.explanation,
      unavailableNote: legacy?.unavailableNote,
      headingOverride: 'الجواب المعتمد',
    });
  }
  const keyed = raw as unknown as {
    interaction: never;
    answerKey?: Record<string, string>;
    teacher: { answerOrGuidance: string };
    checkExplanation?: string;
  };
  return toStudentReveal({
    id: raw.id,
    disclosure: raw.disclosure as never,
    entries: entriesFromAnswerKey(keyed.interaction, keyed.answerKey ?? {}),
    modelAnswer: keyed.teacher.answerOrGuidance,
    explanation: keyed.checkExplanation,
  });
};

const LEGACY_BASELINE: Record<string, () => Map<string, LegacyPayload>> = {
  lesson1: () => new Map(TEXTBOOK_ACTIVITIES.map((a) => [keyOf(a as never), legacyLesson1(a)])),
  lesson2: () =>
    new Map(
      LESSON2_ACTIVITIES.map((a) => [
        keyOf(a as never),
        legacyKeyedReveal(a as never, LEGACY_L2_MODEL_ANSWER_IDS, LEGACY_L2_TEACHER_ONLY_IDS),
      ]),
    ),
  lesson3: () =>
    new Map(
      LESSON3_ACTIVITIES.map((a) => [
        keyOf(a as never),
        legacyKeyedReveal(a as never, LEGACY_L3_MODEL_ANSWER_IDS, LEGACY_L3_TEACHER_ONLY_IDS),
      ]),
    ),
  unit2Lesson1: () =>
    new Map(
      U2L1_ACTIVITIES.map((a) => [
        keyOf(a as never),
        legacyKeyedReveal(a as never, LEGACY_U2L1_MODEL_ANSWER_IDS, LEGACY_U2L1_TEACHER_ONLY_IDS),
      ]),
    ),
  unit2Lesson2: () =>
    new Map(
      U2L2_ACTIVITIES.map((a) => [
        keyOf(a as never),
        legacyKeyedReveal(a as never, LEGACY_U2L2_MODEL_ANSWER_IDS, LEGACY_U2L2_TEACHER_ONLY_IDS),
      ]),
    ),
};

const ACTIVITIES: Record<string, Loose[]> = {
  lesson1: TEXTBOOK_ACTIVITIES as never,
  lesson2: LESSON2_ACTIVITIES as never,
  lesson3: LESSON3_ACTIVITIES as never,
  unit2Lesson1: U2L1_ACTIVITIES as never,
  unit2Lesson2: U2L2_ACTIVITIES as never,
};

const byKey = (lesson: string, key: string) =>
  ACTIVITIES[lesson].find((activity) => keyOf(activity) === key);

describe('parity 1/3 — every record the owner did not rule on matches the legacy baseline exactly', () => {
  it.each(Object.keys(ACTIVITIES))('%s', (lesson) => {
    const baseline = LEGACY_BASELINE[lesson]();
    const rulings = APPLIED_RULINGS[lesson] ?? {};
    let checked = 0;
    ACTIVITIES[lesson].forEach((activity) => {
      const key = keyOf(activity);
      if (rulings[key]) return; // its intended change is asserted by parity 2/3
      checked += 1;
      expect(baseline.has(key), `${lesson}/${key} is missing from the legacy baseline`).toBe(true);
      expect(
        normalize(studentPayload(lesson, activity)),
        `${lesson}/${key} drifted from the pre-existing behaviour without a ruling`,
      ).toEqual(normalize(baseline.get(key) ?? null));
    });
    expect(checked).toBeGreaterThan(0);
  });
});

describe('parity 2/3 — each owner ruling produces exactly the decided behaviour', () => {
  const cases: [string, string, Ruling][] = Object.entries(APPLIED_RULINGS).flatMap(([lesson, rulings]) =>
    Object.entries(rulings).map(([key, ruling]) => [lesson, key, ruling] as [string, string, Ruling]),
  );

  it('the ruling ledger is complete: 32 changes + 3 confirmed-unchanged, 0 pending', () => {
    expect(cases).toHaveLength(32);
    const totals = cases.reduce<Record<string, number>>((acc, [, , ruling]) => {
      acc[ruling.to] = (acc[ruling.to] ?? 0) + 1;
      return acc;
    }, {});
    // 16 lesson-1 examples + 3 lesson-3 alternatives + 1 Unit-2-Lesson-1 alternative.
    expect(totals).toEqual({ guidance_only: 20, teacher_only: 12 });
    // Every ruling moves a record to a strictly narrower surface, never wider.
    cases.forEach(([lesson, key, ruling]) => {
      const was = LEGACY_BASELINE[lesson]().get(key) === null ? 'hidden' : 'shown';
      expect(ruling.from, `${lesson}/${key} was not ${ruling.from}`).toBe(was);
      if (ruling.to === 'teacher_only') expect(ruling.from).toBe('shown');
    });
    // The 3 confirmed-unchanged records are NOT in the ledger …
    expect(cases.map(([lesson, key]) => `${lesson}/${key}`)).not.toContain('lesson2/L2-14-01');
    expect(cases.map(([lesson, key]) => `${lesson}/${key}`)).not.toContain('lesson2/L2-19-07');
    expect(cases.map(([lesson, key]) => `${lesson}/${key}`)).not.toContain('unit2Lesson1/U2L1-44-04');
  });

  it.each(cases)('%s/%s → %s (as the owner decided)', (lesson, key, ruling) => {
    const activity = byKey(lesson, key);
    expect(activity, `missing record ${lesson}/${key}`).toBeDefined();
    expect(activity!.disclosure?.kind).toBe(ruling.to);
    const next = studentPayload(lesson, activity!);

    if (ruling.to === 'teacher_only') {
      // Hidden from the learner: no button, no text, no payload at all.
      expect(next, `${key} leaked to the student surface`).toBeNull();
      // …while the teacher area still gets the full view it always had.
      const teacherView = resolveAnswerReveal(activity as never, 'teacher');
      expect(teacherView, `${key} lost its teacher view`).not.toBeNull();
      expect(teacherView!.kind).toBe('teacher_solution');
      expect(teacherView!.modelAnswer.trim().length).toBeGreaterThan(0);
      return;
    }

    // guidance_only: still shown, under «إرشادات للإجابة» — never as the key.
    expect(next).not.toBeNull();
    expect(next!.heading).toBe('إرشادات للإجابة');
    expect(next!.heading).not.toBe('الحل النموذجي المعتمد');
    /* The text is the record's own approved wording, unchanged by the ruling:
       only the heading may differ, because that is precisely what the ruling
       re-decided. Everything else must still equal the legacy payload. */
    const { heading: _nextHeading, ...nextBody } = normalize(next)!;
    const { heading: _legacyHeading, ...legacyBody } = normalize(LEGACY_BASELINE[lesson]().get(key) ?? null)!;
    expect(nextBody, `${key}: the ruling must not alter the revealed content`).toEqual(legacyBody);
  });

  it('the 3 confirmed-unchanged records still behave as the legacy baseline', () => {
    expect(normalize(studentPayload('lesson2', byKey('lesson2', 'L2-14-01')!))).toBeNull();
    expect(normalize(studentPayload('lesson2', byKey('lesson2', 'L2-19-07')!))).toBeNull();
    expect(normalize(studentPayload('unit2Lesson1', byKey('unit2Lesson1', 'U2L1-44-04')!))).toBeNull();
    expect(CONFIRMED_UNCHANGED.lesson2).toHaveLength(2);
    expect(CONFIRMED_UNCHANGED.unit2Lesson1).toHaveLength(1);
  });
});

describe('parity 3/3 — the classification never changed what a record contains', () => {
  it('every activity still carries its instruction, inputs, answers and rationale', () => {
    TEXTBOOK_ACTIVITIES.forEach((activity) => {
      expect(activity.instruction.trim().length).toBeGreaterThan(0);
      expect(activity.solution.answer.trim().length).toBeGreaterThan(0);
      expect(activity.solution.explanation.trim().length).toBeGreaterThan(0);
      expect(activity.sourceRecordIds.length).toBeGreaterThan(0);
    });
    [...LESSON2_ACTIVITIES, ...LESSON3_ACTIVITIES, ...U2L1_ACTIVITIES, ...U2L2_ACTIVITIES].forEach((activity) => {
      expect(activity.instruction.trim().length).toBeGreaterThan(0);
      expect(activity.teacher.answerOrGuidance.trim().length).toBeGreaterThan(0);
      expect(activity.teacher.explanation.trim().length).toBeGreaterThan(0);
      expect(activity.source.pageNumber).toBeGreaterThan(0);
    });
  });

  it('activity ids stay unique per lesson (the full order is pinned against b774c3d)', () => {
    Object.entries(ACTIVITIES).forEach(([lesson, activities]) => {
      const keys = activities.map(keyOf);
      expect(new Set(keys).size, `${lesson} has duplicate record ids`).toBe(keys.length);
    });
  });

  it('unit 2 lesson 3 still produces no student payload (no content exists)', () => {
    U2L3_ACTIVITIES.forEach((activity) => {
      expect(
        resolveAnswerReveal(activity as never, 'student'),
        `unexpected reveal on ${activity.sourceActivityId}`,
      ).toBeNull();
    });
  });

  /*
   * unit 3 lesson 1 (fix after PR #24): the lesson keeps NO approved key, but it
   * is no longer button-less. Every answerable activity reveals through the SAME
   * shared path under «إرشادات للإجابة», and the eight source-gap records stay
   * unreachable — never a guessed answer, never an empty button.
   */
  it('unit 3 lesson 1 reveals its suggested answers only where they exist', () => {
    /* The three listening items joined this list in the follow-up round: they are
       answered from the PRINTED poem, never from the missing recording. */
    const UNDECIDABLE = new Set(['U3L1-80-02', 'U3L1-80-03', 'U3L1-80-04', 'U3L1-80-05', 'U3L1-81-01']);
    let revealed = 0;
    U3L1_ACTIVITIES.forEach((activity) => {
      const payload = resolveAnswerReveal(u3l1RevealRecord(activity), 'student');
      if (UNDECIDABLE.has(activity.sourceActivityId)) {
        expect(payload, `gap record revealed: ${activity.sourceActivityId}`).toBeNull();
        return;
      }
      expect(payload, `missing reveal on ${activity.sourceActivityId}`).not.toBeNull();
      expect(payload!.heading).toBe('إرشادات للإجابة');
      expect(payload!.heading).not.toContain('المعتمد');
      revealed += 1;
    });
    expect(revealed).toBe(52);
  });

  it('platform drills keep their approved key', () => {
    [GRAMMAR_PLATFORM_EXPLANATION.quickCheck, SPELLING_PLATFORM_EXPLANATION.quickCheck].forEach((drill) => {
      expect(drill.options.some((option) => option.correct)).toBe(true);
      expect(drill.disclosure.kind).toBe('approved_key');
      expect(drill.disclosure.sourceRef).toMatch(/^platform:/);
    });
    Object.values(LESSON2_PLATFORM_EXERCISES)
      .flat()
      .forEach((exercise) => {
        expect(exercise.disclosure.kind).toBe('approved_key');
        expect(exercise.disclosure.sourceRef).toBe(`platform:${exercise.id}`);
      });
  });
});

describe('resolver fails closed', () => {
  it('returns nothing without a disclosure', () => {
    expect(toStudentReveal({ id: 'x', modelAnswer: 'نص' })).toBeNull();
  });
  it('returns nothing with an empty source reference', () => {
    expect(
      toStudentReveal({ id: 'x', modelAnswer: 'نص', disclosure: { kind: 'approved_key', sourceRef: '  ' } }),
    ).toBeNull();
  });
  it('returns nothing for an unknown kind', () => {
    expect(
      toStudentReveal({ id: 'x', modelAnswer: 'نص', disclosure: { kind: 'unknown' as never, sourceRef: 'r' } }),
    ).toBeNull();
  });
  it('never leaks teacher_only or no_approved_content to the student scope', () => {
    (['teacher_only', 'no_approved_content'] as const).forEach((kind) => {
      expect(toStudentReveal({ id: 'x', modelAnswer: 'نص', disclosure: { kind, sourceRef: 'r' } })).toBeNull();
      expect(resolveAnswerReveal({ id: 'x', modelAnswer: 'نص', disclosure: { kind, sourceRef: 'r' } }, 'student')).toBeNull();
    });
  });
  it('produces no button when nothing approved is present', () => {
    expect(toStudentReveal({ id: 'x', disclosure: { kind: 'approved_key', sourceRef: 'r' } })).toBeNull();
  });
  it('teacher scope keeps teacher material and student scope does not', () => {
    const record = {
      id: 'x',
      disclosure: { kind: 'teacher_only' as const, sourceRef: 'L2-14-01' },
      teacher: { answerOrGuidance: 'إجراء تصحيح', explanation: 'ملاحظة معلم', commonMistakes: ['خطأ'] },
    };
    expect(resolveAnswerReveal(record, 'student')).toBeNull();
    const teacherView = resolveAnswerReveal(record, 'teacher');
    expect(teacherView).toMatchObject({ kind: 'teacher_solution', modelAnswer: 'إجراء تصحيح' });
    // the teacher view is a different type and can never feed <AnswerReveal>
    expect(teacherView && 'heading' in teacherView).toBe(false);
  });
});
