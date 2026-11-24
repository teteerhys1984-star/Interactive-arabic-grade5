import { describe, expect, it } from 'vitest';
import { TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import { U2L1_ACTIVITIES } from '../data/unit2Lesson1/activities';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import {
  fromKeyedLesson,
  hasValidDisclosure,
  resolveAnswerReveal,
  toStudentReveal,
} from '../components/common/answerDisclosure';

/**
 * Explicit disclosure coverage.
 *
 * WHY: the feature used to depend on a hand-written list in App.tsx and on five
 * renderer-local id sets. This suite proves that every registered answer record
 * carries an explicit, well-formed disclosure — so a new lesson cannot ship
 * with an unclassified record, and no record falls back to a default.
 */

const REGISTERED = [
  { lesson: 'lesson1', records: TEXTBOOK_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'lesson2', records: LESSON2_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'lesson3', records: LESSON3_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'unit2-lesson1', records: U2L1_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'unit2-lesson2', records: U2L2_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'unit2-lesson3', records: U2L3_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
  { lesson: 'unit3-lesson1', records: U3L1_ACTIVITIES as readonly { id: string; disclosure?: unknown }[] },
];

const VALID_KINDS = ['approved_key', 'guidance_only', 'teacher_only', 'no_approved_content'];

describe('disclosure coverage — every registered record is classified explicitly', () => {
  it.each(REGISTERED)('$lesson: every record carries a valid disclosure with a source reference', ({ records }) => {
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(hasValidDisclosure(record as never), `missing/invalid disclosure on ${record.id}`).toBe(true);
    }
  });

  it.each(REGISTERED)('$lesson: ids are unique and no kind is unknown', ({ records }) => {
    const ids = records.map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
    records.forEach((record) => {
      const disclosure = record.disclosure as { kind: string; sourceRef: string };
      expect(VALID_KINDS).toContain(disclosure.kind);
      expect(disclosure.sourceRef.trim().length).toBeGreaterThan(0);
    });
  });

  it('uses the exact audited totals per lesson', () => {
    const totals = REGISTERED.map((entry) => [entry.lesson, entry.records.length]);
    expect(totals).toEqual([
      ['lesson1', 39],
      ['lesson2', 53],
      ['lesson3', 51],
      ['unit2-lesson1', 45],
      ['unit2-lesson2', 51],
      ['unit2-lesson3', 43],
      ['unit3-lesson1', 57],
    ]);
  });

  it('keeps the approved/absent split exactly as audited', () => {
    const count = (records: readonly { disclosure?: unknown }[], kind: string) =>
      records.filter((record) => (record.disclosure as { kind: string }).kind === kind).length;

    /*
     * Owner ruling on the 35 flagged records (2026-11-23):
     *   proven single model answer  ⇒ approved_key
     *   examples / alternatives     ⇒ guidance_only
     *   teacher procedure/grading/dictation ⇒ teacher_only
     * Nothing was guessed; every change below is the owner's decision applied.
     *
     * lesson 1: 22 model answers (keys + single approved wording), 16 guidance
     * (open-production records whose text is an example or a performance
     * description), 1 pending (a-p11-1 keeps no_approved_content).
     */
    expect(count(TEXTBOOK_ACTIVITIES, 'approved_key')).toBe(22);
    expect(count(TEXTBOOK_ACTIVITIES, 'guidance_only')).toBe(16);
    expect(count(TEXTBOOK_ACTIVITIES, 'no_approved_content')).toBe(1);

    // lesson 2: 3 teacher-only (L2-18-04 corrected: "يتحقق المعلم…" is grading),
    // 12 source gaps, 14 model keys, 24 guidance.
    expect(count(LESSON2_ACTIVITIES, 'teacher_only')).toBe(3);
    expect(count(LESSON2_ACTIVITIES, 'no_approved_content')).toBe(12);
    expect(count(LESSON2_ACTIVITIES, 'approved_key')).toBe(14);
    expect(count(LESSON2_ACTIVITIES, 'guidance_only')).toBe(24);

    // lesson 3: 24 model keys, 16 guidance, 11 teacher-only (performance and
    // handwriting tasks the guide grades: "يتحقق المعلم/يقوّم المعلم").
    expect(count(LESSON3_ACTIVITIES, 'approved_key')).toBe(24);
    expect(count(LESSON3_ACTIVITIES, 'guidance_only')).toBe(16);
    expect(count(LESSON3_ACTIVITIES, 'teacher_only')).toBe(11);

    // unit 2 lesson 1: 2 teacher-only (U2L1-44-04 peer assessment +
    // U2L1-46-07 teacher dictation, owner decision D14), 0 source gaps,
    // 17 model keys (U2L1-42-04 moved to guidance: "ويُقبل…" alternatives),
    // 26 guidance.
    expect(count(U2L1_ACTIVITIES, 'teacher_only')).toBe(2);
    expect(count(U2L1_ACTIVITIES, 'no_approved_content')).toBe(0);
    expect(count(U2L1_ACTIVITIES, 'approved_key')).toBe(17);
    expect(count(U2L1_ACTIVITIES, 'guidance_only')).toBe(26);

    // unit 2 lesson 2: 22 model keys, 29 guidance, no gaps.
    expect(count(U2L2_ACTIVITIES, 'approved_key')).toBe(22);
    expect(count(U2L2_ACTIVITIES, 'guidance_only')).toBe(29);

    // unit 2 lesson 3 still has no displayable content for any record.
    expect(count(U2L3_ACTIVITIES, 'no_approved_content')).toBe(43);

    /*
     * unit 3 lesson 1 (PR after #24): the source still has NO approved key, so
     * `approved_key` stays at ZERO and nothing is attributed to the book. What
     * changed is the honest middle state the owner asked for: 52 activities get
     * a platform-authored, grade-5 educational answer ⇒ guidance_only. That
     * includes the three listening items, answered ONLY from the poem printed on
     * ص٧٤ and labelled «ليست تفريغًا للتسجيل الصوتي». The 5 calligraphy items,
     * whose hand-drawn Ruq'ah models the source cannot reproduce, keep
     * no_approved_content.
     */
    expect(count(U3L1_ACTIVITIES, 'approved_key')).toBe(0);
    expect(count(U3L1_ACTIVITIES, 'teacher_only')).toBe(0);
    expect(count(U3L1_ACTIVITIES, 'guidance_only')).toBe(52);
    expect(count(U3L1_ACTIVITIES, 'no_approved_content')).toBe(5);
  });

  it('never classifies a source-gap record as displayable, and D14 is the one owner-approved exception', () => {
    const gaps = [
      ...LESSON2_ACTIVITIES.filter((activity) => activity.availability === 'gap'),
      ...U2L1_ACTIVITIES.filter((activity) => activity.availability === 'gap'),
    ];
    expect(gaps.length).toBe(13);

    /*
     * A missing PRINTED key does not imply "nothing approved exists": in a
     * teacher-dictated task the teacher IS the source of the text, and the owner
     * ruled (D14) that U2L1-46-07 is teacher_only. That is the only exception,
     * and it is still unreachable from the student surface.
     */
    const DICTATION = 'U2L1-46-07';
    gaps.forEach((activity) => {
      expect(['no_approved_content', 'teacher_only']).toContain(activity.disclosure.kind);
      if (activity.sourceActivityId === DICTATION) {
        expect(activity.disclosure.kind).toBe('teacher_only');
      } else {
        expect(activity.disclosure.kind).toBe('no_approved_content');
      }
    });
  });

  it('D14: the dictated spelling task is teacher-owned, never student-visible', () => {
    const dictation = U2L1_ACTIVITIES.find(
      (activity) => activity.sourceActivityId === 'U2L1-46-07',
    )!;
    // Evidence the classification rests on: the printed instruction itself.
    expect(dictation.instruction).toContain('يُمْلِيهِ عَلَيَّ الْمُعَلِّمُ');
    expect(dictation.disclosure).toEqual({ kind: 'teacher_only', sourceRef: 'U2L1-46-07' });

    // Student scope: nothing at all — no button, no key, no wording.
    expect(resolveAnswerReveal(fromKeyedLesson(dictation), 'student')).toBeNull();
    expect(toStudentReveal(fromKeyedLesson(dictation))).toBeNull();

    // Teacher scope: the approved grading basis stays available.
    const teacherView = resolveAnswerReveal(fromKeyedLesson(dictation), 'teacher');
    expect(teacherView).not.toBeNull();
    expect(teacherView!.sourceRef).toBe('U2L1-46-07');
    expect(teacherView!.modelAnswer).toContain('يمليها المعلم');
    expect(teacherView!.explanation).toContain('حدّ مصدر معلن');
  });
});

describe('Owner ruling on the 35 flagged records (2026-11-23)', () => {
  /**
   * The three rules, applied and pinned:
   *  - proven single model answer              ⇒ approved_key
   *  - examples / alternatives                 ⇒ guidance_only
   *  - teacher procedure, grading or dictation ⇒ teacher_only
   *
   * Every record below is listed with the evidence phrase that decided it, so a
   * later edit to that phrase fails this test instead of silently re-classifying.
   */
  const moved = (acts: readonly { sourceActivityId: string; disclosure?: unknown }[], id: string) =>
    acts.find((activity) => activity.sourceActivityId === id)?.disclosure as
      | { kind: string; sourceRef: string }
      | undefined;

  it('lesson 1: 16 open-production records became guidance, content untouched', () => {
    const guidance = TEXTBOOK_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'guidance_only');
    expect(
      guidance.map((activity) => activity.id).sort(),
      'the 16 flagged lesson-1 records, decided one by one',
    ).toEqual(
      ['a-p4-5', 'a-p5-1', 'a-p5-2', 'a-p5-3', 'a-p6-7', 'a-p6-8', 'a-p7-1', 'a-p7-2',
       'a-p8-6', 'a-p8-7', 'a-p9-6', 'a-p10-1', 'a-p10-3', 'a-p11-2', 'a-p11-3', 'a-p11-4'].sort(),
    );
    // Each moved record's own text is an example or a performance description.
    guidance.forEach((activity) => {
      expect(`${activity.solution.answer} ${activity.solution.explanation}`).toMatch(
        /مثال|حرّة|حرّ|عرض|قراءة|محاكاة|يسجّل|يحوّل|نموذجية|أستنتج/,
      );
    });
    // Nothing was removed: the approved text is still present, only relabelled.
    const example = TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p6-7')!;
    expect(example.solution.answer).toContain('مثال');
    // A true single answer stayed approved_key (e.g. the comprehension key).
    expect(TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p6-5')!.disclosure.kind).toBe('approved_key');
    // The one pending record keeps its honest class.
    expect(TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p11-1')!.disclosure.kind)
      .toBe('no_approved_content');
  });

  it('lesson 3: 11 performance/handwriting records became teacher_only', () => {
    const teacherOnly = LESSON3_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'teacher_only');
    expect(teacherOnly).toHaveLength(11);
    teacherOnly.forEach((activity) => {
      expect(activity.teacher.answerOrGuidance).toMatch(/يتحقق المعلم|يقوّم|يقوّمه/);
    });
    // Their guidance never reaches the student surface.
    teacherOnly.forEach((activity) => {
      expect(resolveAnswerReveal(fromKeyedLesson(activity), 'student')).toBeNull();
    });
  });

  it('lesson 3 / unit2 lesson 1: records whose guide offers alternatives became guidance', () => {
    ['L3-27-01', 'L3-27-05', 'L3-31-03'].forEach((id) => {
      expect(moved(LESSON3_ACTIVITIES, id)!.kind).toBe('guidance_only');
    });
    const place = LESSON3_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L3-27-01')!;
    expect(place.teacher.answerOrGuidance).toContain('ويقبل');
    const gap = LESSON3_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L3-31-03')!;
    expect(gap.teacher.answerOrGuidance).toContain('أمثلة معتمدة');

    expect(moved(U2L1_ACTIVITIES, 'U2L1-42-04')!.kind).toBe('guidance_only');
    expect(
      U2L1_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L1-42-04')!.teacher.answerOrGuidance,
    ).toContain('ويُقبل');
  });

  it('lesson 2: L2-18-04 is teacher grading, so it moved to teacher_only', () => {
    expect(moved(LESSON2_ACTIVITIES, 'L2-18-04')!.kind).toBe('teacher_only');
    const record = LESSON2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L2-18-04')!;
    expect(record.teacher.answerOrGuidance).toContain('يتحقق المعلم');
    expect(resolveAnswerReveal(fromKeyedLesson(record), 'student')).toBeNull();
    expect(resolveAnswerReveal(fromKeyedLesson(record), 'teacher')).not.toBeNull();
  });

  it('no record was left unclassified by the ruling, and no count changed silently', () => {
    const total =
      TEXTBOOK_ACTIVITIES.length + LESSON2_ACTIVITIES.length + LESSON3_ACTIVITIES.length +
      U2L1_ACTIVITIES.length + U2L2_ACTIVITIES.length + U2L3_ACTIVITIES.length + U3L1_ACTIVITIES.length;
    expect(total).toBe(339);
    expect(hasValidDisclosure({ id: 'x', disclosure: undefined })).toBe(false);
  });
});
