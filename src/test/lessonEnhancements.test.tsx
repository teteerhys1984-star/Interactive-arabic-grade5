import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { StepRenderer } from '../components/curriculum/StepRenderer';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import { curriculumRegistry, getLessonById } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { auditCurriculum } from '../utils/audit';
import { LESSON1_STEP_CONTENT, LESSON1_STEPS } from '../data/lesson1/content';
import { COVERAGE, TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { LESSON1_IRAB } from '../data/lesson1/irab';
import { LESSON1_TEST } from '../data/lesson1/lessonTest';
import { SOURCE_UNCERTAINTIES } from '../data/lesson1/sourceMeta';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import {
  GRAMMAR_EXAMPLE_GROUPS,
  GRAMMAR_PLATFORM_EXPLANATION,
  HAMZA_EXAMPLES,
  LESSON1_VOCABULARY_EXPLANATIONS,
  SPELLING_PLATFORM_EXPLANATION,
} from '../data/lesson1/platformExplanations';

const lesson = getLessonById('lesson1')!.lesson;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Lesson side navigation', () => {
  it('shows a right-to-left lesson rail with current and remaining step states', () => {
    const { container } = render(<LessonFlow lesson={lesson} />);
    const rail = screen.getByRole('navigation', { name: 'مسار الدرس' });
    const buttons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });

    expect(container.querySelector('.lesson-shell')).toHaveAttribute('dir', 'rtl');
    expect(buttons).toHaveLength(10);
    expect(buttons[0]).toHaveAttribute('aria-current', 'step');
    expect(buttons[0]).toHaveAccessibleName(/الخطوة الحالية/);
    expect(buttons[1]).toHaveAccessibleName(/لم تُنجز بعد/);
    expect(rail).toContainElement(buttons[0]);
    expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuemax', '10');
    expect(screen.getByLabelText('اختر خطوة للانتقال إليها')).toBeInTheDocument();
  });

  it('preserves free navigation and updates active/visited states and progress', () => {
    render(<LessonFlow lesson={lesson} />);
    const buttons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });

    fireEvent.click(buttons[3]);

    expect(buttons[3]).toHaveAttribute('aria-current', 'step');
    expect(buttons[0]).toHaveAccessibleName(/سبق عرضها/);
    expect(buttons[1]).toHaveAccessibleName(/لم تُنجز بعد/);
    expect(buttons[2]).toHaveAccessibleName(/لم تُنجز بعد/);
    expect(buttons[4]).toHaveAccessibleName(/لم تُنجز بعد/);
    expect(screen.getAllByRole('progressbar').every((bar) => bar.getAttribute('aria-valuenow') === '2')).toBe(true);
    expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuetext', 'تمت زيارة 2 من 10 خطوة؛ موضعك الحالي الخطوة 4 من 10');

    // The existing product permits selecting later steps; preserve that behavior.
    fireEvent.click(buttons[9]);
    expect(buttons[9]).toHaveAttribute('aria-current', 'step');
    expect(buttons[3]).toHaveAccessibleName(/سبق عرضها/);
    expect(buttons[8]).toHaveAccessibleName(/لم تُنجز بعد/);
    expect(screen.getAllByRole('progressbar').every((bar) => bar.getAttribute('aria-valuenow') === '3')).toBe(true);
    expect(screen.getByRole('button', { name: 'بدء اختبار الدرس، عشرون سؤالاً' })).toBeInTheDocument();
  });

  it('supports arrow, Home and End keyboard navigation with visible focus target', () => {
    render(<LessonFlow lesson={lesson} />);
    const buttons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(buttons[1]).toHaveFocus();
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');

    fireEvent.keyDown(buttons[1], { key: 'End' });
    expect(buttons[9]).toHaveFocus();
    expect(buttons[9]).toHaveAttribute('aria-current', 'step');

    fireEvent.keyDown(buttons[9], { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
    expect(buttons[0]).toHaveAttribute('aria-current', 'step');
  });

  it('mobile step picker tracks the same state and previous/next controls work', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    render(<LessonFlow lesson={lesson} />);
    const select = screen.getByLabelText('اختر خطوة للانتقال إليها') as HTMLSelectElement;

    expect(select.options).toHaveLength(10);
    fireEvent.change(select, { target: { value: '5' } });
    expect(select.value).toBe('5');
    expect(screen.getByRole('button', { name: /^الخطوة 6:/ })).toHaveAttribute('aria-current', 'step');

    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الخطوة 5' }));
    expect(screen.getByRole('button', { name: /^الخطوة 5:/ })).toHaveAttribute('aria-current', 'step');
    expect(scrollTo).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 6' }));
    expect(screen.getByRole('button', { name: /^الخطوة 6:/ })).toHaveAttribute('aria-current', 'step');
  });
});

describe('Lesson 1 platform explanations', () => {
  it('covers the grammar concepts and all currently represented i‘rab items with ordered details', () => {
    expect(GRAMMAR_PLATFORM_EXPLANATION.concept).toContain('اسمية');
    expect(GRAMMAR_PLATFORM_EXPLANATION.identificationSteps).toHaveLength(3);
    expect(GRAMMAR_PLATFORM_EXPLANATION.caseMarkers.map((marker) => marker.title)).toEqual(
      expect.arrayContaining(['الرَّفْع — الضمة', 'النَّصْب — الفتحة', 'الجَرّ — الكسرة']),
    );
    expect(GRAMMAR_EXAMPLE_GROUPS.flatMap((group) => group.examples)).toHaveLength(11);

    expect(LESSON1_IRAB).toHaveLength(8);
    LESSON1_IRAB.forEach((record) => {
      expect(record.sentence).toBeTruthy();
      expect(record.wordBreakdown.length).toBeGreaterThanOrEqual(2);
      record.wordBreakdown.forEach((word) => {
        expect(word.word).toBeTruthy();
        expect(word.type).toBeTruthy();
        expect(word.position).toBeTruthy();
        expect(word.recognition).toBeTruthy();
        expect(word.irab).toBeTruthy();
        expect(word.sign).toBeTruthy();
        expect(word.signReason).toBeTruthy();
      });
    });
    expect(LESSON1_IRAB.find((record) => record.id === 'irab-8')?.wordBreakdown[1].sign).toContain('حذف حرف العلة');
    expect(LESSON1_IRAB.every((record) => record.source.readabilityVerified)).toBe(true);
    expect(LESSON1_IRAB.find((record) => record.id === 'irab-5')?.source.pageNumber).toBe(5);
    expect(LESSON1_IRAB.find((record) => record.id === 'irab-8')?.source.sourceType).toBe('textbook_exercise');
  });

  it('renders platform grammar support and a usable quick check without relabelling the textbook rule', () => {
    const grammarStep = lesson.steps.find((step) => step.id === 'l1-s6')!;
    render(<StepRenderer step={grammarStep} />);

    expect(screen.getByRole('heading', { name: 'كيف أميّز الجملة الاسمية من الفعلية؟' })).toBeInTheDocument();
    expect(screen.getByText('شرح المنصة — القواعد')).toBeInTheDocument();
    expect(screen.getByText('القاعدة (من الكتاب)')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'إعراب الجمل الواردة في الدرس، كلمةً كلمة' })).toBeInTheDocument();
    expect(screen.getAllByText('النص الأصلي من الكتاب').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'جملة فعلية' }));
    expect(screen.getByRole('status')).toHaveTextContent('صحيح: أول كلمة أساسية');
  });

  it('teaches only the initial hamza categories present in the lesson and checks application', () => {
    const spellingStep = lesson.steps.find((step) => step.id === 'l1-s7')!;
    render(<StepRenderer step={spellingStep} />);

    expect(HAMZA_EXAMPLES.some((example) => example.type === 'قطع')).toBe(true);
    expect(HAMZA_EXAMPLES.some((example) => example.type === 'وصل')).toBe(true);
    expect(SPELLING_PLATFORM_EXPLANATION.concept).toContain('الهمزة الأولية');
    expect(SPELLING_PLATFORM_EXPLANATION.concept).not.toMatch(/المتوسطة|المتطرفة/);
    expect(screen.getByRole('heading', { name: 'الهمزة الأولية: أقطع أم أصل؟' })).toBeInTheDocument();
    expect(screen.getAllByText(/إِسْهامِها.*إِنْجازاتِهِمْ/).length).toBeGreaterThan(0);
    expect(screen.getByText('أَقْرَأُ المِثالَيْنِ الآتِيَيْنِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:')).toBeInTheDocument();
    expect(screen.getByLabelText('نشاط ٤')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'همزة وصل' }));
    expect(screen.getByRole('status')).toHaveTextContent('أحسنت');
  });

  it('provides contextual vocabulary while retaining the exact glossary wording as a source-labelled layer', () => {
    expect(LESSON1_VOCABULARY_EXPLANATIONS.length).toBeGreaterThanOrEqual(8);
    expect(LESSON1_VOCABULARY_EXPLANATIONS.find((item) => item.id === 'al-maghza')?.sourceMeaning).toBe('المَقْصَدُ');
    expect(LESSON1_VOCABULARY_EXPLANATIONS.find((item) => item.id === 'qaddat')?.contextualMeaning).toContain('لا يتضمن الجملة كاملة');

    const readingStep = lesson.steps.find((step) => step.id === 'l1-s3')!;
    render(<StepRenderer step={readingStep} />);
    expect(screen.getByRole('heading', { name: 'أفهم الكلمة من معناها وسياقها' })).toBeInTheDocument();
    expect(screen.getAllByText('النص الأصلي من الكتاب').length).toBeGreaterThan(0);
    expect(screen.getByText('المَغْزى:')).toBeInTheDocument();
    expect(screen.getByText('شرح المنصة — المفردات')).toBeInTheDocument();
  });
});

describe('Curriculum, assessment and source-fidelity checks', () => {
  it('keeps all 39 textbook activities represented once, with their original source references', () => {
    expect(TEXTBOOK_ACTIVITIES).toHaveLength(39);
    expect(COVERAGE.discovered).toBe(39);
    expect(COVERAGE.implemented).toBe(39);
    expect(COVERAGE.teacherSolutions).toBe(39);
    expect(COVERAGE.unresolved).toBe(0);

    const activityIds = LESSON1_STEPS.flatMap((step) =>
      LESSON1_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => block.kind === 'activity' ? block.activityId : ''),
    );
    expect(activityIds).toHaveLength(39);
    expect(new Set(activityIds).size).toBe(39);
    expect(new Set(activityIds)).toEqual(new Set(TEXTBOOK_ACTIVITIES.map((activity) => activity.id)));

    LESSON1_STEPS.forEach((step) => {
      LESSON1_STEP_CONTENT[step.id].blocks.forEach((block) => {
        if (block.kind !== 'activity' && block.kind !== 'explanation') {
          expect(block.source.readabilityVerified).toBe(true);
        }
      });
    });
    expect(SOURCE_UNCERTAINTIES).toHaveLength(1);
    expect(SOURCE_UNCERTAINTIES[0].page).toBe(11);
    const uncertainActivity = TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p11-1')!;
    expect(uncertainActivity.uncertain).toBeTruthy();
    expect(uncertainActivity.source.uncertaintyNote).toBeTruthy();
  });

  it('correctly classifies written hamza forms and preserves the 20-question assessment blueprint', () => {
    const classificationActivity = TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p9-4')!;
    expect(classificationActivity.interaction.kind).toBe('classify');
    if (classificationActivity.interaction.kind === 'classify') {
      expect(classificationActivity.interaction.items.find((item) => item.id === 'w3')?.correctCategoryId).toBe('qata');
    }
    expect(TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p9-5')?.solution.answer).toContain('اسْتَفِدْ');
    expect(TEXTBOOK_ACTIVITIES.find((activity) => activity.id === 'a-p9-5')?.solution.explanation).toMatch(/إِنْجازاتِهِمْ.*همزة قطع/);

    expect(LESSON1_TEST.questions).toHaveLength(20);
    expect(new Set(LESSON1_TEST.questions.map((question) => question.id)).size).toBe(20);
    expect(LESSON1_TEST.questions.map((question) => question.order)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    const hamzaQuestion = LESSON1_TEST.questions.find((question) => question.id === 'l1-t-14')!;
    expect(hamzaQuestion.prompt).toContain('اسْتَفِدْ');
    expect(hamzaQuestion.explanation).toContain('همزة قطع مكسورة');
    expect(LESSON1_TEACHER_GUIDE.exerciseSolutions).toHaveLength(39);
    const assessmentAudit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, [LESSON1_TEACHER_GUIDE]);
    expect(assessmentAudit.errorsCount).toBe(0);
    expect(assessmentAudit.issues.some((issue) => issue.severity === 'warning' && issue.message.includes('صفحة 11'))).toBe(true);
  });

  it('keeps the full Test Solutions content and does not mark Unit 1 complete', () => {
    render(<TestSolutions test={LESSON1_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(20);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(20);
    expect(getLessonById('lesson1')!.unit.metadata.isComplete).toBe(false);
    expect(getLessonById('lesson1')!.unit.unitTestId).toBeUndefined();
  });

  it('retains every Teacher Area exercise solution and remains auditable', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={[LESSON1_TEACHER_GUIDE]}
        tests={ALL_ASSESSMENTS}
      />,
    );
    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(39);
    expect(screen.getByText('الأهداف التربوية')).toBeInTheDocument();
  });
});
