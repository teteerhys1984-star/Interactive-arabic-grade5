import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { curriculumRegistry, getLessonById } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { LESSON3_ACTIVITIES, LESSON3_COVERAGE } from '../data/lesson3/activities';
import { LESSON3_STEP_CONTENT, LESSON3_STEPS } from '../data/lesson3/content';
import { LESSON3_TEST } from '../data/lesson3/lessonTest';
import { LESSON3_SOURCE_LOCK_IDS, auditLesson3Coverage } from '../data/lesson3/sourceAudit';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { LISTENING_AUDIO_GAP, LOCKED_SOURCE_NOTES } from '../data/lesson3/sourceMeta';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';

afterEach(cleanup);

describe('Lesson 3 — source-lock implementation', () => {
  it('registers Lesson 3 as the third lesson of Unit 1 with all pages 25–35', () => {
    const result = getLessonById('lesson3');
    expect(result).not.toBeNull();
    expect(result?.lesson.metadata.title).toBe('لُغَتي');
    expect(result?.lesson.metadata.order).toBe(3);
    expect(result?.lesson.metadata.sources.map((source) => source.pageNumber)).toEqual(Array.from({ length: 11 }, (_, index) => index + 25));
    expect(result?.lesson.steps).toHaveLength(9);
    expect(result?.unit.lessons.map((lesson) => lesson.metadata.id)).toEqual(['lesson1', 'lesson2', 'lesson3']);
  });

  it('maps exactly the 51 source-lock records to student activities, subparts, and teacher solutions', () => {
    expect(LESSON3_SOURCE_LOCK_IDS).toHaveLength(51);
    expect(LESSON3_ACTIVITIES).toHaveLength(51);
    expect(LESSON3_COVERAGE.requiredSourceActivities).toBe(51);
    expect(LESSON3_COVERAGE.discovered).toBe(51);
    expect(LESSON3_COVERAGE.studentActivities).toBe(51);
    expect(LESSON3_COVERAGE.teacherSolutions).toBe(51);
    expect(new Set(LESSON3_ACTIVITIES.map((activity) => activity.sourceActivityId))).toEqual(new Set(LESSON3_SOURCE_LOCK_IDS));
    expect(LESSON3_ACTIVITIES.every((activity) => activity.subparts.length > 0)).toBe(true);
    expect(LESSON3_TEACHER_GUIDE.exerciseSolutions).toHaveLength(51);
    expect(LESSON3_TEACHER_GUIDE.sourceCoverage).toHaveLength(51);

    const studentActivityIds = LESSON3_STEPS.flatMap((step) =>
      LESSON3_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => (block.kind === 'activity' ? block.activityId : '')),
    );
    expect(studentActivityIds).toHaveLength(51);
    expect(new Set(studentActivityIds)).toEqual(new Set(LESSON3_ACTIVITIES.map((activity) => activity.id)));

    const report = auditLesson3Coverage(LESSON3_TEACHER_GUIDE);
    expect(report.status).toBe('passed');
    expect(report.missingStudentActivities).toEqual([]);
    expect(report.missingTeacherSolutions).toEqual([]);
    expect(report.unmappedSubparts).toEqual([]);
  });

  it('keeps locked uncertainties and the audio gap explicit instead of fabricating content', () => {
    const listening = LESSON3_ACTIVITIES.find((activity) => activity.sourceActivityId === 'L3-25-05')!;
    expect(listening.teacher.explanation).toContain('التسجيل الصوتي غير متوفر');
    const poemBlock = LESSON3_STEP_CONTENT['l3-s2'].blocks.find((block) => block.kind === 'source_sentences')!;
    expect(poemBlock.kind === 'source_sentences' ? poemBlock.sentences : []).toHaveLength(6);
    expect(LESSON3_STEP_CONTENT['l3-s1'].blocks.some((block) => block.kind === 'source_info' && block.gapReason === LOCKED_SOURCE_NOTES.introPronoun)).toBe(true);
    expect(LISTENING_AUDIO_GAP.length).toBeGreaterThan(10);
  });

  it('renders Lesson 3 inside the established lesson flow with all activities', () => {
    const lesson3 = getLessonById('lesson3')!.lesson;
    render(<LessonFlow lesson={lesson3} />);

    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(9);
    expect(screen.getByText('لُغَتي')).toBeInTheDocument();
    expect(screen.getAllByText(/التسجيل الصوتي غير متوفر/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('نشاط المصدر L3-25-01')).toBeInTheDocument();
  });

  it('has an auditable, correctly distributed 20-question lesson test', () => {
    expect(getLessonTestByLessonId('lesson3')).toBe(LESSON3_TEST);
    expect(LESSON3_TEST.questions).toHaveLength(20);
    expect(LESSON3_TEST.questions.map((question) => question.order)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(new Set(LESSON3_TEST.questions.map((question) => question.id)).size).toBe(20);

    const countDifficulty = (difficulty: string) => LESSON3_TEST.questions.filter((question) => question.difficulty === difficulty).length;
    expect(countDifficulty('basic')).toBe(6);
    expect(countDifficulty('medium')).toBe(7);
    expect(countDifficulty('advanced')).toBe(4);
    expect(countDifficulty('thinking')).toBe(3);

    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE]);
    expect(audit.errorsCount).toBe(0);
  });

  it('uses matching, classification, ordering, and correction keys that the evaluator can score', () => {
    const answers = {
      'l3-t-08': { استقبال: 'استقبلَ', انكسار: 'انكسرَ', استعلام: 'استعلمَ', انتقال: 'انتقلَ' },
      'l3-t-10': { iqra: 'wasl', akhadha: 'qat', istifham: 'wasl', istajala: 'wasl' },
      'l3-t-12': ['verb', 'subj', 'obj'],
      'l3-t-15': 'a',
    };
    const targetedTest = { ...LESSON3_TEST, questions: LESSON3_TEST.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)) };
    const result = evaluateAssessmentAttempt(targetedTest, answers);
    expect(result.score).toBe(targetedTest.questions.length);
  });

  it('gates the teacher area with the supplied password and shows all 51 Lesson 3 solutions', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={[LESSON3_TEACHER_GUIDE]}
        tests={[LESSON3_TEST]}
      />,
    );

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');

    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(51);
  });

  it('renders all 20 explanatory test solutions separately from the test interface', () => {
    render(<TestSolutions test={LESSON3_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(20);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(20);
  });
});
