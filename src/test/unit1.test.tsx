import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import { AssessmentShell } from '../components/assessment/AssessmentShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { curriculumRegistry, isUnitTestAvailable } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS, getUnitTestByUnitId } from '../data/assessments';
import { LESSON1_TEST } from '../data/lesson1/lessonTest';
import { LESSON2_TEST } from '../data/lesson2/lessonTest';
import { LESSON3_TEST } from '../data/lesson3/lessonTest';
import { UNIT1_TEST } from '../data/unit1/unitTest';
import { auditCurriculum } from '../utils/audit';
import { auditCrossTestDuplication } from '../utils/testDuplicationAudit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';

afterEach(cleanup);

describe('Unit 1 comprehensive test and its independent solutions area', () => {
  it('is available only because the unit is explicitly complete', () => {
    expect(curriculumRegistry.units[0].metadata.isComplete).toBe(true);
    expect(isUnitTestAvailable('unit1')).toBe(true);
    expect(getUnitTestByUnitId('unit1')).toBe(UNIT1_TEST);
    expect(UNIT1_TEST.scope).toBe('unit');
  });

  it('holds exactly 50 auditable questions distributed over the three lessons by content weight', () => {
    expect(UNIT1_TEST.questions).toHaveLength(50);
    expect(UNIT1_TEST.questions.map((question) => question.order)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
    expect(new Set(UNIT1_TEST.questions.map((question) => question.id)).size).toBe(50);

    const pagesOf = (from: number, to: number) =>
      UNIT1_TEST.questions.filter((question) => question.source.pageNumber >= from && question.source.pageNumber <= to).length;
    expect(pagesOf(4, 11)).toBe(15); // Lesson 1
    expect(pagesOf(12, 24)).toBe(18); // Lesson 2
    expect(pagesOf(25, 35)).toBe(17); // Lesson 3

    const difficulties = UNIT1_TEST.questions.map((question) => question.difficulty);
    expect(difficulties.filter((level) => level === 'basic').length).toBeGreaterThan(10);
    expect(difficulties.filter((level) => level === 'medium').length).toBeGreaterThan(10);
    expect(difficulties.filter((level) => level === 'advanced').length).toBeGreaterThan(5);
    expect(difficulties.filter((level) => level === 'thinking').length).toBeGreaterThan(5);
  });

  it('keeps every question explained, sourced, and free of duplication with the lesson tests', () => {
    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE]);
    expect(audit.errorsCount).toBe(0);
    expect(UNIT1_TEST.questions.every((question) => question.explanation.length > 0)).toBe(true);
    // The unit test is an independent instrument: no question ID overlaps a lesson test.
    const lessonQuestionIds = new Set([...LESSON1_TEST.questions, ...LESSON2_TEST.questions, ...LESSON3_TEST.questions].map((question) => question.id));
    expect(UNIT1_TEST.questions.every((question) => !lessonQuestionIds.has(question.id))).toBe(true);
    // Textual/substantive duplication guard: no near-identical prompt+answer or reused answer.
    const duplication = auditCrossTestDuplication(UNIT1_TEST, [LESSON1_TEST, LESSON2_TEST, LESSON3_TEST]);
    expect(duplication.findings).toEqual([]);
    expect(duplication.passed).toBe(true);
  });

  it('scores complex answer shapes correctly through the shared evaluator', () => {
    const answers = {
      'u1-t-05': { s1: 'nom', s2: 'ver', s3: 'nom' },
      'u1-t-11': ['a', 'c'],
      'u1-t-23': { ishtarak: 'verb', ishtirak: 'masdar', intashar: 'verb', intishar: 'masdar' },
      'u1-t-30': { 'الترحيب بالضيف وشكره': 'افتتاح مهذب وخاتمة لائقة', 'تحضير أسئلة قصيرة مباشرة': 'إبقاء الحوار في الموضوع', 'إعطاء الضيف وقتاً كافياً': 'إتاحة الرأي للضيف' },
      'u1-t-45': 'a',
    };
    const targeted = { ...UNIT1_TEST, questions: UNIT1_TEST.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)) };
    const result = evaluateAssessmentAttempt(targeted, answers);
    expect(result.score).toBe(targeted.questions.length);
  });

  it('hides results during the attempt and clears answers on restart', () => {
    render(<AssessmentShell test={UNIT1_TEST} />);
    expect(screen.queryByText(/نتيجة التقييم/)).toBeNull();

    const firstChoice = screen.getAllByRole('radio')[0];
    fireEvent.click(firstChoice);
    fireEvent.click(screen.getByRole('button', { name: '✓ اعتماد وإرسال الإجابات' }));
    expect(screen.getByText('نتيجة التقييم')).toBeInTheDocument();
    expect(screen.getAllByText(/إجابة صحيحة/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '🔄 إعادة المحاولة باختبار جديد' }));
    expect(screen.queryByText(/نتيجة التقييم/)).toBeNull();
    expect(screen.getByText(/أجبت عن/)).toBeInTheDocument();
  });

  it('exposes the unit test from the unit page and a separate 50-solution review area', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'عرض دروس الوحدة الأولى: أحلامي وطموحاتي' }));
    expect(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' })).toBeInTheDocument();

    cleanup();
    render(<TestSolutions test={UNIT1_TEST} />);
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ:/)).toHaveLength(50);
    expect(screen.getAllByText(/التَّعليلُ:/)).toHaveLength(50);
    // grouped by tens for the unit test
    expect(screen.getByText('الأسئلة ١–١٠')).toBeInTheDocument();
    expect(screen.getByText('الأسئلة ٤١–٥٠')).toBeInTheDocument();
  });
});
