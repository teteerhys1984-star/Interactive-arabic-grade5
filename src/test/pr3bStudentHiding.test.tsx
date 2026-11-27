import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import {
  getStudentBlockLines,
  getStudentSteps,
  isStudentBlockVisible,
  isStudentStepHidden,
  resolveStudentStepIndex,
} from '../components/curriculum/studentVisibility';
import { curriculumRegistry, getLessonById } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_STEP_CONTENT } from '../data/lesson2/content';
import { U2L1_STEP_CONTENT } from '../data/unit2Lesson1/content';
import { U2L2_STEP_CONTENT } from '../data/unit2Lesson2/content';
import { U2L3_STEP_CONTENT } from '../data/unit2Lesson3/content';
import { U3L1_STEP_CONTENT, U3L1_STEPS } from '../data/unit3Lesson1/content';
import { U3L1_LOCKED_SOURCE_NOTES } from '../data/unit3Lesson1/sourceMeta';
import { U3L1_ACTIVITY_BY_ID } from '../data/unit3Lesson1/activities';
import { U3L1_SUGGESTED_ANSWERS } from '../data/unit3Lesson1/guidance';
import { readLearningLocation, writeLearningLocation } from '../utils/learningProgress';

/**
 * PR 3b — student view of the SIX remaining lessons hides listening («أستمع») and
 * oral-communication («أتواصل شفهياً») material.
 *
 * Policy: docs/redesign/learning-experience-phase-1-diagnosis-and-concept.md
 * §٦ (per-lesson hiding table), §١١ (numbers, resume, storage untouched) and §١٣.١.
 *
 * The suite is deliberately two-sided:
 *  - NEGATIVE: every identifier §٦ names is absent from the rendered student surface.
 *  - POSITIVE: reading aloud, recitation, image observation, comprehension, grammar,
 *    spelling, calligraphy, expression, the test entry and the whole teacher/data
 *    layer stay present.
 *
 * A test that only proves absence could pass on an empty page, so each lesson also
 * asserts that its visible steps still render their source material.
 */

afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

const lesson = (id: string) => getLessonById(id)!.lesson;

/** Student-surface HTML after visiting every visible step of a lesson. */
function visitAll(lessonId: string): string {
  const { container } = render(<LessonFlow lesson={lesson(lessonId)} />);
  const total = screen.getAllByRole('button', { name: /^الخطوة \d+:/ }).length;
  let seen = '';
  for (let index = 0; index < total; index += 1) {
    fireEvent.click(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })[index]);
    seen += container.innerHTML;
  }
  cleanup();
  return seen;
}

/* ------------------------------------------------------------------ */
/* §٦ — the exact hiding table, lesson by lesson                       */
/* ------------------------------------------------------------------ */

describe('PR 3b — lesson 1: l1-s2 (listening) and l1-s5 (oral) are whole hidden steps', () => {
  it('removes exactly those two steps and keeps the other eight', () => {
    const data = lesson('lesson1');
    expect(data.steps).toHaveLength(10); // registry untouched

    const visible = getStudentSteps(data).map((step) => step.id);
    expect(visible).toHaveLength(8);
    expect(visible).not.toContain('l1-s2');
    expect(visible).not.toContain('l1-s5');
    expect(visible).toContain('l1-s3'); // أَقْرَأُ النَّصَّ
    expect(visible).toContain('l1-s4'); // الفَهْمُ القِرائِيُّ
    expect(visible).toContain('l1-s9'); // أُعَبِّرُ كِتابِيّاً
  });

  it('renders no listening/oral step and keeps the reading step', () => {
    render(<LessonFlow lesson={lesson('lesson1')} />);
    const names = screen
      .getAllByRole('button', { name: /^الخطوة \d+:/ })
      .map((button) => button.getAttribute('aria-label') ?? '');
    expect(names.some((name) => name.includes('أَسْتَمِعُ'))).toBe(false);
    expect(names.some((name) => name.includes('أُتَواصَلُ'))).toBe(false);
    expect(names.some((name) => name.includes('أَقْرَأُ'))).toBe(true);
  });

  it('skips the hidden listening step with the next control', () => {
    const { container } = render(<LessonFlow lesson={lesson('lesson1')} />);
    expect(container.querySelector('.lesson-step-position')).toHaveTextContent(/1.*8/);
    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 2' }));
    expect(readLearningLocation()?.stepId).toBe('l1-s3');
    expect(container.querySelector('.lesson-step-position')).toHaveTextContent(/2.*8/);
  });
});

describe('PR 3b — lesson 2: l2-s1 keeps image reflection only, l2-s4 is hidden', () => {
  it('keeps L2-12-01…03 and drops L2-12-04…06 plus the listening source note', () => {
    render(<LessonFlow lesson={lesson('lesson2')} />);
    expect(screen.getByLabelText('نشاط المصدر L2-12-01')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر L2-12-02')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر L2-12-03')).toBeInTheDocument();
    expect(screen.queryByLabelText('نشاط المصدر L2-12-04')).toBeNull();
    expect(screen.queryByLabelText('نشاط المصدر L2-12-05')).toBeNull();
    expect(screen.queryByLabelText('نشاط المصدر L2-12-06')).toBeNull();
    expect(screen.queryByText('تنبيه المصدر: الاستماع')).toBeNull();
  });

  it('the step title is a truncation of the existing wording, not new text', () => {
    const data = lesson('lesson2');
    const registered = data.steps.find((step) => step.id === 'l2-s1')!;
    const shown = getStudentSteps(data).find((step) => step.id === 'l2-s1')!;
    expect(registered.title).toBe('أستكشف الصور وأستمع');
    expect(shown.title).toBe('أستكشف الصور');
    expect(registered.title.startsWith(shown.title)).toBe(true);
    // The registry object itself is never mutated by the student view.
    expect(data.steps[0].title).toBe('أستكشف الصور وأستمع');
  });

  it('hides the oral-communication step and keeps comprehension, grammar and the poem', () => {
    const visible = getStudentSteps(lesson('lesson2')).map((step) => step.id);
    expect(visible).toHaveLength(8);
    expect(visible).not.toContain('l2-s4');
    expect(visible).toEqual(['l2-s1', 'l2-s2', 'l2-s3', 'l2-s5', 'l2-s6', 'l2-s7', 'l2-s8', 'l2-s9']);
  });
});

describe('PR 3b — lesson 3: the PR 3 rules are unchanged', () => {
  it('still hides l3-s4 and nothing else in the step list', () => {
    const visible = getStudentSteps(lesson('lesson3')).map((step) => step.id);
    expect(visible).toHaveLength(8);
    expect(visible).not.toContain('l3-s4');
  });

  it('keeps reading aloud and recitation visible inside their steps', () => {
    expect(isStudentBlockVisible('lesson3', 'l3-s2', { kind: 'activity', activityId: 'l3-a-07' })).toBe(true);
    expect(isStudentBlockVisible('lesson3', 'l3-s3', { kind: 'activity', activityId: 'l3-a-11' })).toBe(true);
  });
});

describe('PR 3b — unit2-lesson1: the listening block and the oral step are hidden', () => {
  const activitiesOf = (lessonId: string, stepId: string, blocks: readonly { kind: string; activityId?: string }[]) =>
    blocks
      .filter((block) => isStudentBlockVisible(lessonId, stepId, block))
      .flatMap((block) => (block.kind === 'activity' && block.activityId ? [block.activityId] : []));

  it('keeps the image activities and hides the listening instruction, gap, explanation and items', () => {
    expect(activitiesOf('unit2-lesson1', 'u2l1-s1', U2L1_STEP_CONTENT['u2l1-s1'].blocks)).toEqual([
      'u2l1-a-01',
      'u2l1-a-02',
      'u2l1-a-03',
    ]);
    expect(
      isStudentBlockVisible('unit2-lesson1', 'u2l1-s1', {
        kind: 'source_info',
        heading: 'تنبيه المصدر: الاستماع',
      }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit2-lesson1', 'u2l1-s1', {
        kind: 'instruction',
        heading: 'أستمع إلى النص (من الكتاب)',
      }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit2-lesson1', 'u2l1-s1', {
        kind: 'instruction',
        heading: 'أتأمل الصور الآتية (من الكتاب)',
      }),
    ).toBe(true);
  });

  it('removes u2l1-s4 (story of Majd, radio-talk examples and checks) as one step', () => {
    const data = lesson('unit2-lesson1');
    expect(data.steps).toHaveLength(11); // registry untouched
    const visible = getStudentSteps(data).map((step) => step.id);
    expect(visible).toHaveLength(10);
    expect(visible).not.toContain('u2l1-s4');
    expect(resolveStudentStepIndex(data, 'u2l1-s4')).toBe(3); // → u2l1-s5
    // Data of the hidden step survives in full.
    expect(JSON.stringify(U2L1_STEP_CONTENT['u2l1-s4'])).toContain('قصة مجد');
  });

  it('renders no Majd story and no listening instruction on the student surface', () => {
    const seen = visitAll('unit2-lesson1');
    expect(seen).not.toContain('قصة مجد');
    expect(seen).toContain('مُخْتَرِعٌ مِنْ بِلَادِي');
    expect(seen).toContain('U2L1-40-01'); // image observation stays
    expect(seen).toContain('U2L1-41-01'); // reading aloud stays
  });
});

describe('PR 3b — unit2-lesson2: mixed steps, only the oral parts go', () => {
  const activitiesOf = (lessonId: string, stepId: string, blocks: readonly { kind: string; activityId?: string }[]) =>
    blocks
      .filter((block) => isStudentBlockVisible(lessonId, stepId, block))
      .flatMap((block) => (block.kind === 'activity' && block.activityId ? [block.activityId] : []));

  it('hides the listening block of u2l2-s1 and keeps its image activities', () => {
    expect(activitiesOf('unit2-lesson2', 'u2l2-s1', U2L2_STEP_CONTENT['u2l2-s1'].blocks)).toEqual([
      'u2l2-a-01',
      'u2l2-a-02',
      'u2l2-a-03',
    ]);
  });

  it('keeps u2l2-s4 as a step, keeps a-13…16, hides a-17, its example and its check', () => {
    const data = lesson('unit2-lesson2');
    expect(getStudentSteps(data).map((step) => step.id)).toContain('u2l2-s4');

    expect(activitiesOf('unit2-lesson2', 'u2l2-s4', U2L2_STEP_CONTENT['u2l2-s4'].blocks)).toEqual([
      'u2l2-a-13',
      'u2l2-a-14',
      'u2l2-a-15',
      'u2l2-a-16',
    ]);

    expect(
      isStudentBlockVisible('unit2-lesson2', 'u2l2-s4', {
        kind: 'worked_example',
        heading: 'مثال محلول: أبني حديثاً إذاعياً (موضوع موازٍ)',
      }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit2-lesson2', 'u2l2-s4', { kind: 'check', id: 'u2l2-check-s4-radio', heading: 'أتأكد من فهمي' }),
    ).toBe(false);
    // Other checks in other steps are untouched.
    expect(
      isStudentBlockVisible('unit2-lesson2', 'u2l2-s2', { kind: 'check', id: 'u2l2-check-s2-purpose', heading: 'أتأكد من فهمي' }),
    ).toBe(true);
  });

  it('the shared explanation keeps its comprehension lines and loses only the radio line', () => {
    const block = U2L2_STEP_CONTENT['u2l2-s4'].blocks.find(
      (candidate) => candidate.kind === 'explanation' && candidate.heading === 'من الفهم إلى التذوق والإنتاج',
    );
    expect(block?.kind).toBe('explanation');
    const lines = block && block.kind === 'explanation' ? block.lines : [];
    expect(lines).toHaveLength(3); // data untouched

    const studentLines = getStudentBlockLines('unit2-lesson2', 'u2l2-s4', 'من الفهم إلى التذوق والإنتاج', lines);
    expect(studentLines).toHaveLength(2);
    expect(studentLines.some((line) => line.includes('الحديث الإذاعي'))).toBe(false);
    expect(studentLines.some((line) => line.includes('اختيار عبارة أعجبتني'))).toBe(true);
    expect(studentLines.some((line) => line.includes('إضافة مقطع حواري'))).toBe(true);
  });

  it('renders the mixed step without the radio material', () => {
    render(<LessonFlow lesson={lesson('unit2-lesson2')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4: الفهم القرائي/ }));
    expect(screen.getByLabelText('نشاط المصدر U2L2-53-01')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر U2L2-53-04')).toBeInTheDocument();
    expect(screen.queryByLabelText('نشاط المصدر U2L2-53-05')).toBeNull();
    expect(screen.queryByText(/أبني حديثاً إذاعياً/)).toBeNull();
    expect(screen.queryByText(/لازم في افتتاح الحديث الإذاعي الصباحي/)).toBeNull();
    expect(screen.queryByText(/الحديث الإذاعي: تحية افتتاحية/)).toBeNull();
    expect(screen.getByText(/اختيار عبارة أعجبتني/)).toBeInTheDocument();
  });
});

describe('PR 3b — unit2-lesson3: listening block out, grammar kept in the same step', () => {
  const activitiesOf = (lessonId: string, stepId: string, blocks: readonly { kind: string; activityId?: string }[]) =>
    blocks
      .filter((block) => isStudentBlockVisible(lessonId, stepId, block))
      .flatMap((block) => (block.kind === 'activity' && block.activityId ? [block.activityId] : []));

  it('hides the listening instruction/note and a-04/05, and keeps the image activities', () => {
    expect(activitiesOf('unit2-lesson3', 'u2l3-s1', U2L3_STEP_CONTENT['u2l3-s1'].blocks)).toEqual([
      'u2l3-a-01',
      'u2l3-a-02',
      'u2l3-a-03',
    ]);
    expect(
      isStudentBlockVisible('unit2-lesson3', 'u2l3-s1', { kind: 'source_info', heading: 'حدّ مصدر معلن: الاستماع' }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit2-lesson3', 'u2l3-s1', { kind: 'platform_note', heading: 'تنفيذ مهمتَي الاستماع' }),
    ).toBe(false);
    // The frame-wording gap belongs to the pictures, not to listening — it stays.
    expect(
      isStudentBlockVisible('unit2-lesson3', 'u2l3-s1', { kind: 'source_info', heading: 'حدّ مصدر معلن: الإطار الأزرق' }),
    ).toBe(true);
  });

  it('hides only a-19 and the oral guidance in u2l3-s5, keeping every grammar block', () => {
    expect(isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'activity', activityId: 'u2l3-a-19' })).toBe(false);
    expect(isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'activity', activityId: 'u2l3-a-20' })).toBe(true);
    expect(isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'activity', activityId: 'u2l3-a-23' })).toBe(true);
    expect(
      isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'instruction', heading: 'أتواصل شفوياً (من الكتاب)' }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'instruction', heading: 'قواعد اللغة (من الكتاب)' }),
    ).toBe(true);
    expect(isStudentBlockVisible('unit2-lesson3', 'u2l3-s5', { kind: 'rule', heading: 'القاعِدَةُ (من الكتاب)' })).toBe(true);
  });

  it('renders the grammar step without the oral section', () => {
    render(<LessonFlow lesson={lesson('unit2-lesson3')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 5: قواعد اللغة/ }));
    expect(screen.queryByText('أتواصل شفوياً (من الكتاب)')).toBeNull();
    expect(screen.getByText('قواعد اللغة (من الكتاب)')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر U2L3-64-02')).toBeInTheDocument();
    expect(screen.queryByLabelText('نشاط المصدر U2L3-64-01')).toBeNull();
  });
});

describe('PR 3b — unit3-lesson1: listening items out, grammar and poem kept', () => {
  const activitiesOf = (lessonId: string, stepId: string, blocks: readonly { kind: string; activityId?: string }[]) =>
    blocks
      .filter((block) => isStudentBlockVisible(lessonId, stepId, block))
      .flatMap((block) => (block.kind === 'activity' && block.activityId ? [block.activityId] : []));

  it('hides a-05…07 with their note and keeps the image activities', () => {
    expect(activitiesOf('unit3-lesson1', 'u3l1-s1', U3L1_STEP_CONTENT['u3l1-s1'].blocks)).toEqual([
      'u3l1-a-01',
      'u3l1-a-02',
      'u3l1-a-03',
      'u3l1-a-04',
    ]);
    expect(
      isStudentBlockVisible('unit3-lesson1', 'u3l1-s1', { kind: 'source_info', heading: 'حدّ مصدر معلن: الاستماع' }),
    ).toBe(false);
    expect(
      isStudentBlockVisible('unit3-lesson1', 'u3l1-s1', { kind: 'platform_note', heading: 'تنفيذ أسئلة الاستماع' }),
    ).toBe(false);
  });

  it('hides only a-21 and the oral guidance in u3l1-s4, keeping the grammar', () => {
    expect(isStudentBlockVisible('unit3-lesson1', 'u3l1-s4', { kind: 'activity', activityId: 'u3l1-a-21' })).toBe(false);
    expect(isStudentBlockVisible('unit3-lesson1', 'u3l1-s4', { kind: 'activity', activityId: 'u3l1-a-22' })).toBe(true);
    expect(isStudentBlockVisible('unit3-lesson1', 'u3l1-s4', { kind: 'activity', activityId: 'u3l1-a-24' })).toBe(true);
    expect(
      isStudentBlockVisible('unit3-lesson1', 'u3l1-s4', { kind: 'instruction', heading: 'أتواصل شفوياً (من الكتاب)' }),
    ).toBe(false);
    expect(isStudentBlockVisible('unit3-lesson1', 'u3l1-s4', { kind: 'rule', heading: 'أَتَذَكَّرُ (من الكتاب)' })).toBe(
      true,
    );
  });

  it('removes the student note that ties the poem to the recording', () => {
    expect(
      isStudentBlockVisible('unit3-lesson1', 'u3l1-s2', { kind: 'platform_note', heading: 'ملاحظة عن القصيدة' }),
    ).toBe(false);
    render(<LessonFlow lesson={lesson('unit3-lesson1')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2: أقرأ/ }));
    expect(screen.queryByText('ملاحظة عن القصيدة')).toBeNull();
    expect(screen.getByText(/وَسَعَادَتُنا أَنَّا/)).toBeInTheDocument(); // the poem stays
  });

  it('keeps the suggested-answer surface for the non-hidden activities', () => {
    expect(U3L1_SUGGESTED_ANSWERS['u3l1-a-13']).toBeDefined(); // comprehension
    expect(U3L1_SUGGESTED_ANSWERS['u3l1-a-22']).toBeDefined(); // grammar
    expect(U3L1_ACTIVITY_BY_ID['u3l1-a-05'].disclosure.kind).toBe('guidance_only'); // data intact
  });
});

/* ------------------------------------------------------------------ */
/* Positive controls: the material §٦ protects is still rendered       */
/* ------------------------------------------------------------------ */

describe('PR 3b — what must stay visible', () => {
  it('reading-aloud and recitation activities (kind: speak) are not hidden wholesale', () => {
    render(<LessonFlow lesson={lesson('unit2-lesson1')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2: أقرأ/ }));
    // U2L1-41-01/02/03 — قراءة جهرية.
    expect(screen.getByLabelText('نشاط المصدر U2L1-41-01')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر U2L1-41-02')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر U2L1-41-03')).toBeInTheDocument();
  });

  it('expressly keeps the recitation-and-delivery activity of lesson 3', () => {
    // l3-a-11 «أحفظ مقطعًا وألقيه» is a speak activity that stays visible.
    render(<LessonFlow lesson={lesson('lesson3')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    expect(isStudentBlockVisible('lesson3', 'l3-s3', { kind: 'activity', activityId: 'l3-a-11' })).toBe(true);
    expect(screen.getByLabelText('نشاط المصدر L3-27-02')).toBeInTheDocument();
  });

  it('the hidden-step set is exactly what §٦ names — no lesson lost a grammar or spelling step', () => {
    const hiddenIn = (lessonId: string) =>
      lesson(lessonId)
        .steps.map((step) => step.id)
        .filter((id) => isStudentStepHidden(lessonId, id));
    expect(hiddenIn('lesson1')).toEqual(['l1-s2', 'l1-s5']);
    expect(hiddenIn('lesson2')).toEqual(['l2-s4']);
    expect(hiddenIn('lesson3')).toEqual(['l3-s4']);
    expect(hiddenIn('unit2-lesson1')).toEqual(['u2l1-s4']);
    expect(hiddenIn('unit2-lesson2')).toEqual([]);
    expect(hiddenIn('unit2-lesson3')).toEqual([]);
    expect(hiddenIn('unit3-lesson1')).toEqual([]);
  });

  it('no block kind is filtered: only the identified identifiers are hidden', () => {
    // A same-kind block with a different id in the same step is visible.
    expect(isStudentBlockVisible('lesson2', 'l2-s1', { kind: 'activity', activityId: 'l2-a-03' })).toBe(true);
    expect(isStudentBlockVisible('lesson2', 'l2-s1', { kind: 'activity', activityId: 'l2-a-04' })).toBe(false);
    expect(isStudentBlockVisible('unit2-lesson2', 'u2l2-s1', { kind: 'activity', activityId: 'u2l2-a-06' })).toBe(true);
    // The listening note is hidden only inside its own step.
    expect(
      isStudentBlockVisible('lesson2', 'l2-s3', { kind: 'source_info', heading: 'تنبيه المصدر: الاستماع' }),
    ).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* Data, teacher area and storage are untouched                        */
/* ------------------------------------------------------------------ */

describe('PR 3b — data, teacher area and storage contracts', () => {
  it('keeps every registered step and every hidden source record', () => {
    expect(lesson('lesson1').steps).toHaveLength(10);
    expect(lesson('lesson2').steps).toHaveLength(9);
    expect(lesson('lesson3').steps).toHaveLength(9);
    expect(lesson('unit2-lesson1').steps).toHaveLength(11);
    expect(lesson('unit2-lesson2').steps).toHaveLength(11);
    expect(lesson('unit2-lesson3').steps).toHaveLength(9);
    expect(lesson('unit3-lesson1').steps).toHaveLength(11);

    // The hidden activity records still exist with their source ids.
    expect(JSON.stringify(LESSON2_STEP_CONTENT['l2-s4'])).toContain('أتواصل شفهياً');
    expect(JSON.stringify(U2L2_STEP_CONTENT['u2l2-s4'])).toContain('u2l2-a-17');
    expect(JSON.stringify(U2L2_STEP_CONTENT['u2l2-s4'])).toContain('u2l2-a-13');
    expect(JSON.stringify(U2L3_STEP_CONTENT['u2l3-s5'])).toContain('u2l3-a-19');
    expect(JSON.stringify(U3L1_STEP_CONTENT['u3l1-s1'])).toContain('u3l1-a-05');
  });

  it('keeps a hidden activity draft readable — nothing is cleared from storage', () => {
    const draftKey = 'arabic-grade5-drafts-v1:lesson2:L2-12-04';
    window.sessionStorage.setItem(draftKey, JSON.stringify({ x: 'مسودة محفوظة' }));
    render(<LessonFlow lesson={lesson('lesson2')} />);
    expect(screen.queryByLabelText('نشاط المصدر L2-12-04')).toBeNull();
    expect(window.sessionStorage.getItem(draftKey)).toContain('مسودة محفوظة');
  });

  it('opens a stored position on a hidden step at the next visible one, without overwriting it', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson2', stepId: 'l2-s4' });
    render(<LessonFlow lesson={lesson('lesson2')} />);

    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(readLearningLocation()).toEqual({ unitId: 'unit1', lessonId: 'lesson2', stepId: 'l2-s4' });
  });

  it('resumes a hidden first-step position at step 2 and writes only after a real choice', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson1', stepId: 'l1-s2' });
    render(<LessonFlow lesson={lesson('lesson1')} />);

    expect(screen.getByRole('button', { name: /^الخطوة 2:/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('heading', { level: 2, name: /أَقْرَأُ/ })).toBeInTheDocument();
    expect(readLearningLocation()?.stepId).toBe('l1-s2'); // untouched

    // Visible steps: 1 l1-s1 · 2 l1-s3 · 3 l1-s4 · 4 l1-s6 · 5 l1-s7 · 6 l1-s8 …
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 5:/ }));
    expect(readLearningLocation()?.stepId).toBe('l1-s7');
  });

  it('resolves hidden positions forwards only (unit under test)', () => {
    const data = lesson('lesson1');
    expect(resolveStudentStepIndex(data, 'l1-s2')).toBe(1); // → l1-s3
    expect(resolveStudentStepIndex(data, 'l1-s5')).toBe(3); // → l1-s6
    expect(resolveStudentStepIndex(data, 'l1-s1')).toBe(0);
    expect(resolveStudentStepIndex(data, 'no-such-step')).toBe(-1);
  });

  it('numbers and counts only the visible steps', () => {
    const { container } = render(<LessonFlow lesson={lesson('unit2-lesson1')} />);
    expect(container.querySelector('.lesson-step-position')).toHaveTextContent(/1.*10/);
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(10);

    // The mobile picker mirrors the same list.
    const select = screen.getByLabelText('اختر خطوة للانتقال إليها') as HTMLSelectElement;
    expect(select.options).toHaveLength(10);
    expect(Array.from(select.options).some((option) => option.textContent?.includes('أتواصل'))).toBe(false);
  });

  it('home and unit pages report visible counts for every lesson', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الثانية/ }));
    const unit2Row = screen.getByRole('button', { name: /ابدأ الدرس 1: مُخْتَرِعٌ/ }).closest('li');
    expect(unit2Row!.textContent).toMatch(/١٠\s*خطوات/);
    expect(unit2Row!.textContent).not.toMatch(/١١\s*خطوات/);

    fireEvent.click(screen.getByRole('button', { name: /^الرئيسية$/ }));
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    const unit1Row = screen.getByRole('button', { name: /ابدأ الدرس 1:/ }).closest('li');
    expect(unit1Row!.textContent).toMatch(/٨\s*خطوات/);
    expect(unit1Row!.textContent).not.toMatch(/١٠\s*خطوات/);
  });

  it('the teacher area keeps the hidden material (student-only filter)', () => {
    render(
      <TeacherAreaShell curriculum={curriculumRegistry} teacherGuides={[LESSON1_TEACHER_GUIDE]} tests={ALL_ASSESSMENTS} />,
    );
    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    fireEvent.click(screen.getByRole('button', { name: 'عرض دروس وحلول الوحدة الأولى: أحلامي وطموحاتي' }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: السَّمَكَةُ الذَّهَبِيَّةُ$/ }));

    // Lesson 1's teacher guide still resolves the full registered ledger of 39 records —
    // including the activities that belong to the two hidden steps (l1-s2 and l1-s5).
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(39);
    expect(screen.getByText('الأهداف التربوية')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Navigation across hidden steps                                      */
/* ------------------------------------------------------------------ */

describe('PR 3b — navigation across hidden steps', () => {
  it('previous/next never land on a hidden step', () => {
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    render(<LessonFlow lesson={lesson('lesson2')} />);

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 4' }));
    // Visible 4 is l2-s5 (grammar), not the hidden l2-s4.
    expect(screen.getByRole('heading', { level: 2, name: 'قواعد اللغة: المصادر' })).toBeInTheDocument();
    expect(readLearningLocation()?.stepId).toBe('l2-s5');

    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الخطوة 3' }));
    expect(readLearningLocation()?.stepId).toBe('l2-s3');
    scroll.mockRestore();
  });

  it('End and Home reach the visible first and last steps', () => {
    render(<LessonFlow lesson={lesson('lesson1')} />);
    const buttons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'End' });
    expect(buttons[7]).toHaveAttribute('aria-current', 'step');
    expect(readLearningLocation()?.stepId).toBe('l1-s10');

    fireEvent.keyDown(buttons[7], { key: 'Home' });
    expect(buttons[0]).toHaveAttribute('aria-current', 'step');
    expect(readLearningLocation()?.stepId).toBe('l1-s1');
  });

  it('a lesson with no hidden step keeps its full list', () => {
    const { container } = render(<LessonFlow lesson={lesson('unit2-lesson3')} />);
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(9);
    expect(container.querySelector('.lesson-step-position')).toHaveTextContent(/1.*9/);
  });

  it('the lesson test is offered on the last VISIBLE step of lesson 1', () => {
    render(<LessonFlow lesson={lesson('lesson1')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 8:/ }));
    expect(screen.getByRole('button', { name: 'بدء اختبار الدرس، عشرون سؤالاً' })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })[0]);
    expect(screen.queryByRole('button', { name: 'بدء اختبار الدرس، عشرون سؤالاً' })).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* The student-facing wording is never authored, only cut              */
/* ------------------------------------------------------------------ */

describe('PR 3b — title and source-name overrides are literal truncations', () => {
  const sectionOf = (step: { source?: unknown }) =>
    step.source && 'sectionName' in (step.source as object)
      ? (step.source as { sectionName?: string }).sectionName
      : undefined;

  it.each([
    'lesson1',
    'lesson2',
    'lesson3',
    'unit2-lesson1',
    'unit2-lesson2',
    'unit2-lesson3',
    'unit3-lesson1',
  ])('%s: every shown title/section is a contiguous substring of the registered one', (lessonId) => {
    const data = lesson(lessonId);
    getStudentSteps(data).forEach((shown) => {
      const registered = data.steps.find((step) => step.id === shown.id)!;
      expect(registered.title.includes(shown.title), `${shown.id} title: «${shown.title}»`).toBe(true);
      const registeredSection = sectionOf(registered);
      const shownSection = sectionOf(shown);
      if (shownSection !== undefined) {
        expect(registeredSection, `${shown.id} has a section override but no registered section`).toBeDefined();
        expect(registeredSection!.includes(shownSection), `${shown.id} section: «${shownSection}»`).toBe(true);
      }
    });
  });

  /**
   * `includes` alone is a weak proof: a single inserted character in the middle
   * keeps the string a substring. These tests pin the EXACT cut — the shown text
   * must be a contiguous slice of the registered text, the leftovers before and
   * after it must be exactly the listening/oral wording, and the codepoints of
   * the kept slice must be identical one by one.
   */
  const cutProof = (registered: string, shown: string) => {
    const at = registered.indexOf(shown);
    return {
      at,
      before: at < 0 ? null : registered.slice(0, at),
      after: at < 0 ? null : registered.slice(at + shown.length),
      codepointsMatch:
        at >= 0 &&
        [...shown].map((char) => char.codePointAt(0)).join(',') ===
          [...registered.slice(at, at + shown.length)].map((char) => char.codePointAt(0)).join(','),
    };
  };

  it('u2l3-s5 (APPROVED): the kept slice is exactly «قواعد اللغة» and only the oral wording is cut', () => {
    const data = lesson('unit2-lesson3');
    const registered = data.steps.find((step) => step.id === 'u2l3-s5')!;
    const shown = getStudentSteps(data).find((step) => step.id === 'u2l3-s5')!;

    // The registered wording is untouched in the data.
    expect(registered.title).toBe('التواصل الشفهي وقواعد اللغة');
    expect(sectionOf(registered)).toBe('أتواصل شفوياً وقواعد اللغة');

    const titleCut = cutProof(registered.title, shown.title);
    expect(shown.title).toBe('قواعد اللغة'); // the approved slice, verbatim
    expect(titleCut.at).toBeGreaterThan(0); // a real cut, not the whole string
    expect(titleCut.before).toBe('التواصل الشفهي و'); // only the oral wording goes
    expect(titleCut.after).toBe(''); // nothing was cut from the end
    expect(titleCut.codepointsMatch).toBe(true);

    const sectionCut = cutProof(sectionOf(registered)!, sectionOf(shown)!);
    expect(sectionOf(shown)).toBe('قواعد اللغة');
    expect(sectionCut.before).toBe('أتواصل شفوياً و');
    expect(sectionCut.after).toBe('');
    expect(sectionCut.codepointsMatch).toBe(true);

    // What was removed mentions nothing but the oral-communication wording.
    expect(titleCut.before).not.toMatch(/قواعد|اللغة|نحو|إعراب/);
    expect(sectionCut.before).not.toMatch(/قواعد|اللغة|نحو|إعراب/);
  });

  it('u3l1-s1 (APPROVED): the kept slice is exactly «أتأمّل الصورتين» and only the listening wording is cut', () => {
    const data = lesson('unit3-lesson1');
    const registered = data.steps.find((step) => step.id === 'u3l1-s1')!;
    const shown = getStudentSteps(data).find((step) => step.id === 'u3l1-s1')!;

    expect(registered.title).toBe('أتأمّل الصورتين وأستمع');
    expect(sectionOf(registered)).toBe('أتأمّل الصورتين وأستمع إلى النص');

    const titleCut = cutProof(registered.title, shown.title);
    expect(shown.title).toBe('أتأمّل الصورتين');
    expect(titleCut.at).toBe(0); // the kept slice starts the registered string
    expect(titleCut.before).toBe('');
    expect(titleCut.after).toBe(' وأستمع');
    expect(titleCut.codepointsMatch).toBe(true);

    const sectionCut = cutProof(sectionOf(registered)!, sectionOf(shown)!);
    expect(sectionOf(shown)).toBe('أتأمّل الصورتين');
    expect(sectionCut.at).toBe(0);
    expect(sectionCut.before).toBe('');
    expect(sectionCut.after).toBe(' وأستمع إلى النص');
    expect(sectionCut.codepointsMatch).toBe(true);

    // What was removed mentions nothing but the listening wording.
    expect(titleCut.after).not.toMatch(/صور|تأمل|تأمّل/);
    expect(sectionCut.after).not.toMatch(/صور|تأمل|تأمّل/);
  });

  it('fixes the exact overrides this PR introduces', () => {
    const shownTitle = (lessonId: string, stepId: string) =>
      getStudentSteps(lesson(lessonId)).find((step) => step.id === stepId)!.title;

    expect(shownTitle('lesson2', 'l2-s1')).toBe('أستكشف الصور');
    expect(shownTitle('unit2-lesson1', 'u2l1-s1')).toBe('أتأمّل الصور');
    expect(shownTitle('unit2-lesson2', 'u2l2-s1')).toBe('أتأمّل الصور');
    expect(shownTitle('unit2-lesson2', 'u2l2-s4')).toBe('الفهم القرائي (٦–٩)');
    expect(shownTitle('unit2-lesson3', 'u2l3-s1')).toBe('أتأمّل الصور');
    expect(shownTitle('unit2-lesson3', 'u2l3-s5')).toBe('قواعد اللغة');
    expect(shownTitle('unit3-lesson1', 'u3l1-s1')).toBe('أتأمّل الصورتين');

    // Steps with no override keep the registered wording verbatim.
    expect(shownTitle('unit2-lesson1', 'u2l1-s2')).toBe('أقرأ النصّ');
    expect(shownTitle('lesson1', 'l1-s3')).toBe(lesson('lesson1').steps[2].title);
  });

  /**
   * The other five overrides are not §9 rulings, but they are held to the same
   * standard: a contiguous prefix/suffix slice with an identical codepoint run.
   */
  it.each([
    ['lesson2', 'l2-s1'],
    ['unit2-lesson1', 'u2l1-s1'],
    ['unit2-lesson2', 'u2l2-s1'],
    ['unit2-lesson2', 'u2l2-s4'],
    ['unit2-lesson3', 'u2l3-s1'],
  ])('%s / %s: the override is an exact slice of the registered wording', (lessonId, stepId) => {
    const data = lesson(lessonId);
    const registered = data.steps.find((step) => step.id === stepId)!;
    const shown = getStudentSteps(data).find((step) => step.id === stepId)!;

    const titleCut = cutProof(registered.title, shown.title);
    expect(titleCut.at, `${stepId} title not a slice`).toBeGreaterThanOrEqual(0);
    expect(titleCut.codepointsMatch).toBe(true);
    // Either a prefix or a suffix — never an interior fragment that drops a middle part.
    expect(
      titleCut.before === '' || titleCut.after === '',
      `${stepId}: title override is not a prefix/suffix slice`,
    ).toBe(true);

    const registeredSection = sectionOf(registered);
    const shownSection = sectionOf(shown);
    if (shownSection !== undefined) {
      const sectionCut = cutProof(registeredSection!, shownSection);
      expect(sectionCut.codepointsMatch).toBe(true);
      expect(sectionCut.before === '' || sectionCut.after === '').toBe(true);
    }
  });
});

/* ------------------------------------------------------------------ */
/* «ملاحظة عن القصيدة» — subordinate to the hidden listening section  */
/* ------------------------------------------------------------------ */

describe('PR 3b — «ملاحظة عن القصيدة» is hidden because it is not about the poem', () => {
  const NOTE_HEADING = 'ملاحظة عن القصيدة';

  const noteLines = () => {
    const block = U3L1_STEP_CONTENT['u3l1-s2'].blocks.find(
      (candidate) => candidate.kind === 'platform_note' && candidate.heading === NOTE_HEADING,
    );
    return block && block.kind === 'platform_note' ? block.lines : [];
  };

  it('carries no teaching content about the poem itself', () => {
    const text = noteLines().join(' ');
    expect(noteLines()).toHaveLength(1);
    // Nothing about meaning, structure, wording or grammar of the poem.
    ['معنى', 'شرح', 'بيت', 'أبيات', 'تشكيل', 'إعراب', 'مفردات', 'فكرة'].forEach((word) => {
      expect(text, `the note should not teach «${word}»`).not.toContain(word);
    });
  });

  it('its only subject is the relation to the listening section on page 73', () => {
    const text = noteLines().join(' ');
    expect(text).toContain('نصّ الاستماع في ص٧٣');
    expect(text).toContain('لا تُنسب');
    // The whole note is that relation plus its bare classification — nothing else.
    expect(text.replace('القصيدة نصّ قراءة فقط؛ ', '')).toContain('لا تُنسب إلى نصّ الاستماع');
  });

  it('is hidden in u3l1-s2, and it is the ONLY block hidden there', () => {
    const blocks = U3L1_STEP_CONTENT['u3l1-s2'].blocks;
    const hidden = blocks.filter((block) => !isStudentBlockVisible('unit3-lesson1', 'u3l1-s2', block));
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toMatchObject({ kind: 'platform_note', heading: NOTE_HEADING });

    // Everything else in the step survives: the reading instruction, the poem and three activities.
    const kept = blocks
      .filter((block) => isStudentBlockVisible('unit3-lesson1', 'u3l1-s2', block))
      .map((block) => block.kind);
    expect(kept).toEqual(['instruction', 'poem', 'activity', 'activity', 'activity']);
  });

  it('is not hidden in any other step, because it exists only here', () => {
    const occurrences = U3L1_STEPS.flatMap((step) =>
      U3L1_STEP_CONTENT[step.id].blocks
        .filter((block) => 'heading' in block && block.heading === NOTE_HEADING)
        .map(() => step.id),
    );
    expect(occurrences).toEqual(['u3l1-s2']);
    expect(isStudentBlockVisible('unit3-lesson1', 'u3l1-s2', {
      kind: 'platform_note',
      heading: NOTE_HEADING,
    })).toBe(false);
  });

  it('the student still reads the whole poem and its three activities', () => {
    render(<LessonFlow lesson={lesson('unit3-lesson1')} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2: أقرأ/ }));
    expect(screen.queryByText(NOTE_HEADING)).toBeNull();
    expect(screen.getByText(/وَسَعَادَتُنا أَنَّا/)).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط المصدر U3L1-74-01')).toBeInTheDocument();
  });

  it('the claim itself survives in the data and the teacher layer', () => {
    // The note is not deleted — it stays in the source notes and in the data block.
    expect(noteLines()[0]).toContain('لا تُنسب إلى نصّ الاستماع');
    expect(U3L1_LOCKED_SOURCE_NOTES.poemListeningRelation).toContain('لا تُنسب');
    // And the two blocks that carried it in the hidden listening section are still there.
    expect(
      U3L1_STEP_CONTENT['u3l1-s1'].blocks.some(
        (block) => block.kind === 'platform_note' && block.heading === 'تنفيذ أسئلة الاستماع',
      ),
    ).toBe(true);
  });
});
