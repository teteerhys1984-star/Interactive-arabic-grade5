import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { curriculumRegistry, getLessonById, getUnitById, isUnitTestAvailable } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { U2L1_ACTIVITIES, U2L1_COVERAGE } from '../data/unit2Lesson1/activities';
import { U2L1_READING_TEXT, U2L1_SOURCE_RULES, U2L1_STEP_CONTENT, U2L1_STEPS } from '../data/unit2Lesson1/content';
import { U2L1_TEST } from '../data/unit2Lesson1/lessonTest';
import { U2L1_SOURCE_LOCK_IDS, auditU2L1Coverage } from '../data/unit2Lesson1/sourceAudit';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { U2L1_LISTENING_AUDIO_GAP } from '../data/unit2Lesson1/sourceMeta';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe('Unit 2 Lesson 1 — مخترعٌ من بلادي source-lock implementation', () => {
  it('registers Unit 2 as incomplete with no unit test, and keeps Unit 1 untouched', () => {
    const unit2 = getUnitById('unit2');
    expect(unit2).toBeDefined();
    expect(unit2!.metadata.order).toBe(2);
    expect(unit2!.metadata.title).toBe('الوحدة الثانية');
    // The unit divider/theme page was not supplied: no invented theme.
    expect(unit2!.metadata.theme).toBeUndefined();
    expect(unit2!.metadata.isComplete).toBe(false);
    expect(unit2!.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit2')).toBe(false);
    expect(unit2!.lessons.map((lesson) => lesson.metadata.id)).toEqual(['unit2-lesson1']);

    const unit1 = getUnitById('unit1')!;
    expect(unit1.metadata.isComplete).toBe(true);
    expect(unit1.lessons.map((lesson) => lesson.metadata.id)).toEqual(['lesson1', 'lesson2', 'lesson3']);
    expect(unit1.unitTestId).toBe('unit1-test');
    expect(isUnitTestAvailable('unit1')).toBe(true);
  });

  it('registers the lesson with pages 40–49 and 11 steps', () => {
    const result = getLessonById('unit2-lesson1');
    expect(result).not.toBeNull();
    expect(result!.lesson.metadata.title).toBe('مُخْتَرِعٌ مِنْ بِلَادِي');
    expect(result!.lesson.metadata.order).toBe(1);
    expect(result!.lesson.metadata.unitId).toBe('unit2');
    expect(result!.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual(
      Array.from({ length: 10 }, (_, index) => index + 40),
    );
    expect(result!.lesson.steps).toHaveLength(11);
    expect(result!.lesson.steps.map((step) => step.id)).toEqual(U2L1_STEPS.map((step) => step.id));
  });

  it('maps exactly the 45 source-lock records to student activities, subparts, and teacher solutions', () => {
    expect(U2L1_SOURCE_LOCK_IDS).toHaveLength(45);
    expect(U2L1_ACTIVITIES).toHaveLength(45);
    expect(U2L1_COVERAGE.requiredSourceActivities).toBe(45);
    expect(U2L1_COVERAGE.discovered).toBe(45);
    expect(U2L1_COVERAGE.studentActivities).toBe(45);
    expect(U2L1_COVERAGE.teacherSolutions).toBe(45);
    expect(new Set(U2L1_ACTIVITIES.map((activity) => activity.sourceActivityId))).toEqual(new Set(U2L1_SOURCE_LOCK_IDS));
    expect(U2L1_ACTIVITIES.every((activity) => activity.subparts.length > 0)).toBe(true);
    expect(U2L1_TEACHER_GUIDE.exerciseSolutions).toHaveLength(45);
    expect(U2L1_TEACHER_GUIDE.sourceCoverage).toHaveLength(45);

    const studentActivityIds = U2L1_STEPS.flatMap((step) =>
      (U2L1_STEP_CONTENT[step.id]?.blocks ?? [])
        .filter((block) => block.kind === 'activity')
        .map((block) => (block.kind === 'activity' ? block.activityId : '')),
    );
    expect(studentActivityIds).toHaveLength(45);
    expect(new Set(studentActivityIds)).toEqual(new Set(U2L1_ACTIVITIES.map((activity) => activity.id)));

    const report = auditU2L1Coverage(U2L1_TEACHER_GUIDE);
    expect(report.status).toBe('passed');
    expect(report.missingStudentActivities).toEqual([]);
    expect(report.missingTeacherSolutions).toEqual([]);
    expect(report.unmappedSubparts).toEqual([]);
  });

  it('keeps source limits explicit instead of inventing replacements', () => {
    const listening = U2L1_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L1-40-04')!;
    expect(listening.teacher.explanation).toContain('التسجيل الصوتي غير متوفر');
    expect(U2L1_LISTENING_AUDIO_GAP).toContain('ص٤١');

    const dictation = U2L1_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L1-46-07')!;
    expect(dictation.availability).toBe('gap');
    expect(dictation.teacher.explanation).toContain('غير مطبوع');

    const handwriting = U2L1_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L1-47-01')!;
    expect(handwriting.subparts.join(' ')).toContain('غير محسومة');
    expect(JSON.stringify(U2L1_STEP_CONTENT['u2l1-s4'])).toContain('مَا كَتَبْتُ بِلُغَتِي');
    expect(JSON.stringify(U2L1_STEP_CONTENT['u2l1-s4'])).not.toContain('كلمة غير محسومة الرسم');
    expect(U2L1_READING_TEXT.paragraphs.join(' ')).toContain('سَطَعَ عَلَى يَدَيْهِ بِمِرْوَحَةٍ');
    expect(U2L1_SOURCE_RULES.inductionPassage).toContain('لِتَحَضُّرِ الْمُجْتَمَعَاتِ');
    expect(U2L1_SOURCE_RULES.inductionPassage).toContain('مُؤَشِّرٌ');

    const vowelize = U2L1_ACTIVITIES.find((activity) => activity.sourceActivityId === 'U2L1-45-05')!;
    expect(vowelize.instruction).toContain('الشجر مزهر؛ الرياضة حياة');
    expect(vowelize.instruction).not.toContain('الشَّجَرُ مُزْهِرٌ');
    expect(JSON.stringify(U2L1_STEP_CONTENT['u2l1-s5'])).not.toContain('ما الكتابُ؟ صديقٌ');
    expect(JSON.stringify(U2L1_STEP_CONTENT['u2l1-s5'])).not.toContain('الاستعمالُ المفيدُ مرتبطٌ');
  });

  it('opens the lesson from the home curriculum list without offering a Unit 2 test', () => {
    render(<App />);

    expect(screen.getByText('قيد التدريس (غير مكتملة)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /اختبار الوحدة الثانية/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /مُخْتَرِعٌ مِنْ بِلَادِي/ }));
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(11);
    expect(screen.getByLabelText('نشاط المصدر U2L1-40-01')).toBeInTheDocument();
  });

  it('renders the lesson in the established shell, and drafts survive step navigation', () => {
    const lesson = getLessonById('unit2-lesson1')!.lesson;
    render(<LessonFlow lesson={lesson} />);

    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(11);
    expect(screen.getByText('مُخْتَرِعٌ مِنْ بِلَادِي')).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل الصوتي غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('نشاط المصدر U2L1-40-01')).toBeInTheDocument();

    const draft = screen.getByLabelText('الرابط الذي اكتشفته:');
    fireEvent.change(draft, { target: { value: 'الهاتف جمع وظائف الوسائط كلها' } });

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    expect(screen.getByLabelText('نشاط المصدر U2L1-42-01')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 1:/ }));
    expect(screen.getByLabelText('الرابط الذي اكتشفته:')).toHaveValue('الهاتف جمع وظائف الوسائط كلها');
  });

  it('does not reveal feedback or an explanation before the learner attempts a closed activity', () => {
    const lesson = getLessonById('unit2-lesson1')!.lesson;
    render(<LessonFlow lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));

    const activitySection = screen.getByLabelText('نشاط المصدر U2L1-43-01');
    expect(within(activitySection).queryByText(/ليس كذباً بل صورة جميلة/)).toBeNull();
    expect(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' })).toBeDisabled();

    // One wrong classification (the figurative sentence marked as a fact).
    fireEvent.change(within(activitySection).getByLabelText('تصنيف اخترعَ آلةَ خياطةٍ'), { target: { value: 'fact' } });
    fireEvent.change(within(activitySection).getByLabelText('تصنيف يحلِّقُ بأفكارهِ نحوَ النجومِ'), { target: { value: 'fact' } });
    fireEvent.click(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(activitySection).getByRole('status')).toHaveTextContent('من 3 عناصر');

    fireEvent.click(within(activitySection).getByRole('button', { name: 'اعرض التفسير التعليمي' }));
    expect(within(activitySection).getByText(/ليس كذباً بل صورة جميلة/)).toBeInTheDocument();

    // Retry after feedback can reach full correctness.
    fireEvent.change(within(activitySection).getByLabelText('تصنيف يحلِّقُ بأفكارهِ نحوَ النجومِ'), { target: { value: 'fiction' } });
    fireEvent.change(within(activitySection).getByLabelText('تصنيف أنشأَ محطّةً إذاعيةً'), { target: { value: 'fact' } });
    fireEvent.click(within(activitySection).getByRole('button', { name: 'تحقق من إجابتي' }));
    expect(within(activitySection).getByRole('status')).toHaveTextContent('صحيحة');
  });

  it('gate-checks comprehension with a platform check before showing its explanation', () => {
    const lesson = getLessonById('unit2-lesson1')!.lesson;
    render(<LessonFlow lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2:/ }));

    const verifyButtons = screen.getAllByRole('button', { name: 'تحقق من إجابتي' });
    expect(verifyButtons.length).toBeGreaterThan(0);
    expect(screen.queryByText(/تفصل الحبوب عن القش/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'الغربالَ للدرّاسات بأدقّ صورة وبأشكال كثيرة من الثقوب' }));
    fireEvent.click(verifyButtons[0]);
    expect(screen.getByText(/تفصل الحبوب عن القش/)).toBeInTheDocument();
  });

  it('has an auditable, correctly distributed 20-question lesson test', () => {
    expect(getLessonTestByLessonId('unit2-lesson1')).toBe(U2L1_TEST);
    expect(U2L1_TEST.questions).toHaveLength(20);
    expect(U2L1_TEST.questions.map((question) => question.order)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
    expect(new Set(U2L1_TEST.questions.map((question) => question.id)).size).toBe(20);
    expect(U2L1_TEST.questions.every((question) => question.source.pageNumber >= 40 && question.source.pageNumber <= 49)).toBe(true);

    const countDifficulty = (difficulty: string) =>
      U2L1_TEST.questions.filter((question) => question.difficulty === difficulty).length;
    expect(countDifficulty('basic')).toBe(6);
    expect(countDifficulty('medium')).toBe(7);
    expect(countDifficulty('advanced')).toBe(4);
    expect(countDifficulty('thinking')).toBe(3);

    const audit = auditCurriculum(
      curriculumRegistry,
      ALL_ASSESSMENTS,
      [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE, U2L1_TEACHER_GUIDE],
    );
    expect(audit.errorsCount).toBe(0);
  });

  it('uses matching, classification, ordering, and correction keys that the evaluator can score', () => {
    const answers = {
      'u2l1-t-08': { 'تدفَّقَ': 'سالَ بقوّةٍ', 'تتجلَّى': 'تنكشفُ وتظهرُ', 'ابتكَرَ': 'أبدعَ شيئًا جديدًا' },
      'u2l1-t-12': { istakhraja: 'wasl', aadda: 'qat', intasara: 'wasl', ihsan: 'qat' },
      'u2l1-t-11': ['gather', 'write', 'review', 'train'],
      'u2l1-t-14': 'a',
    };
    const targetedTest = {
      ...U2L1_TEST,
      questions: U2L1_TEST.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)),
    };
    const result = evaluateAssessmentAttempt(targetedTest, answers);
    expect(result.score).toBe(targetedTest.questions.length);
  });

  it('gates the teacher area with the existing password and shows all 45 solutions plus detailed rule teaching', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={[U2L1_TEACHER_GUIDE]}
        tests={[U2L1_TEST]}
      />,
    );

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(45);
    expect(screen.getByText('شروح القواعد التفصيلية')).toBeInTheDocument();
    expect(screen.getByText('شروح الإملاء التفصيلية')).toBeInTheDocument();
    expect(screen.getByText('تنبيهات حدود المصدر')).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل الصوتي غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByText('U2L1-49-02')).toBeInTheDocument();
  });

  it('renders all 20 explanatory test solutions separately from the test interface', () => {
    render(<TestSolutions test={U2L1_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(20);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(20);
  });
});
