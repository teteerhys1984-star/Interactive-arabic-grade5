import {
  CurriculumRegistry,
  AssessmentTest,
  TeacherLessonGuide,
} from '../types/curriculum';

/**
 * Normalizes Arabic text for duplicate detection: strips diacritics/tatweel,
 * unifies Arabic-Indic digits to Latin, and collapses whitespace.
 */
function normalizeArabic(text: string): string {
  return text
    .replace(/[ً-ْـ]/g, '')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٤٥٦٧٨٩'.indexOf(d)))
    .replace(/\s+/g, ' ')
    .trim();
}

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
  teacherGuides: TeacherLessonGuide[] = []
): AuditReport {
  const issues: AuditIssue[] = [];

  const seenUnitIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenTestIds = new Set<string>();
  const seenQuestionIds = new Set<string>();
  const seenPrompts = new Map<string, string>();

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

      // Duplicate / numeric-normalized prompt detection
      const normPrompt = normalizeArabic(q.prompt);
      const prior = seenPrompts.get(normPrompt);
      if (prior) {
        issues.push({
          severity: 'error',
          category: 'unique_identifiers',
          entityId: q.id,
          message: `محتوى السؤال ${q.id} مكرر مع السؤال ${prior}.`,
        });
      } else {
        seenPrompts.set(normPrompt, q.id);
      }

      // Answer-key validity per question type
      if (
        q.type === 'single_choice' ||
        q.type === 'true_false' ||
        q.type === 'reading_comprehension' ||
        q.type === 'grammar_application' ||
        q.type === 'vocabulary_in_context'
      ) {
        if (!q.choices.some((c) => c.id === q.correctChoiceId)) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `مفتاح الإجابة للسؤال ${q.id} لا يطابق أي خيار متاح.`,
          });
        }
      } else if (q.type === 'multi_select') {
        if (q.correctChoiceIds.length === 0 || !q.correctChoiceIds.every((id) => q.choices.some((c) => c.id === id))) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `مفاتيح الإجابة للسؤال ${q.id} غير صالحة.`,
          });
        }
      } else if (q.type === 'fill_blank' || q.type === 'text_input' || q.type === 'sentence_correction') {
        if (!q.acceptedAnswers || q.acceptedAnswers.length === 0) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `السؤال ${q.id} يفتقر إلى إجابات مقبولة.`,
          });
        }
      } else if (q.type === 'ordering') {
        const ids = q.items.map((i) => i.id).sort().join(',');
        const ord = [...q.correctOrderIds].sort().join(',');
        if (ids !== ord) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `ترتيب الإجابة للسؤال ${q.id} لا يطابق عناصره.`,
          });
        }
      } else if (q.type === 'classification') {
        if (!q.items.every((i) => q.categories.some((c) => c.id === i.correctCategoryId))) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `فئات التصنيف للسؤال ${q.id} غير صالحة.`,
          });
        }
      }
    }
  }

  // Teacher-guide ↔ test answer-key mapping
  for (const guide of teacherGuides) {
    const refTest = tests.find((t) => t.id === guide.lessonTestAnswerKeyRef);
    if (!refTest) {
      issues.push({
        severity: 'warning',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `دليل المعلم (${guide.lessonId}) يشير إلى اختبار غير مسجل (${guide.lessonTestAnswerKeyRef}).`,
      });
    }
    if (guide.exerciseSolutions.length === 0) {
      issues.push({
        severity: 'warning',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `دليل المعلم (${guide.lessonId}) لا يحتوي على حلول تدريبات.`,
      });
    }
  }

  // Source readability/uncertainty surfacing
  for (const unit of curriculum.units) {
    for (const lesson of unit.lessons) {
      lesson.metadata.sources.forEach((s, idx) => {
        if (s.uncertaintyNote) {
          issues.push({
            severity: 'warning',
            category: 'source_traceability',
            entityId: `${lesson.metadata.id}-src-${idx}`,
            message: `صفحة ${s.pageNumber}: ${s.uncertaintyNote}`,
          });
        }
      });
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
