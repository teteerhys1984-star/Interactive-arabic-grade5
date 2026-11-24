import {
  CurriculumRegistry,
  AssessmentTest,
  ApprovedLessonSolutions,
  DeclaredAbsenceLessonSolutions,
  TeacherSolutionsModel,
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
    | 'unit_completion'
    | 'activity_coverage'
    | 'answer_disclosure'
    | 'declared_absence';
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
  teacherGuides: TeacherSolutionsModel[] = []
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

    // Unit review rule: the official unit review (تقويم الوحدة) is never a
    // lesson — its identifier must not appear in the lessons list.
    if (unit.reviewId && unit.lessons.some((lesson) => lesson.metadata.id === unit.reviewId)) {
      issues.push({
        severity: 'error',
        category: 'curriculum_integrity',
        entityId: unit.metadata.id,
        message: `تقويم الوحدة (${unit.reviewId}) مسجَّل كدرس في الوحدة (${unit.metadata.id})؛ التقويم عنصر تقويمي مستقل وليس درساً.`,
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
      } else if (q.type === 'matching') {
        const leftValues = q.pairs.map((pair) => pair.left);
        const rightValues = q.pairs.map((pair) => pair.right);
        if (
          q.pairs.length === 0 ||
          new Set(leftValues).size !== leftValues.length ||
          new Set(rightValues).size !== rightValues.length
        ) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `أزواج المطابقة للسؤال ${q.id} غير صالحة أو مكررة.`,
          });
        }
      } else if (q.type === 'error_analysis') {
        if (q.correctionOptions && (!q.correctOptionId || !q.correctionOptions.some((choice) => choice.id === q.correctOptionId))) {
          issues.push({
            severity: 'error',
            category: 'solution_key',
            entityId: q.id,
            message: `خيار تصويب الخطأ للسؤال ${q.id} لا يطابق خياراته.`,
          });
        }
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* 5.c SOLUTIONS MODEL — approved guide vs declared absence (A1–A11) */
  /* ---------------------------------------------------------------- */

  const registeredLessons = new Map<string, { unitId: string; title: string }>();
  for (const unit of curriculum.units) {
    for (const lesson of unit.lessons) {
      registeredLessons.set(lesson.metadata.id, {
        unitId: unit.metadata.id,
        title: lesson.metadata.title,
      });
    }
  }

  /** One record may not be registered twice for the same lesson. */
  const seenSolutionLessonIds = new Set<string>();

  for (const guide of teacherGuides) {
    const lesson = registeredLessons.get(guide.lessonId);

    /* A1 — a solutions record must belong to a registered lesson. */
    if (!lesson) {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `سجل حلول (${guide.lessonId}) لا يطابق أي درس مسجل في المنهج؛ لا يعرض ولا يهمل صامتًا.`,
      });
      continue;
    }

    /* A2 — the declared unit must be the registry unit of that lesson. */
    if (guide.unitId !== lesson.unitId) {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `سجل حلول (${guide.lessonId}) يعلن الوحدة ${guide.unitId} بينما الدرس المسجل في ${lesson.unitId}.`,
      });
    }

    /* A3 — one solutions record per lesson, never two competing models. */
    if (seenSolutionLessonIds.has(guide.lessonId)) {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `الدرس ${guide.lessonId} له أكثر من سجل حلول؛ لا يجوز أن يجتمع دليل معتمد وإعلان غياب معًا.`,
      });
    }
    seenSolutionLessonIds.add(guide.lessonId);

    /* A4 — `kind` is mandatory: presence of text never implies approval. */
    const kind = (guide as { kind?: unknown }).kind;
    if (kind !== 'approved' && kind !== 'declared_absence') {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: guide.lessonId,
        message: `سجل حلول (${guide.lessonId}) لا يعلن نوعه (kind) صراحةً: approved أو declared_absence. لا يُستنتج الاعتماد من وجود نصّ.`,
      });
      continue;
    }

    if (kind === 'declared_absence') {
      const declared = guide as unknown as DeclaredAbsenceLessonSolutions;
      const declaration = declared.declaration;

      /* A5 — the declared absence must be documented, not an empty record. */
      if (!declaration) {
        issues.push({
          severity: 'error',
          category: 'declared_absence',
          entityId: guide.lessonId,
          message: `إعلان الغياب (${guide.lessonId}) بلا بيان موثق (declaration).`,
        });
      } else {
        const required: (keyof typeof declaration)[] = [
          'reason',
          'sourceRef',
          'declaredOn',
          'deferredContentTask',
        ];
        for (const field of required) {
          const value = declaration[field];
          if (typeof value !== 'string' || value.trim().length === 0) {
            issues.push({
              severity: 'error',
              category: 'declared_absence',
              entityId: guide.lessonId,
              message: `إعلان الغياب (${guide.lessonId}) يفتقر إلى الحقل الإلزامي «${field}»؛ الغياب بلا مصدر وتاريخ ومهمة لاحقة ليس توثيقًا.`,
            });
          }
        }
      }

      /*
       * A6/A7 — a declared absence may not carry solutions, notes, or any answer
       * text. Optional fields are NOT an audit loophole (owner D6): the presence
       * of any of them is an error, not a warning.
       */
      const forbidden = [
        'exerciseSolutions',
        'sourceCoverage',
        'grammarNotes',
        'spellingRules',
        'sourceAlerts',
        'lessonTestAnswerKeyRef',
        'pedagogicalObjectives',
      ] as const;
      for (const field of forbidden) {
        const value = (declared as unknown as Record<string, unknown>)[field];
        const present = Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null;
        if (present) {
          issues.push({
            severity: 'error',
            category: 'declared_absence',
            entityId: guide.lessonId,
            message: `إعلان الغياب (${guide.lessonId}) يحمل المحتوى الممنوع «${field}»؛ إعلان الغياب لا يحتوي حلولًا ولا أهدافًا ولا مفاتيح.`,
          });
        }
      }

      /* A9 — the audited source ledger must be non-empty and unique. */
      const records = declared.sourceRecords;
      if (!Array.isArray(records) || records.length === 0) {
        issues.push({
          severity: 'error',
          category: 'declared_absence',
          entityId: guide.lessonId,
          message: `إعلان الغياب (${guide.lessonId}) بلا سجل مصادر مدقق (sourceRecords).`,
        });
      } else {
        const seenSourceIds = new Set<string>();
        records.forEach((record) => {
          if (!record.sourceActivityId || !record.lessonStepId || !record.pageNumber) {
            issues.push({
              severity: 'error',
              category: 'declared_absence',
              entityId: guide.lessonId,
              message: `سجل مصدر ناقص في إعلان الغياب (${guide.lessonId}): يلزم معرّف النشاط وخطوة الدرس ورقم الصفحة.`,
            });
          }
          if (seenSourceIds.has(record.sourceActivityId)) {
            issues.push({
              severity: 'error',
              category: 'declared_absence',
              entityId: guide.lessonId,
              message: `سجل الغياب (${guide.lessonId}) يكرر نشاط المصدر ${record.sourceActivityId}.`,
            });
          }
          seenSourceIds.add(record.sourceActivityId);
        });
      }
      continue;
    }

    const approved = guide as ApprovedLessonSolutions;

    /* A10 — an approved guide must actually carry approved solutions. */
    if (!Array.isArray(approved.exerciseSolutions) || approved.exerciseSolutions.length === 0) {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: approved.lessonId,
        message: `دليل المعلم المعتمد (${approved.lessonId}) لا يحتوي على حلول تدريبات؛ إن لم توجد حلول معتمدة فيجب تسجيل غياب معلن بدل دليل فارغ.`,
      });
    }

    if (!Array.isArray(approved.pedagogicalObjectives) || approved.pedagogicalObjectives.length === 0) {
      issues.push({
        severity: 'error',
        category: 'solution_key',
        entityId: approved.lessonId,
        message: `دليل المعلم المعتمد (${approved.lessonId}) بلا أهداف تربوية؛ الأهداف اختيارية في إعلان الغياب فقط، وليست كذلك في الدليل المعتمد.`,
      });
    }

    /* A11 — every approved solution must be complete and sourced. */
    approved.exerciseSolutions?.forEach((solution, index) => {
      if (!solution.sourceExercise?.trim() || !solution.officialSolution?.trim()) {
        issues.push({
          severity: 'error',
          category: 'solution_key',
          entityId: `${approved.lessonId}-solution-${index}`,
          message: `حل معلم ناقص في ${approved.lessonId}: يلزم نصّ التمرين ونصّ الحل المعتمد.`,
        });
      }
      if (!Number.isFinite(solution.pageNumber) || solution.pageNumber <= 0) {
        issues.push({
          severity: 'error',
          category: 'source_traceability',
          entityId: `${approved.lessonId}-solution-${index}`,
          message: `حل معلم في ${approved.lessonId} بلا رقم صفحة صالح.`,
        });
      }
    });

    /* Approved guide ↔ registered assessment answer key. */
    const refTest = tests.find((t) => t.id === approved.lessonTestAnswerKeyRef);
    if (!refTest) {
      issues.push({
        severity: 'warning',
        category: 'solution_key',
        entityId: approved.lessonId,
        message: `دليل المعلم (${approved.lessonId}) يشير إلى اختبار غير مسجل (${approved.lessonTestAnswerKeyRef}).`,
      });
    }

    if (approved.sourceCoverage) {
      const solutionIds = approved.exerciseSolutions
        .map((solution) => solution.id)
        .filter((id): id is string => Boolean(id));
      const seenSourceActivityIds = new Set<string>();
      const seenLessonActivityIds = new Set<string>();
      const seenTeacherSolutionIds = new Set<string>();

      approved.sourceCoverage.forEach((entry) => {
        if (seenSourceActivityIds.has(entry.sourceActivityId)) {
          issues.push({
            severity: 'error',
            category: 'activity_coverage',
            entityId: approved.lessonId,
            message: `سجل التغطية في ${approved.lessonId} يكرر نشاط المصدر ${entry.sourceActivityId}.`,
          });
        }
        seenSourceActivityIds.add(entry.sourceActivityId);

        if (seenLessonActivityIds.has(entry.lessonActivityId)) {
          issues.push({
            severity: 'error',
            category: 'activity_coverage',
            entityId: approved.lessonId,
            message: `سجل التغطية في ${approved.lessonId} يكرر نشاط الطالب ${entry.lessonActivityId}.`,
          });
        }
        seenLessonActivityIds.add(entry.lessonActivityId);

        if (seenTeacherSolutionIds.has(entry.teacherSolutionId)) {
          issues.push({
            severity: 'error',
            category: 'activity_coverage',
            entityId: approved.lessonId,
            message: `سجل التغطية في ${approved.lessonId} يكرر حل المعلم ${entry.teacherSolutionId}.`,
          });
        }
        seenTeacherSolutionIds.add(entry.teacherSolutionId);

        if (!solutionIds.includes(entry.teacherSolutionId)) {
          issues.push({
            severity: 'error',
            category: 'activity_coverage',
            entityId: approved.lessonId,
            message: `نشاط المصدر ${entry.sourceActivityId} لا يرتبط بحل معلم موجود (${entry.teacherSolutionId}).`,
          });
        }
      });

      if (approved.sourceCoverage.length !== approved.exerciseSolutions.length) {
        issues.push({
          severity: 'error',
          category: 'activity_coverage',
          entityId: approved.lessonId,
          message: `عدد سجلات تغطية المصدر (${approved.sourceCoverage.length}) لا يطابق عدد حلول المعلم (${approved.exerciseSolutions.length}).`,
        });
      }
    }
  }

  /* A12 — a registered lesson with NO solutions record must be visible. */
  for (const [lessonId] of registeredLessons) {
    if (!seenSolutionLessonIds.has(lessonId)) {
      issues.push({
        severity: 'info',
        category: 'solution_key',
        entityId: lessonId,
        message: `الدرس ${lessonId} غير مسجل في بوابة المعلم: لا دليل معتمد ولا إعلان غياب موثق.`,
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
