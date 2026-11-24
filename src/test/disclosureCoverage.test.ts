import { describe, expect, it } from 'vitest';
import { TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import { U2L1_ACTIVITIES } from '../data/unit2Lesson1/activities';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { hasValidDisclosure } from '../components/common/answerDisclosure';

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

    // lesson 1: 37 solved + 1 partially pending (approved key for its settled fields) + 1 pending.
    expect(count(TEXTBOOK_ACTIVITIES, 'approved_key')).toBe(38);
    expect(count(TEXTBOOK_ACTIVITIES, 'no_approved_content')).toBe(1);

    // lesson 2: 2 teacher-only, 12 source gaps, 14 model keys, 25 guidance.
    expect(count(LESSON2_ACTIVITIES, 'teacher_only')).toBe(2);
    expect(count(LESSON2_ACTIVITIES, 'no_approved_content')).toBe(12);
    expect(count(LESSON2_ACTIVITIES, 'approved_key')).toBe(14);
    expect(count(LESSON2_ACTIVITIES, 'guidance_only')).toBe(25);

    // lesson 3: 27 model keys, 24 guidance, no gaps.
    expect(count(LESSON3_ACTIVITIES, 'approved_key')).toBe(27);
    expect(count(LESSON3_ACTIVITIES, 'guidance_only')).toBe(24);

    // unit 2 lesson 1: 1 teacher-only + 1 source gap (U2L1-46-07: the gap wins
    // over teacher_only because the source carries no material at all),
    // 18 model keys, 25 guidance.
    expect(count(U2L1_ACTIVITIES, 'teacher_only')).toBe(1);
    expect(count(U2L1_ACTIVITIES, 'no_approved_content')).toBe(1);
    expect(count(U2L1_ACTIVITIES, 'approved_key')).toBe(18);
    expect(count(U2L1_ACTIVITIES, 'guidance_only')).toBe(25);

    // unit 2 lesson 2: 22 model keys, 29 guidance, no gaps.
    expect(count(U2L2_ACTIVITIES, 'approved_key')).toBe(22);
    expect(count(U2L2_ACTIVITIES, 'guidance_only')).toBe(29);

    // The two lessons with no approved key: every record declares it.
    expect(count(U2L3_ACTIVITIES, 'no_approved_content')).toBe(43);
    expect(count(U3L1_ACTIVITIES, 'no_approved_content')).toBe(57);
  });

  it('never classifies a source-gap record as displayable', () => {
    const gaps = [
      ...LESSON2_ACTIVITIES.filter((activity) => activity.availability === 'gap'),
      ...U2L1_ACTIVITIES.filter((activity) => activity.availability === 'gap'),
    ];
    expect(gaps.length).toBe(13);
    gaps.forEach((activity) => {
      expect(activity.disclosure.kind).toBe('no_approved_content');
    });
  });
});
