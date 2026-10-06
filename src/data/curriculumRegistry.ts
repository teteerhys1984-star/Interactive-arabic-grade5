import { CurriculumRegistry, Lesson, Unit } from '../types/curriculum';
import { LESSON1_STEPS } from './lesson1/content';
import { src } from './lesson1/sourceMeta';

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

const unit1: Unit = {
  metadata: {
    id: 'unit1',
    order: 1,
    title: 'الوحدة الأولى: أحلامي وطموحاتي',
    theme: 'أحلامي وطموحاتي',
    isComplete: false, // NOT complete — owner has not declared the final lesson.
    sourcePagesRange: { startPage: 4, endPage: 11 },
  },
  lessons: [lesson1],
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
