import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { curriculumRegistry, isUnitTestAvailable } from '../data/curriculumRegistry';
import { auditCurriculum } from '../utils/audit';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';
import { AssessmentTest, Unit } from '../types/curriculum';

describe('Interactive Arabic Grade 5 - Foundation Phase Contracts', () => {
  it('CRITICAL: Curriculum registry must start completely empty (ZERO fake lessons/units)', () => {
    expect(curriculumRegistry.units).toHaveLength(0);
    expect(curriculumRegistry.grade).toBe(5);
    expect(curriculumRegistry.subject).toBe('اللغة العربية');
  });

  it('CRITICAL: Renders application in Arabic RTL with clear foundation empty-state', () => {
    render(<App />);

    // Brand and header
    expect(screen.getByText('اللغة العربية التفاعلية')).toBeInTheDocument();
    expect(screen.getAllByText(/الصف الخامس الأساسي/)[0]).toBeInTheDocument();

    // Verify empty state warning rather than fake curriculum
    expect(screen.getByText('مرحلة التأسيس الهيكلي والتقني (Foundation Phase)')).toBeInTheDocument();
    expect(
      screen.getByText(/لم يتم إدراج أي دروس أو وحدات تخمينية أو وهمية/i)
    ).toBeInTheDocument();
  });

  it('CRITICAL: Unit completion rule - Unit test is strictly forbidden unless isComplete is explicitly declared', () => {
    // Fabricate an in-progress unit in memory (purely to test the validator rule)
    const incompleteUnit: Unit = {
      metadata: {
        id: 'test-unit-1',
        order: 1,
        title: 'وحدة تجريبية',
        isComplete: false, // NOT complete
      },
      lessons: [],
      unitTestId: 'unit-test-1', // Attempting to attach a unit test
    };

    expect(isUnitTestAvailable('test-unit-1')).toBe(false);

    const audit = auditCurriculum(
      { grade: 5, subject: 'اللغة العربية', units: [incompleteUnit] },
      []
    );

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
        // Only 1 question instead of 20
        {
          id: 'q1',
          order: 1,
          type: 'single_choice',
          prompt: 'سؤال تجريبي',
          explanation: 'تفسير',
          testedSkill: 'النحو',
          source: {
            documentTitle: 'الكتاب الرسمي',
            pageNumber: 10,
            sourceType: 'textbook_grammar',
            readabilityVerified: true,
          },
          choices: [{ id: 'c1', text: 'أ' }, { id: 'c2', text: 'ب' }],
          correctChoiceId: 'c1',
        },
      ],
    };

    const audit = auditCurriculum(
      { grade: 5, subject: 'اللغة العربية', units: [] },
      [invalidLessonTest]
    );

    const questionCountError = audit.issues.find(
      (i) => i.category === 'question_count' && i.entityId === 'lesson-test-fake'
    );
    expect(questionCountError).toBeDefined();
    expect(questionCountError?.message).toContain('يجب أن يحتوي بالضبط على 20 سؤالاً');
  });

  it('CRITICAL: Audit enforces unit test count of 50-60 questions', () => {
    const invalidUnitTest: AssessmentTest = {
      id: 'unit-test-short',
      scope: 'unit',
      unitId: 'unit-1',
      title: 'اختبار وحدة تجريبي',
      description: 'وصف',
      questions: [], // 0 questions
    };

    const audit = auditCurriculum(
      { grade: 5, subject: 'اللغة العربية', units: [] },
      [invalidUnitTest]
    );

    const questionCountError = audit.issues.find(
      (i) => i.category === 'question_count' && i.entityId === 'unit-test-short'
    );
    expect(questionCountError).toBeDefined();
    expect(questionCountError?.message).toContain('يجب أن يتراوح بين 50 و 60 سؤالاً');
  });

  it('Test Evaluator Contract: Pure evaluation produces scores and question breakdown', () => {
    const sampleTest: AssessmentTest = {
      id: 't1',
      scope: 'lesson',
      unitId: 'u1',
      title: 'اختبار تجريبي',
      description: 'وصف',
      questions: [
        {
          id: 'q1',
          order: 1,
          type: 'single_choice',
          prompt: 'سؤال 1',
          explanation: 'تفسير 1',
          testedSkill: 'فهم المقروء',
          source: {
            documentTitle: 'الكتاب',
            pageNumber: 15,
            sourceType: 'textbook_reading',
            readabilityVerified: true,
          },
          choices: [{ id: 'opt1', text: 'صواب' }, { id: 'opt2', text: 'خطأ' }],
          correctChoiceId: 'opt1',
        },
        {
          id: 'q2',
          order: 2,
          type: 'fill_blank',
          prompt: 'سؤال 2',
          explanation: 'تفسير 2',
          testedSkill: 'الإملاء',
          source: {
            documentTitle: 'الكتاب',
            pageNumber: 16,
            sourceType: 'textbook_spelling',
            readabilityVerified: true,
          },
          acceptedAnswers: ['السماء'],
        },
      ],
    };

    // User gets q1 right, q2 wrong
    const result = evaluateAssessmentAttempt(sampleTest, {
      q1: 'opt1',
      q2: 'الأرض',
    });

    expect(result.score).toBe(1);
    expect(result.totalPossible).toBe(2);
    expect(result.percentage).toBe(50);
    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(1);
    expect(result.questionResults['q1']).toBe(true);
    expect(result.questionResults['q2']).toBe(false);
  });
});
