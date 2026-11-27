import type { Lesson, LessonStep } from '../../types/curriculum';

/**
 * Student-view visibility for listening («أستمع») and oral-communication («أتواصل شفهياً») material.
 *
 * Policy — docs/redesign/learning-experience-phase-1-diagnosis-and-concept.md §٦ و§١١ و§١٣.١:
 * - Presentation-only filter. Lesson data, source records, teacher content, draft keys and the
 *   learning-location record are NOT modified.
 * - Hiding is by explicit identifiers (step id, activity id, block heading, platform-check id,
 *   and — where a shared platform explanation mixes modes — a single printed line).
 *   It is never by block kind: `kind: 'speak'` also covers reading-aloud and recitation
 *   activities, which stay visible to the student.
 * - A stored position that points at a hidden step is left untouched in storage. The student sees the
 *   nearest visible step instead, until they choose a visible step themselves.
 *
 * PR 3 populated the `lesson3` rules. PR 3b adds the six remaining lessons with the same shape,
 * using only the identifiers listed in §٦.
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
  /** `source_info` block hidden by heading, inside one step. */
  readonly hiddenSourceInfo: readonly { readonly stepId: string; readonly heading: string }[];
  /**
   * Any block hidden by heading inside one step — used for the instruction, explanation,
   * platform-note, worked-example and check blocks that belong to a hidden section.
   */
  readonly hiddenBlockHeadings: readonly { readonly stepId: string; readonly heading: string }[];
  /** Platform checks (`kind: 'check'`) hidden by their own id. */
  readonly hiddenCheckIds: readonly { readonly stepId: string; readonly id: string }[];
  /**
   * One line removed from an otherwise-visible platform explanation, when the printed/source
   * part of that explanation stays and only the oral-communication line must go.
   */
  readonly hiddenLines: readonly { readonly stepId: string; readonly heading: string; readonly line: string }[];
  readonly stepOverrides: Readonly<Record<string, StudentStepOverride>>;
}

const EMPTY_RULES: StudentVisibilityRules = {
  hiddenStepIds: [],
  hiddenActivityIds: [],
  hiddenSourceInfo: [],
  hiddenBlockHeadings: [],
  hiddenCheckIds: [],
  hiddenLines: [],
  stepOverrides: {},
};

const RULES: Readonly<Record<string, StudentVisibilityRules>> = {
  lesson1: {
    // §٦: «أَسْتَمِعُ وَأَتَحَدَّثُ» (l1-s2) and «أُتَواصَلُ شَفَوِيّاً» (l1-s5) — both steps are the
    // listening and oral-communication sections themselves.
    hiddenStepIds: ['l1-s2', 'l1-s5'],
    hiddenActivityIds: [],
    hiddenSourceInfo: [],
    hiddenBlockHeadings: [],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {},
  },

  lesson2: {
    // §٦: «أتواصل شفهياً: مقابلة صحفية» (l2-s4) is the oral-communication section.
    hiddenStepIds: ['l2-s4'],
    hiddenActivityIds: [
      'l2-a-04', // نشاط الاستماع ١ (l2-s1)
      'l2-a-05', // نشاط الاستماع ٢ (l2-s1)
      'l2-a-06', // نشاط الاستماع ٣ (l2-s1)
    ],
    hiddenSourceInfo: [
      // «تنبيه المصدر: الاستماع» — تابع لقسم الاستماع المحجوب.
      { stepId: 'l2-s1', heading: 'تنبيه المصدر: الاستماع' },
    ],
    hiddenBlockHeadings: [],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {
      'l2-s1': { title: 'أستكشف الصور', sourceSectionName: 'أتأمل الصور' },
    },
  },

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
    hiddenBlockHeadings: [],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {
      'l3-s1': { title: 'أستكشف الصور', sourceSectionName: 'أتأمل الصور' },
    },
  },

  'unit2-lesson1': {
    // §٦: «أتواصل شفوياً: حديث إذاعي» (u2l1-s4) — القسم كاملًا مع قصة مجد والأمثلة والتحققات.
    hiddenStepIds: ['u2l1-s4'],
    hiddenActivityIds: [
      'u2l1-a-04', // أستمع إلى النص ١ (u2l1-s1)
      'u2l1-a-05', // أستمع إلى النص ٢ (u2l1-s1)
      'u2l1-a-06', // أستمع إلى النص ٣ (u2l1-s1)
    ],
    hiddenSourceInfo: [
      { stepId: 'u2l1-s1', heading: 'تنبيه المصدر: الاستماع' },
    ],
    hiddenBlockHeadings: [
      // كتلة الاستماع نفسها: توجيهها وشرحها، مع الإبقاء على تأمل الصور.
      { stepId: 'u2l1-s1', heading: 'أستمع إلى النص (من الكتاب)' },
      { stepId: 'u2l1-s1', heading: 'ماذا يفعل المستمع الجيد قبل الأسئلة؟' },
    ],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {
      'u2l1-s1': { title: 'أتأمّل الصور', sourceSectionName: 'أتأمل الصور الآتية' },
    },
  },

  'unit2-lesson2': {
    // §٦: في u2l2-s1 تُحجب كتلة الاستماع وu2l2-a-04/05؛ وفي u2l2-s4 تُبقى أنشطة الفهم
    // u2l2-a-13…16 ويُحجب u2l2-a-17 ومثال الحديث الإذاعي والتحقق المرتبط به وسطره ضمن الشرح المشترك.
    hiddenStepIds: [],
    hiddenActivityIds: [
      'u2l2-a-04', // أستمع إلى النص ١ (u2l2-s1)
      'u2l2-a-05', // أستمع إلى النص ٢ (u2l2-s1)
      'u2l2-a-17', // أتواصل شفوياً: الإذاعة المدرسية (u2l2-s4)
    ],
    hiddenSourceInfo: [
      { stepId: 'u2l2-s1', heading: 'تنبيه المصدر: الاستماع' },
    ],
    hiddenBlockHeadings: [
      { stepId: 'u2l2-s1', heading: 'أستمع إلى النص (من الكتاب)' },
      { stepId: 'u2l2-s1', heading: 'كيف أنفّذ مهمتَي الاستماع بلا تسجيل؟' },
      { stepId: 'u2l2-s4', heading: 'مثال محلول: أبني حديثاً إذاعياً (موضوع موازٍ)' },
    ],
    hiddenCheckIds: [
      // «أتأكد من فهمي» المرتبط بالحديث الإذاعي وحده.
      { stepId: 'u2l2-s4', id: 'u2l2-check-s4-radio' },
    ],
    hiddenLines: [
      {
        stepId: 'u2l2-s4',
        heading: 'من الفهم إلى التذوق والإنتاج',
        line: 'الحديث الإذاعي: تحية افتتاحية، ثم محوران هما أهمية التلفاز وآداب مشاهدته، ثم ختام بالشكر — كما تقتضي الإذاعة الصباحية.',
      },
    ],
    stepOverrides: {
      'u2l2-s1': { title: 'أتأمّل الصور', sourceSectionName: 'أتأمل الصور الآتية' },
      'u2l2-s4': { title: 'الفهم القرائي (٦–٩)', sourceSectionName: 'الفهم القرائي' },
    },
  },

  'unit2-lesson3': {
    // §٦: حجب كتلة الاستماع وu2l3-a-04/05؛ وفي u2l3-s5 حجب توجيه التواصل وu2l3-a-19 فقط،
    // مع إبقاء القواعد.
    hiddenStepIds: [],
    hiddenActivityIds: [
      'u2l3-a-04', // أستمع إلى النص ١ (u2l3-s1)
      'u2l3-a-05', // أستمع إلى النص ٢ (u2l3-s1)
      'u2l3-a-19', // أتواصل شفوياً (u2l3-s5)
    ],
    hiddenSourceInfo: [
      { stepId: 'u2l3-s1', heading: 'حدّ مصدر معلن: الاستماع' },
    ],
    hiddenBlockHeadings: [
      { stepId: 'u2l3-s1', heading: 'أستمع إلى النص (من الكتاب)' },
      { stepId: 'u2l3-s1', heading: 'تنفيذ مهمتَي الاستماع' },
      { stepId: 'u2l3-s5', heading: 'أتواصل شفوياً (من الكتاب)' },
    ],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {
      'u2l3-s1': { title: 'أتأمّل الصور', sourceSectionName: 'أتأمّل الصورتين' },
      'u2l3-s5': { title: 'قواعد اللغة', sourceSectionName: 'قواعد اللغة' },
    },
  },

  'unit3-lesson1': {
    // §٦: حجب كتلة الاستماع وu3l1-a-05…07 وإرشاداتها؛ وفي u3l1-s4 حجب توجيه التواصل
    // وu3l1-a-21 وإبقاء القواعد. وإزالة الملاحظة الطلابية التي تربط القصيدة بالتسجيل.
    hiddenStepIds: [],
    hiddenActivityIds: [
      'u3l1-a-05', // أستمع إلى النص ١ (u3l1-s1)
      'u3l1-a-06', // أستمع إلى النص ٢ (u3l1-s1)
      'u3l1-a-07', // أستمع إلى النص ٣ (u3l1-s1)
      'u3l1-a-21', // أتواصل شفوياً (u3l1-s4)
    ],
    hiddenSourceInfo: [
      { stepId: 'u3l1-s1', heading: 'حدّ مصدر معلن: الاستماع' },
    ],
    hiddenBlockHeadings: [
      { stepId: 'u3l1-s1', heading: 'أستمع إلى النص (من الكتاب)' },
      { stepId: 'u3l1-s1', heading: 'تنفيذ أسئلة الاستماع' },
      { stepId: 'u3l1-s4', heading: 'أتواصل شفوياً (من الكتاب)' },
      // ملاحظة صارت تابعة لقسم مخفي: تربط القصيدة بنص الاستماع.
      { stepId: 'u3l1-s2', heading: 'ملاحظة عن القصيدة' },
    ],
    hiddenCheckIds: [],
    hiddenLines: [],
    stepOverrides: {
      'u3l1-s1': { title: 'أتأمّل الصورتين', sourceSectionName: 'أتأمّل الصورتين' },
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
  /** Platform checks carry their own id. */
  id?: string;
}

export function isStudentBlockVisible(lessonId: string, stepId: string, block: StudentBlockLike): boolean {
  const rules = rulesFor(lessonId);
  if (block.kind === 'activity' && block.activityId && rules.hiddenActivityIds.includes(block.activityId)) {
    return false;
  }
  if (block.kind === 'check' && block.id && rules.hiddenCheckIds.some((rule) => rule.stepId === stepId && rule.id === block.id)) {
    return false;
  }
  if (
    block.heading &&
    rules.hiddenBlockHeadings.some((rule) => rule.stepId === stepId && rule.heading === block.heading)
  ) {
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

/**
 * Lines of an otherwise-visible block, minus the identified hidden line.
 * Used where a shared platform explanation keeps its comprehension lines and must lose
 * only the oral-communication line (§٦, `u2l2-s4`).
 */
export function getStudentBlockLines<T>(
  lessonId: string,
  stepId: string,
  heading: string | undefined,
  lines: readonly T[],
): T[] {
  const rules = rulesFor(lessonId);
  const hidden = rules.hiddenLines.filter((rule) => rule.stepId === stepId && rule.heading === heading);
  if (hidden.length === 0) return [...lines];
  return lines.filter((line) => !hidden.some((rule) => rule.line === line));
}
