import { CurriculumRegistry, Lesson, Unit } from '../types/curriculum';
import { LESSON1_STEPS } from './lesson1/content';
import { src } from './lesson1/sourceMeta';
import { LESSON2_STEPS } from './lesson2/content';
import { lesson2Src } from './lesson2/sourceMeta';
import { LESSON3_STEPS } from './lesson3/content';
import { lesson3Src } from './lesson3/sourceMeta';

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
    sourcePagesRange: { startPage: 4, endPage: 35 },
  },
  lessons: [lesson1, lesson2, lesson3],
  unitTestId: 'unit1-test',
};

export const curriculumRegistry: CurriculumRegistry = {
  grade: 5,
  subject: 'اللغة العربية',
  academicYear: '2024-2025',
  units: [unit1],
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
