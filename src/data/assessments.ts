import { AssessmentTest } from '../types/curriculum';
import { LESSON1_TEST } from './lesson1/lessonTest';
import { LESSON2_TEST } from './lesson2/lessonTest';
import { LESSON3_TEST } from './lesson3/lessonTest';
import { UNIT1_TEST } from './unit1/unitTest';
import { U2L1_TEST } from './unit2Lesson1/lessonTest';

/**
 * Central assessment registry (data-driven).
 * Lesson tests are registered here; the unit test is exposed ONLY when the unit
 * is explicitly complete (see isUnitTestAvailable).
 */
export const ALL_ASSESSMENTS: AssessmentTest[] = [LESSON1_TEST, LESSON2_TEST, LESSON3_TEST, UNIT1_TEST, U2L1_TEST];

export function getLessonTestByLessonId(lessonId: string): AssessmentTest | undefined {
  return ALL_ASSESSMENTS.find((t) => t.scope === 'lesson' && t.lessonId === lessonId);
}

export function getUnitTestByUnitId(unitId: string): AssessmentTest | undefined {
  return ALL_ASSESSMENTS.find((t) => t.scope === 'unit' && t.unitId === unitId);
}
