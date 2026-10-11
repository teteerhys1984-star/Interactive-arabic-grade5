import { TeacherLessonGuide } from '../../types/curriculum';
import { LESSON3_ACTIVITIES } from './activities';

/** IDs copied from the 51-record registry in the permanent Source Lock. */
export const LESSON3_SOURCE_LOCK_IDS = [
  'L3-25-01', 'L3-25-02', 'L3-25-03', 'L3-25-04', 'L3-25-05', 'L3-25-06',
  'L3-26-01', 'L3-26-02', 'L3-26-03',
  'L3-27-01', 'L3-27-02', 'L3-27-03', 'L3-27-04', 'L3-27-05', 'L3-27-06',
  'L3-27-07', 'L3-27-08', 'L3-27-09',
  'L3-28-01', 'L3-28-02', 'L3-28-03', 'L3-28-04', 'L3-28-05', 'L3-28-06',
  'L3-29-01', 'L3-29-02', 'L3-29-03', 'L3-29-04', 'L3-29-05', 'L3-29-06',
  'L3-30-01', 'L3-30-02', 'L3-30-03', 'L3-30-04',
  'L3-31-01', 'L3-31-02', 'L3-31-03', 'L3-31-04',
  'L3-32-01', 'L3-32-02', 'L3-32-03', 'L3-32-04',
  'L3-33-01', 'L3-33-02', 'L3-33-03',
  'L3-34-01', 'L3-34-02', 'L3-34-03',
  'L3-35-01', 'L3-35-02', 'L3-35-03',
] as const;

export interface Lesson3CoverageAuditReport {
  required: number;
  studentActivities: number;
  teacherSolutions: number;
  missingStudentActivities: string[];
  unexpectedStudentActivities: string[];
  missingTeacherSolutions: string[];
  duplicateStudentActivityIds: string[];
  duplicateTeacherSolutionIds: string[];
  unmappedSubparts: string[];
  status: 'passed' | 'failed';
}

function duplicates(values: string[]): string[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

/**
 * Proves the explicit source → Student Area → Teacher Area chain for Lesson 3.
 */
export function auditLesson3Coverage(guide: TeacherLessonGuide): Lesson3CoverageAuditReport {
  const required: string[] = [...LESSON3_SOURCE_LOCK_IDS];
  const activitySourceIds = LESSON3_ACTIVITIES.map((activity) => activity.sourceActivityId);
  const activitySet = new Set(activitySourceIds);
  const requiredSet = new Set(required);
  const coverage = guide.sourceCoverage || [];
  const teacherSolutionIds = guide.exerciseSolutions.map((solution) => solution.id).filter((id): id is string => Boolean(id));

  const missingStudentActivities = required.filter((id) => !activitySet.has(id));
  const unexpectedStudentActivities = activitySourceIds.filter((id) => !requiredSet.has(id));
  const missingTeacherSolutions = required.filter((id) => {
    const activity = LESSON3_ACTIVITIES.find((candidate) => candidate.sourceActivityId === id);
    if (!activity) return true;
    const mapped = coverage.find((entry) => entry.sourceActivityId === id);
    return !mapped || mapped.lessonActivityId !== activity.id || mapped.teacherSolutionId !== activity.teacherSolutionId || !teacherSolutionIds.includes(activity.teacherSolutionId);
  });
  const unmappedSubparts = LESSON3_ACTIVITIES
    .filter((activity) => activity.subparts.length === 0)
    .map((activity) => activity.sourceActivityId);
  const duplicateStudentActivityIds = duplicates(activitySourceIds);
  const duplicateTeacherSolutionIds = duplicates(teacherSolutionIds);

  const status = (
    required.length === 51 &&
    LESSON3_ACTIVITIES.length === 51 &&
    guide.exerciseSolutions.length === 51 &&
    coverage.length === 51 &&
    missingStudentActivities.length === 0 &&
    unexpectedStudentActivities.length === 0 &&
    missingTeacherSolutions.length === 0 &&
    duplicateStudentActivityIds.length === 0 &&
    duplicateTeacherSolutionIds.length === 0 &&
    unmappedSubparts.length === 0
  ) ? 'passed' : 'failed';

  return {
    required: required.length,
    studentActivities: LESSON3_ACTIVITIES.length,
    teacherSolutions: guide.exerciseSolutions.length,
    missingStudentActivities,
    unexpectedStudentActivities,
    missingTeacherSolutions,
    duplicateStudentActivityIds,
    duplicateTeacherSolutionIds,
    unmappedSubparts,
    status,
  };
}
