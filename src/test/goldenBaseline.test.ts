import { describe, expect, it } from 'vitest';
import { TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON1_STEPS, LESSON1_STEP_CONTENT } from '../data/lesson1/content';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { LESSON2_STEPS } from '../data/lesson2/content';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import { LESSON3_STEPS } from '../data/lesson3/content';
import { U2L1_ACTIVITIES } from '../data/unit2Lesson1/activities';
import { U2L1_STEPS } from '../data/unit2Lesson1/content';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L2_STEPS } from '../data/unit2Lesson2/content';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { U2L3_STEPS } from '../data/unit2Lesson3/content';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { U3L1_STEPS } from '../data/unit3Lesson1/content';
import { BASELINE_GZIP_BASE64, BASELINE_SHA256 } from './fixtures/baselineB774c3d';

/**
 * GOLDEN CONTENT BASELINE — captured from commit `b774c3d`, the commit this
 * branch forked from, BEFORE any annotation existed.
 *
 * WHY A FROZEN FILE: comparing the resolver against the current data would be
 * circular — the classification lives in the very records being compared. The
 * fixture was produced by a one-off dump executed inside `git worktree` at
 * `b774c3d` and contains that commit's data verbatim. Only the ONE field this PR
 * adds to activity records — `disclosure` — is excluded from the comparison
 * (see `stripAdditive`). Every pre-existing field — including every `kind`
 * already in the data, `interaction.kind` above all — stays compared verbatim.
 *
 * WHAT IS PINNED HERE (the surfaces a reviewer must be able to trust):
 *   - the activity ledger of every registered lesson, in order, field by field:
 *     instruction, subparts, interaction inputs, approved answers, explanations,
 *     sources;
 *   - the step order/titles of every lesson;
 *   - lesson 1's step content (blocks and their order).
 *
 * A single character changed in an instruction, an accepted answer, a
 * rationale, a heading, a page number or the ORDER of two activities fails.
 */

interface FixtureLesson {
  activities: Record<string, unknown>[];
  steps: Record<string, unknown>[];
}

/*
 * The fixture is a gzip+base64 blob checked in as a TS module (the project has no
 * Node type definitions). `DecompressionStream` is available in the test
 * environment, and the decoded payload is verified against a pinned sha256 so a
 * silently edited fixture cannot weaken this guard.
 */
const decodeBaseline = async (): Promise<Record<string, unknown>> => {
  const bytes = Uint8Array.from(atob(BASELINE_GZIP_BASE64), (char) => char.charCodeAt(0));
  const stream = new DecompressionStream('gzip');
  const writer = stream.writable.getWriter();
  void writer.write(bytes);
  void writer.close();
  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });
  const json = new TextDecoder().decode(merged);
  const bytesOfJson = new TextEncoder().encode(json);
  const digest = await crypto.subtle.digest('SHA-256', bytesOfJson);
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  expect(hex, 'the golden fixture was modified (sha256 mismatch)').toBe(BASELINE_SHA256);
  return JSON.parse(json) as Record<string, unknown>;
};

let baseline: Record<string, unknown>;

/**
 * Exactly ONE addition of this PR is excluded from the comparison: the
 * `disclosure` declaration that every answer record gained. Nothing else is.
 *
 * WHY `kind` IS *NOT* EXCLUDED: this file compares activities, steps and the
 * lesson-1 step content — never a `TeacherSolutionsModel` record — so no added
 * `kind` is present in the compared data. Excluding the key `kind` here could
 * only ever hide a real field. An earlier revision did exactly that, recursively
 * deleting `interaction.kind` from BOTH sides and making a changed interaction
 * type compare equal to itself. Every `kind` value in the data is now compared
 * verbatim, whatever its name or value looks like.
 */
const stripAdditive = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripAdditive);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'disclosure') continue;
      out[key] = stripAdditive(child);
    }
    return out;
  }
  return value;
};

/** Deep key-sorted form: array ORDER is preserved, object key order is not. */
const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
};

/** Order-sensitive (for arrays), key-order-insensitive canonical form. */
const canon = (value: unknown) => JSON.stringify(sortKeys(stripAdditive(value)));

const LESSONS: [string, unknown[], unknown[]][] = [
  ['lesson1', TEXTBOOK_ACTIVITIES, LESSON1_STEPS],
  ['lesson2', LESSON2_ACTIVITIES, LESSON2_STEPS],
  ['lesson3', LESSON3_ACTIVITIES, LESSON3_STEPS],
  ['unit2Lesson1', U2L1_ACTIVITIES, U2L1_STEPS],
  ['unit2Lesson2', U2L2_ACTIVITIES, U2L2_STEPS],
  ['unit2Lesson3', U2L3_ACTIVITIES, U2L3_STEPS],
  ['unit3Lesson1', U3L1_ACTIVITIES, U3L1_STEPS],
];

describe('golden baseline — the annotation pass changed no content and no order', () => {
  /* Loaded once; every assertion below needs the decoded, digest-verified dump. */
  let loaded = false;
  const ensureLoaded = async () => {
    if (!loaded) {
      baseline = await decodeBaseline();
      loaded = true;
    }
  };

  it.each(LESSONS)('%s: the whole activity ledger is byte-identical to b774c3d', async (name, activities) => {
    await ensureLoaded();
    const expected = (baseline[name] as FixtureLesson).activities;
    expect(activities).toHaveLength(expected.length);
    /* Absolute order equality first, so a reordering names the record. */
    expect(activities.map((activity) => (activity as { id: string }).id)).toEqual(
      expected.map((activity) => (activity as { id: string }).id),
    );
    expect(canon(activities)).toBe(canon(expected));
  });

  it.each(LESSONS)('%s: the step order and titles are unchanged', async (name, _activities, steps) => {
    await ensureLoaded();
    const expected = (baseline[name] as FixtureLesson).steps;
    expect(steps.map((step) => (step as { id: string }).id)).toEqual(
      expected.map((step) => (step as { id: string }).id),
    );
    expect(canon(steps)).toBe(canon(expected));
  });

  it('lesson 1: the step content blocks and their order are unchanged', async () => {
    await ensureLoaded();
    expect(canon(LESSON1_STEP_CONTENT)).toBe(canon(baseline.lesson1Content));
  });

  /* ------------------------------------------------------------------ *
   * SELF-TESTS — the guard must be able to FAIL.
   *
   * A comparison that excludes the wrong field silently passes on changed data.
   * These tests mutate a copy of the current data in memory (never the real
   * records) and assert that the very same `canon` used above reports a
   * difference. They exist because an earlier revision of `stripAdditive`
   * dropped every `kind` key, which made `interaction.kind` invisible.
   * ------------------------------------------------------------------ */

  it('a changed interaction.kind is DETECTED (the exclusion is path-specific)', async () => {
    await ensureLoaded();
    /* The interaction type is a real pre-existing field: it must never be
       stripped. Every lesson has at least one keyed interaction. */
    const subject = LESSONS[0];
    const copy = JSON.parse(JSON.stringify(subject[1])) as Record<string, unknown>[];
    const target = copy.find((activity) => {
      const interaction = activity.interaction as { kind?: string } | undefined;
      return typeof interaction?.kind === 'string';
    });
    expect(target, 'no activity with an interaction.kind found').toBeDefined();
    const before = canon(target);
    (target!.interaction as { kind: string }).kind = 'a_kind_that_never_existed';
    expect(canon(target), 'interaction.kind is invisible to the golden guard').not.toBe(before);
    /* …and therefore the whole-ledger comparison fails, as the test above asserts. */
    expect(canon(copy)).not.toBe(canon((baseline[subject[0]] as FixtureLesson).activities));
  });

  it('every lesson still exposes its interaction kinds after stripping', async () => {
    await ensureLoaded();
    let interactions = 0;
    for (const [name, activities, steps] of LESSONS) {
      /* Both sides go through `canon`, i.e. through `stripAdditive`. */
      const current = JSON.parse(canon(activities) as string) as Record<string, unknown>[];
      const expected = canon((baseline[name] as FixtureLesson).activities);
      expect(canon(activities)).toBe(expected);
      expect(canon(steps)).toBe(canon((baseline[name] as FixtureLesson).steps));
      /* The interaction type survived the strip on the CURRENT side… */
      current.forEach((activity, index) => {
        const interaction = activity.interaction as { kind?: string } | undefined;
        expect(typeof interaction?.kind, `${name} record ${index} lost interaction.kind`).toBe('string');
      });
      interactions += current.filter((activity) => typeof (activity.interaction as { kind?: string })?.kind === 'string').length;
    }
    /* b774c3d holds exactly 339 `interaction.kind` values; all are compared. */
    expect(interactions).toBe(339);
  });

  it('only `disclosure` is excluded — every `kind` is preserved', async () => {
    await ensureLoaded();
    const probe = {
      id: 'probe',
      interaction: { kind: 'text_fields' },
      stepKind: 'activity',
      disclosure: { kind: 'approved_key', sourceRef: 'L1-000' },
    };
    expect(stripAdditive(probe)).toEqual({
      id: 'probe',
      interaction: { kind: 'text_fields' },
      stepKind: 'activity',
    });

    /* A `kind` is kept whatever its name, wherever it sits, even when its value
       mimics the teacher-solutions discriminator this PR introduced. */
    const mimetics = { kind: 'approved', lessonId: 'lesson2', unitId: 'unit1', exerciseSolutions: [] };
    expect(stripAdditive(mimetics)).toEqual(mimetics);
    const absence = { kind: 'declared_absence', lessonId: 'unit3-lesson1', unitId: 'unit3', declaration: { reason: 'x' } };
    expect(stripAdditive(absence)).toEqual(absence);
    /* …and a mimetic `kind` is still detected when it changes. */
    expect(canon({ ...mimetics, kind: 'declared_absence' })).not.toBe(canon(mimetics));
    /* Nested `kind`s are preserved too, at any depth. */
    expect(stripAdditive({ a: { kind: 'x', b: [{ kind: 'y', disclosure: {} }] } })).toEqual({
      a: { kind: 'x', b: [{ kind: 'y' }] },
    });
  });

  it('pins the exact surfaces the reviewer asked for, per activity', async () => {
    await ensureLoaded();
    const surface = (activity: Record<string, unknown>) => ({
      instruction: activity.instruction,
      subparts: activity.subparts,
      interaction: activity.interaction,
      /* approved answers + rationale: the lesson-1 shape */
      solution: activity.solution,
      /* approved answers + rationale: the keyed-lesson shape */
      answerKey: activity.answerKey,
      checkExplanation: activity.checkExplanation,
      teacher: activity.teacher,
      source: activity.source,
    });

    for (const [name, activities] of LESSONS) {
      const expected = (baseline[name] as FixtureLesson).activities;
      activities.forEach((activity, index) => {
        expect(
          canon(surface(activity as Record<string, unknown>)),
          `${name} record ${index} (${(activity as { id: string }).id}) changed an input, an answer, a rationale or a source`,
        ).toBe(canon(surface(expected[index])));
      });
    }
  });
});
