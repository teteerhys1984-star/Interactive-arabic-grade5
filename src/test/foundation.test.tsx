import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { curriculumRegistry, isUnitTestAvailable, getLessonById } from '../data/curriculumRegistry';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from '../data/assessments';
import { TEXTBOOK_ACTIVITIES, COVERAGE } from '../data/lesson1/activities';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { AssessmentTest, Unit } from '../types/curriculum';

describe('Interactive Arabic Grade 5 - Lesson 1 & Foundation Contracts', () => {
  it('Curriculum integrity: Unit 1 registered with Lesson 1, incomplete, and NO unit test', () => {
    expect(curriculumRegistry.grade).toBe(5);
    expect(curriculumRegistry.subject).toBe('اللغة العربية');
    expect(curriculumRegistry.units).toHaveLength(1);

    const unit1 = curriculumRegistry.units[0];
    expect(unit1.metadata.id).toBe('unit1');
    expect(unit1.metadata.isComplete).toBe(false); // NOT complete
    expect(unit1.unitTestId).toBeUndefined(); // unit test disabled
    expect(isUnitTestAvailable('unit1')).toBe(false);

    const lesson = getLessonById('lesson1');
    expect(lesson).not.toBeNull();
    expect(lesson!.lesson.metadata.title).toContain('السَّمَكَةُ الذَّهَبِيَّةُ');
    expect(lesson!.lesson.metadata.sources.length).toBeGreaterThan(0);
    expect(lesson!.lesson.steps.length).toBeGreaterThan(0);
  });

  it('Renders Arabic RTL with Lesson 1 unit card (foundation empty-state intentionally replaced)', () => {
    render(<App />);

    expect(screen.getByText('اللغة العربية التفاعلية')).toBeInTheDocument();
    // Lesson 1 unit is now visible
    expect(screen.getAllByText(/أحلامي وطموحاتي/)[0]).toBeInTheDocument();
    // The foundation "no lessons yet" empty-state must be gone
    expect(screen.queryByText(/لم يتم إدراج أي دروس أو وحدات تخمينية أو وهمية/)).toBeNull();
  });

  it('CRITICAL: Unit completion rule - Unit test is strictly forbidden unless isComplete is explicitly declared', () => {
    const incompleteUnit: Unit = {
      metadata: { id: 'test-unit-1', order: 1, title: 'وحدة تجريبية', isComplete: false },
      lessons: [],
      unitTestId: 'unit-test-1',
    };

    expect(isUnitTestAvailable('test-unit-1')).toBe(false);

    const audit = auditCurriculum({ grade: 5, subject: 'اللغة العربية', units: [incompleteUnit] }, []);
    const completionError = audit.issues.find((i) => i.category === 'unit_completion');
    expect(completionError).toBeDefined();
    expect(completionError?.message).toContain('لا يجوز ربط اختبار وحدة');
  });

  it('CRITICAL: Audit enforces lesson test count of exactly 20 questions', () => {
    const invalidLessonTest: AssessmentTest = {
      id: 'lesson-test-fake',
      scope: 'lesson',
      unitId: 'unit-1',
      lessonId: 'lesson-1',
      title: 'اختبار تجريبي',
      description: 'وصف',
      questions: [
        {
          id: 'q1', order: 1, type: 'single_choice', prompt: 'سؤال تجريبي', explanation: 'تفسير', testedSkill: 'النحو',
          source: { documentTitle: 'الكتاب الرسمي', pageNumber: 10, sourceType: 'textbook_grammar', readabilityVerified: true },
          choices: [{ id: 'c1', text: 'أ' }, { id: 'c2', text: 'ب' }], correctChoiceId: 'c1',
        },
      ],
    };

    const audit = auditCurriculum({ grade: 5, subject: 'اللغة العربية', units: [] }, [invalidLessonTest]);
    const questionCountError = audit.issues.find((i) => i.category === 'question_count' && i.entityId === 'lesson-test-fake');
    expect(questionCountError).toBeDefined();
    expect(questionCountError?.message).toContain('يجب أن يحتوي بالضبط على 20 سؤالاً');
  });

  it('CRITICAL: Audit enforces unit test count of 50-60 questions', () => {
    const invalidUnitTest: AssessmentTest = {
      id: 'unit-test-short', scope: 'unit', unitId: 'unit-1', title: 'اختبار وحدة تجريبي', description: 'وصف', questions: [],
    };

    const audit = auditCurriculum({ grade: 5, subject: 'اللغة العربية', units: [] }, [invalidUnitTest]);
    const questionCountError = audit.issues.find((i) => i.category === 'question_count' && i.entityId === 'unit-test-short');
    expect(questionCountError).toBeDefined();
    expect(questionCountError?.message).toContain('يجب أن يتراوح بين 50 و 60 سؤالاً');
  });

  it('Lesson 1 assessment: exactly 20 questions, unique IDs, balanced blueprint, zero audit errors', () => {
    const test = getLessonTestByLessonId('lesson1')!;
    expect(test).toBeDefined();
    expect(test.questions).toHaveLength(20);

    const ids = new Set(test.questions.map((q) => q.id));
    expect(ids.size).toBe(20);

    const byDiff = (d: string) => test.questions.filter((q) => q.difficulty === d).length;
    expect(byDiff('basic')).toBe(6);
    expect(byDiff('medium')).toBe(7);
    expect(byDiff('advanced')).toBe(4);
    expect(byDiff('thinking')).toBe(3);

    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, [LESSON1_TEACHER_GUIDE]);
    expect(audit.errorsCount).toBe(0);
  });

  it('Textbook coverage ledger: discovered == implemented == teacher solutions, unresolved 0', () => {
    expect(TEXTBOOK_ACTIVITIES.length).toBe(COVERAGE.discovered);
    expect(COVERAGE.implemented).toBe(COVERAGE.discovered);
    expect(LESSON1_TEACHER_GUIDE.exerciseSolutions.length).toBe(TEXTBOOK_ACTIVITIES.length);
    expect(COVERAGE.unresolved).toBe(0);
  });

  it('Test Evaluator Contract: Pure evaluation produces scores and question breakdown', () => {
    const sampleTest: AssessmentTest = {
      id: 't1', scope: 'lesson', unitId: 'u1', title: 'اختبار تجريبي', description: 'وصف',
      questions: [
        {
          id: 'q1', order: 1, type: 'single_choice', prompt: 'سؤال 1', explanation: 'تفسير 1', testedSkill: 'فهم المقروء',
          source: { documentTitle: 'الكتاب', pageNumber: 15, sourceType: 'textbook_reading', readabilityVerified: true },
          choices: [{ id: 'opt1', text: 'صواب' }, { id: 'opt2', text: 'خطأ' }], correctChoiceId: 'opt1',
        },
        {
          id: 'q2', order: 2, type: 'fill_blank', prompt: 'سؤال 2', explanation: 'تفسير 2', testedSkill: 'الإملاء',
          source: { documentTitle: 'الكتاب', pageNumber: 16, sourceType: 'textbook_spelling', readabilityVerified: true },
          acceptedAnswers: ['السماء'],
        },
      ],
    };

    const result = evaluateAssessmentAttempt(sampleTest, { q1: 'opt1', q2: 'الأرض' });
    expect(result.score).toBe(1);
    expect(result.totalPossible).toBe(2);
    expect(result.percentage).toBe(50);
    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(1);
    expect(result.questionResults['q1']).toBe(true);
    expect(result.questionResults['q2']).toBe(false);
  });
});
