import { TeacherLessonGuide } from '../../types/curriculum';
import { LESSON2_ACTIVITIES } from './activities';

/** IDs copied from the 53-record registry in the permanent Source Lock. */
export const LESSON2_SOURCE_LOCK_IDS = [
  'L2-12-01', 'L2-12-02', 'L2-12-03', 'L2-12-04', 'L2-12-05', 'L2-12-06',
  'L2-13-01', 'L2-13-02', 'L2-13-03',
  'L2-14-01', 'L2-14-02', 'L2-14-03', 'L2-14-04', 'L2-14-05', 'L2-14-06',
  'L2-15-01', 'L2-15-02', 'L2-15-03', 'L2-15-04', 'L2-15-05', 'L2-15-06',
  'L2-17-01', 'L2-17-02', 'L2-17-03', 'L2-17-04', 'L2-17-05',
  'L2-18-01', 'L2-18-02', 'L2-18-03', 'L2-18-04', 'L2-18-05', 'L2-18-06',
  'L2-19-01', 'L2-19-02', 'L2-19-03', 'L2-19-04', 'L2-19-05', 'L2-19-06', 'L2-19-07',
  'L2-20-01', 'L2-20-02', 'L2-20-03',
  'L2-21-01', 'L2-21-02', 'L2-21-03',
  'L2-22-01',
  'L2-23-01', 'L2-23-02', 'L2-23-03', 'L2-23-04',
  'L2-24-01', 'L2-24-02', 'L2-24-03',
] as const;

export interface Lesson2CoverageAuditReport {
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
 * Proves the explicit source → Student Area → Teacher Area chain for Lesson 2.
 * Gap activities count as covered only because their unavailable source state is
 * deliberately represented and the teacher guidance records the same limitation.
 */
export function auditLesson2Coverage(guide: TeacherLessonGuide): Lesson2CoverageAuditReport {
  const required: string[] = [...LESSON2_SOURCE_LOCK_IDS];
  const activitySourceIds = LESSON2_ACTIVITIES.map((activity) => activity.sourceActivityId);
  const activitySet = new Set(activitySourceIds);
  const requiredSet = new Set(required);
  const coverage = guide.sourceCoverage || [];
  const teacherSolutionIds = guide.exerciseSolutions.map((solution) => solution.id).filter((id): id is string => Boolean(id));

  const missingStudentActivities = required.filter((id) => !activitySet.has(id));
  const unexpectedStudentActivities = activitySourceIds.filter((id) => !requiredSet.has(id));
  const missingTeacherSolutions = required.filter((id) => {
    const activity = LESSON2_ACTIVITIES.find((candidate) => candidate.sourceActivityId === id);
    if (!activity) return true;
    const mapped = coverage.find((entry) => entry.sourceActivityId === id);
    return !mapped || mapped.lessonActivityId !== activity.id || mapped.teacherSolutionId !== activity.teacherSolutionId || !teacherSolutionIds.includes(activity.teacherSolutionId);
  });
  const unmappedSubparts = LESSON2_ACTIVITIES
    .filter((activity) => activity.subparts.length === 0)
    .map((activity) => activity.sourceActivityId);
  const duplicateStudentActivityIds = duplicates(activitySourceIds);
  const duplicateTeacherSolutionIds = duplicates(teacherSolutionIds);

  const status = (
    required.length === 53 &&
    LESSON2_ACTIVITIES.length === 53 &&
    guide.exerciseSolutions.length === 53 &&
    coverage.length === 53 &&
    missingStudentActivities.length === 0 &&
    unexpectedStudentActivities.length === 0 &&
    missingTeacherSolutions.length === 0 &&
    duplicateStudentActivityIds.length === 0 &&
    duplicateTeacherSolutionIds.length === 0 &&
    unmappedSubparts.length === 0
  ) ? 'passed' : 'failed';

  return {
    required: required.length,
    studentActivities: LESSON2_ACTIVITIES.length,
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
