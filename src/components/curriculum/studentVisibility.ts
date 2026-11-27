import type { Lesson, LessonStep } from '../../types/curriculum';

/**
 * Student-view visibility for listening («أستمع») and oral-communication («أتواصل شفهياً») material.
 *
 * Policy — docs/redesign/learning-experience-phase-1-diagnosis-and-concept.md §٦ و§١١ و§١٣.١:
 * - Presentation-only filter. Lesson data, source records, teacher content, draft keys and the
 *   learning-location record are NOT modified.
 * - Hiding is by explicit identifiers (step id, activity id, source-info heading inside a step).
 *   It is never by block kind: `kind: 'speak'` also covers reading-aloud and recitation activities,
 *   which stay visible to the student.
 * - A stored position that points at a hidden step is left untouched in storage. The student sees the
 *   nearest visible step instead, until they choose a visible step themselves.
 *
 * PR 3 populates the `lesson3` rules only. Other lessons are added by PR 3b, using the same shape.
 */

interface StudentStepOverride {
  /** Student-facing title. Only a truncation of the existing wording is allowed. */
  readonly title?: string;
  /** Student-facing section name shown in the source badge. Truncation of existing wording only. */
  readonly sourceSectionName?: string;
}

interface StudentVisibilityRules {
  readonly hiddenStepIds: readonly string[];
  readonly hiddenActivityIds: readonly string[];
  readonly hiddenSourceInfo: readonly { readonly stepId: string; readonly heading: string }[];
  readonly stepOverrides: Readonly<Record<string, StudentStepOverride>>;
}

const EMPTY_RULES: StudentVisibilityRules = {
  hiddenStepIds: [],
  hiddenActivityIds: [],
  hiddenSourceInfo: [],
  stepOverrides: {},
};

const RULES: Readonly<Record<string, StudentVisibilityRules>> = {
  lesson3: {
    // «أتواصل شفهياً: حوار عن الترجمة» — whole step is oral communication.
    hiddenStepIds: ['l3-s4'],
    hiddenActivityIds: [
      'l3-a-01', // وصف شفهي للصور (l3-s1)
      'l3-a-05', // أستمع إلى النص — أخبر زميلاتي بالحرف الأخير (l3-s1)
      'l3-a-06', // أستمع إلى النص — صفتان من النص (l3-s1)
      'l3-a-19', // حوار جماعي (l3-s4)
      'l3-a-20', // تسجيل خلاصة الحوار (l3-s4، داخل القسم المحجوب)
      'l3-a-29', // حديث لمدة دقيقة (l3-s5 — النشاط وحده)
      'l3-a-41', // حوار لمدة دقيقة (l3-s6 — النشاط وحده)
    ],
    hiddenSourceInfo: [
      // «تنبيه المصدر: الاستماع» — تابع لقسم الاستماع المحجوب.
      { stepId: 'l3-s1', heading: 'تنبيه المصدر: الاستماع' },
    ],
    stepOverrides: {
      'l3-s1': { title: 'أستكشف الصور', sourceSectionName: 'أتأمل الصور' },
    },
  },
};

const rulesFor = (lessonId: string): StudentVisibilityRules => RULES[lessonId] ?? EMPTY_RULES;

export function isStudentStepHidden(lessonId: string, stepId: string): boolean {
  return rulesFor(lessonId).hiddenStepIds.includes(stepId);
}

/** Steps as the student sees them: hidden steps removed, approved truncations applied. */
export function getStudentSteps(lesson: Lesson): LessonStep[] {
  const rules = rulesFor(lesson.metadata.id);
  return (lesson.steps || [])
    .filter((step) => !rules.hiddenStepIds.includes(step.id))
    .map((step) => {
      const override = rules.stepOverrides[step.id];
      if (!override) return step;
      const source =
        override.sourceSectionName !== undefined && step.source && 'sectionName' in step.source
          ? { ...step.source, sectionName: override.sourceSectionName }
          : step.source;
      return {
        ...step,
        title: override.title ?? step.title,
        source,
      };
    });
}

/**
 * Index, inside `getStudentSteps(lesson)`, of a stored step id.
 * Returns -1 when the id is not a step of this lesson at all.
 * A hidden stored step resolves to the next visible step, else to the previous visible one.
 */
export function resolveStudentStepIndex(lesson: Lesson, stepId: string): number {
  const allSteps = lesson.steps || [];
  const rawIndex = allSteps.findIndex((step) => step.id === stepId);
  if (rawIndex < 0) return -1;

  const visibleIds = getStudentSteps(lesson).map((step) => step.id);
  if (visibleIds.length === 0) return -1;
  if (visibleIds.includes(stepId)) return visibleIds.indexOf(stepId);

  const next = allSteps.slice(rawIndex + 1).find((step) => visibleIds.includes(step.id));
  if (next) return visibleIds.indexOf(next.id);
  const previous = allSteps.slice(0, rawIndex).reverse().find((step) => visibleIds.includes(step.id));
  return previous ? visibleIds.indexOf(previous.id) : -1;
}

/** Minimal structural view of a lesson content block, enough to decide its visibility. */
export interface StudentBlockLike {
  kind: string;
  heading?: string;
  activityId?: string;
}

export function isStudentBlockVisible(lessonId: string, stepId: string, block: StudentBlockLike): boolean {
  const rules = rulesFor(lessonId);
  if (block.kind === 'activity' && block.activityId && rules.hiddenActivityIds.includes(block.activityId)) {
    return false;
  }
  if (
    block.kind === 'source_info' &&
    block.heading &&
    rules.hiddenSourceInfo.some((rule) => rule.stepId === stepId && rule.heading === block.heading)
  ) {
    return false;
  }
  return true;
}
