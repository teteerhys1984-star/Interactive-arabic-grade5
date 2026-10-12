import {
  UNIT1_REVIEW_CLOSING,
  UNIT1_REVIEW_INSTRUCTIONS,
  UNIT1_REVIEW_QUESTIONS,
  UNIT1_REVIEW_TIMING,
  ReviewQuestion,
  ReviewSubpart,
} from './reviewItems';
import { UNIT1_REVIEW_SOURCE_LOCK, auditUnit1ReviewCoverage, ReviewCoverageAuditReport } from './sourceAudit';
import { REVIEW_SOURCE_UNCERTAINTIES, ReviewSourceUncertainty } from './sourceMeta';

/**
 * Teacher Area model for «تقويم الوحدة الأولى».
 *
 * The solutions themselves live on each student subpart (single source of truth):
 * student element → teacher solution. This guide assembles them per page/question
 * for the Teacher Area and exposes the coverage audit, without duplicating any
 * answer text.
 */

export interface ReviewTeacherPage {
  page: number;
  heading: string;
  /** Non-question printed records of the page (timing / instructions / closing). */
  records: { id: string; title: string }[];
  questions: ReviewQuestion[];
}

export interface Unit1ReviewTeacherGuide {
  reviewId: string;
  unitId: string;
  title: string;
  pageRange: { startPage: number; endPage: number };
  printedQuestions: number;
  printedBranches: number;
  records: number;
  pedagogicalObjectives: string[];
  grammarNotes: string[];
  spellingRules: string[];
  expressionNotes: string[];
  crossUnitReferences: string[];
  sourceLimits: ReviewSourceUncertainty[];
  audit: ReviewCoverageAuditReport;
  pages: ReviewTeacherPage[];
  ungradedSubpartIds: string[];
}

export const UNIT1_REVIEW_TEACHER_GUIDE: Unit1ReviewTeacherGuide = {
  reviewId: 'unit1-review',
  unitId: 'unit1',
  title: 'حلول تقويم الوحدة الأولى',
  pageRange: { startPage: 36, endPage: 38 },
  printedQuestions: UNIT1_REVIEW_QUESTIONS.length,
  printedBranches: UNIT1_REVIEW_QUESTIONS.reduce((total, question) => total + question.subparts.length, 0),
  records: UNIT1_REVIEW_SOURCE_LOCK.length,
  pedagogicalObjectives: [
    'مراجعة شاملة لما تعلّمه المتعلم في دروس الوحدة الأولى الثلاثة: الفهم القرائي، والمصادر، وأركان الجملة، والهمزتان، والتعبير الكتابي.',
    'تدريب المتعلم على تمييز العبارة الصحيحة من غير الصحيحة وتصويب الخطأ بالدليل من النصّ.',
    'تثبيت مهارات التصنيف (اسم/فعل/حرف) واستخراج السبب والنتائج من العبارة.',
    'تدريب المتعلم على تحليل الكلمة: فعلها ونوعها ومعناها وضدّها.',
    'ضبط التمييز بين الهمزة الأولية وهمزة الوصل وهمزة القطع كتابةً ونطقاً.',
    'إتاحة تقويم ذاتي ختامي عبر بندي خاتمة الوحدة (ما أضيفه إلى معلوماتي / المهارة التي أتقنها).',
  ],
  grammarNotes: [
    'أركان الجملة الفعلية: فعل وفاعل، ويُزاد المفعول به عند تعدّي الفعل (الدرس الثالث ص ٢٩).',
    'الجملة الاسمية: مبتدأ وخبر، ويُفرَّق بينها وبين الجملة الفعلية ببدايتها.',
    'المصدر: اسم من جنس الفعل يدل على حدث مجرّد من الزمن (الدرس الثاني ص ١٧).',
    'أنواع الكلمة: اسم (يقبل «ال» والتنوين)، فعل (يدل على حدث وزمن)، حرف (لا يستقل بالمعنى).',
    'في «بالرأي» و«والرأي» تجتمع الباء والواو (حروف) مع الاسم؛ يُنبَّه المتعلم إلى التفريق بينهما عند التصنيف.',
    'الإعراب يُطلب كاملاً: موضع الكلمة + حالتها + علامتها (مثل: مفعول به منصوب وعلامة نصبه الفتحة الظاهرة).',
  ],
  spellingRules: [
    'الهمزة الأولية: الهمزة الواقعة في أول الكلمة، وهي قسمان: همزة قطع وهمزة وصل (الدرس الأول ص ٩).',
    'همزة القطع: تُكتب وتُلفظ دائماً، وتُرسم فوق الألف (أَ/أُ) أو تحته (إِ).',
    'همزة الوصل: تُكتب ألفاً بلا رأس همزة، وتُلفظ في أول الكلام وتسقط عند الوصل. مواضعها: أمر الثلاثي، وماضي الخماسي والسداسي وأمرهما ومصدرهما، وفي الأسماء: ابن، ابنة، امرؤ، امرأة، اثنان، اثنتان، اسم.',
    'رابط داخل الوحدة: «إعلان» في السؤال ٦ مصدر رباعي بهمزة قطع (إ)، ويظهر في السؤال ٧ كتطبيق مباشر على همزة القطع.',
  ],
  expressionNotes: [
    'السؤال ٣ فقرة كتابية حرّة تشتمل التراكيب الثلاثة المطبوعة؛ لا يُشترط عدد أسطر ولا يُنسخ نصّ نموذجي، ويُقاس الترابط ووجود التراكيب.',
    'خاتمة الوحدة (البندان) تقويم ذاتي لا يُعطى عليه درجة، ويُستثمر في التخطيط للدعم.',
  ],
  crossUnitReferences: [
    'نصّ الدرس الأول «السمكة الذهبية» (ص ٥): فكرة الصيّاد الشابّ واصطياد سمكة إضافية واحدة كل يوم.',
    'الدرس الأول ص ٩: الهَمْزَةُ الأَوَّلِيَّةُ وهمزة القطع/الوصل.',
    'الدرس الثاني ص ١٦: متطلبات إجراء مقابلة صحفية (ستة متطلبات).',
    'الدرس الثاني ص ١٧: قاعدة المصدر «اسم من جنس الفعل يدل على حدث مجرّد من الزمن».',
    'الدرس الثالث ص ٢٦: قصيدة «لُغَتي» وفيها «تَقارُبُ الأَرواح» و«تَباعُدُ الأَجساد».',
    'الدرس الثالث ص ٢٩: أركان الجملة الفعلية.',
    'الدرس الثالث ص ٣٠–٣٢: همزة الوصل وتقويمها.',
  ],
  sourceLimits: REVIEW_SOURCE_UNCERTAINTIES,
  audit: auditUnit1ReviewCoverage(),
  pages: [
    {
      page: 36,
      heading: 'الصفحة ٣٦: تعليمات التقويم والسؤال ١',
      records: [
        { id: UNIT1_REVIEW_TIMING.id, title: 'مهمة ضبط الوقت (الساعتان — غير مقوَّمة)' },
        { id: UNIT1_REVIEW_INSTRUCTIONS.id, title: 'تعليمات التقويم (٤ بنود — غير مقوَّمة)' },
      ],
      questions: UNIT1_REVIEW_QUESTIONS.filter((question) => question.page === 36),
    },
    {
      page: 37,
      heading: 'الصفحة ٣٧: الأسئلة ٢ و٣ و٤ و٥',
      records: [],
      questions: UNIT1_REVIEW_QUESTIONS.filter((question) => question.page === 37),
    },
    {
      page: 38,
      heading: 'الصفحة ٣٨: السؤالان ٦ و٧ وخاتمة الوحدة',
      records: [{ id: UNIT1_REVIEW_CLOSING.id, title: 'خاتمة الوحدة (بندان — تقويم ذاتي)' }],
      questions: UNIT1_REVIEW_QUESTIONS.filter((question) => question.page === 38),
    },
  ],
  ungradedSubpartIds: [
    ...UNIT1_REVIEW_TIMING.subparts.map((subpart) => subpart.id),
    ...UNIT1_REVIEW_INSTRUCTIONS.subparts.map((subpart) => subpart.id),
    ...UNIT1_REVIEW_CLOSING.subparts.map((subpart) => subpart.id),
  ],
};

/** Convenience selector used by the Teacher Area UI. */
export function getReviewSubpartsOfQuestion(question: ReviewQuestion): ReviewSubpart[] {
  return question.subparts;
}
