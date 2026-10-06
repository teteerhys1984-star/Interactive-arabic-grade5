import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { curriculumRegistry, getLessonById, isUnitTestAvailable } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { LESSON2_ACTIVITIES, LESSON2_COVERAGE } from '../data/lesson2/activities';
import { LESSON2_STEP_CONTENT, LESSON2_STEPS } from '../data/lesson2/content';
import { LESSON2_TEST } from '../data/lesson2/lessonTest';
import { LESSON2_SOURCE_LOCK_IDS, auditLesson2Coverage } from '../data/lesson2/sourceAudit';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';

afterEach(cleanup);

describe('Lesson 2 — source-lock implementation', () => {
  it('registers Lesson 2 inside Unit 1 with all pages 12–24 and no unit test', () => {
    const result = getLessonById('lesson2');
    expect(result).not.toBeNull();
    expect(result?.lesson.metadata.title).toBe('بالرأي والرأي الآخر');
    expect(result?.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual(Array.from({ length: 13 }, (_, index) => index + 12));
    expect(result?.lesson.steps).toHaveLength(9);
    expect(result?.unit.metadata.isComplete).toBe(false);
    expect(result?.unit.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit1')).toBe(false);
    expect(ALL_ASSESSMENTS.some((assessment) => assessment.scope === 'unit')).toBe(false);
  });

  it('maps exactly the 53 source-lock records to student activities, subparts, and teacher solutions', () => {
    expect(LESSON2_SOURCE_LOCK_IDS).toHaveLength(53);
    expect(LESSON2_ACTIVITIES).toHaveLength(53);
    expect(LESSON2_COVERAGE.requiredSourceActivities).toBe(53);
    expect(LESSON2_COVERAGE.discovered).toBe(53);
    expect(LESSON2_COVERAGE.studentActivities).toBe(53);
    expect(LESSON2_COVERAGE.teacherSolutions).toBe(53);
    expect(new Set(LESSON2_ACTIVITIES.map((activity) => activity.sourceActivityId))).toEqual(new Set(LESSON2_SOURCE_LOCK_IDS));
    expect(LESSON2_ACTIVITIES.every((activity) => activity.subparts.length > 0)).toBe(true);
    expect(LESSON2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(53);
    expect(LESSON2_TEACHER_GUIDE.sourceCoverage).toHaveLength(53);

    const studentActivityIds = LESSON2_STEPS.flatMap((step) =>
      LESSON2_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => block.kind === 'activity' ? block.activityId : ''),
    );
    expect(studentActivityIds).toHaveLength(53);
    expect(new Set(studentActivityIds)).toEqual(new Set(LESSON2_ACTIVITIES.map((activity) => activity.id)));

    const report = auditLesson2Coverage(LESSON2_TEACHER_GUIDE);
    expect(report.status).toBe('passed');
    expect(report.missingStudentActivities).toEqual([]);
    expect(report.missingTeacherSolutions).toEqual([]);
    expect(report.unmappedSubparts).toEqual([]);
  });

  it('keeps source gaps explicit instead of fabricating listening, poem, or handwriting content', () => {
    const listening = LESSON2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L2-12-04')!;
    const poem = LESSON2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L2-13-01')!;
    const handwriting = LESSON2_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L2-21-01')!;

    expect(listening.availability).toBe('gap');
    expect(poem.availability).toBe('gap');
    expect(handwriting.availability).toBe('gap');
    expect(listening.teacher.answerOrGuidance).toContain('لا يُعتمد جواب محدد');
    expect(poem.teacher.explanation).toContain('لا تتضمن نسخاً حرفياً كاملاً');
  });

  it('renders Lesson 2 inside the established lesson flow and exposes the listening source gap', () => {
    const lesson2 = getLessonById('lesson2')!.lesson;
    render(<LessonFlow lesson={lesson2} />);

    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(9);
    expect(screen.getByText('بالرأي والرأي الآخر')).toBeInTheDocument();
    expect(screen.getAllByText(/المادة السمعية غير متوفرة في المصدر المتاح/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('نشاط المصدر L2-12-01')).toBeInTheDocument();
  });

  it('has an auditable, correctly distributed 20-question lesson test without listening questions', () => {
    expect(getLessonTestByLessonId('lesson2')).toBe(LESSON2_TEST);
    expect(LESSON2_TEST.questions).toHaveLength(20);
    expect(LESSON2_TEST.questions.map((question) => question.order)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(new Set(LESSON2_TEST.questions.map((question) => question.id)).size).toBe(20);

    const countDifficulty = (difficulty: string) => LESSON2_TEST.questions.filter((question) => question.difficulty === difficulty).length;
    expect(countDifficulty('basic')).toBe(6);
    expect(countDifficulty('medium')).toBe(7);
    expect(countDifficulty('advanced')).toBe(4);
    expect(countDifficulty('thinking')).toBe(3);
    expect(LESSON2_TEST.questions.every((question) => question.source.pageNumber !== 12)).toBe(true);

    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE]);
    expect(audit.errorsCount).toBe(0);
  });

  it('uses matching, classification, ordering, and correction keys that the evaluator can score', () => {
    const answers = {
      'l2-t-08': { akhbara: 'verb', ikhbar: 'source', zaraa: 'verb', ziraa: 'source' },
      'l2-t-09': 'a',
      'l2-t-10': { كتب: 'كتابة', ذهب: 'ذهاب', صعد: 'صعود' },
      'l2-t-11': ['topic', 'questions', 'closing'],
      'l2-t-15': { aqbala: 'quad', iqbal: 'source', akhadha: 'triple', amalan: 'source' },
      'l2-t-16': 'إلى',
    };
    const targetedTest = { ...LESSON2_TEST, questions: LESSON2_TEST.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)) };
    const result = evaluateAssessmentAttempt(targetedTest, answers);
    expect(result.score).toBe(targetedTest.questions.length);
  });

  it('gates the independent teacher area with the supplied password and shows all 53 Lesson 2 solutions', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={[LESSON2_TEACHER_GUIDE]}
        tests={[LESSON2_TEST]}
      />,
    );

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
    expect(screen.getByText(/دليل الدرس: الحلول النموذجية المفصلة/)).toBeInTheDocument();
  });

  it('renders all 20 explanatory test solutions separately from the test interface', () => {
    render(<TestSolutions test={LESSON2_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(20);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(20);
  });
});
