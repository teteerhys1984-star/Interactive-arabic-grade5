import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  buildTeacherGuidanceRegistry,
  compareGuidanceToSource,
  declaredContentGaps,
  studentVisibleGuidance,
  TeacherGuidanceSource,
  TeacherGuidanceSourceItem,
} from '../data/guidanceRegistry';
import { U3L1_GUIDANCE_REGISTRY } from '../data/unit3Lesson1/guidanceRegistry';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { U3L1_SUGGESTED_ANSWERS, u3l1RevealRecord } from '../data/unit3Lesson1/guidance';
import { U3L1_SOLUTIONS_DECLARATION } from '../data/unit3Lesson1/solutions';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L3_SOLUTIONS_DECLARATION } from '../data/unit2Lesson3/solutions';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import { U2L1_ACTIVITIES } from '../data/unit2Lesson1/activities';
import { curriculumRegistry } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { TeacherSolutionsBrowser } from '../components/teacher/TeacherSolutionsBrowser';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import {
  TEACHER_GUIDANCE_HEADING,
  TeacherGuidanceSection,
} from '../components/teacher/TeacherGuidanceSection';
import { auditCurriculum } from '../utils/audit';
import { fromKeyedLesson, fromLesson1, resolveAnswerReveal } from '../components/common/answerDisclosure';
import type { DisclosureBearingRecord } from '../components/common/answerDisclosure';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { U2L2_TEACHER_GUIDE } from '../data/unit2Lesson2/teacherGuide';
import type { TeacherSolutionsModel } from '../types/curriculum';

/**
 * U3L1 teacher guidance — link-only counterpart of the student's suggestions.
 *
 * This suite covers the three surfaces (student, teacher, supervision) and the
 * THREE-GATE contract that every future lesson must satisfy:
 *
 *   GATE 1 (student)      : approved_key/guidance_only only, and only when the
 *                           record actually carries text; everything else null.
 *   GATE 2 (teacher)      : whatever the learner can reveal has a teacher
 *                           counterpart in the same lesson — never dropped.
 *   GATE 3 (supervision)  : counts, statuses and gaps are honest and add up,
 *                           and no suggestion is laundered into a solution.
 */

const SHIPPED_GUIDES: TeacherSolutionsModel[] = [
  LESSON1_TEACHER_GUIDE,
  LESSON2_TEACHER_GUIDE,
  LESSON3_TEACHER_GUIDE,
  U2L1_TEACHER_GUIDE,
  U2L2_TEACHER_GUIDE,
  U2L3_SOLUTIONS_DECLARATION,
  U3L1_SOLUTIONS_DECLARATION,
];

const SHIPPED_REGISTRIES = [U3L1_GUIDANCE_REGISTRY];

/** Minimal source adapter over a lesson's own activity list (tests only). */
const sourceOf = <T extends { id: string; sourceActivityId?: string }>(
  activities: T[],
  toRecord: (activity: T) => DisclosureBearingRecord,
): TeacherGuidanceSource => ({
  activityIds: () => activities.map((activity) => activity.id),
  record: (activityId) => {
    const activity = activities.find((entry) => entry.id === activityId);
    return activity ? toRecord(activity) : null;
  },
  sourceActivityId: (activityId) =>
    activities.find((entry) => entry.id === activityId)?.sourceActivityId,
});

const U3L1_SOURCE = sourceOf(U3L1_ACTIVITIES, (activity) => u3l1RevealRecord(activity));

const audit = (
  guides: TeacherSolutionsModel[] = SHIPPED_GUIDES,
  registries = SHIPPED_REGISTRIES,
) => auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, guides, registries);

const errors = (report: ReturnType<typeof audit>) =>
  report.issues.filter((issue) => issue.severity === 'error');

afterEach(cleanup);

describe('U3L1 guidance registry — link-only, complete and pinned', () => {
  it('covers all 57 printed activities with links only (no copied answer text)', () => {
    expect(U3L1_GUIDANCE_REGISTRY.declaredActivityCount).toBe(57);
    expect(U3L1_GUIDANCE_REGISTRY.links).toHaveLength(57);
    expect(U3L1_GUIDANCE_REGISTRY.activityIds).toHaveLength(57);
    expect(new Set(U3L1_GUIDANCE_REGISTRY.activityIds).size).toBe(57);

    /* LINK-ONLY: no link carries the suggestion text. */
    const answerTexts = Object.values(U3L1_SUGGESTED_ANSWERS).map((entry) => entry.modelAnswer);
    expect(answerTexts).toHaveLength(52);
    for (const link of U3L1_GUIDANCE_REGISTRY.links) {
      const serialized = JSON.stringify(link);
      for (const text of answerTexts) {
        expect(serialized.includes(text)).toBe(false);
      }
    }
  });

  it('pins the audited classification: 0 approved / 52 guidance / 5 gaps', () => {
    const { counts } = U3L1_GUIDANCE_REGISTRY;
    expect(counts.total).toBe(57);
    expect(counts.approved_key).toBe(0);
    expect(counts.guidance_only).toBe(52);
    expect(counts.teacher_only).toBe(0);
    expect(counts.no_approved_content).toBe(5);
    expect(studentVisibleGuidance(U3L1_GUIDANCE_REGISTRY)).toHaveLength(52);
    expect(declaredContentGaps(U3L1_GUIDANCE_REGISTRY)).toHaveLength(5);
  });

  it('derives every classification from the record own disclosure, never from text', () => {
    for (const activity of U3L1_ACTIVITIES) {
      const link = U3L1_GUIDANCE_REGISTRY.links.find((entry) => entry.activityId === activity.id);
      expect(link).toBeDefined();
      expect(link!.classification).toBe(activity.disclosure.kind);
      expect(link!.sourceRef.trim().length).toBeGreaterThan(0);
      expect(link!.notice.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps the five calligraphy activities free of invented answers', () => {
    const calligraphy = U3L1_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'no_approved_content');
    expect(calligraphy.map((activity) => activity.id)).toEqual([
      'u3l1-a-45',
      'u3l1-a-46',
      'u3l1-a-47',
      'u3l1-a-48',
      'u3l1-a-49',
    ]);
    for (const activity of calligraphy) {
      /* No suggestion entry, no student payload, and the gap states its reason. */
      expect(U3L1_SUGGESTED_ANSWERS[activity.id]).toBeUndefined();
      expect(resolveAnswerReveal(u3l1RevealRecord(activity), 'student')).toBeNull();
      const link = U3L1_GUIDANCE_REGISTRY.links.find((entry) => entry.activityId === activity.id);
      expect(link?.gapReason?.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not change the PR #24 model: the lesson is still a declared absence', () => {
    expect(U3L1_SOLUTIONS_DECLARATION.kind).toBe('declared_absence');
    expect(
      (U3L1_SOLUTIONS_DECLARATION as unknown as Record<string, unknown>).exerciseSolutions,
    ).toBeUndefined();
    /* The registry is NOT a solutions record and is not registered as one. */
    expect(Object.keys(U3L1_GUIDANCE_REGISTRY)).not.toContain('exerciseSolutions');
    expect(Object.keys(U3L1_GUIDANCE_REGISTRY)).not.toContain('kind');
  });
});

describe('Audit A13 — student-visible guidance needs a teacher counterpart', () => {
  it('passes on the shipped configuration with three documented repairs', () => {
    const report = audit();
    expect(errors(report)).toEqual([]);
  });

  it('rejects a documented student guidance note with no teacher registry', () => {
    const report = audit(SHIPPED_GUIDES, []);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1' && issue.message.includes('دون سجل إرشادات معلمي'),
      ),
    ).toBe(true);
  });

  it('rejects a registry with no registered solutions record', () => {
    const withoutU3L1 = SHIPPED_GUIDES.filter((guide) => guide.lessonId !== 'unit3-lesson1');
    const report = audit(withoutU3L1, SHIPPED_REGISTRIES);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1' && issue.message.includes('بلا سجل حلول مسجل'),
      ),
    ).toBe(true);
  });

  it('rejects a link without a source reference or without a notice', () => {
    const items: TeacherGuidanceSourceItem[] = U3L1_ACTIVITIES.map((activity) => ({
      activityId: activity.id,
      sourceActivityId: activity.sourceActivityId,
      pageNumber: activity.page,
      section: activity.section,
      printedNumber: activity.printedNumber,
      record: u3l1RevealRecord(activity),
      notice: U3L1_SUGGESTED_ANSWERS[activity.id]?.notice ?? 'تنبيه',
    }));
    const broken = buildTeacherGuidanceRegistry({
      lessonId: 'unit3-lesson1',
      unitId: 'unit3',
      lessonTitle: 'العُلَماءُ الصِّغارُ',
      recordLocation: 'src/data/unit3Lesson1/guidance.ts',
      items,
      source: U3L1_SOURCE,
    });
    broken.links[0] = { ...broken.links[0], sourceRef: '   ' };
    broken.links[1] = { ...broken.links[1], notice: '   ' };
    const report = audit(SHIPPED_GUIDES, [broken]);
    expect(errors(report).some((issue) => issue.message.includes('بلا مرجع مصدر'))).toBe(true);
    expect(errors(report).some((issue) => issue.message.includes('بلا تنبيه'))).toBe(true);
  });

  it('rejects counts that do not match the links (no silent drift)', () => {
    const drifted = {
      ...U3L1_GUIDANCE_REGISTRY,
      counts: { ...U3L1_GUIDANCE_REGISTRY.counts, guidance_only: 51 },
    };
    const report = audit(SHIPPED_GUIDES, [drifted]);
    expect(errors(report).some((issue) => issue.message.includes('غير مطابقة للروابط'))).toBe(true);
  });

  it('forbids laundering a guidance_only record into an approved key', () => {
    const laundered = {
      ...U3L1_GUIDANCE_REGISTRY,
      links: U3L1_GUIDANCE_REGISTRY.links.map((link, index) =>
        index === 0 ? { ...link, classification: 'approved_key' as const } : link,
      ),
      counts: { ...U3L1_GUIDANCE_REGISTRY.counts, approved_key: 1, guidance_only: 51 },
    };
    const report = audit(SHIPPED_GUIDES, [laundered]);
    expect(
      errors(report).some((issue) => issue.message.includes('لا يجوز تحويل إرشاد إلى مفتاح معتمد')),
    ).toBe(true);
  });

  it('rejects two guidance registries for one lesson (no ambiguous counterpart)', () => {
    const report = audit(SHIPPED_GUIDES, [U3L1_GUIDANCE_REGISTRY, U3L1_GUIDANCE_REGISTRY]);
    expect(
      errors(report).some((issue) => issue.message.includes('أكثر من سجل إرشادات معلمي')),
    ).toBe(true);
  });

  it('leaves every other lesson untouched: no new issue mentions them', () => {
    const messages = audit().issues.map((issue) => issue.message).join('\n');
    for (const otherLesson of [
      'lesson1',
      'lesson2',
      'lesson3',
      'unit2-lesson1',
      'unit2-lesson2',
      'unit2-lesson3',
    ]) {
      expect(messages.includes(`إرشادات (${otherLesson})`)).toBe(false);
      expect(messages.includes(`سجل إرشادات (${otherLesson})`)).toBe(false);
    }
  });
});

describe('Reusable triple gate — student / teacher / supervision', () => {
  /**
   * GATE CONTRACT (mandatory for every future lesson).
   *
   * Given the records of one lesson, the teacher counterpart registry and the
   * solutions record, ALL THREE gates must agree. The gate is deliberately
   * data-driven, so a new lesson only has to provide the same three pieces.
   */
  const expectTripleGate = (input: {
    label: string;
    records: { id: string; disclosure: { kind: string; sourceRef: string } }[];
    registry: typeof U3L1_GUIDANCE_REGISTRY;
    guide: TeacherSolutionsModel;
  }) => {
    const { label, registry, guide } = input;
    /* Revealability is decided by the SAME resolver the student surface uses,
       over the ORIGINAL records the registry points at. */
    const revealable = input.records.filter((record) => {
      const original = registry.readRecord(record.id);
      return original ? resolveAnswerReveal(original, 'student') !== null : false;
    }).length;

    /* GATE 1 — the student surface only reveals what the disclosure allows. */
    const visibleLinks = studentVisibleGuidance(registry);
    expect(visibleLinks.length, `${label}: student-visible guidance`).toBe(revealable);

    /* GATE 2 — every revealable record has a teacher link (completeness). */
    const linkIds = new Set(registry.links.map((link) => link.activityId));
    for (const record of input.records) {
      expect(linkIds.has(record.id), `${label}: ${record.id} has no teacher link`).toBe(true);
    }

    /* GATE 3 — supervision arithmetic must add up, and the record kind rules. */
    const { counts } = registry;
    expect(counts.total).toBe(registry.links.length);
    expect(counts.guidance_only + counts.approved_key + counts.teacher_only + counts.no_approved_content).toBe(
      counts.total,
    );
    expect(counts.total).toBe(input.records.length);

    if (guide.kind === 'declared_absence') {
      /* Nothing may be presented as an approved key inside a declared absence. */
      expect(counts.approved_key, `${label}: approved keys inside declared absence`).toBe(0);
      expect(counts.guidance_only + counts.approved_key).toBe(visibleLinks.length);
      expect(guide.declaration.studentGuidanceNote?.trim().length).toBeGreaterThan(0);
    }
  };

  it('U3L1 passes the triple gate', () => {
    expectTripleGate({
      label: 'unit3-lesson1',
      records: U3L1_ACTIVITIES,
      registry: U3L1_GUIDANCE_REGISTRY,
      guide: U3L1_SOLUTIONS_DECLARATION,
    });
  });

  it('a previously working lesson (unit 2 lesson 2) still matches the same contract', () => {
    /* The comparison lesson: approved guide, 51 records, its own solution texts.
       A registry built from ITS records must satisfy the same gates — proving the
       gate is reusable and that U3L1 was not special-cased. */
    const registry = buildTeacherGuidanceRegistry({
      lessonId: 'unit2-lesson2',
      unitId: 'unit2',
      lessonTitle: 'الذَّكاءُ الاصطِناعيُّ',
      recordLocation: 'src/data/unit2Lesson2/activities.ts',
      source: sourceOf(U2L2_ACTIVITIES, (activity) => ({
        id: activity.id,
        sourceActivityId: activity.sourceActivityId,
        disclosure: activity.disclosure,
        modelAnswer: activity.teacher.answerOrGuidance,
        explanation: activity.checkExplanation,
        teacher: activity.teacher,
      })),
      items: U2L2_TEACHER_GUIDE.sourceCoverage
        ? U2L2_ACTIVITIES.map((activity) => ({
            activityId: activity.id,
            sourceActivityId: activity.sourceActivityId,
            pageNumber: activity.page,
            section: activity.section,
            printedNumber: activity.printedNumber,
            record: {
              id: activity.id,
              sourceActivityId: activity.sourceActivityId,
              disclosure: activity.disclosure,
              modelAnswer: activity.teacher.answerOrGuidance,
              explanation: activity.checkExplanation,
              teacher: activity.teacher,
            },
            notice: 'إرشاد مقترح أعدّته المنصة، وليس إجابة معتمدة.',
          }))
        : [],
    });

    expect(registry.counts.total).toBe(51);
    expect(registry.counts.approved_key).toBe(22);
    expect(registry.counts.guidance_only).toBe(29);
    expect(registry.counts.no_approved_content).toBe(0);
    expect(studentVisibleGuidance(registry)).toHaveLength(51);

    /* GATE 2 alone: every record has a teacher link. */
    for (const activity of U2L2_ACTIVITIES) {
      expect(registry.links.some((link) => link.activityId === activity.id)).toBe(true);
    }
  });

  it('a lesson with zero student guidance needs no counterpart (unit 2 lesson 3)', () => {
    /* Contrast case: 43 records, all `no_approved_content` — the learner can
       reveal nothing, so no advisory section is required and A13 stays silent. */
    const registry = buildTeacherGuidanceRegistry({
      lessonId: 'unit2-lesson3',
      unitId: 'unit2',
      lessonTitle: 'بِالْعِلْمِ تَرْقَى',
      recordLocation: 'src/data/unit2Lesson3/activities.ts',
      source: sourceOf(U2L3_ACTIVITIES, (activity) => ({
        id: activity.id,
        sourceActivityId: activity.sourceActivityId,
        disclosure: activity.disclosure,
      })),
      items: U2L3_ACTIVITIES.map((activity) => ({
        activityId: activity.id,
        sourceActivityId: activity.sourceActivityId,
        pageNumber: activity.page,
        record: {
          id: activity.id,
          sourceActivityId: activity.sourceActivityId,
          disclosure: activity.disclosure,
        },
        notice: 'لا محتوى معتمد لهذا النشاط.',
      })),
    });
    expect(registry.counts.no_approved_content).toBe(43);
    expect(studentVisibleGuidance(registry)).toHaveLength(0);
    expect(U2L3_SOLUTIONS_DECLARATION.kind).toBe('declared_absence');
    expect(U2L3_SOLUTIONS_DECLARATION.declaration.studentGuidanceNote).toBeUndefined();
    /* The shipped audit must not require a counterpart here. */
    expect(
      audit().issues.some((issue) => issue.entityId === 'unit2-lesson3' && issue.category === 'answer_disclosure'),
    ).toBe(false);
  });

  it('lesson 2 (approved guide) shows no advisory section and gains no A13 issue', () => {
    const report = audit();
    expect(report.issues.some((issue) => issue.message.includes('lesson2'))).toBe(false);
    expect(LESSON2_ACTIVITIES.length).toBe(53);
    expect(LESSON2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(53);
  });
});


describe('A13 is bound to the ORIGINAL activity ledger (source-verified)', () => {
  /** A registry clone with one mutation applied — never touching shipped data. */
  const mutate = (mutator: (links: typeof U3L1_GUIDANCE_REGISTRY['links']) => typeof U3L1_GUIDANCE_REGISTRY['links']) => {
    const links = mutator([...U3L1_GUIDANCE_REGISTRY.links]);
    return {
      ...U3L1_GUIDANCE_REGISTRY,
      links,
      counts: {
        total: links.length,
        approved_key: links.filter((link) => link.classification === 'approved_key').length,
        guidance_only: links.filter((link) => link.classification === 'guidance_only').length,
        teacher_only: links.filter((link) => link.classification === 'teacher_only').length,
        no_approved_content: links.filter((link) => link.classification === 'no_approved_content').length,
      },
    };
  };

  it('the shipped registry matches the source record for record', () => {
    const comparison = compareGuidanceToSource(
      U3L1_GUIDANCE_REGISTRY,
      (record) => resolveAnswerReveal(record, 'student') !== null,
    );
    expect(comparison.missing).toEqual([]);
    expect(comparison.extra).toEqual([]);
    expect(comparison.classificationDrift).toEqual([]);
    expect(comparison.sourceRefDrift).toEqual([]);
    expect(comparison.sourceIdDrift).toEqual([]);
    expect(comparison.unresolved).toEqual([]);
    expect(comparison.withoutTeacherCounterpart).toEqual([]);
    /* 52 of the 57 records are revealable, and all 52 have a counterpart. */
    expect(comparison.studentVisible).toHaveLength(52);
  });

  it('DELETING one link fails the audit (missing record, incomplete coverage)', () => {
    const oneRemoved = mutate((links) => links.filter((link) => link.activityId !== 'u3l1-a-01'));
    const report = audit(SHIPPED_GUIDES, [oneRemoved]);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1:u3l1-a-01' &&
          issue.message.includes('بلا رابط إرشاد معلمي'),
      ),
    ).toBe(true);
    /* The declared activity count (57) is now larger than the links (56): the
       completeness accounting catches the deletion even though counts were
       recomputed, because the source still has 57 records. */
    expect(
      errors(report).some((issue) => issue.message.includes('بينما يحوي')),
    ).toBe(true);
  });

  it('DELETING the link of a revealable activity is specifically a missing counterpart', () => {
    /* u3l1-a-45 is a declared gap; u3l1-a-01 is revealable. Deleting the latter
       removes the teacher counterpart of something the learner can see. */
    const withoutRevealable = mutate((links) =>
      links.filter((link) => link.activityId !== 'u3l1-a-01'),
    );
    const comparison = compareGuidanceToSource(
      withoutRevealable,
      (record) => resolveAnswerReveal(record, 'student') !== null,
    );
    expect(comparison.missing).toContain('u3l1-a-01');
    /* The learner can still reveal it — the source did not change. */
    const record = U3L1_GUIDANCE_REGISTRY.source.record('u3l1-a-01');
    expect(record).not.toBeNull();
    expect(resolveAnswerReveal(record!, 'student')).not.toBeNull();
  });

  it('CHANGING a classification fails the audit (drift from the disclosure)', () => {
    const drifted = mutate((links) =>
      links.map((link) =>
        link.activityId === 'u3l1-a-02'
          ? { ...link, classification: 'approved_key' as const }
          : link,
      ),
    );
    const report = audit(SHIPPED_GUIDES, [drifted]);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1:u3l1-a-02' &&
          issue.message.includes('يخالف تصريح النشاط الأصلي'),
      ),
    ).toBe(true);
    expect(
      errors(report).some((issue) => issue.message.includes('لا يجوز تحويل إرشاد إلى مفتاح معتمد')),
    ).toBe(true);
  });

  it('CHANGING a sourceRef fails the audit (no unattributable reference)', () => {
    const rewired = mutate((links) =>
      links.map((link) =>
        link.activityId === 'u3l1-a-03'
          ? { ...link, sourceRef: 'src/data/unit3Lesson1/guidance.ts#somewhere-else' }
          : link,
      ),
    );
    const report = audit(SHIPPED_GUIDES, [rewired]);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1:u3l1-a-03' &&
          issue.message.includes('لا يطابق مرجع النشاط الأصلي'),
      ),
    ).toBe(true);
  });

  it('CHANGING a source-lock id fails the audit (link points at the wrong printed task)', () => {
    const mislabelled = mutate((links) =>
      links.map((link) =>
        link.activityId === 'u3l1-a-04'
          ? { ...link, sourceActivityId: 'U3L1-99-99' }
          : link,
      ),
    );
    const report = audit(SHIPPED_GUIDES, [mislabelled]);
    expect(
      errors(report).some((issue) => issue.message.includes('بينما الأصل')),
    ).toBe(true);
  });

  it('ADDING a dangling link fails the audit (no invented activity)', () => {
    const withExtra = mutate((links) => [
      ...links,
      {
        activityId: 'u3l1-a-99',
        sourceRef: 'src/data/unit3Lesson1/guidance.ts#u3l1-a-99',
        classification: 'guidance_only' as const,
        notice: 'تنبيه',
      },
    ]);
    const report = audit(SHIPPED_GUIDES, [withExtra]);
    expect(
      errors(report).some((issue) => issue.message.includes('نشاط غير موجود في السجل الأصلي')),
    ).toBe(true);
  });

  it('SHRINKING activityIds fails the audit (declared coverage cannot prove itself)', () => {
    const shrunk = {
      ...U3L1_GUIDANCE_REGISTRY,
      activityIds: U3L1_GUIDANCE_REGISTRY.activityIds.slice(0, 10),
    };
    const report = audit(SHIPPED_GUIDES, [shrunk]);
    expect(
      errors(report).some((issue) => issue.message.includes('غير مذكور في قائمة الأنشطة المعلنة')),
    ).toBe(true);
    expect(errors(report).some((issue) => issue.message.includes('التغطية ناقصة أو زائدة'))).toBe(true);
  });

  it('ADDING a revealable activity to the ledger without a counterpart fails the audit', () => {
    /* A new printed activity appears in the source and the learner can reveal it,
       but nobody adds a teacher link. This is exactly the regression the gate
       exists to prevent — and the audit must catch it from the data alone. */
    const syntheticRecord: DisclosureBearingRecord = {
      id: 'u3l1-a-88',
      sourceActivityId: 'U3L1-88-01',
      disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-88-01' },
      modelAnswer: 'إرشاد جديد',
    };
    const sourceWithNewActivity: TeacherGuidanceSource = {
      activityIds: () => [...U3L1_ACTIVITIES.map((a) => a.id), 'u3l1-a-88'],
      record: (activityId) =>
        activityId === 'u3l1-a-88'
          ? syntheticRecord
          : U3L1_GUIDANCE_REGISTRY.source.record(activityId),
      sourceActivityId: (activityId) =>
        activityId === 'u3l1-a-88'
          ? 'U3L1-88-01'
          : U3L1_GUIDANCE_REGISTRY.source.sourceActivityId(activityId),
    };
    /* The learner can indeed reveal it, so it demands a counterpart. */
    expect(resolveAnswerReveal(syntheticRecord, 'student')).not.toBeNull();

    const registry = { ...U3L1_GUIDANCE_REGISTRY, source: sourceWithNewActivity };
    const report = audit(SHIPPED_GUIDES, [registry]);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1:u3l1-a-88' &&
          issue.message.includes('بلا رابط إرشاد معلمي'),
      ),
    ).toBe(true);
    expect(
      errors(report).some((issue) => issue.message.includes('بينما السجل الأصلي يحوي')),
    ).toBe(true);
  });

  it('a registry with no SOURCE adapter is rejected outright', () => {
    const { source: _omitted, ...withoutSource } = U3L1_GUIDANCE_REGISTRY;
    const report = audit(SHIPPED_GUIDES, [withoutSource as never]);
    expect(
      errors(report).some((issue) => issue.message.includes('بلا مصدر سجلات أصلي')),
    ).toBe(true);
  });
});

describe('Triple gate is AUTOMATIC over the registered ledger', () => {
  /**
   * The gate is no longer a hand-maintained list. It walks the curriculum
   * registry, resolves each lesson's ORIGINAL records through registered
   * adapters, and derives the expectations from the data itself. A new lesson is
   * covered the moment it is registered — no test edit required.
   */
  const REGISTERED_RECORD_SOURCES: Record<string, { activities: { id: string }[]; toRecord: (activity: never) => DisclosureBearingRecord }> = {
    lesson1: { activities: TEXTBOOK_ACTIVITIES, toRecord: (activity) => fromLesson1(activity) },
    lesson2: { activities: LESSON2_ACTIVITIES, toRecord: (activity) => fromKeyedLesson(activity) },
    lesson3: { activities: LESSON3_ACTIVITIES, toRecord: (activity) => fromKeyedLesson(activity) },
    'unit2-lesson1': { activities: U2L1_ACTIVITIES, toRecord: (activity) => fromKeyedLesson(activity) },
    'unit2-lesson2': { activities: U2L2_ACTIVITIES, toRecord: (activity) => fromKeyedLesson(activity) },
    'unit2-lesson3': { activities: U2L3_ACTIVITIES, toRecord: (activity) => activity },
    'unit3-lesson1': { activities: U3L1_ACTIVITIES, toRecord: (activity) => u3l1RevealRecord(activity) },
  };

  const registeredLessonIds = curriculumRegistry.units.flatMap((unit) =>
    unit.lessons.map((lesson) => lesson.metadata.id),
  );

  it.each(registeredLessonIds)(
    '%s: student-visible records all have a teacher counterpart in the registry',
    (lessonId) => {
      const source = REGISTERED_RECORD_SOURCES[lessonId];
      /* A newly registered lesson with no adapter fails loudly instead of being
         skipped silently — that is the whole point of "automatic". */
      expect(source, `no record adapter registered for lesson ${lessonId}`).toBeDefined();

      const revealable = source.activities.filter(
        (activity) =>
          resolveAnswerReveal(source.toRecord(activity as never), 'student') !== null,
      );
      const registry = U3L1_GUIDANCE_REGISTRY;
      if (lessonId !== registry.lessonId) {
        /* Only lessons that ship a guidance registry are in scope today; the
           assertion above guarantees they cannot be *forgotten* silently. */
        expect(registry.lessonId).not.toBe(lessonId);
        return;
      }
      expect(revealable).toHaveLength(52);
      for (const activity of revealable) {
        expect(
          registry.links.some((link) => link.activityId === activity.id),
          `${lessonId}: ${activity.id} is revealable but has no teacher link`,
        ).toBe(true);
      }
    },
  );

  it('every registered lesson satisfies the automatic counterpart contract', () => {
    /*
     * AUTOMATIC RULE (no per-lesson test edits):
     *  - approved guide    → its solutions view IS the teacher counterpart, so it
     *                        must carry one solution per source record (1:1).
     *  - declared absence  → a registry is REQUIRED as soon as the learner can
     *                        reveal anything, and it must match the source.
     * A lesson with nothing revealable needs neither, and A13 stays silent.
     */
    for (const lessonId of registeredLessonIds) {
      const source = REGISTERED_RECORD_SOURCES[lessonId];
      const records = source.activities;
      const revealable = records.filter(
        (activity) =>
          resolveAnswerReveal(source.toRecord(activity as never), 'student') !== null,
      );
      const registry = SHIPPED_REGISTRIES.find((entry) => entry.lessonId === lessonId);
      const guide = SHIPPED_GUIDES.find((entry) => entry.lessonId === lessonId);

      expect(guide, `${lessonId} has no solutions record`).toBeDefined();

      if (registry) {
        const comparison = compareGuidanceToSource(
          registry,
          (record) => resolveAnswerReveal(record, 'student') !== null,
        );
        expect(comparison.missing, `${lessonId}: missing links`).toEqual([]);
        expect(comparison.extra, `${lessonId}: dangling links`).toEqual([]);
        expect(comparison.classificationDrift, `${lessonId}: classification drift`).toEqual([]);
        expect(comparison.withoutTeacherCounterpart, `${lessonId}: uncovered`).toEqual([]);
        expect(comparison.studentVisible.length, `${lessonId}: revealable`).toBe(revealable.length);
        /* Coverage is proven above via `missing`: every record has a link, so the
           five calligraphy gaps are linked too (they just reveal nothing). */
        expect(comparison.missing, `${lessonId}: full coverage`).toEqual([]);
        expect(registry.links.length, `${lessonId}: links`).toBe(records.length);
        continue;
      }

      if (guide!.kind === 'approved') {
        /* The approved solutions view must cover every record 1:1. */
        expect(
          guide!.exerciseSolutions.length,
          `${lessonId}: approved guide does not cover every source record`,
        ).toBe(records.length);
        continue;
      }

      /* Declared absence with no registry is only legal when nothing is shown. */
      expect(
        revealable,
        `${lessonId} shows ${revealable.length} revealable records but ships no guidance registry`,
      ).toHaveLength(0);
    }
  });
});

describe('Teacher surface — the 52 suggestions are shown as a separate section', () => {
  it('renders every suggestion under the mandated heading, with source, class and notice', () => {
    render(<TeacherGuidanceSection registry={U3L1_GUIDANCE_REGISTRY} />);

    expect(
      screen.getByRole('heading', { name: TEACHER_GUIDANCE_HEADING }),
    ).toBeInTheDocument();
    expect(TEACHER_GUIDANCE_HEADING).toBe('إرشادات مقترحة من المنصة — ليست حلولًا معتمدة');

    const items = document.querySelectorAll('.teacher-guidance-item');
    /* 52 visible suggestions + the 5 declared gaps. */
    expect(items).toHaveLength(57);

    const firstItem = document.querySelector('.teacher-guidance-item') as HTMLElement;
    expect(firstItem.textContent).toContain('إرشاد مقترح (غير معتمد)'); // classification
    expect(firstItem.querySelector('code')?.textContent).toContain('U3L1-73-01'); // source
    expect(within(firstItem).getByRole('note').textContent).toContain('ليست إجابة معتمدة'); // notice

    /* No approved-solution marker anywhere in the advisory section. */
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
  });

  it('opens inside the declared-absence lesson without becoming a solutions view', () => {
    render(
      <TeacherSolutionsBrowser
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الثالثة/ }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض الإرشادات المقترحة للدرس الأول/ }));

    expect(screen.getByRole('heading', { name: TEACHER_GUIDANCE_HEADING })).toBeInTheDocument();
    expect(document.querySelectorAll('.teacher-guidance-item')).toHaveLength(57);
    /* Still a declared absence: no solution card, no approved heading. */
    expect(document.querySelectorAll('.guide-solution-card')).toHaveLength(0);
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
    expect(screen.getByText(/غياب الحلول معلن وموثَّق/)).toBeInTheDocument();
    /* The suggestion text itself is present — as the teacher's counterpart. */
    const firstSuggestion = U3L1_SUGGESTED_ANSWERS['u3l1-a-01'].modelAnswer;
    expect(screen.getByText(firstSuggestion)).toBeInTheDocument();
  });

  it('keeps the approved lessons free of any advisory section', () => {
    render(
      <TeacherSolutionsBrowser
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الأولى: أحلامي وطموحاتي/ }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس الثاني: / }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
    expect(screen.queryByRole('heading', { name: TEACHER_GUIDANCE_HEADING })).toBeNull();
    expect(document.querySelectorAll('.teacher-guidance-item')).toHaveLength(0);
  });
});

describe('Supervision surface — status, counts and gaps only', () => {
  const openAuditTab = () => {
    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: /^مدقق الجودة والنزاهة \(/ }));
  };

  it('shows lesson status and classification counts without duplicating guidance text', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        tests={ALL_ASSESSMENTS}
        accessPassword="somer173"
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    openAuditTab();

    expect(
      screen.getByRole('heading', { name: 'الإشراف على الإرشادات — الحالة والأعداد' }),
    ).toBeInTheDocument();

    const row = document.querySelector('[data-lesson-id="unit3-lesson1"]') as HTMLElement;
    expect(row).not.toBeNull();
    expect(row.textContent).toContain('العُلَماءُ الصِّغارُ');
    expect(row.textContent).toContain('غياب معلن وموثَّق'); // status
    expect(row.textContent).toContain('٥٢'); // guidance_only
    expect(row.textContent).toContain('٥'); // no_approved_content
    expect(row.textContent).toContain('مقابل معلمي قائم');

    /* No guidance text is repeated in the supervision panel. */
    const panel = document.querySelector('.guidance-supervision') as HTMLElement;
    for (const entry of Object.values(U3L1_SUGGESTED_ANSWERS)) {
      expect(panel.textContent).not.toContain(entry.modelAnswer);
    }
  });

  it('surfaces an A13 mismatch in the audit list when the counterpart is missing', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        tests={ALL_ASSESSMENTS}
        accessPassword="somer173"
        guidanceRegistries={[]}
      />,
    );
    openAuditTab();
    expect(
      screen.getByText(/دون سجل إرشادات معلمي/),
    ).toBeInTheDocument();
  });
});

describe('Student surface — unchanged by the teacher projection', () => {
  it('still reveals the suggestions and hides the five gaps', () => {
    const revealable = U3L1_ACTIVITIES.filter(
      (activity) => resolveAnswerReveal(u3l1RevealRecord(activity), 'student') !== null,
    );
    expect(revealable).toHaveLength(52);
    for (const activity of revealable) {
      const payload = resolveAnswerReveal(u3l1RevealRecord(activity), 'student');
      expect(payload?.heading).toBe('إرشادات للإجابة');
    }
    const hidden = U3L1_ACTIVITIES.filter(
      (activity) => resolveAnswerReveal(u3l1RevealRecord(activity), 'student') === null,
    );
    expect(hidden.map((activity) => activity.id)).toEqual([
      'u3l1-a-45',
      'u3l1-a-46',
      'u3l1-a-47',
      'u3l1-a-48',
      'u3l1-a-49',
    ]);
  });

  it('never exposes teacher-only material to the student scope', () => {
    for (const activity of U3L1_ACTIVITIES) {
      const student = resolveAnswerReveal(u3l1RevealRecord(activity), 'student');
      expect(student === null || !('kind' in student)).toBe(true);
    }
  });
});
