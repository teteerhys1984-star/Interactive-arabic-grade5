import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import {
  isU2L2TextAnswerCorrect,
  normalizeU2L2TextAnswer,
} from '../components/curriculum/Unit2Lesson2StepRenderer';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { curriculumRegistry, getLessonById, getUnitById, isUnitTestAvailable } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { U2L2_ACTIVITIES, U2L2_COVERAGE } from '../data/unit2Lesson2/activities';
import { U2L2_READING_TEXT, U2L2_SOURCE_RULES, U2L2_STEP_CONTENT, U2L2_STEPS } from '../data/unit2Lesson2/content';
import { U2L2_TEST } from '../data/unit2Lesson2/lessonTest';
import { U2L2_SOURCE_LOCK_IDS, auditU2L2Coverage } from '../data/unit2Lesson2/sourceAudit';
import { U2L2_TEACHER_GUIDE } from '../data/unit2Lesson2/teacherGuide';
import { U2L2_LISTENING_AUDIO_GAP } from '../data/unit2Lesson2/sourceMeta';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe('Unit 2 Lesson 2 — الذَّكاءُ الاصطِناعيُّ source-lock implementation', () => {
  it('keeps Unit 2 incomplete with no unit test while registering the second lesson', () => {
    const unit2 = getUnitById('unit2');
    expect(unit2).toBeDefined();
    expect(unit2!.metadata.order).toBe(2);
    expect(unit2!.metadata.title).toBe('الوحدة الثانية');
    expect(unit2!.metadata.theme).toBeUndefined();
    expect(unit2!.metadata.isComplete).toBe(false);
    expect(unit2!.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit2')).toBe(false);
    expect(unit2!.lessons.map((lesson) => lesson.metadata.id)).toEqual(['unit2-lesson1', 'unit2-lesson2']);

    const unit1 = getUnitById('unit1')!;
    expect(unit1.metadata.isComplete).toBe(true);
    expect(unit1.unitTestId).toBe('unit1-test');
  });

  it('registers the lesson with pages 50–60 and 11 steps', () => {
    const result = getLessonById('unit2-lesson2');
    expect(result).not.toBeNull();
    expect(result!.lesson.metadata.title).toBe('الذَّكاءُ الاصطِناعيُّ');
    expect(result!.lesson.metadata.order).toBe(2);
    expect(result!.lesson.metadata.unitId).toBe('unit2');
    expect(result!.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual(
      Array.from({ length: 11 }, (_, index) => index + 50),
    );
    expect(result!.lesson.steps).toHaveLength(11);
    expect(result!.lesson.steps.map((step) => step.id)).toEqual(U2L2_STEPS.map((step) => step.id));
  });

  it('maps exactly the 51 source-lock records to student activities, subparts, and teacher solutions', () => {
    expect(U2L2_SOURCE_LOCK_IDS).toHaveLength(51);
    expect(U2L2_ACTIVITIES).toHaveLength(51);
    expect(U2L2_COVERAGE.discovered).toBe(51);
    expect(U2L2_COVERAGE.studentActivities).toBe(51);
    expect(U2L2_COVERAGE.teacherSolutions).toBe(51);
    expect(U2L2_COVERAGE.explicitSourceGaps).toEqual([]);
    expect(new Set(U2L2_ACTIVITIES.map((activity) => activity.sourceActivityId))).toEqual(new Set(U2L2_SOURCE_LOCK_IDS));
    expect(U2L2_ACTIVITIES.every((activity) => activity.subparts.length > 0)).toBe(true);
    expect(U2L2_ACTIVITIES.every((activity) => activity.availability === 'available')).toBe(true);
    expect(U2L2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(51);
    expect(U2L2_TEACHER_GUIDE.sourceCoverage).toHaveLength(51);

    // Per-page distribution after adding the three page-55 grammar tasks and
    // moving the four-word table to page 56: 50→5, 51→2, 52→5, 53→5, 54→6,
    // 55→9 (6 spelling + 3 grammar), 56→4, 57→5, 58→4, 59→4, 60→2.
    const perPage = U2L2_ACTIVITIES.reduce<Record<number, number>>((acc, activity) => {
      acc[activity.page] = (acc[activity.page] ?? 0) + 1;
      return acc;
    }, {});
    expect(perPage).toEqual({ 50: 5, 51: 2, 52: 5, 53: 5, 54: 6, 55: 9, 56: 4, 57: 5, 58: 4, 59: 4, 60: 2 });

    const studentActivityIds = U2L2_STEPS.flatMap((step) =>
      (U2L2_STEP_CONTENT[step.id]?.blocks ?? [])
        .filter((block) => block.kind === 'activity')
        .map((block) => (block.kind === 'activity' ? block.activityId : '')),
    );
    expect(studentActivityIds).toHaveLength(51);
    expect(new Set(studentActivityIds)).toEqual(new Set(U2L2_ACTIVITIES.map((activity) => activity.id)));

    const report = auditU2L2Coverage(U2L2_TEACHER_GUIDE);
    expect(report.status).toBe('passed');
    expect(report.missingStudentActivities).toEqual([]);
    expect(report.missingTeacherSolutions).toEqual([]);
    expect(report.unmappedSubparts).toEqual([]);
  });

  it('keeps source limits explicit instead of inventing replacements', () => {
    expect(U2L2_LISTENING_AUDIO_GAP).toContain('ص٥١');
    const listening = U2L2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L2-50-04')!;
    expect(listening.teacher.explanation).toContain('التسجيل الصوتي غير متوفر');
    expect(listening.source.uncertaintyNote).toBeTruthy();

    const mindMap = U2L2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L2-52-05')!;
    expect(mindMap.source.uncertaintyNote).toContain('فارغة');

    const calligraphy = U2L2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L2-58-02')!;
    expect(calligraphy.interaction.kind).toBe('handwriting');
    expect(calligraphy.source.uncertaintyNote).toContain('رسوم خطية');

    // Verbatim reading passage and rule wording survive in the content layer.
    expect(U2L2_READING_TEXT.paragraphs.join(' ')).toContain('نعم، لكنَّني الأذكى');
    // The printed sentence begins «وَأَنتَ…»; assert the verbatim core without the hamza prefix.
    expect(U2L2_READING_TEXT.paragraphs.join(' ')).toContain('لا تقدِّمُ إلَّا ما أودَعَكَ الإنسانُ إيَّاهُ');
    expect(U2L2_SOURCE_RULES.grammarConversion).toContain('نُقَدِّمُ الفاعِلَ على الفِعلِ');
    expect(U2L2_SOURCE_RULES.marbuta.join(' ')).toContain('تُلفَظُ هاءً عندَ الوقفِ');
    expect(U2L2_SOURCE_RULES.calligraphyFaaida.join(' ')).toContain('مُرتَكِزاً على السَّطرِ');
  });

  it('opens the lesson from the home curriculum list without offering a Unit 2 test', () => {
    render(<App />);

    expect(screen.getByText('قيد التدريس (غير مكتملة)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /اختبار الوحدة الثانية/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /الذَّكاءُ الاصطِناعيُّ/ }));
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(11);
    expect(screen.getByLabelText('نشاط المصدر U2L2-50-01')).toBeInTheDocument();
  });

  it('renders the lesson in the established shell, and drafts survive step navigation', () => {
    const lesson = getLessonById('unit2-lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);

    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(11);
    expect(screen.getByText('الذَّكاءُ الاصطِناعيُّ')).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل الصوتي غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('نشاط المصدر U2L2-50-01')).toBeInTheDocument();

    const draft = screen.getByLabelText('برنامج أعرفه') as HTMLInputElement;
    fireEvent.change(draft, { target: { value: 'معالج النصوص' } });

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    expect(screen.getByLabelText('نشاط المصدر U2L2-52-01')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 1:/ }));
    expect(screen.getByLabelText('برنامج أعرفه')).toHaveValue('معالج النصوص');
  });

  it('does not reveal feedback or an explanation before the learner attempts a closed activity', () => {
    const lesson = getLessonById('unit2-lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);

    const activitySection = screen.getByLabelText('نشاط المصدر U2L2-50-04');
    // The rationale text must not be in the DOM before any attempt.
    expect(within(activitySection).queryByText(/فالإجابة المعتمدة/)).toBeNull();
    expect(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' })).toBeDisabled();

    // Wrong classification first.
    fireEvent.change(within(activitySection).getByLabelText('تصنيف مراد سامي من جلوسه أمام حاسبه'), { target: { value: 'game' } });
    fireEvent.click(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(activitySection).getByRole('status')).toHaveTextContent('من 1 عناصر');

    fireEvent.click(within(activitySection).getByRole('button', { name: 'اعرض التفسير التعليمي' }));
    expect(within(activitySection).getByText(/فالإجابة المعتمدة/)).toBeInTheDocument();

    // Retry reaches full correctness.
    fireEvent.change(within(activitySection).getByLabelText('تصنيف مراد سامي من جلوسه أمام حاسبه'), { target: { value: 'family' } });
    fireEvent.click(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(activitySection).getByRole('status')).toHaveTextContent('صحيحة');
  });

  it('keeps the approved answer out of the DOM until «أظهر الجواب» is pressed', () => {
    const lesson = getLessonById('unit2-lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);

    // The closed table activity lives on step 3; navigate there first.
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    const closed = screen.getByLabelText('نشاط المصدر U2L2-52-01');
    // The model answer (مفرد نواقل) must not appear before pressing the button.
    expect(within(closed).queryByText(/ناقِلَة/)).toBeNull();
    fireEvent.click(within(closed).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(closed).getAllByText(/ناقِلَة/).length).toBeGreaterThan(0);

    // An open/performance activity (step 1) shows guidance, never an internal teacher note.
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 1:/ }));
    const open = screen.getByLabelText('نشاط المصدر U2L2-50-01');
    fireEvent.click(within(open).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(open).getByText('إرشادات للإجابة')).toBeInTheDocument();
  });

  it('gate-checks comprehension with a platform check before showing its explanation', () => {
    const lesson = getLessonById('unit2-lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2:/ }));

    const verifyButtons = screen.getAllByRole('button', { name: 'تحقق من إجابتي' });
    expect(verifyButtons.length).toBeGreaterThan(0);
    expect(screen.queryByText(/أما اللعب ومكالمة الأصدقاء فلم يردا/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /رسالة تهنئ الناس بالعيد/ }));
    fireEvent.click(verifyButtons[0]);
    expect(screen.getByText(/أما اللعب ومكالمة الأصدقاء فلم يردا/)).toBeInTheDocument();
  });

  it('has an auditable, correctly distributed 20-question lesson test', () => {
    expect(getLessonTestByLessonId('unit2-lesson2')).toBe(U2L2_TEST);
    expect(U2L2_TEST.questions).toHaveLength(20);
    expect(U2L2_TEST.questions.map((question) => question.order)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
    expect(new Set(U2L2_TEST.questions.map((question) => question.id)).size).toBe(20);
    expect(U2L2_TEST.questions.every((question) => question.source.pageNumber >= 50 && question.source.pageNumber <= 60)).toBe(true);

    const countDifficulty = (difficulty: string) =>
      U2L2_TEST.questions.filter((question) => question.difficulty === difficulty).length;
    expect(countDifficulty('basic')).toBe(6);
    expect(countDifficulty('medium')).toBe(7);
    expect(countDifficulty('advanced')).toBe(4);
    expect(countDifficulty('thinking')).toBe(3);

    const audit = auditCurriculum(
      curriculumRegistry,
      ALL_ASSESSMENTS,
      [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE, U2L1_TEACHER_GUIDE, U2L2_TEACHER_GUIDE],
    );
    expect(audit.errorsCount).toBe(0);
  });

  it('uses matching, classification, fill-blank and correction keys that the evaluator can score', () => {
    const answers = {
      'u2l2-t-07': { 'نَواقِلُ': 'ناقِلَةٌ', 'داراتٌ': 'دارَةٌ', 'حَواسِبُ': 'حاسِبٌ', 'رَسائِلُ': 'رِسالَةٌ' },
      'u2l2-t-10': { inbathaqat: 'basita', risala: 'marbuta', umniyat: 'basita', madrasa: 'marbuta' },
      'u2l2-t-05': 'أمنية',
      'u2l2-t-14': 'a',
    };
    const targetedTest = {
      ...U2L2_TEST,
      questions: U2L2_TEST.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)),
    };
    const result = evaluateAssessmentAttempt(targetedTest, answers);
    expect(result.score).toBe(targetedTest.questions.length);
  });

  it('gates the teacher area with the existing password and shows all 51 solutions plus rule teaching', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={[U2L2_TEACHER_GUIDE]}
        tests={[U2L2_TEST]}
      />,
    );

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(51);
    expect(screen.getByText('شروح القواعد التفصيلية')).toBeInTheDocument();
    expect(screen.getByText('شروح الإملاء التفصيلية')).toBeInTheDocument();
    expect(screen.getByText('تنبيهات حدود المصدر')).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل الصوتي غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByText('U2L2-60-02')).toBeInTheDocument();
  });

  it('renders all 20 explanatory test solutions separately from the test interface', () => {
    render(<TestSolutions test={U2L2_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(20);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(20);
  });
});

describe('Unit 2 Lesson 2 — lesson-local text answer normalization (no shared evaluator change)', () => {
  it('strips diacritics, tatweel, trailing stops and redundant spaces', () => {
    expect(normalizeU2L2TextAnswer('مَبسوطَةً')).toBe('مبسوطة');
    expect(normalizeU2L2TextAnswer('مبسوطة')).toBe('مبسوطة');
    expect(normalizeU2L2TextAnswer('الخــبيرُ')).toBe('الخبير');
    expect(normalizeU2L2TextAnswer('الخَبيرُ يَبرمِجُ الحاسِبَ.')).toBe('الخبير يبرمج الحاسب');
    expect(normalizeU2L2TextAnswer('الخبير يبرمج الحاسب۔')).toBe('الخبير يبرمج الحاسب');
    expect(normalizeU2L2TextAnswer('  الخبير   يبرمج  ')).toBe('الخبير يبرمج');
    expect(normalizeU2L2TextAnswer('')).toBe('');
  });

  it('accepts correct unvocalized equivalents but never collapses meaning-changing spelling', () => {
    // مقبول: الإجابة الصحيحة بلا تشكيل أو بنقطة طرفية مختلفة.
    expect(isU2L2TextAnswerCorrect('مبسوطة', 'مَبسوطَةً')).toBe(true);
    expect(isU2L2TextAnswerCorrect('الخبير يبرمج الحاسب', 'الخَبيرُ يَبرمِجُ الحاسِبَ.')).toBe(true);
    // مرفوض: إجابة مختلفة المعنى.
    expect(isU2L2TextAnswerCorrect('مربوطة', 'مَبسوطَةً')).toBe(false);
    // مرفوض: التاء المربوطة والهاء لا تُوحَّدان.
    expect(isU2L2TextAnswerCorrect('رساله', 'رِسالَة')).toBe(false);
    // مرفوض: صور الألف والهمزة لا تُوحَّد.
    expect(isU2L2TextAnswerCorrect('امنية', 'أُمنِيَة')).toBe(false);
    // مرفوض: فراغ مقابل مفتاح.
    expect(isU2L2TextAnswerCorrect('', 'مَبسوطَةً')).toBe(false);
  });

  it('grades an unvocalized typed answer correct in the real widget, and a wrong answer incorrect', () => {
    const lesson = getLessonById('unit2-lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 6:/ }));

    const section = screen.getByLabelText('نشاط المصدر U2L2-55-02');
    const input = within(section).getByLabelText('صورة التاء في «التَفَتَ»') as HTMLInputElement;

    // إجابة صحيحة بلا تشكيل يجب أن تُقبل بعد التسوية.
    fireEvent.change(input, { target: { value: 'مبسوطة' } });
    fireEvent.click(within(section).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(section).getByRole('status')).toHaveTextContent('صحيحة');

    // الإجابة الخاطئة نفسها (مربوطة) يجب أن تبقى مرفوضة رغم التسوية.
    fireEvent.change(input, { target: { value: 'مربوطة' } });
    fireEvent.click(within(section).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(section).getByRole('status')).toHaveTextContent('من 1 عناصر');
  });
});
