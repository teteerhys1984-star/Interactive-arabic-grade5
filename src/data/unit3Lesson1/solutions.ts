import { DeclaredAbsenceLessonSolutions } from '../../types/curriculum';
import { U3L1_ACTIVITIES } from './activities';

/**
 * العُلَماءُ الصِّغار — unit3 / unit3-lesson1 (ص٧٣–٨٣)
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
 * The 57 `sourceRecords` below are the lesson's OWN activity ledger
 * (source activity id → lesson step → printed page), so the teacher can see
 * exactly which printed tasks exist and which step each belongs to. They are
 * NOT solutions, and no answer is implied by their presence.
 */
export const U3L1_SOLUTIONS_DECLARATION: DeclaredAbsenceLessonSolutions = {
  kind: 'declared_absence',
  lessonId: 'unit3-lesson1',
  unitId: 'unit3',
  declaration: {
    reason:
      'المنهاج السوري المتاح لا يتضمن مفتاح إجابة معتمدًا لهذا الدرس: لا حلول رسمية للتدريبات المطبوعة، ولا تصحيح آلي، ولا درجات. لذلك لا يظهر في البوابة أي «حل معتمد» ولا مفاتيح ولا درجات. هذا لا يعني أن الدرس بلا مساندة تعليمية: الطالب يرى «أظهر الجواب» مع إرشادات مقترحة أعدّتها المنصة لكل نشاط قابل للإجابة (٥٢ نشاطًا، منها أسئلة الاستماع الثلاثة بإرشادات **شرطية** مستندة إلى القصيدة المطبوعة ص٧٤، لا تفريغًا للتسجيل ولا حسمًا لأسئلته)، وهي موسومة صراحةً بأنها ليست من الكتاب ولا من دليل المعلّم. أما الأنشطة الخمسة التي تحتاج أثرًا غير موجود في المصدر (نماذج الخط اليدوية) فتبقى بلا إجابة معلنة مع بيان السبب.',
    sourceRef: 'docs/source-locks/unit3-lesson-01-al-ulama-as-sighar.md',
    declaredOn: '2026-11-23',
    studentGuidanceNote:
      'إرشادات الطالب في هذا الدرس مقترحة من المنصة (guidance_only) لتعليم المتعلم كيف يجيب، وليست إجابات معتمدة ولا بديلًا عن مفتاح تصحيح رسمي؛ ولذلك لا تدخل هنا ولا تُعدّ حلولًا معتمدة.',
    deferredContentTask:
      'مهمة محتوى مستقلة لاحقًا (خارج نطاق هذا العمل): الحصول على مفتاح الإجابة المعتمد من المصدر الرسمي أو من صاحب المشروع، ثم إدخال الحلول المصدَّقة وتحويل هذا السجل إلى دليل معلم معتمد (kind: \'approved\') بعد اجتياز التدقيق؛ وعندها يُراجع تصنيف الإرشادات المقترحة ويُرفع ما يثبت له مفتاح معتمد إلى approved_key.',
  },
  /*
   * كل سجل مصدر مدقق في الدرس، بترتيب الطباعة: نشاط المصدر ← خطوة الدرس ← الصفحة.
   * عدد السجلات = عدد الأنشطة في ./activities.ts؛ قاعدة التدقيق A9 ترفض أي اختلاف.
   */
  sourceRecords: [
  { sourceActivityId: 'U3L1-73-01', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-02', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-03', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-04', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-05', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-06', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-73-07', lessonStepId: 'u3l1-s1', pageNumber: 73 },
  { sourceActivityId: 'U3L1-74-01', lessonStepId: 'u3l1-s2', pageNumber: 74 },
  { sourceActivityId: 'U3L1-74-02', lessonStepId: 'u3l1-s2', pageNumber: 74 },
  { sourceActivityId: 'U3L1-74-03', lessonStepId: 'u3l1-s2', pageNumber: 74 },
  { sourceActivityId: 'U3L1-75-01', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-02', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-03', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-04', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-05', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-06', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-07', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-08', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-09', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-75-10', lessonStepId: 'u3l1-s3', pageNumber: 75 },
  { sourceActivityId: 'U3L1-76-01', lessonStepId: 'u3l1-s4', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-02', lessonStepId: 'u3l1-s4', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-03', lessonStepId: 'u3l1-s4', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-04', lessonStepId: 'u3l1-s4', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-05', lessonStepId: 'u3l1-s5', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-06', lessonStepId: 'u3l1-s5', pageNumber: 76 },
  { sourceActivityId: 'U3L1-76-07', lessonStepId: 'u3l1-s5', pageNumber: 76 },
  { sourceActivityId: 'U3L1-77-01', lessonStepId: 'u3l1-s5', pageNumber: 77 },
  { sourceActivityId: 'U3L1-77-02', lessonStepId: 'u3l1-s6', pageNumber: 77 },
  { sourceActivityId: 'U3L1-77-03', lessonStepId: 'u3l1-s6', pageNumber: 77 },
  { sourceActivityId: 'U3L1-77-04', lessonStepId: 'u3l1-s6', pageNumber: 77 },
  { sourceActivityId: 'U3L1-78-01', lessonStepId: 'u3l1-s6', pageNumber: 78 },
  { sourceActivityId: 'U3L1-78-02', lessonStepId: 'u3l1-s6', pageNumber: 78 },
  { sourceActivityId: 'U3L1-78-03', lessonStepId: 'u3l1-s6', pageNumber: 78 },
  { sourceActivityId: 'U3L1-78-04', lessonStepId: 'u3l1-s6', pageNumber: 78 },
  { sourceActivityId: 'U3L1-79-01', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-02', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-03', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-04', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-05', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-06', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-07', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-79-08', lessonStepId: 'u3l1-s7', pageNumber: 79 },
  { sourceActivityId: 'U3L1-80-01', lessonStepId: 'u3l1-s8', pageNumber: 80 },
  { sourceActivityId: 'U3L1-80-02', lessonStepId: 'u3l1-s8', pageNumber: 80 },
  { sourceActivityId: 'U3L1-80-03', lessonStepId: 'u3l1-s8', pageNumber: 80 },
  { sourceActivityId: 'U3L1-80-04', lessonStepId: 'u3l1-s8', pageNumber: 80 },
  { sourceActivityId: 'U3L1-80-05', lessonStepId: 'u3l1-s8', pageNumber: 80 },
  { sourceActivityId: 'U3L1-81-01', lessonStepId: 'u3l1-s9', pageNumber: 81 },
  { sourceActivityId: 'U3L1-81-02', lessonStepId: 'u3l1-s9', pageNumber: 81 },
  { sourceActivityId: 'U3L1-81-03', lessonStepId: 'u3l1-s9', pageNumber: 81 },
  { sourceActivityId: 'U3L1-82-01', lessonStepId: 'u3l1-s9', pageNumber: 82 },
  { sourceActivityId: 'U3L1-82-02', lessonStepId: 'u3l1-s9', pageNumber: 82 },
  { sourceActivityId: 'U3L1-82-03', lessonStepId: 'u3l1-s9', pageNumber: 82 },
  { sourceActivityId: 'U3L1-82-04', lessonStepId: 'u3l1-s9', pageNumber: 82 },
  { sourceActivityId: 'U3L1-83-01', lessonStepId: 'u3l1-s10', pageNumber: 83 },
  { sourceActivityId: 'U3L1-83-02', lessonStepId: 'u3l1-s10', pageNumber: 83 },
  ],
};

/** عدد سجلات المصدر المعلنة — يُستخدم في التدقيق والاختبارات. */
export const U3L1_DECLARED_RECORD_COUNT = 57;

/*
 * Ledger invariant, asserted at module load: the declaration must mirror the
 * lesson's real activity list exactly — same ids, same order. A future activity
 * that is added without extending the declaration fails loudly here (and in the
 * audit/CI), instead of leaving the teacher portal quietly stale.
 */
if (U3L1_ACTIVITIES.map((activity) => activity.sourceActivityId).join('|') !==
    U3L1_SOLUTIONS_DECLARATION.sourceRecords.map((record) => record.sourceActivityId).join('|')) {
  throw new Error('src/data/unit3Lesson1/solutions.ts: سجل الغياب المعلن لا يطابق قائمة أنشطة المصدر');
}
