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
 * `b774c3d`, with the additive fields added by this PR (`disclosure`, and the
 * `kind` discriminator on the teacher guides) removed. It therefore describes
 * the PRE-CHANGE content and classification-independent behaviour only.
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

/** Fields added by this PR; they are not part of the pre-change content. */
const ADDITIVE = new Set(['disclosure', 'kind']);

const strip = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (ADDITIVE.has(key)) continue;
      out[key] = strip(child);
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
const canon = (value: unknown) => JSON.stringify(sortKeys(strip(value)));

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
