import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { Unit3Lesson1StepRenderer } from '../components/curriculum/Unit3Lesson1StepRenderer';
import { SourceBadge } from '../components/common/SourceBadge';
import {
  curriculumRegistry,
  getLessonById,
  getUnitById,
  isUnitTestAvailable,
} from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { U3L1_ACTIVITIES, U3L1_ACTIVITY_BY_ID, U3L1_COVERAGE } from '../data/unit3Lesson1/activities';
import { U3L1_POEM, U3L1_SOURCE_TEXT, U3L1_STEPS, U3L1_STEP_CONTENT } from '../data/unit3Lesson1/content';
import { U3L1_LOCKED_SOURCE_NOTES } from '../data/unit3Lesson1/sourceMeta';
import { auditCurriculum } from '../utils/audit';
import { readLearningLocation, writeLearningLocation } from '../utils/learningProgress';
import { draftKey } from '../utils/draftStorage';

afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

describe('Unit 3 Lesson 1 — العُلَماءُ الصِّغار (ص٧٣–٨٣)', () => {
  it('registers the first lesson of Unit 3, extends the range to 83, and keeps the unit incomplete', () => {
    const unit3 = getUnitById('unit3')!;
    expect(unit3.lessons.map((lesson) => lesson.metadata.id)).toEqual(['unit3-lesson1']);
    expect(unit3.metadata.sourcePagesRange).toEqual({ startPage: 73, endPage: 83 });
    expect(unit3.metadata.isComplete).toBe(false);
    expect(unit3.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit3')).toBe(false);
    expect(unit3.metadata.theme).toBeUndefined();

    const result = getLessonById('unit3-lesson1')!;
    expect(result.unit.metadata.id).toBe('unit3');
    expect(result.lesson.metadata.title).toBe('العُلَماءُ الصِّغارُ');
    expect(result.lesson.metadata.order).toBe(1);
    expect(result.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual([73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]);
    expect(result.lesson.steps).toHaveLength(11);
    expect(result.lesson.steps.map((step) => step.id)).toEqual(U3L1_STEPS.map((step) => step.id));
    expect(result.lesson.testId).toBeUndefined();

    // Earlier units keep their own titles, ranges, step counts and tests.
    expect(getLessonById('unit2-lesson3')!.lesson.steps).toHaveLength(9);
    expect(getLessonTestByLessonId('unit2-lesson2')).toBeDefined();
    expect(getLessonById('unit3-lesson-that-does-not-exist')).toBeNull();
    expect(ALL_ASSESSMENTS.some((test) => test.lessonId === 'unit3-lesson1')).toBe(false);
  });

  it('attributes the independent summary to the platform without a printed page', () => {
    const summary = U3L1_STEPS.find((step) => step.id === 'u3l1-s11')!;
    expect(summary.source).toEqual({
      documentTitle: 'شرح المنصة',
      sourceType: 'enrichment',
      sectionName: 'خلاصة الدرس',
    });
    const { container } = render(<SourceBadge source={summary.source!} />);
    expect(container.querySelector('.source-doc')).toHaveTextContent('شرح المنصة');
    expect(container.querySelector('.source-page')).toBeNull();
  });

  it('keeps handwriting manual on ruled paper and uses the field only for notes', () => {
    const handwritingStep = U3L1_STEPS.find((step) => step.id === 'u3l1-s8')!;
    render(<Unit3Lesson1StepRenderer step={handwritingStep} />);
    expect(screen.getAllByLabelText(/ملاحظاتك حول التدريب/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/يُكتب.*ورقة مسطّرة|يُكتَب.*ورقة مسطّرة|يُنفّذ.*ورقة مسطّرة/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/محاكاتك رقمياً/)).toBeNull();
  });

  it('keeps the curriculum audit error-free with no invented lesson test or answer key', () => {
    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, []);
    expect(audit.errorsCount).toBe(0);
    expect(audit.totalLessons).toBe(7);
  });

  it('covers all eleven pages in printed order with unique, traceable activities', () => {
    expect(U3L1_COVERAGE.discovered).toBe(U3L1_ACTIVITIES.length);
    expect(U3L1_COVERAGE.discovered).toBe(57);
    expect(U3L1_COVERAGE.pages).toEqual([73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]);
    expect(new Set(U3L1_ACTIVITIES.map((activity) => activity.id)).size).toBe(U3L1_ACTIVITIES.length);
    expect(new Set(U3L1_ACTIVITIES.map((activity) => activity.sourceActivityId)).size).toBe(U3L1_ACTIVITIES.length);
    U3L1_ACTIVITIES.forEach((activity) => {
      expect(activity.instruction.trim().length).toBeGreaterThan(0);
      expect(activity.source.pageNumber).toBe(activity.page);
      expect(activity.source.readabilityVerified).toBe(true);
      // No answer key anywhere in the lesson data.
      expect(Object.keys(activity)).not.toContain('answerKey');
      expect(Object.keys(activity)).not.toContain('correctChoiceId');
    });
  });

  it('wires every step to its blocks and every activity block to a registered activity', () => {
    U3L1_STEPS.forEach((step) => {
      const content = U3L1_STEP_CONTENT[step.id];
      expect(content).toBeDefined();
      expect(content.blocks.length).toBeGreaterThan(0);
      content.blocks.forEach((block) => {
        if (block.kind === 'activity') expect(U3L1_ACTIVITY_BY_ID[block.activityId]).toBeDefined();
      });
    });
    const referenced = U3L1_STEPS.flatMap((step) =>
      U3L1_STEP_CONTENT[step.id].blocks.filter((block) => block.kind === 'activity').map((block) => block.activityId),
    );
    expect(new Set(referenced).size).toBe(U3L1_ACTIVITIES.length);
    expect(referenced.length).toBe(U3L1_ACTIVITIES.length);
  });

  it('keeps the poem and listening limits declared, with no invented listening text', () => {
    expect(U3L1_POEM.stanzas).toHaveLength(8);
    expect(U3L1_POEM.stanzas[5].left).toBe('وَسَعَادَتُنا أَنَّا... نَعْمَلُ');
    expect(U3L1_POEM.poet).toBe('إبراهيم فهد منصور');
    expect(U3L1_SOURCE_TEXT.letterModel[0]).toBe('دمشق ٢٠١٨/٢/٢٦');
    expect(U3L1_LOCKED_SOURCE_NOTES.poemListeningRelation).toContain('لا تُنسب');
    expect(U3L1_COVERAGE.withDeclaredGap).toBeGreaterThan(0);
  });

  it('shows lesson 1 on the Unit 3 page in the correct order and opens it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'عرض دروس الوحدة الثالثة' }));
    expect(screen.getByRole('heading', { level: 1, name: /الوحدة الثالثة/ })).toBeInTheDocument();
    const rows = document.querySelectorAll('.unit-page-lesson-row .unit-page-lesson-copy h3');
    expect(Array.from(rows).map((row) => row.textContent)).toEqual(['العُلَماءُ الصِّغارُ']);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 1: العُلَماءُ الصِّغارُ/ }));
    expect(document.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 1 من 11');
    expect(screen.getByText(/أَعُدُّ عَناصِرَ الصُّورَتَيْنِ/)).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'العودة إلى صفحة الوحدة' })).toBeInTheDocument();
  });

  it('supports step navigation, previous/next, and the saved learning position', () => {
    const { lesson, unit } = getLessonById('unit3-lesson1')!;
    const first = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(document.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 1 من 11');
    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 2' }));
    expect(readLearningLocation()).toEqual({ unitId: 'unit3', lessonId: 'unit3-lesson1', stepId: 'u3l1-s2' });
    expect(screen.getByText(/نَسْمُو لِلأَقْمَارِ/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الخطوة 1' }));
    expect(screen.getByRole('button', { name: /^الخطوة 1:/ })).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    expect(readLearningLocation()?.stepId).toBe('u3l1-s4');
    first.unmount();

    const resumed = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(resumed.container.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 4 من 11');
  });

  it('restores an activity draft from the shared sessionStorage mechanism', () => {
    expect(writeLearningLocation({ unitId: 'unit3', lessonId: 'unit3-lesson1', stepId: 'u3l1-s1' })).toBe(true);
    const { lesson, unit } = getLessonById('unit3-lesson1')!;
    const first = render(<LessonFlow lesson={lesson} unit={unit} />);
    const section = screen.getByLabelText('نشاط المصدر U3L1-73-01');
    const field = within(section).getByLabelText('عناصر الصورتين') as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: 'مسودة عناصر الصورتين' } });
    expect(window.sessionStorage.getItem(draftKey('unit3lesson1', 'U3L1-73-01'))).toContain('مسودة عناصر الصورتين');
    fireEvent.click(within(section).getByRole('button', { name: 'حفظ مسودة إجابتي' }));
    expect(within(section).getByRole('status')).toHaveTextContent('حُفظت مسودتك');

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2:/ }));
    first.unmount();
    window.sessionStorage.setItem('arabic-grade5-learning-location-v1', JSON.stringify({
      unitId: 'unit3', lessonId: 'unit3-lesson1', stepId: 'u3l1-s1',
    }));
    render(<LessonFlow lesson={lesson} unit={unit} />);
    const restored = screen.getByLabelText('نشاط المصدر U3L1-73-01');
    expect(within(restored).getByLabelText('عناصر الصورتين')).toHaveValue('مسودة عناصر الصورتين');
  });

  it('renders source text and platform notes as distinct layers, with no grading or answer reveal', () => {
    const { lesson, unit } = getLessonById('unit3-lesson1')!;
    const { container } = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(container.querySelectorAll('.l2-source-info').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.block-explanation.l2-platform-explanation').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.source-badge').length).toBeGreaterThan(0);
    expect(screen.queryByText(/الإجابة الصحيحة/)).toBeNull();
    expect(screen.queryByRole('button', { name: /تحقق من إجابتي/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /عرض الإجابة/ })).toBeNull();
    expect(container).not.toHaveTextContent(/image-\d+|OCR/i);
  });

  it('declares every source gap as a platform note and keeps learner work blank', () => {
    const view = render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[0]} />);
    U3L1_STEPS.forEach((step) => {
      view.rerender(<Unit3Lesson1StepRenderer step={step} />);
      const blocks = U3L1_STEP_CONTENT[step.id].blocks;
      const gapBlocks = blocks.filter((block) => block.kind === 'source_info' && block.gap);
      const gapActivities = blocks.filter((block) => block.kind === 'activity' && U3L1_ACTIVITY_BY_ID[block.activityId]?.gapNote);
      expect(view.container.querySelectorAll('.l2-source-gap-panel')).toHaveLength(gapBlocks.length);
      expect(view.container.querySelectorAll('.l2-activity-gap .l2-gap-notice')).toHaveLength(gapActivities.length);
      view.container.querySelectorAll('.l2-source-gap-panel').forEach((panel) => {
        expect(panel.querySelector('.block-source-head')).toHaveTextContent('ملاحظة المنصة');
        expect(panel.querySelector('.source-badge')).toBeInTheDocument();
        expect(panel.querySelector('h3')).toHaveTextContent('حدّ مصدر معلن');
      });
      view.container.querySelectorAll('.l2-activity-gap .l2-gap-notice').forEach((notice) => {
        expect(notice.querySelector('strong')).toHaveTextContent('ملاحظة المنصة');
        expect(notice).not.toHaveTextContent('حدّ مصدر معلن');
      });
      view.container.querySelectorAll('.l2-platform-explanation').forEach((note) => {
        expect(note.querySelector('.source-label-explain')).toHaveTextContent('ملاحظة المنصة');
      });
      expect(view.container).not.toHaveTextContent(/image-\d+|OCR|١٢٠٠٪|1200%/i);
    });
  });

  it('keeps ordinary source labels, the poem, and blank learner work intact', () => {
    const view = render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[0]} />);
    const opening = screen.getByRole('heading', { name: 'افتتاح الدرس (من الكتاب)' }).closest('section')!;
    expect(within(opening).getByText('مادة موثقة من الكتاب')).toBeInTheDocument();
    expect(within(opening).getByText(U3L1_SOURCE_TEXT.lessonTitle)).toBeInTheDocument();
    view.rerender(<Unit3Lesson1StepRenderer step={U3L1_STEPS[1]} />);
    expect(screen.getByText(/وَسَعَادَتُنا أَنَّا/)).toBeInTheDocument();
    view.rerender(<Unit3Lesson1StepRenderer step={U3L1_STEPS[5]} />);
    const table = screen.getByLabelText('نشاط المصدر U3L1-78-01');
    expect(within(table).queryByRole('button', { name: /تحقق|الإجابة/ })).toBeNull();
    view.rerender(<Unit3Lesson1StepRenderer step={U3L1_STEPS[9]} />);
    const play = screen.getByLabelText('نشاط المصدر U3L1-83-01');
    expect(within(play).queryByRole('note')).toBeNull();
    const fields = within(play).getAllByRole('textbox');
    expect(fields).toHaveLength(1);
    fields.forEach((field) => expect(field).toHaveValue(''));
  });
});
