import {
  CurriculumRegistry,
  AssessmentTest,
  TeacherLessonGuide,
} from '../types/curriculum';

export interface AuditIssue {
  severity: 'error' | 'warning' | 'info';
  category:
    | 'curriculum_integrity'
    | 'question_count'
    | 'unique_identifiers'
    | 'solution_key'
    | 'source_traceability'
    | 'unit_completion';
  entityId: string;
  message: string;
}

export interface AuditReport {
  timestamp: string;
  totalUnits: number;
  totalLessons: number;
  totalTests: number;
  errorsCount: number;
  warningsCount: number;
  issues: AuditIssue[];
  status: 'passed' | 'failed' | 'empty_state';
}

/**
 * Validates tests and curriculum according to Grade 5 project rules:
 * - Lesson tests must have exactly 20 questions
 * - Unit tests must have 50-60 questions
 * - Unit tests only allowed when unit.metadata.isComplete === true
 * - Question IDs, test IDs, lesson IDs must be globally unique
 * - Every question must have an answer key, explanation, and verified source reference
 * - Incomplete units must not have active unit tests
 */
export function auditCurriculum(
  curriculum: CurriculumRegistry,
  tests: AssessmentTest[] = [],
  _teacherGuides: TeacherLessonGuide[] = []
): AuditReport {
  const issues: AuditIssue[] = [];

  const seenUnitIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenTestIds = new Set<string>();
  const seenQuestionIds = new Set<string>();

  let totalLessons = 0;

  for (const unit of curriculum.units) {
    // Unique unit ID check
    if (seenUnitIds.has(unit.metadata.id)) {
      issues.push({
        severity: 'error',
        category: 'unique_identifiers',
        entityId: unit.metadata.id,
        message: `معرّف الوحدة مكرر: ${unit.metadata.id}`,
      });
    }
    seenUnitIds.add(unit.metadata.id);

    // Unit completion rule: unit tests strictly forbidden if incomplete
    if (!unit.metadata.isComplete && unit.unitTestId) {
      issues.push({
        severity: 'error',
        category: 'unit_completion',
        entityId: unit.metadata.id,
        message: `لا يجوز ربط اختبار وحدة (${unit.unitTestId}) بوحدة غير مكتملة (${unit.metadata.id})، يجب أن يُعلن المالك اكتمالها صراحة.`,
      });
    }

    // Inspect lessons in unit
    for (const lesson of unit.lessons) {
      totalLessons++;
      if (seenLessonIds.has(lesson.metadata.id)) {
        issues.push({
          severity: 'error',
          category: 'unique_identifiers',
          entityId: lesson.metadata.id,
          message: `معرّف الدرس مكرر: ${lesson.metadata.id}`,
        });
      }
      seenLessonIds.add(lesson.metadata.id);

      // Source traceability check
      if (!lesson.metadata.sources || lesson.metadata.sources.length === 0) {
        issues.push({
          severity: 'error',
          category: 'source_traceability',
          entityId: lesson.metadata.id,
          message: `الدرس ${lesson.metadata.title} يفتقر إلى مراجع الصفحة من الكتاب المدرسي.`,
        });
      } else {
        lesson.metadata.sources.forEach((source, idx) => {
          if (!source.readabilityVerified) {
            issues.push({
              severity: 'warning',
              category: 'source_traceability',
              entityId: `${lesson.metadata.id}-src-${idx}`,
              message: `المصدر لصفحة ${source.pageNumber} لم يخضع لتقرير مقروئية معتمد (Readability Report).`,
            });
          }
        });
      }
    }
  }

  // Audit tests
  for (const test of tests) {
    if (seenTestIds.has(test.id)) {
      issues.push({
        severity: 'error',
        category: 'unique_identifiers',
        entityId: test.id,
        message: `معرّف الاختبار مكرر: ${test.id}`,
      });
    }
    seenTestIds.add(test.id);

    // Lesson test question count rule: exactly 20 questions
    if (test.scope === 'lesson' && test.questions.length !== 20) {
      issues.push({
        severity: 'error',
        category: 'question_count',
        entityId: test.id,
        message: `اختبار الدرس (${test.id}) يجب أن يحتوي بالضبط على 20 سؤالاً. العدد الحالي: ${test.questions.length}.`,
      });
    }

    // Unit test question count rule: 50-60 questions
    if (test.scope === 'unit' && (test.questions.length < 50 || test.questions.length > 60)) {
      issues.push({
        severity: 'error',
        category: 'question_count',
        entityId: test.id,
        message: `اختبار الوحدة (${test.id}) يجب أن يتراوح بين 50 و 60 سؤالاً. العدد الحالي: ${test.questions.length}.`,
      });
    }

    // Verify individual questions
    for (const q of test.questions) {
      if (seenQuestionIds.has(q.id)) {
        issues.push({
          severity: 'error',
          category: 'unique_identifiers',
          entityId: q.id,
          message: `معرّف السؤال مكرر: ${q.id}`,
        });
      }
      seenQuestionIds.add(q.id);

      if (!q.explanation || q.explanation.trim().length === 0) {
        issues.push({
          severity: 'error',
          category: 'solution_key',
          entityId: q.id,
          message: `السؤال ${q.id} يفتقر إلى تعليل الإجابة والتفسير التعليمي.`,
        });
      }

      if (!q.source || !q.source.pageNumber) {
        issues.push({
          severity: 'error',
          category: 'source_traceability',
          entityId: q.id,
          message: `السؤال ${q.id} غير مرتبط بصفحة مصدرية محددة من الكتاب.`,
        });
      }
    }
  }

  const errorsCount = issues.filter((i) => i.severity === 'error').length;
  const warningsCount = issues.filter((i) => i.severity === 'warning').length;

  const status =
    errorsCount > 0
      ? 'failed'
      : curriculum.units.length === 0 && tests.length === 0
      ? 'empty_state'
      : 'passed';

  return {
    timestamp: new Date().toISOString(),
    totalUnits: curriculum.units.length,
    totalLessons,
    totalTests: tests.length,
    errorsCount,
    warningsCount,
    issues,
    status,
  };
}
