import { AssessmentTest } from '../types/curriculum';
import { LESSON1_TEST } from './lesson1/lessonTest';

/**
 * Central assessment registry (data-driven).
 * Lesson tests are registered here; unit tests appear ONLY when a unit is complete.
 */
export const ALL_ASSESSMENTS: AssessmentTest[] = [LESSON1_TEST];

export function getLessonTestByLessonId(lessonId: string): AssessmentTest | undefined {
  return ALL_ASSESSMENTS.find((t) => t.scope === 'lesson' && t.lessonId === lessonId);
}

export function getUnitTestByUnitId(unitId: string): AssessmentTest | undefined {
  return ALL_ASSESSMENTS.find((t) => t.scope === 'unit' && t.unitId === unitId);
}
