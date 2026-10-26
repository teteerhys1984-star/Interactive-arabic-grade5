import { CurriculumRegistry, Lesson, Unit, UnitReview } from '../types/curriculum';
import { LESSON1_STEPS } from './lesson1/content';
import { src } from './lesson1/sourceMeta';
import { LESSON2_STEPS } from './lesson2/content';
import { lesson2Src } from './lesson2/sourceMeta';
import { LESSON3_STEPS } from './lesson3/content';
import { lesson3Src } from './lesson3/sourceMeta';
import {
  UNIT1_REVIEW_ANSWERABLE_BRANCHES,
  UNIT1_REVIEW_QUESTIONS,
} from './unit1Review/reviewItems';
import { UNIT1_REVIEW_SOURCE_LOCK } from './unit1Review/sourceAudit';
import { UNIT1_REVIEW_TEACHER_GUIDE } from './unit1Review/teacherGuide';
import { UNIT1_REVIEW_DOCUMENT_TITLE } from './unit1Review/sourceMeta';
import { U2L1_STEPS } from './unit2Lesson1/content';
import { u2l1Src, U2L1_LOCKED_SOURCE_NOTES, U2L1_LISTENING_AUDIO_GAP } from './unit2Lesson1/sourceMeta';
import { U2L2_STEPS } from './unit2Lesson2/content';
import { u2l2Src, U2L2_LISTENING_AUDIO_GAP, U2L2_LOCKED_SOURCE_NOTES } from './unit2Lesson2/sourceMeta';

/**
 * Official Curriculum Registry for Grade 5 Arabic.
 *
 * Data-driven: units, lessons, sources and completion state are declared here,
 * never hardcoded in components.
 *
 * CRITICAL UNIT-COMPLETION RULE:
 * Unit 1 is registered with isComplete = false and NO unitTestId.
 * It becomes complete and receives a unit test ONLY after the project owner
 * explicitly declares "هذا هو آخر درس في الوحدة".
 */

const lesson1: Lesson = {
  metadata: {
    id: 'lesson1',
    unitId: 'unit1',
    order: 1,
    title: 'السَّمَكَةُ الذَّهَبِيَّةُ',
    subtitle: 'أحلامي الكبيرة... كيف أُحقّقها؟',
    primarySkill: 'reading_comprehension',
    estimatedMinutes: 45,
    sources: [
      src(4, 'textbook_exercise', 'أَتَأَمَّلُ الصُّورَتَيْنِ'),
      src(5, 'textbook_reading', 'أَقْرَأُ'),
      src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ'),
      src(7, 'textbook_expression', 'أُتَواصَلُ شَفَوِيّاً'),
      src(8, 'textbook_grammar', 'قَواعِدُ اللُّغَةِ'),
      src(9, 'textbook_spelling', 'إملاء'),
      src(10, 'textbook_exercise', 'الخَطُّ وَالتَّعْبيرُ'),
      src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', undefined, 'صَفّا الرموز في النشاط الأول بحاجة إلى قصّ أدق لتحديد الجملتين'),
    ],
  },
  steps: LESSON1_STEPS,
  testId: 'lesson1-test',
};

const lesson2: Lesson = {
  metadata: {
    id: 'lesson2',
    unitId: 'unit1',
    order: 2,
    title: 'بالرأي والرأي الآخر',
    subtitle: 'حوار + حب = حياة',
    primarySkill: 'literary_appreciation',
    estimatedMinutes: 90,
    sources: [
      lesson2Src(12, 'textbook_exercise', 'أتأمل الصور والاستماع'),
      lesson2Src(13, 'textbook_poetry', 'أقرأ'),
      lesson2Src(14, 'textbook_exercise', 'الفهم القرائي'),
      lesson2Src(15, 'textbook_exercise', 'استكمال الفهم والحوار والحفظ'),
      lesson2Src(16, 'textbook_expression', 'مقابلة صحفية'),
      lesson2Src(17, 'textbook_grammar', 'المقابلة الصحفية والمصادر'),
      lesson2Src(18, 'textbook_grammar', 'تطبيق المصادر والتقويم النهائي'),
      lesson2Src(19, 'textbook_spelling', 'همزة القطع'),
      lesson2Src(20, 'textbook_spelling', 'استكمال تقويم همزة القطع'),
      lesson2Src(21, 'textbook_exercise', 'الخط: الهمزة والمد والألف'),
      lesson2Src(22, 'textbook_expression', 'الخط والتعبير الكتابي'),
      lesson2Src(23, 'textbook_expression', 'أضيف'),
      lesson2Src(24, 'activity_book', 'ألعب وأتعلم'),
    ],
  },
  steps: LESSON2_STEPS,
  testId: 'lesson2-test',
};

const lesson3: Lesson = {
  metadata: {
    id: 'lesson3',
    unitId: 'unit1',
    order: 3,
    title: 'لُغَتي',
    subtitle: 'لغةُ الضَّادِ... إنَّهُ يَجمعُنا... فما السَّبيلُ إلى الحِفاظِ عليها؟',
    primarySkill: 'literary_appreciation',
    estimatedMinutes: 90,
    sources: [
      lesson3Src(25, 'textbook_exercise', 'أتأمل الصور والاستماع', undefined, 'الضمير في العبارة التمهيدية غير محسوم بصرياً؛ القراءة المعتمدة «إنَّهُ يَجمعُنا».'),
      lesson3Src(26, 'textbook_poetry', 'أقرأ: قصيدة لغتي'),
      lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', undefined, 'فعل التكليف في البند ٩ غير محسوم بصرياً.'),
      lesson3Src(28, 'textbook_expression', 'أتواصل شفهياً: إجراء حوار', undefined, undefined, 29),
      lesson3Src(29, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', undefined, 'صيغة الإكمال الثالث في البند ٣ غير محسومة.'),
      lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', undefined, undefined, 32),
      lesson3Src(31, 'textbook_spelling', 'استكمال همزة الوصل والتقويم', undefined, undefined, 32),
      lesson3Src(32, 'textbook_spelling', 'استكمال تقويم همزة الوصل', undefined, 'رأس الجدول يظهر بعمودي «فعلٌ» في الطرفين.'),
      lesson3Src(33, 'textbook_exercise', 'الخط: ب ت ث بخط الرقعة', undefined, 'الصف الثالث من كلمات الملاحظة غير محسوم بصرياً.', 34),
      lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: التقديم والتأخير', undefined, 'الكلمة الأولى في عنوان التطبيق غير محسومة (ريادة/زيادة).'),
      lesson3Src(35, 'activity_book', 'ألعب وأتعلم'),
    ],
  },
  steps: LESSON3_STEPS,
  testId: 'lesson3-test',
};

/**
 * COMPLETION DECLARATION (2026-10-12):
 * The project owner explicitly declared Lesson 3 to be the LAST lesson of
 * Unit 1 ("الدرس الثالث هو الدرس الأخير في الوحدة"). With Lesson 3 locked and
 * audited, the unit is now complete and receives its unit test.
 */
const unit1: Unit = {
  metadata: {
    id: 'unit1',
    order: 1,
    title: 'الوحدة الأولى: أحلامي وطموحاتي',
    theme: 'أحلامي وطموحاتي',
    isComplete: true, // Owner declared Lesson 3 the final lesson of the unit (2026-10-12).
    completionDeclarationDate: '2026-10-12',
    // Documents the three lesson pages (4–35). The official unit review lives on
    // pages 36–38 and is registered separately in `unit1Review` below.
    sourcePagesRange: { startPage: 4, endPage: 35 },
  },
  lessons: [lesson1, lesson2, lesson3],
  unitTestId: 'unit1-test',
  // Official textbook unit review («تقويم الوحدة الأولى»): an assessment
  // extension of the unit, NOT a lesson and NOT a replacement for unit1-test.
  reviewId: 'unit1-review',
};

/**
 * «تقويم الوحدة الأولى» — official unit review registration.
 *
 * It is linked to Unit 1 through `unit1.reviewId`, keeps the printed page range
 * (36–38), and stays out of `unit1.lessons` on purpose so lesson count, order
 * and content are untouched.
 */
const unit1Review: UnitReview = {
  metadata: {
    id: 'unit1-review',
    unitId: 'unit1',
    kind: 'unit_review',
    title: 'تقويم الوحدة الأولى',
    englishLabel: 'Unit 1 Review',
    description:
      'مراجعة شاملة لما تعلّمه الطالب في دروس الوحدة الأولى الثلاثة، وفق صفحات التقويم الرسمية الثلاث من الكتاب المدرسي.',
    sourcePagesRange: { startPage: 36, endPage: 38 },
    printedQuestions: UNIT1_REVIEW_QUESTIONS.length,
    printedBranches: UNIT1_REVIEW_ANSWERABLE_BRANCHES,
    sourceRecords: UNIT1_REVIEW_SOURCE_LOCK.length,
    source: {
      documentTitle: UNIT1_REVIEW_DOCUMENT_TITLE,
      term: 1,
      pageNumber: 36,
      pageEndNumber: 38,
      sectionName: 'تقويم الوحدة',
      sourceType: 'textbook_exercise',
      readabilityVerified: true,
    },
    coverageReportRef: 'docs/coverage/unit-1-review-coverage-report.md',
    sourceAuditRef: 'docs/source-audits/unit-1-review-pages-36-38.md',
    isCoverageVerified: UNIT1_REVIEW_TEACHER_GUIDE.audit.status === 'passed',
  },
};

/**
 * Unit 2 — registered from pages 40–49 only
 * (docs/source-locks/unit2-lesson-01-mukhtari-min-biladi.md).
 *
 * CRITICAL RULES, identical to Unit 1:
 * - The unit divider page (title/theme) was NOT among the supplied images,
 *   so the unit is registered as «الوحدة الثانية» without an invented theme.
 * - The unit is NOT complete: isComplete = false and NO unitTestId. It may
 *   only become complete after the project owner explicitly declares
 *   «هذا هو آخر درس في الوحدة».
 */
const unit2Lesson1: Lesson = {
  metadata: {
    id: 'unit2-lesson1',
    unitId: 'unit2',
    order: 1,
    title: 'مُخْتَرِعٌ مِنْ بِلَادِي',
    subtitle: 'الحاجةُ أمُّ الاختراعِ... فأنتَ تستطيعُ',
    primarySkill: 'reading_comprehension',
    estimatedMinutes: 90,
    sources: [
      u2l1Src(40, 'textbook_exercise', 'أتأمل الصور وأستمع إلى النص', undefined, U2L1_LISTENING_AUDIO_GAP),
      u2l1Src(41, 'textbook_reading', 'أقرأ: مخترعٌ من بلادي'),
      u2l1Src(42, 'textbook_exercise', 'الفهم القرائي (١–٤)'),
      u2l1Src(43, 'textbook_expression', 'الفهم القرائي (٥–٨) وأتعلم: حديث إذاعي'),
      u2l1Src(44, 'textbook_grammar', 'الحديث الإذاعي وقواعد اللغة: الجملة الاسمية'),
      u2l1Src(45, 'textbook_grammar', 'القاعدة والتقويم النهائي (١–٣)'),
      u2l1Src(46, 'textbook_spelling', 'التقويم النهائي (٤–٦) وإملاء: الهمزة الأولية', undefined, U2L1_LOCKED_SOURCE_NOTES.dictation),
      u2l1Src(47, 'textbook_exercise', 'الخط: رسم (ج ح خ) بخط الرقعة', undefined, U2L1_LOCKED_SOURCE_NOTES.handwritingWords),
      u2l1Src(48, 'textbook_expression', 'الخط وأعبر كتابياً: أساليب للتعبير'),
      u2l1Src(49, 'activity_book', 'ألعب وأتعلم وأنا وأسرتي'),
    ],
  },
  steps: U2L1_STEPS,
  testId: 'unit2-lesson1-test',
};

/**
 * Unit 2, Lesson 2 — registered from pages 50–60
 * (docs/source-locks/unit2-lesson-02-aldhaka-al-istinaai.md).
 * Same rules as Lesson 1: every block traces to a verified scan, the missing
 * listening audio and drawn calligraphy shapes stay declared limits, and the
 * unit remains incomplete (no owner declaration, therefore still no unit test).
 */
const unit2Lesson2: Lesson = {
  metadata: {
    id: 'unit2-lesson2',
    unitId: 'unit2',
    order: 2,
    title: 'الذَّكاءُ الاصطِناعيُّ',
    subtitle: 'الذَّكاءُ البَشَريُّ … الذَّكاءُ الاصطِناعيُّ … مَن صَنَع مَن؟',
    primarySkill: 'reading_comprehension',
    estimatedMinutes: 90,
    sources: [
      u2l2Src(50, 'textbook_exercise', 'أتأمل الصور وأستمع إلى النص', undefined, U2L2_LISTENING_AUDIO_GAP),
      u2l2Src(51, 'textbook_reading', 'أقرأ: الذكاء الاصطناعي'),
      u2l2Src(52, 'textbook_exercise', 'الفهم القرائي (١–٥)'),
      u2l2Src(53, 'textbook_exercise', 'الفهم القرائي (٦–٩) وأتواصل شفوياً: الإذاعة المدرسية', undefined, U2L2_LOCKED_SOURCE_NOTES.drawingTasks),
      u2l2Src(54, 'textbook_grammar', 'قواعد اللغة: تحويل الجملة الفعلية إلى اسمية'),
      u2l2Src(55, 'textbook_spelling', 'إملاء: التاء المبسوطة'),
      u2l2Src(56, 'textbook_spelling', 'إملاء: التاء المربوطة'),
      u2l2Src(57, 'textbook_spelling', 'التقويم النهائي للتاء والخط: ملاحظة الأحرف'),
      u2l2Src(58, 'textbook_exercise', 'الخط: حرفا الدال والذال بخط الرقعة', undefined, U2L2_LOCKED_SOURCE_NOTES.calligraphyShapes),
      u2l2Src(59, 'textbook_expression', 'أعبر كتابياً: حقيقة علمية'),
      u2l2Src(60, 'activity_book', 'ألعب وأتعلم وأنا وأسرتي'),
    ],
  },
  steps: U2L2_STEPS,
  testId: 'unit2-lesson2-test',
};

const unit2: Unit = {
  metadata: {
    id: 'unit2',
    order: 2,
    title: 'الوحدة الثانية',
    // No theme: the unit divider page was not supplied.
    isComplete: false, // No owner completion declaration; therefore no unit test.
    sourcePagesRange: { startPage: 40, endPage: 60 },
  },
  lessons: [unit2Lesson1, unit2Lesson2],
  // unitTestId intentionally absent until the owner declares completion.
};

export const unitReviews: UnitReview[] = [unit1Review];

export const curriculumRegistry: CurriculumRegistry = {
  grade: 5,
  subject: 'اللغة العربية',
  academicYear: '2024-2025',
  units: [unit1, unit2],
};

/**
 * Accessor helpers
 */
export function getAllUnits() {
  return curriculumRegistry.units;
}

export function getUnitById(unitId: string) {
  return curriculumRegistry.units.find((u) => u.metadata.id === unitId);
}

export function getLessonById(lessonId: string) {
  for (const unit of curriculumRegistry.units) {
    const lesson = unit.lessons.find((l) => l.metadata.id === lessonId);
    if (lesson) {
      return { lesson, unit };
    }
  }
  return null;
}

/**
 * Checks if a unit test is legitimately available.
 * Rule: Only available if the unit is explicitly marked complete by project owner.
 */
export function isUnitTestAvailable(unitId: string): boolean {
  const unit = getUnitById(unitId);
  return Boolean(unit && unit.metadata.isComplete && unit.unitTestId);
}

/**
 * Unit review accessors.
 * A unit review is offered in the Student Area after the unit's lessons and is
 * never part of the lessons list.
 */
export function getUnitReviews(): UnitReview[] {
  return unitReviews;
}

export function getUnitReviewById(reviewId: string): UnitReview | undefined {
  return unitReviews.find((review) => review.metadata.id === reviewId);
}

export function getUnitReviewByUnitId(unitId: string): UnitReview | undefined {
  const unit = getUnitById(unitId);
  if (!unit?.reviewId) return undefined;
  return getUnitReviewById(unit.reviewId);
}

/** True only when the unit review is registered on the unit itself. */
export function isUnitReviewAvailable(unitId: string): boolean {
  return Boolean(getUnitReviewByUnitId(unitId));
}
