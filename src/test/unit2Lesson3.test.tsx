import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import {
  curriculumRegistry,
  getLessonById,
  getUnitById,
  isUnitTestAvailable,
} from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { U2L3_ACTIVITIES, U2L3_ACTIVITY_BY_ID, U2L3_COVERAGE } from '../data/unit2Lesson3/activities';
import { U2L3_POEM, U2L3_SOURCE_TEXT, U2L3_STEPS, U2L3_STEP_CONTENT } from '../data/unit2Lesson3/content';
import { U2L3_LOCKED_SOURCE_NOTES } from '../data/unit2Lesson3/sourceMeta';
import { auditCurriculum } from '../utils/audit';
import { readLearningLocation, writeLearningLocation } from '../utils/learningProgress';
import { draftKey } from '../utils/draftStorage';

afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

describe('Unit 2 Lesson 3 — بِالْعِلْمِ تَرْقَى (ص٦١–٦٨)', () => {
  it('registers the third lesson last, extends the unit range to 68, and keeps the unit incomplete', () => {
    const unit2 = getUnitById('unit2')!;
    expect(unit2.lessons.map((lesson) => lesson.metadata.id)).toEqual([
      'unit2-lesson1', 'unit2-lesson2', 'unit2-lesson3',
    ]);
    expect(unit2.metadata.sourcePagesRange).toEqual({ startPage: 40, endPage: 68 });
    expect(unit2.metadata.isComplete).toBe(false);
    expect(unit2.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit2')).toBe(false);
    expect(unit2.metadata.theme).toBeUndefined();

    const result = getLessonById('unit2-lesson3')!;
    expect(result.unit.metadata.id).toBe('unit2');
    expect(result.lesson.metadata.title).toBe('بِالْعِلْمِ تَرْقَى');
    expect(result.lesson.metadata.order).toBe(3);
    expect(result.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual([61, 62, 63, 64, 65, 66, 67, 68]);
    expect(result.lesson.steps).toHaveLength(9);
    expect(result.lesson.steps.map((step) => step.id)).toEqual(U2L3_STEPS.map((step) => step.id));
    expect(result.lesson.testId).toBeUndefined();

    // Earlier lessons keep their own titles, ranges, step counts and tests.
    expect(getLessonById('unit2-lesson1')!.lesson.steps).toHaveLength(11);
    expect(getLessonById('unit2-lesson2')!.lesson.steps).toHaveLength(11);
    expect(getLessonTestByLessonId('unit2-lesson2')).toBeDefined();
    expect(getLessonById('unit1-lesson-that-does-not-exist')).toBeNull();
    expect(ALL_ASSESSMENTS.some((test) => test.lessonId === 'unit2-lesson3')).toBe(false);
  });

  it('keeps the curriculum audit error-free with no invented lesson test or answer key', () => {
    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, []);
    expect(audit.errorsCount).toBe(0);
    expect(audit.totalLessons).toBe(6);
  });

  it('covers all eight pages in printed order with unique, traceable activities', () => {
    expect(U2L3_COVERAGE.discovered).toBe(U2L3_ACTIVITIES.length);
    expect(U2L3_COVERAGE.discovered).toBe(43);
    expect(U2L3_COVERAGE.pages).toEqual([61, 62, 63, 64, 65, 66, 67, 68]);
    expect(new Set(U2L3_ACTIVITIES.map((activity) => activity.id)).size).toBe(U2L3_ACTIVITIES.length);
    expect(new Set(U2L3_ACTIVITIES.map((activity) => activity.sourceActivityId)).size).toBe(U2L3_ACTIVITIES.length);
    U2L3_ACTIVITIES.forEach((activity) => {
      expect(activity.instruction.trim().length).toBeGreaterThan(0);
      expect(activity.source.pageNumber).toBe(activity.page);
      expect(activity.source.readabilityVerified).toBe(true);
      // No answer key anywhere in the lesson data.
      expect(Object.keys(activity)).not.toContain('answerKey');
      expect(Object.keys(activity)).not.toContain('correctChoiceId');
    });
  });

  it('wires every step to its blocks and every activity block to a registered activity', () => {
    U2L3_STEPS.forEach((step) => {
      const content = U2L3_STEP_CONTENT[step.id];
      expect(content).toBeDefined();
      expect(content.blocks.length).toBeGreaterThan(0);
      content.blocks.forEach((block) => {
        if (block.kind === 'activity') expect(U2L3_ACTIVITY_BY_ID[block.activityId]).toBeDefined();
      });
    });
    const referenced = U2L3_STEPS.flatMap((step) =>
      U2L3_STEP_CONTENT[step.id].blocks.filter((block) => block.kind === 'activity').map((block) => block.activityId),
    );
    expect(new Set(referenced).size).toBe(U2L3_ACTIVITIES.length);
    expect(referenced.length).toBe(U2L3_ACTIVITIES.length);
  });

  it('resolves the riddle words from the extra crop and marks only what is still unreadable', () => {
    // ص٦١: اللفظان ثُبِتا من image-9.png، فحُذفت علامة عدم الحسم من هذا الموضع وحده.
    expect(U2L3_SOURCE_TEXT.openingRiddle).toBe('خيرُ جَليسٍ ... أُنْسٌ وَوَنِيسٌ، فَمَنْ أنا؟');
    expect(U2L3_SOURCE_TEXT.openingRiddle).not.toContain('[موضع غير محسوم بصرياً]');
    expect(U2L3_LOCKED_SOURCE_NOTES.openingRiddle).toContain('image-9.png');
    // ص٦٢: الشطر الثاني مؤكَّد، والكلمة الأخيرة من الشطر الأول لا تزال معلّمة.
    expect(U2L3_POEM.stanzas[5].left).toBe('فاحْذَرُوا العُجْمَةَ دابا');
    expect(U2L3_POEM.stanzas[5].right).toContain('[موضع غير محسوم بصرياً]');
    expect(U2L3_LOCKED_SOURCE_NOTES.poemLastStanza).toContain('غير محسومة');
    expect(U2L3_LOCKED_SOURCE_NOTES.handwritingWords).toContain('لا يستطيع');
    expect(U2L3_COVERAGE.withDeclaredGap).toBeGreaterThan(0);
  });

  it('shows lesson 3 on the Unit 2 page in the correct order and opens it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'عرض دروس الوحدة الثانية' }));
    expect(screen.getByRole('heading', { level: 1, name: /الوحدة الثانية/ })).toBeInTheDocument();
    const rows = document.querySelectorAll('.unit-page-lesson-row .unit-page-lesson-copy h3');
    expect(Array.from(rows).map((row) => row.textContent)).toEqual([
      'مُخْتَرِعٌ مِنْ بِلَادِي', 'الذَّكاءُ الاصطِناعيُّ', 'بِالْعِلْمِ تَرْقَى',
    ]);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 3: بِالْعِلْمِ تَرْقَى/ }));
    expect(document.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 1 من 9');
    expect(screen.getByText(/أَصِفُ ما أُشاهِدُهُ في الصُّورَتَيْنِ/)).toBeInTheDocument();
    expect(screen.getAllByText(/افتتاح الدرس/)[0]).toBeInTheDocument();
    expect(screen.getByText(/وصف الصورتين المطبوعتين/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'العودة إلى صفحة الوحدة' })).toBeInTheDocument();
  });

  it('supports step navigation, previous/next, and the saved learning position', () => {
    const { lesson, unit } = getLessonById('unit2-lesson3')!;
    const first = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(document.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 1 من 9');
    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 2' }));
    expect(readLearningLocation()).toEqual({ unitId: 'unit2', lessonId: 'unit2-lesson3', stepId: 'u2l3-s2' });
    expect(screen.getByText(/أَيُّهَا الطّالِبُ مَهْلًا/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الخطوة 1' }));
    expect(screen.getByRole('button', { name: /^الخطوة 1:/ })).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    expect(readLearningLocation()?.stepId).toBe('u2l3-s4');
    first.unmount();

    const resumed = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(resumed.container.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 4 من 9');
  });

  it('restores an activity draft from the shared sessionStorage mechanism', () => {
    expect(writeLearningLocation({ unitId: 'unit2', lessonId: 'unit2-lesson3', stepId: 'u2l3-s1' })).toBe(true);
    const { lesson, unit } = getLessonById('unit2-lesson3')!;
    const first = render(<LessonFlow lesson={lesson} unit={unit} />);
    const section = screen.getByLabelText('نشاط المصدر U2L3-61-01');
    const field = within(section).getByLabelText('وصف الصورتين') as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: 'مسودة وصف الصورتين' } });
    expect(window.sessionStorage.getItem(draftKey('unit2lesson3', 'U2L3-61-01'))).toContain('مسودة وصف الصورتين');
    fireEvent.click(within(section).getByRole('button', { name: 'حفظ مسودة إجابتي' }));
    expect(within(section).getByRole('status')).toHaveTextContent('حُفظت مسودتك');

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2:/ }));
    first.unmount();
    window.sessionStorage.setItem('arabic-grade5-learning-location-v1', JSON.stringify({
      unitId: 'unit2', lessonId: 'unit2-lesson3', stepId: 'u2l3-s1',
    }));
    render(<LessonFlow lesson={lesson} unit={unit} />);
    const restored = screen.getByLabelText('نشاط المصدر U2L3-61-01');
    expect(within(restored).getByLabelText('وصف الصورتين')).toHaveValue('مسودة وصف الصورتين');
  });

  it('renders source text and platform notes as distinct layers, with no grading or answer reveal', () => {
    const { lesson, unit } = getLessonById('unit2-lesson3')!;
    const { container } = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(container.querySelectorAll('.l2-source-info').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.block-explanation.l2-platform-explanation').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.source-badge').length).toBeGreaterThan(0);
    expect(screen.queryByText(/الإجابة الصحيحة/)).toBeNull();
    expect(screen.queryByRole('button', { name: /تحقق من إجابتي/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /عرض الإجابة/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /بدء اختبار الدرس/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 9:/ }));
    expect(screen.queryByRole('button', { name: /بدء اختبار الدرس/ })).toBeNull();
  });
});
