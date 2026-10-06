import { CurriculumRegistry, Lesson, Unit } from '../types/curriculum';
import { LESSON1_STEPS } from './lesson1/content';
import { src } from './lesson1/sourceMeta';
import { LESSON2_STEPS } from './lesson2/content';
import { lesson2Src } from './lesson2/sourceMeta';

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

const unit1: Unit = {
  metadata: {
    id: 'unit1',
    order: 1,
    title: 'الوحدة الأولى: أحلامي وطموحاتي',
    theme: 'أحلامي وطموحاتي',
    isComplete: false, // NOT complete — owner has not declared the final lesson.
    sourcePagesRange: { startPage: 4, endPage: 24 },
  },
  lessons: [lesson1, lesson2],
  // unitTestId intentionally OMITTED while the unit is incomplete.
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
