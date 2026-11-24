import { DeclaredAbsenceLessonSolutions } from '../../types/curriculum';
import { U2L3_ACTIVITIES } from './activities';

/**
 * بِالْعِلْمِ تَرْقَى — unit2 / unit2-lesson3 (ص٦٢–٧١)
 *
 * DECLARED ABSENCE, NOT AN EMPTY GUIDE (owner decisions D1 + D3).
 *
 * The supplied source carries NO approved answer key for this lesson, so the
 * lesson is registered in the teacher portal with a DOCUMENTED ABSENCE instead
 * of an invented guide. This model carries no solutions, no objectives, no
 * notes and no answer text of any kind: `DeclaredAbsenceLessonSolutions`
 * forbids them structurally, and audit rule A8 rejects the record if any such
 * field ever appears. Adding optional solution fields therefore cannot be used
 * to smuggle unapproved content past the audit (D6).
 *
 * The 43 `sourceRecords` below are the lesson's OWN activity ledger
 * (source activity id → lesson step → printed page), so the teacher can see
 * exactly which printed tasks exist and which step each belongs to. They are
 * NOT solutions, and no answer is implied by their presence.
 */
export const U2L3_SOLUTIONS_DECLARATION: DeclaredAbsenceLessonSolutions = {
  kind: 'declared_absence',
  lessonId: 'unit2-lesson3',
  unitId: 'unit2',
  declaration: {
    reason:
      'المنهاج السوري المتاح لا يتضمن مفتاح إجابة معتمدًا لهذا الدرس: لا حلول رسمية للتدريبات المطبوعة، ولا تصحيح آلي، ولا درجات. عرض أي «حل» هنا سيكون تخمينًا، وقد منع المالك صراحةً اختراع الإجابات أو استنتاجها من نصّ الدرس.',
    sourceRef: 'docs/source-locks/unit2-lesson-03-bil-ilmi-tarqa.md',
    declaredOn: '2026-11-23',
    deferredContentTask:
      'مهمة محتوى مستقلة لاحقًا (خارج نطاق هذا العمل): الحصول على مفتاح الإجابة المعتمد من المصدر الرسمي أو من صاحب المشروع، ثم إدخال الحلول المصدَّقة وتحويل هذا السجل إلى دليل معلم معتمد (kind: \'approved\') بعد اجتياز التدقيق.',
  },
  /*
   * كل سجل مصدر مدقق في الدرس، بترتيب الطباعة: نشاط المصدر ← خطوة الدرس ← الصفحة.
   * عدد السجلات = عدد الأنشطة في ./activities.ts؛ قاعدة التدقيق A9 ترفض أي اختلاف.
   */
  sourceRecords: [
  { sourceActivityId: 'U2L3-61-01', lessonStepId: 'u2l3-s1', pageNumber: 61 },
  { sourceActivityId: 'U2L3-61-02', lessonStepId: 'u2l3-s1', pageNumber: 61 },
  { sourceActivityId: 'U2L3-61-03', lessonStepId: 'u2l3-s1', pageNumber: 61 },
  { sourceActivityId: 'U2L3-61-04', lessonStepId: 'u2l3-s1', pageNumber: 61 },
  { sourceActivityId: 'U2L3-61-05', lessonStepId: 'u2l3-s1', pageNumber: 61 },
  { sourceActivityId: 'U2L3-62-01', lessonStepId: 'u2l3-s2', pageNumber: 62 },
  { sourceActivityId: 'U2L3-62-02', lessonStepId: 'u2l3-s2', pageNumber: 62 },
  { sourceActivityId: 'U2L3-62-03', lessonStepId: 'u2l3-s2', pageNumber: 62 },
  { sourceActivityId: 'U2L3-63-01', lessonStepId: 'u2l3-s3', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-02', lessonStepId: 'u2l3-s3', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-03', lessonStepId: 'u2l3-s3', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-04', lessonStepId: 'u2l3-s3', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-05', lessonStepId: 'u2l3-s3', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-06', lessonStepId: 'u2l3-s4', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-07', lessonStepId: 'u2l3-s4', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-08', lessonStepId: 'u2l3-s4', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-09', lessonStepId: 'u2l3-s4', pageNumber: 63 },
  { sourceActivityId: 'U2L3-63-10', lessonStepId: 'u2l3-s4', pageNumber: 63 },
  { sourceActivityId: 'U2L3-64-01', lessonStepId: 'u2l3-s5', pageNumber: 64 },
  { sourceActivityId: 'U2L3-64-02', lessonStepId: 'u2l3-s5', pageNumber: 64 },
  { sourceActivityId: 'U2L3-64-03', lessonStepId: 'u2l3-s5', pageNumber: 64 },
  { sourceActivityId: 'U2L3-64-04', lessonStepId: 'u2l3-s5', pageNumber: 64 },
  { sourceActivityId: 'U2L3-64-05', lessonStepId: 'u2l3-s5', pageNumber: 64 },
  { sourceActivityId: 'U2L3-65-01', lessonStepId: 'u2l3-s6', pageNumber: 65 },
  { sourceActivityId: 'U2L3-65-02', lessonStepId: 'u2l3-s6', pageNumber: 65 },
  { sourceActivityId: 'U2L3-66-01', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-02', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-03', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-04', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-05', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-06', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-07', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-66-08', lessonStepId: 'u2l3-s7', pageNumber: 66 },
  { sourceActivityId: 'U2L3-67-01', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-02', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-03', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-04', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-05', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-06', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-67-07', lessonStepId: 'u2l3-s8', pageNumber: 67 },
  { sourceActivityId: 'U2L3-68-01', lessonStepId: 'u2l3-s9', pageNumber: 68 },
  { sourceActivityId: 'U2L3-68-02', lessonStepId: 'u2l3-s9', pageNumber: 68 },
  { sourceActivityId: 'U2L3-68-03', lessonStepId: 'u2l3-s9', pageNumber: 68 },
  ],
};

/** عدد سجلات المصدر المعلنة — يُستخدم في التدقيق والاختبارات. */
export const U2L3_DECLARED_RECORD_COUNT = 43;

/*
 * Ledger invariant, asserted at module load: the declaration must mirror the
 * lesson's real activity list exactly — same ids, same order. A future activity
 * added without extending the declaration fails loudly here (and in the audit),
 * instead of leaving the teacher portal quietly stale.
 */
if (U2L3_ACTIVITIES.map((activity) => activity.sourceActivityId).join('|') !==
    U2L3_SOLUTIONS_DECLARATION.sourceRecords.map((record) => record.sourceActivityId).join('|')) {
  throw new Error('unit2Lesson3/solutions.ts: سجل الغياب المعلن لا يطابق قائمة أنشطة المصدر');
}
