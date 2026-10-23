import { TeacherLessonGuide } from '../../types/curriculum';
import { U2L1_ACTIVITIES } from './activities';

/**
 * IDs copied from the 45-record registry in the Source Lock
 * (docs/source-locks/unit2-lesson-01-mukhtari-min-biladi.md §٣).
 */
export const U2L1_SOURCE_LOCK_IDS = [
  'U2L1-40-01', 'U2L1-40-02', 'U2L1-40-03', 'U2L1-40-04', 'U2L1-40-05', 'U2L1-40-06',
  'U2L1-41-01', 'U2L1-41-02', 'U2L1-41-03',
  'U2L1-42-01', 'U2L1-42-02', 'U2L1-42-03', 'U2L1-42-04',
  'U2L1-43-01', 'U2L1-43-02', 'U2L1-43-03', 'U2L1-43-04',
  'U2L1-44-01', 'U2L1-44-02', 'U2L1-44-03', 'U2L1-44-04', 'U2L1-44-05', 'U2L1-44-06',
  'U2L1-45-01', 'U2L1-45-02', 'U2L1-45-03', 'U2L1-45-04', 'U2L1-45-05', 'U2L1-45-06',
  'U2L1-46-01', 'U2L1-46-02', 'U2L1-46-03', 'U2L1-46-04', 'U2L1-46-05', 'U2L1-46-06', 'U2L1-46-07',
  'U2L1-47-01', 'U2L1-47-02', 'U2L1-47-03',
  'U2L1-48-01', 'U2L1-48-02', 'U2L1-48-03', 'U2L1-48-04',
  'U2L1-49-01', 'U2L1-49-02',
] as const;

export interface U2L1CoverageAuditReport {
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
 * Proves the explicit source → Student Area → Teacher Area chain for
 * Unit 2 Lesson 1: every locked source record has exactly one student
 * activity, with subparts, and exactly one teacher solution.
 */
export function auditU2L1Coverage(guide: TeacherLessonGuide): U2L1CoverageAuditReport {
  const required: string[] = [...U2L1_SOURCE_LOCK_IDS];
  const activitySourceIds = U2L1_ACTIVITIES.map((activity) => activity.sourceActivityId);
  const activitySet = new Set(activitySourceIds);
  const requiredSet = new Set(required);
  const coverage = guide.sourceCoverage || [];
  const teacherSolutionIds = guide.exerciseSolutions
    .map((solution) => solution.id)
    .filter((id): id is string => Boolean(id));

  const missingStudentActivities = required.filter((id) => !activitySet.has(id));
  const unexpectedStudentActivities = activitySourceIds.filter((id) => !requiredSet.has(id));
  const missingTeacherSolutions = required.filter((id) => {
    const activity = U2L1_ACTIVITIES.find((candidate) => candidate.sourceActivityId === id);
    if (!activity) return true;
    const mapped = coverage.find((entry) => entry.sourceActivityId === id);
    return (
      !mapped ||
      mapped.lessonActivityId !== activity.id ||
      mapped.teacherSolutionId !== activity.teacherSolutionId ||
      !teacherSolutionIds.includes(activity.teacherSolutionId)
    );
  });
  const unmappedSubparts = U2L1_ACTIVITIES
    .filter((activity) => activity.subparts.length === 0)
    .map((activity) => activity.sourceActivityId);
  const duplicateStudentActivityIds = duplicates(activitySourceIds);
  const duplicateTeacherSolutionIds = duplicates(teacherSolutionIds);

  const status = (
    required.length === 45 &&
    U2L1_ACTIVITIES.length === 45 &&
    guide.exerciseSolutions.length === 45 &&
    coverage.length === 45 &&
    missingStudentActivities.length === 0 &&
    unexpectedStudentActivities.length === 0 &&
    missingTeacherSolutions.length === 0 &&
    duplicateStudentActivityIds.length === 0 &&
    duplicateTeacherSolutionIds.length === 0 &&
    unmappedSubparts.length === 0
  ) ? 'passed' : 'failed';

  return {
    required: required.length,
    studentActivities: U2L1_ACTIVITIES.length,
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
