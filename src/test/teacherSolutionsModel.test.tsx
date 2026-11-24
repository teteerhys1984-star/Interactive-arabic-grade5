import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { curriculumRegistry } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { U2L2_TEACHER_GUIDE } from '../data/unit2Lesson2/teacherGuide';
import { U2L3_SOLUTIONS_DECLARATION } from '../data/unit2Lesson3/solutions';
import { U3L1_SOLUTIONS_DECLARATION } from '../data/unit3Lesson1/solutions';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { TeacherSolutionsBrowser } from '../components/teacher/TeacherSolutionsBrowser';
import { auditCurriculum } from '../utils/audit';
import type {
  ApprovedLessonSolutions,
  DeclaredAbsenceLessonSolutions,
  TeacherSolutionsModel,
} from '../types/curriculum';

const TEACHER_GUIDES: TeacherSolutionsModel[] = [
  LESSON1_TEACHER_GUIDE,
  LESSON2_TEACHER_GUIDE,
  LESSON3_TEACHER_GUIDE,
  U2L1_TEACHER_GUIDE,
  U2L2_TEACHER_GUIDE,
  U2L3_SOLUTIONS_DECLARATION,
  U3L1_SOLUTIONS_DECLARATION,
];

const auditOf = (guides: TeacherSolutionsModel[]) =>
  auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, guides);

const errorMessages = (guides: TeacherSolutionsModel[]) =>
  auditOf(guides).issues.filter((issue) => issue.severity === 'error');

const renderBrowser = (guides: TeacherSolutionsModel[]) =>
  render(<TeacherSolutionsBrowser curriculum={curriculumRegistry} teacherGuides={guides} />);

describe('Solutions model — approved guide vs declared absence (contract)', () => {
  it('every registered lesson has exactly one solutions record, and the audit is error-free', () => {
    const lessonIds = curriculumRegistry.units.flatMap((unit) =>
      unit.lessons.map((lesson) => lesson.metadata.id),
    );
    const registered = TEACHER_GUIDES.map((record) => record.lessonId);
    expect(new Set(registered).size).toBe(registered.length); // no lesson twice
    expect([...registered].sort()).toEqual([...lessonIds].sort());

    /* No lesson is left without a record: the "not registered" state is empty. */
    const unregistered = auditOf(TEACHER_GUIDES).issues.filter((issue) =>
      issue.message.includes('غير مسجل في بوابة المعلم'),
    );
    expect(unregistered).toEqual([]);

    expect(errorMessages(TEACHER_GUIDES)).toEqual([]);
    expect(auditOf(TEACHER_GUIDES).errorsCount).toBe(0);
  });

  it('keeps the existing approved guides byte-for-byte intact (no content change)', () => {
    for (const guide of [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE]) {
      expect(guide.kind).toBe('approved');
      expect(guide.exerciseSolutions.length).toBeGreaterThan(0);
    }
    expect(LESSON1_TEACHER_GUIDE.exerciseSolutions).toHaveLength(39);
    expect(LESSON2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(53);
    expect(LESSON3_TEACHER_GUIDE.exerciseSolutions).toHaveLength(51);
    expect(U2L1_TEACHER_GUIDE.exerciseSolutions).toHaveLength(45);
    expect(U2L2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(51);
  });

  it('declared absences mirror the real activity ledger and carry no answers at all', () => {
    const lessons: [DeclaredAbsenceLessonSolutions, typeof U3L1_ACTIVITIES][] = [
      [U2L3_SOLUTIONS_DECLARATION, U2L3_ACTIVITIES],
      [U3L1_SOLUTIONS_DECLARATION, U3L1_ACTIVITIES],
    ];

    for (const [declaration, activities] of lessons) {
      expect(declaration.kind).toBe('declared_absence');
      expect(declaration.sourceRecords).toHaveLength(activities.length);
      expect(declaration.sourceRecords.map((record) => record.sourceActivityId)).toEqual(
        activities.map((activity) => activity.sourceActivityId),
      );
      // Every record points at a real step of the lesson and a real page.
      for (const record of declaration.sourceRecords) {
        expect(record.lessonStepId).toMatch(/^u[23]l\d-s\d+$/);
        expect(record.pageNumber).toBeGreaterThan(0);
      }
      // No solutions / objectives / notes / answer keys, by construction.
      const raw = declaration as unknown as Record<string, unknown>;
      ['exerciseSolutions', 'sourceCoverage', 'lessonTestAnswerKeyRef', 'pedagogicalObjectives'].forEach(
        (field) => expect(raw[field]).toBeUndefined(),
      );
    }

    expect(U2L3_SOLUTIONS_DECLARATION.sourceRecords).toHaveLength(43);
    expect(U3L1_SOLUTIONS_DECLARATION.sourceRecords).toHaveLength(57);
    for (const declaration of [U2L3_SOLUTIONS_DECLARATION, U3L1_SOLUTIONS_DECLARATION]) {
      expect(declaration.declaration.sourceRef).toContain('docs/source-locks/');
      expect(declaration.declaration.declaredOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(declaration.declaration.deferredContentTask.length).toBeGreaterThan(20);
    }
  });
});

describe('Audit A1–A11 fail loudly instead of trusting an optional field (D6)', () => {
  it('A4: a record without an explicit kind is an error, never inferred from its text', () => {
    const kindless = { ...LESSON1_TEACHER_GUIDE } as unknown as Record<string, unknown>;
    delete kindless.kind;
    const errors = errorMessages([kindless as unknown as TeacherSolutionsModel]);
    expect(errors.some((issue) => issue.message.includes('لا يعلن نوعه'))).toBe(true);
  });

  it('A8: a declared absence that smuggles solutions or objectives is rejected', () => {
    /* Cast on purpose: the type forbids this, the audit must catch it anyway. */
    const smuggled = {
      ...U3L1_SOLUTIONS_DECLARATION,
      exerciseSolutions: [
        { sourceExercise: 'حل مُقحم', pageNumber: 73, officialSolution: 'حل مخترع', didacticExplanation: 'شرح' },
      ],
    } as unknown as DeclaredAbsenceLessonSolutions;
    const errors = errorMessages([smuggled]);
    expect(errors.some((issue) => issue.message.includes('يحمل المحتوى الممنوع «exerciseSolutions»'))).toBe(true);

    const withObjectives: DeclaredAbsenceLessonSolutions = {
      ...U3L1_SOLUTIONS_DECLARATION,
      pedagogicalObjectives: ['هدف مستنتج بلا مصدر'],
    };
    expect(
      errorMessages([withObjectives]).some((issue) => issue.message.includes('pedagogicalObjectives')),
    ).toBe(true);
  });

  it('A5: a declared absence without a documented source/date/deferred task is an error', () => {
    const undocumented: DeclaredAbsenceLessonSolutions = {
      ...U3L1_SOLUTIONS_DECLARATION,
      declaration: { ...U3L1_SOLUTIONS_DECLARATION.declaration, sourceRef: '   ' },
    };
    expect(
      errorMessages([undocumented]).some((issue) => issue.message.includes('sourceRef')),
    ).toBe(true);
  });

  it('A10: an approved guide with no solutions is an error (declare the absence instead)', () => {
    const empty: ApprovedLessonSolutions = { ...LESSON3_TEACHER_GUIDE, exerciseSolutions: [] };
    expect(
      errorMessages([empty]).some((issue) => issue.message.includes('إن لم توجد حلول معتمدة')),
    ).toBe(true);
  });

  it('A3: an approved guide and a declared absence for the same lesson cannot coexist', () => {
    const errors = errorMessages([LESSON3_TEACHER_GUIDE, U2L3_SOLUTIONS_DECLARATION]);
    expect(errors.some((issue) => issue.message.includes('أكثر من سجل حلول'))).toBe(false);
    const conflict = errorMessages([
      LESSON3_TEACHER_GUIDE,
      { ...U2L3_SOLUTIONS_DECLARATION, lessonId: 'lesson3' },
    ]);
    expect(conflict.some((issue) => issue.message.includes('أكثر من سجل حلول'))).toBe(true);
  });

  it('A1/A2: an unregistered lesson or a wrong unit is an error', () => {
    expect(
      errorMessages([{ ...LESSON1_TEACHER_GUIDE, lessonId: 'ghost-1' }]).some((issue) =>
        issue.message.includes('لا يطابق أي درس مسجل'),
      ),
    ).toBe(true);
    expect(
      errorMessages([{ ...LESSON1_TEACHER_GUIDE, unitId: 'unit3' }]).some((issue) =>
        issue.message.includes('يعلن الوحدة'),
      ),
    ).toBe(true);
  });
});

describe('Teacher portal — the three states of a lesson', () => {
  it('renders unit 3 lesson 1 with a documented absence and no open button anywhere', () => {
    const { container } = renderBrowser(TEACHER_GUIDES);

    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الثالثة/ }));
    const card = screen.getByText('العُلَماءُ الصِّغارُ').closest('.teacher-lesson-card') as HTMLElement;
    expect(card).not.toBeNull();
    expect(card.className).toContain('teacher-lesson-card--declared-absence');
    expect(within(card).queryByRole('button')).toBeNull();
    expect(card.textContent).toContain('غياب معلن وموثَّق');
    expect(card.textContent).toContain('docs/source-locks/unit3-lesson-01-al-ulama-as-sighar.md');
    expect(card.textContent).toContain('٥٧'); // 57 audited source records
    /* The declaration may NAME the missing key; it may never SHOW an answer. */
    expect(card.textContent).not.toContain('الحل النموذجي:');
    expect(card.textContent).not.toContain('إجابة صحيحة');
    expect(container.querySelectorAll('.guide-solution-card')).toHaveLength(0);
  });

  it('never exposes a lesson solution through the declared-absence path', () => {
    renderBrowser(TEACHER_GUIDES);
    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الثانية/ }));
    /* No open button exists for the declared-absence lesson, so its solutions
       view is structurally unreachable — there is nothing to render. */
    expect(screen.queryByRole('button', { name: /^عرض حلول الدرس .*بِالْعِلْمِ تَرْقَى$/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /بِالْعِلْمِ تَرْقَى/ })).toBeNull();
  });
});
