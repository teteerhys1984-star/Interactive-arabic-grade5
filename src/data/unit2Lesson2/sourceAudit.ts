import { TeacherLessonGuide } from '../../types/curriculum';
import { U2L2_ACTIVITIES } from './activities';

/**
 * IDs copied from the 51-record registry in the Source Lock
 * (docs/source-locks/unit2-lesson-02-aldhaka-al-istinaai.md §٣).
 * Every printed, numbered/delimited task discovered on pages 50–60 has one
 * record; declared limits (no listening audio, empty mind-map circles, drawn
 * ruq'a shapes, manual drawing) are documented inside the relevant records
 * rather than dropped, so no record carries availability «gap».
 * Page 55 holds nine records: 55-01..06 (spelling) and 55-07..09 (the three
 * open grammar final-evaluation tasks printed at the top of the page).
 * The basita four-word table is a page-56 record (56-04); page 57 holds five.
 */
export const U2L2_SOURCE_LOCK_IDS = [
  'U2L2-50-01', 'U2L2-50-02', 'U2L2-50-03', 'U2L2-50-04', 'U2L2-50-05',
  'U2L2-51-01', 'U2L2-51-02',
  'U2L2-52-01', 'U2L2-52-02', 'U2L2-52-03', 'U2L2-52-04', 'U2L2-52-05',
  'U2L2-53-01', 'U2L2-53-02', 'U2L2-53-03', 'U2L2-53-04', 'U2L2-53-05',
  'U2L2-54-01', 'U2L2-54-02', 'U2L2-54-03', 'U2L2-54-04', 'U2L2-54-05', 'U2L2-54-06',
  'U2L2-55-01', 'U2L2-55-02', 'U2L2-55-03', 'U2L2-55-04', 'U2L2-55-05', 'U2L2-55-06',
  'U2L2-55-07', 'U2L2-55-08', 'U2L2-55-09',
  'U2L2-56-01', 'U2L2-56-02', 'U2L2-56-03', 'U2L2-56-04',
  'U2L2-57-01', 'U2L2-57-02', 'U2L2-57-03', 'U2L2-57-04', 'U2L2-57-05',
  'U2L2-58-01', 'U2L2-58-02', 'U2L2-58-03', 'U2L2-58-04',
  'U2L2-59-01', 'U2L2-59-02', 'U2L2-59-03', 'U2L2-59-04',
  'U2L2-60-01', 'U2L2-60-02',
] as const;

export interface U2L2CoverageAuditReport {
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
 * Unit 2 Lesson 2: every locked source record has exactly one student
 * activity, with subparts, and exactly one teacher solution.
 */
export function auditU2L2Coverage(guide: TeacherLessonGuide): U2L2CoverageAuditReport {
  const required: string[] = [...U2L2_SOURCE_LOCK_IDS];
  const activitySourceIds = U2L2_ACTIVITIES.map((activity) => activity.sourceActivityId);
  const activitySet = new Set(activitySourceIds);
  const requiredSet = new Set(required);
  const coverage = guide.sourceCoverage || [];
  const teacherSolutionIds = guide.exerciseSolutions
    .map((solution) => solution.id)
    .filter((id): id is string => Boolean(id));

  const missingStudentActivities = required.filter((id) => !activitySet.has(id));
  const unexpectedStudentActivities = activitySourceIds.filter((id) => !requiredSet.has(id));
  const missingTeacherSolutions = required.filter((id) => {
    const activity = U2L2_ACTIVITIES.find((candidate) => candidate.sourceActivityId === id);
    if (!activity) return true;
    const mapped = coverage.find((entry) => entry.sourceActivityId === id);
    return (
      !mapped ||
      mapped.lessonActivityId !== activity.id ||
      mapped.teacherSolutionId !== activity.teacherSolutionId ||
      !teacherSolutionIds.includes(activity.teacherSolutionId)
    );
  });
  const unmappedSubparts = U2L2_ACTIVITIES
    .filter((activity) => activity.subparts.length === 0)
    .map((activity) => activity.sourceActivityId);
  const duplicateStudentActivityIds = duplicates(activitySourceIds);
  const duplicateTeacherSolutionIds = duplicates(teacherSolutionIds);

  const status = (
    required.length === 51 &&
    U2L2_ACTIVITIES.length === 51 &&
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
    studentActivities: U2L2_ACTIVITIES.length,
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
