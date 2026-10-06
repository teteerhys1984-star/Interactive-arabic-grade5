import { TeacherLessonGuide } from '../../types/curriculum';
import { LESSON2_ACTIVITIES } from './activities';
import { SOURCE_RULES } from './content';
import { LESSON2_TEST } from './lessonTest';

/**
 * Lesson 2 teacher guide.
 * It is generated from the same 53-entry ledger used by the Student Area, so
 * each source activity has exactly one teacher guidance record.  Entries marked
 * as source gaps deliberately explain the limitation instead of fabricating an answer.
 */
export const LESSON2_TEACHER_GUIDE: TeacherLessonGuide = {
  lessonId: 'lesson2',
  unitId: 'unit1',
  pedagogicalObjectives: [
    'يستعمل المتعلم الحوار الإيجابي واحترام الرأي الآخر في التعبير الشفهي والكتابي.',
    'يميز المصدر من الفعل من حيث الدلالة على الحدث والزمن.',
    'يتعرف مواضع همزة القطع ويطبقها في الكتابة والتعبير.',
    'ينجز مهام القراءة والتعبير والخط وفق حدود المصدر الموثق.',
  ],
  grammarNotes: [SOURCE_RULES.source],
  spellingRules: [SOURCE_RULES.hamzatQat, ...SOURCE_RULES.hamzatQatPlaces],
  exerciseSolutions: LESSON2_ACTIVITIES.map((activity) => ({
    id: activity.teacherSolutionId,
    sourceExercise: `${activity.sourceActivityId} — ${activity.section}${activity.printedNumber !== '—' ? ` (${activity.printedNumber})` : ''}`,
    pageNumber: activity.page,
    officialSolution: activity.teacher.answerOrGuidance,
    didacticExplanation: activity.teacher.explanation,
    commonStudentMistakes: activity.teacher.commonMistakes,
  })),
  sourceCoverage: LESSON2_ACTIVITIES.map((activity) => ({
    sourceActivityId: activity.sourceActivityId,
    lessonStepId: activity.stepId,
    lessonActivityId: activity.id,
    teacherSolutionId: activity.teacherSolutionId,
    pageNumber: activity.page,
    availability: activity.availability,
  })),
  lessonTestAnswerKeyRef: LESSON2_TEST.id,
};
