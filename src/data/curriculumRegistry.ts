import { CurriculumRegistry } from '../types/curriculum';

/**
 * Official Curriculum Registry for Grade 5 Arabic.
 * 
 * CRITICAL RULE:
 * Currently empty because the official textbook has not been supplied yet.
 * NO units, lessons, exercises, or tests are invented.
 * 
 * When official textbook images/pages are provided and verified through the
 * Source Readability Report, units and lessons will be registered here.
 */
export const curriculumRegistry: CurriculumRegistry = {
  grade: 5,
  subject: 'اللغة العربية',
  academicYear: '2024-2025',
  units: [],
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
